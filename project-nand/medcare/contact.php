<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
session_start();
ini_set('log_errors', 1);
ini_set('error_log', '/home/u291518478/domains/bmreducation.com/public_html/logs/admin_control/education_sec.php');
error_reporting(E_ALL);
ini_set('display_errors', 0);
date_default_timezone_set('Asia/Kolkata');
session_regenerate_id(true);

require '../vendor1/autoload.php';

// Database connection
$conn = new mysqli('localhost', 'u291518478_project1', 'Moksha@10170+10171', 'u291518478_project1');

// Check connection
if ($conn->connect_error) {
    sendResponse(false, "Database connection failed: " . $conn->connect_error);
}

// Utility function for response
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Capture and validate POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['name'], $data['email'], $data['phone'], $data['subject'], $data['message'])) {
    sendResponse(false, "Missing required fields.");
}

$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'];
$subject = $data['subject'];
$message = $data['message'];

// Get the user's IP address and user agent
$ipAddress = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];

// Insert the contact submission into the database
$stmt = $conn->prepare("INSERT INTO contact_submissions (full_name, email, phone, subject, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $name, $email, $phone, $subject, $message, $ipAddress, $userAgent);

if ($stmt->execute()) {
    sendResponse(true, "Contact form submitted successfully.");
} else {
    sendResponse(false, "Failed to submit the contact form. Please try again later.");
}

$stmt->close();
$conn->close();
?>