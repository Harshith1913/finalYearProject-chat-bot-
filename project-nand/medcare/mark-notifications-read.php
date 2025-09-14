<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'db.php';
include_once 'jwt.php';

try {
    // Get token from header
    $headers = getallheaders();
    $token = null;

    if (isset($headers['Authorization'])) {
        $auth_header = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            $token = $matches[1];
        }
    }

    if (!$token) {
        throw new Exception('No token provided');
    }

    // Verify token and get user ID
    $decoded = decodeJWT($token);
    $user_id = $decoded->user_id;

    // Mark all notifications as read
    $stmt = $conn->prepare("
        UPDATE medcare_user_activities 
        SET additional_data = JSON_SET(
            COALESCE(additional_data, '{}'), 
            '$.read', true
        )
        WHERE user_id = ? AND type = 'notification'
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    http_response_code(200);
    echo json_encode(array("message" => "All notifications marked as read"));
} catch (Exception $e) {
    error_log("Mark notifications error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to mark notifications as read", "error" => $e->getMessage()));
}

$conn->close();
?> 