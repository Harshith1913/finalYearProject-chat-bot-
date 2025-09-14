<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

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

// Fetch all contact submissions
$query = "SELECT * FROM contact_submissions ORDER BY submission_date DESC";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $submissions = [];
    while ($row = $result->fetch_assoc()) {
        $submissions[] = $row;
    }
    sendResponse(true, "Contact details fetched successfully.", $submissions);
} else {
    sendResponse(false, "No contact submissions found.");
}

$conn->close();
?>
