<?php
require '../vendor1/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

function sendVerificationEmail($to_email, $first_name, $verification_link) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'login@bmreducation.com';
        $mail->Password = 'Moksha@10171+10170';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('login@bmreducation.com', 'MedCare Hospital');
        $mail->addAddress($to_email);

        // HTML Content
        $htmlBody = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background-color: #0056b3; color: white; padding: 20px; text-align: center;'>
                    <h1>Welcome to MedCare Hospital</h1>
                </div>
                <div style='padding: 20px;'>
                    <p>Dear {$first_name},</p>
                    <p>Thank you for creating an account with MedCare Hospital. To ensure the security of your account, please verify your email address.</p>
                    
                    <div style='background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;'>
                        <p><strong>Click the button below to verify your email:</strong></p>
                        <a href='{$verification_link}' style='background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;'>Verify Email</a>
                    </div>
                    
                    <p><strong>Security Notice:</strong></p>
                    <ul style='color: #666;'>
                        <li>This verification link will expire in 24 hours</li>
                        <li>If you didn't create this account, please ignore this email</li>
                        <li>Do not share this email with anyone</li>
                    </ul>
                    
                    <p>If you have any questions, please contact our support team.</p>
                    <p>Best regards,<br>MedCare Hospital Team</p>
                </div>
                <div style='background-color: #f1f1f1; color: #333; padding: 10px; text-align: center; font-size: 12px;'>
                    <p><strong>BMR EDUCATION V4 Mail Service</strong></p>
                    <p>Customer ID: 70981278</p>
                </div>
            </div>";

        // Plain text version
        $textBody = "Dear {$first_name},

Thank you for creating an account with MedCare Hospital. To ensure the security of your account, please verify your email address.

Please copy and paste this link into your browser to verify your email:
{$verification_link}

Security Notice:
- This verification link will expire in 24 hours
- If you didn't create this account, please ignore this email
- Do not share this email with anyone

If you have any questions, please contact our support team.

Best regards,
MedCare Hospital Team

---
BMR EDUCATION V4 Mail Service
Customer ID: 70981278";

        $mail->isHTML(true);
        $mail->Subject = 'Verify Your Email - MedCare Hospital';
        $mail->Body = $htmlBody;
        $mail->AltBody = $textBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return false;
    }
}

function sendPasswordResetEmail($to_email, $first_name, $reset_link) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'login@bmreducation.com';
        $mail->Password = 'Moksha@10171+10170';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('login@bmreducation.com', 'MedCare Hospital');
        $mail->addAddress($to_email);

        // HTML Content
        $htmlBody = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background-color: #0056b3; color: white; padding: 20px; text-align: center;'>
                    <h1>Password Reset Request</h1>
                </div>
                <div style='padding: 20px;'>
                    <p>Dear {$first_name},</p>
                    <p>We received a request to reset the password for your MedCare Hospital account.</p>
                    
                    <div style='background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;'>
                        <p><strong>Click the button below to reset your password:</strong></p>
                        <a href='{$reset_link}' style='background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;'>Reset Password</a>
                    </div>
                    
                    <p><strong>Important Security Notes:</strong></p>
                    <ul style='color: #666;'>
                        <li>This link will expire in 1 hour</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>For security, please create a strong password</li>
                        <li>Never share your password with anyone</li>
                    </ul>
                    
                    <p>If you didn't request this change, please contact our support team immediately.</p>
                    <p>Best regards,<br>MedCare Hospital Team</p>
                </div>
                <div style='background-color: #f1f1f1; color: #333; padding: 10px; text-align: center; font-size: 12px;'>
                    <p><strong>BMR EDUCATION V4 Mail Service</strong></p>
                    <p>Customer ID: 70981278</p>
                </div>
            </div>";

        // Plain text version
        $textBody = "Dear {$first_name},

We received a request to reset the password for your MedCare Hospital account.

Please copy and paste this link into your browser to reset your password:
{$reset_link}

Important Security Notes:
- This link will expire in 1 hour
- If you didn't request this reset, please ignore this email
- For security, please create a strong password
- Never share your password with anyone

If you didn't request this change, please contact our support team immediately.

Best regards,
MedCare Hospital Team

---
BMR EDUCATION V4 Mail Service
Customer ID: 70981278";

        $mail->isHTML(true);
        $mail->Subject = 'Password Reset - MedCare Hospital';
        $mail->Body = $htmlBody;
        $mail->AltBody = $textBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return false;
    }
}
?>