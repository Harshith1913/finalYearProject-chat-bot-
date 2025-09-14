<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

    // Verify token and get user email
    $decoded = decodeJWT($token);
    $user_email = $decoded->email;

    // Get appointments with doctor details
    $stmt = $conn->prepare("
        SELECT 
            a.*,
            d.name as doctor_name,
            d.specialty,
            d.image as doctor_image,
            d.consultation_fee
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE a.patient_email = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();

    $appointments = array();
    while ($row = $result->fetch_assoc()) {
        // Format date and time
        $row['appointment_date'] = date('Y-m-d', strtotime($row['appointment_date']));
        $row['appointment_time'] = date('H:i', strtotime($row['appointment_time']));
        $row['created_at'] = date('Y-m-d H:i:s', strtotime($row['created_at']));
        $appointments[] = $row;
    }

    http_response_code(200);
    echo json_encode(array("appointments" => $appointments));
} catch (Exception $e) {
    error_log("Get appointments error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to get appointments", "error" => $e->getMessage()));
}

$conn->close();
?> 