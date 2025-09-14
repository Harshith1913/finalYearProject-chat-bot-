<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

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

// Fetch all appointments
$query = "SELECT a.id, a.reference_no, a.patient_name, a.patient_email, a.patient_phone, a.appointment_date, a.appointment_time, a.reason, a.status, d.name AS doctor_name, a.created_at 
          FROM appointments a 
          JOIN doctors d ON a.doctor_id = d.id 
          ORDER BY a.created_at DESC"; // Changed from a.submission_date to a.created_at
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $appointments = [];
    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }
    sendResponse(true, "Appointment details fetched successfully.", $appointments);
} else {
    sendResponse(false, "No appointments found.");
}

$conn->close();
?>
