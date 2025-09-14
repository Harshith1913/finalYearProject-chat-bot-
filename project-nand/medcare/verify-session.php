<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 3600");

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

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if token is blacklisted
    $query = "SELECT id FROM medcare_token_blacklist 
             WHERE token = :token 
             AND expiry > NOW() 
             LIMIT 1";
             
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        http_response_code(401);
        echo json_encode(array("message" => "Token is invalid."));
        exit();
    }
    
    // Verify token
    if (verifyJWT($token)) {
        // Decode token to get user data
        $token_parts = explode('.', $token);
        $payload = json_decode(base64_decode($token_parts[1]), true);
        
        // Get user data
        $query = "SELECT 
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.last_login,
                    COUNT(ua.id) as activity_count
                 FROM medcare_users u
                 LEFT JOIN medcare_user_activities ua 
                    ON u.id = ua.user_id 
                    AND ua.timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)
                 WHERE u.id = :user_id
                 GROUP BY u.id
                 LIMIT 1";
                 
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $payload['user_id']);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Update last activity
            $update_query = "UPDATE medcare_users 
                           SET last_activity = NOW() 
                           WHERE id = :user_id";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->bindParam(":user_id", $user['id']);
            $update_stmt->execute();
            
            // Log session verification
            $log_query = "INSERT INTO medcare_user_activities 
                         (user_id, type, description, timestamp) 
                         VALUES 
                         (:user_id, 'session', 'Session verified', NOW())";
            $log_stmt = $db->prepare($log_query);
            $log_stmt->bindParam(":user_id", $user['id']);
            $log_stmt->execute();
            
            http_response_code(200);
            echo json_encode(array(
                "message" => "Valid session",
                "user_id" => $user['id'],
                "first_name" => $user['first_name'],
                "last_name" => $user['last_name'],
                "email" => $user['email'],
                "last_login" => $user['last_login'],
                "recent_activity_count" => $user['activity_count']
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "User not found."));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid token."));
    }
} catch (Exception $e) {
    error_log("Session verification error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array(
        "message" => "An error occurred",
        "error" => $e->getMessage()
    ));
}
?>