<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';
include_once '../utils/jwt.php';

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
        
        // Log the logout activity
        $query = "INSERT INTO medcare_user_activities 
                 (user_id, type, description, timestamp) 
                 VALUES 
                 (:user_id, 'logout', 'User logged out', NOW())";
                 
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $payload['user_id']);
        $stmt->execute();
        
        // Add the token to blacklist
        $query = "INSERT INTO medcare_token_blacklist 
                 (token, expiry) 
                 VALUES 
                 (:token, DATE_ADD(NOW(), INTERVAL 24 HOUR))";
                 
        $stmt = $db->prepare($query);
        $stmt->bindParam(":token", $token);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(array(
            "message" => "Logout successful."
        ));
        
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid token."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "An error occurred."));
}
?>