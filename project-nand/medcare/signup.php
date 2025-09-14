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

session_start();
ini_set('log_errors', 1);
ini_set('error_log', '/home/u291518478/domains/bmreducation.com/public_html/logs/admin_control/education_sec.php');
error_reporting(E_ALL);
ini_set('display_errors', 0);
date_default_timezone_set('Asia/Kolkata');
session_regenerate_id(true);

include_once 'db.php';
include_once 'mail.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password) && 
    !empty($data->first_name) && !empty($data->last_name)) {
    
    try {
        // Check if email already exists
        $check_query = "SELECT id FROM medcare_users WHERE email = :email LIMIT 1";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->bindParam(":email", $data->email);
        $check_stmt->execute();

        if ($check_stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Email already exists."));
            exit();
        }

        // Generate verification token
        $verification_token = bin2hex(random_bytes(32));
        
        // Hash password
        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

        // Insert new user
        $query = "INSERT INTO medcare_users 
                 (first_name, last_name, email, password, verification_token) 
                 VALUES (:first_name, :last_name, :email, :password, :verification_token)";
        
        $stmt = $db->prepare($query);

        // Bind parameters
        $stmt->bindParam(":first_name", $data->first_name);
        $stmt->bindParam(":last_name", $data->last_name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->bindParam(":verification_token", $verification_token);

        if ($stmt->execute()) {
            // Send verification email
            $verification_link = "https://www.bmreducation.com/medcare/verify.php?token=" . $verification_token;
            sendVerificationEmail($data->email, $data->first_name, $verification_link);

            http_response_code(201);
            echo json_encode(array(
                "message" => "User registered successfully. Please check your email to verify your account."
            ));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to register user."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "An error occurred."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data provided."));
}
?>