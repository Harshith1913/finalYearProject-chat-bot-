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
include_once 'jwt.php';

// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', '/home/u291518478/domains/bmreducation.com/public_html/logs/admin_control/education_sec.php');
error_reporting(E_ALL);

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        // Log login attempt
        error_log("Login attempt for email: " . $data->email);

        // Prepare query
        $query = "SELECT id, first_name, last_name, email, password, email_verified 
                 FROM medcare_users WHERE email = :email LIMIT 1";
        $stmt = $db->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Log password verification attempt
            error_log("Password verification for user ID: " . $row['id']);
            
            if (password_verify($data->password, $row['password'])) {
                // Check email verification
                if (!$row['email_verified']) {
                    http_response_code(401);
                    echo json_encode(array(
                        "message" => "Please verify your email first.",
                        "unverified" => true
                    ));
                    exit();
                }

                // Update last login
                $update_query = "UPDATE medcare_users 
                               SET last_login = NOW() 
                               WHERE id = :id";
                $update_stmt = $db->prepare($update_query);
                $update_stmt->bindParam(":id", $row['id']);
                $update_stmt->execute();

                // Generate JWT token
                $token = generateJWT([
                    "user_id" => $row['id'],
                    "email" => $row['email']
                ]);

                // Log successful login
                error_log("Successful login for user ID: " . $row['id']);

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login successful.",
                    "token" => $token,
                    "user" => array(
                        "id" => $row['id'],
                        "first_name" => $row['first_name'],
                        "last_name" => $row['last_name'],
                        "email" => $row['email']
                    )
                ));
            } else {
                error_log("Invalid password for user ID: " . $row['id']);
                http_response_code(401);
                echo json_encode(array("message" => "Invalid credentials."));
            }
        } else {
            error_log("No user found with email: " . $data->email);
            http_response_code(401);
            echo json_encode(array("message" => "Invalid credentials."));
        }
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "An error occurred."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data provided."));
}
?>