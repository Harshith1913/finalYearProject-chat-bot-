<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Max-Age: 3600");
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code(200);
    exit;
}

// For actual requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

include_once 'db.php';
include_once 'mail.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    try {
        // Check if email exists
        $query = "SELECT id, first_name FROM medcare_users WHERE email = :email LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Generate reset token
            $reset_token = bin2hex(random_bytes(32));
            $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Update user with reset token
            $update_query = "UPDATE medcare_users 
                           SET reset_token = :reset_token, 
                               reset_token_expiry = :expiry 
                           WHERE email = :email";
            
            $update_stmt = $db->prepare($update_query);
            $update_stmt->bindParam(":reset_token", $reset_token);
            $update_stmt->bindParam(":expiry", $expiry);
            $update_stmt->bindParam(":email", $data->email);

            if ($update_stmt->execute()) {
                // Send reset email
                $reset_link = "https://yourwebsite.com/reset-password.php?token=" . $reset_token;
                sendPasswordResetEmail($data->email, $row['first_name'], $reset_link);

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Password reset instructions have been sent to your email."
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Unable to process request."));
            }
        } else {
            // For security, don't reveal if email exists
            http_response_code(200);
            echo json_encode(array(
                "message" => "If your email is registered, you will receive reset instructions."
            ));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "An error occurred."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Email is required."));
}
?>