<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'db.php';
include_once 'jwt.php';

// Get headers
$headers = getallheaders();
$token = null;

// Extract token from Authorization header
if (isset($headers['Authorization'])) {
    $auth_header = $headers['Authorization'];
    if (preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        $token = $matches[1];
    }
}

if (!$token) {
    http_response_code(401);
    echo json_encode(array("message" => "No token provided."));
    exit();
}

try {
    // Verify token
    if (verifyJWT($token)) {
        // Decode token to get user data
        $token_parts = explode('.', $token);
        $payload = json_decode(base64_decode($token_parts[1]), true);
        
        $database = new Database();
        $db = $database->getConnection();
        
        // Get recent activities for the user
        $query = "SELECT 
                    a.id,
                    a.type,
                    a.description,
                    a.timestamp,
                    a.additional_data
                 FROM medcare_user_activities a
                 WHERE a.user_id = :user_id
                 ORDER BY a.timestamp DESC
                 LIMIT 10";
                 
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $payload['user_id']);
        $stmt->execute();
        
        $activities = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $activity_item = array(
                "id" => $row['id'],
                "type" => $row['type'],
                "description" => $row['description'],
                "timestamp" => $row['timestamp'],
                "additional_data" => json_decode($row['additional_data'], true)
            );
            array_push($activities, $activity_item);
        }
        
        http_response_code(200);
        echo json_encode($activities);
        
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid token."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "An error occurred."));
}
?>