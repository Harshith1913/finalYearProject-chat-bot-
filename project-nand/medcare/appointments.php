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

use PHPMailer\PHPMailer\PHPMailer;

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

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['SCRIPT_URI'] === 'https://www.bmreducation.com/medcare/appointments') {
       sendResponse(false, "Invalid Request.");
}
if (!isset($data['department'], $data['doctor'], $data['appointmentDate'], $data['appointmentTime'], $data['patientName'], $data['patientEmail'], $data['patientPhone'], $data['reason'])) {
    sendResponse(false, "Missing required fields.");
}

$department = $data['department'];
$doctor = $data['doctor'];
$appointmentDate = $data['appointmentDate'];
$appointmentTime = $data['appointmentTime'];
$patientName = $data['patientName'];
$patientEmail = $data['patientEmail'];
$patientPhone = $data['patientPhone'];
$reason = $data['reason'];

// Find doctor_id from the doctors table based on the provided doctor name
$doctorName = str_replace('-', ' ', ucwords($doctor, '-')); // Convert to proper name format
$doctorQuery = $conn->prepare("SELECT id FROM doctors WHERE name = ?");
$doctorQuery->bind_param("s", $doctor);
$doctorQuery->execute();
$doctorResult = $doctorQuery->get_result();

if ($doctorResult->num_rows > 0) {
    $doctorRow = $doctorResult->fetch_assoc();
    $doctorId = $doctorRow['id'];
    $reference_no = rand(10,99999999999);
    // Insert data into appointments table
    $stmt = $conn->prepare("INSERT INTO appointments (doctor_id, reference_no, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason, status, mail_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Not Sent')");
    $stmt->bind_param("isssssss", $doctorId, $reference_no, $patientName, $patientEmail, $patientPhone, $appointmentDate, $appointmentTime, $reason);

    if ($stmt->execute()) {
        $appointmentId = $stmt->insert_id;

        // Send email confirmation
        $mail = new PHPMailer(true);
        $mailStatus = 'Not Sent';  // Default status
        $mailId = '';

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.hostinger.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'login@bmreducation.com';
            $mail->Password = 'Moksha@10171+10170';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            // Recipients
            $mail->setFrom('login@bmreducation.com', 'MedCare Hospital');
            $mail->addAddress($patientEmail, $patientName);

$htmlBody = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background-color: #0056b3; color: white; padding: 20px; text-align: center;'>
            <h1>Appointment Confirmation</h1>
        </div>
        <div style='padding: 20px;'>
            <p>Dear $patientName,</p>
            <p>We are pleased to confirm that your appointment has been scheduled successfully with <strong>$doctorName</strong> in our <strong>$department</strong> department.</p>
            <p><strong>Appointment Details:</strong></p>
            <div style='background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                <p><strong>Reference Number:</strong> $reference_no</p>
                <p><strong>Date:</strong> " . date('l, F j, Y', strtotime($appointmentDate)) . "</p>
                <p><strong>Time:</strong> " . date('g:i A', strtotime($appointmentTime)) . "</p>
                <p><strong>Doctor:</strong> $doctorName</p>
                <p><strong>Department:</strong> $department</p>
            </div>
            <p><strong>Important Notes:</strong></p>
            <ul>
                <li>Please arrive at least 15 minutes before your scheduled appointment time.</li>
                <li>Bring any relevant medical documents and your ID for verification.</li>
                <li>If you need to reschedule or cancel your appointment, kindly contact us at least 24 hours in advance.</li>
            </ul>
            <p><strong>Location:</strong> MedCare Hospital, Near Presidency University Bangalore.</p>
            <p>If you have any questions, feel free to reach out to us at <strong>support@medcarehospital.com</strong> or call us at <strong>(123) 456-7890</strong>.</p>
            <p>We look forward to seeing you soon!</p>
            <p>Best regards,<br>MedCare Hospital Team</p>
            <p style='font-size: 12px; color: #888;'>This is an automated message. Please do not reply to this email.</p>
        </div>
        <div style='background-color: #f1f1f1; color: #333; padding: 10px; text-align: center; font-size: 12px;'>
            <p><strong>BMR EDUCATION V4 Mail Service</strong></p>
            <p>Customer ID: 70981278</p>
        </div>
    </div>";
$textBody = "Dear $patientName,

We are pleased to confirm that your appointment has been scheduled successfully with $doctorName in our $department department.

Appointment Details:
---------------------------
Reference Number: $reference_no
Date: " . date('l, F j, Y', strtotime($appointmentDate)) . "
Time: " . date('g:i A', strtotime($appointmentTime)) . "
Doctor: $doctorName
Department: $department

Important Notes:
--------------------
- Please arrive at least 15 minutes before your scheduled appointment time.
- Bring any relevant medical documents and your ID for verification.
- If you need to reschedule or cancel your appointment, kindly contact us at least 24 hours in advance.

Location: MedCare Hospital, Near Presidency University Bangalore.

If you have any questions, feel free to reach out to us at support@medcarehospital.com or call us at (123) 456-7890.

We look forward to seeing you soon!

Best regards,
MedCare Hospital Team

---
This is an automated message. Please do not reply to this email.

BMR EDUCATION V4 Mail Service
Customer ID: 70981278";

            $mail->isHTML(true);
            $mail->Subject = "Appointment Confirmation - $reference_no";
            $mail->Body = $htmlBody;
            $mail->AltBody = $textBody;

            // Send email
            $mail->send();
            $mailStatus = 'Sent';
            $mailId = $mail->getLastMessageID();

            // Update appointment status and mail details in the database
            $updateStmt = $conn->prepare("UPDATE appointments SET status = 'Confirmed', mail_status = ?, mail_id = ? WHERE id = ?");
            $updateStmt->bind_param("ssi", $mailStatus, $mailId, $appointmentId);
            $updateStmt->execute();
            $updateStmt->close();

            sendResponse(true, "Appointment scheduled, but email could not be sent. Mailer Error: {$mail->ErrorInfo}", [
                'appointmentRef' => $reference_no,
                'appointmentDate' => $appointmentDate,
                'appointmentTime' => $appointmentTime,
                'emailSent' => $emailSent
            ]);
        } catch (Exception $e) {
            // Update mail status if sending fails
            $updateStmt = $conn->prepare("UPDATE appointments SET mail_status = 'Failed' WHERE id = ?");
            $updateStmt->bind_param("i", $appointmentId);
            $updateStmt->execute();
            $updateStmt->close();

            sendResponse(true, "Appointment booked, but email could not be sent. Mailer Error: {$mail->ErrorInfo}");
        }
    } else {
        sendResponse(false, "Failed to book appointment. Please try again later.");
    }

    $stmt->close();
} else {
    sendResponse(false, "Doctor not found.".$doctor);
}

$doctorQuery->close();
$conn->close();
?>
