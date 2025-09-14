<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

    // Start transaction
    $conn->begin_transaction();

    try {
        // Delete user activities
        $stmt = $conn->prepare("DELETE FROM medcare_user_activities WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Delete user appointments
        $stmt = $conn->prepare("DELETE FROM appointments WHERE patient_email = (SELECT email FROM medcare_users WHERE id = ?)");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Delete user account
        $stmt = $conn->prepare("DELETE FROM medcare_users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Add token to blacklist
        $stmt = $conn->prepare("INSERT INTO medcare_token_blacklist (token, expiry) VALUES (?, NOW() + INTERVAL 1 DAY)");
        $stmt->bind_param("s", $token);
        $stmt->execute();

        // Commit transaction
        $conn->commit();

        http_response_code(200);
        echo json_encode(array("message" => "Account deleted successfully"));
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
} catch (Exception $e) {
    error_log("Delete account error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to delete account", "error" => $e->getMessage()));
}

$conn->close();
?> 