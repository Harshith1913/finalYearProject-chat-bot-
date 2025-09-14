<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");

include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

// Get token from URL
$token = isset($_GET['token']) ? $_GET['token'] : '';

if (empty($token)) {
    showErrorPage("Verification token is required.");
    exit();
}

function showSuccessPage($message, $isAlreadyVerified = false) {
    echo '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - MedCare Hospital</title>
        <meta http-equiv="refresh" content="5;url=https://www.bmreducation.com/medcare/login.html">
        <style>
            body {
                font-family: "Segoe UI", Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            .container {
                background: white;
                padding: 2rem 3rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 90%;
                width: 500px;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 1rem;
            }
            .message {
                color: #34495e;
                margin: 1.5rem 0;
                font-size: 1.1rem;
            }
            .redirect-message {
                color: #7f8c8d;
                font-size: 0.9rem;
            }
            .success-icon {
                color: #27ae60;
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .login-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 1rem;
                transition: background-color 0.3s;
            }
            .login-button:hover {
                background-color: #2980b9;
            }
            .countdown {
                color: #e74c3c;
                font-weight: bold;
            }
            @media (max-width: 480px) {
                .container {
                    padding: 1.5rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✓</div>
            <h1>' . ($isAlreadyVerified ? 'Email Already Verified' : 'Email Verified Successfully') . '</h1>
            <div class="message">' . $message . '</div>
            <a href="https://www.bmreducation.com/medcare/login.html" class="login-button">Go to Login</a>
            <div class="redirect-message">
                Redirecting to login page in <span class="countdown">5</span> seconds...
            </div>
        </div>
        <script>
            let countdown = 5;
            const countdownElement = document.querySelector(".countdown");
            
            const timer = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(timer);
                }
            }, 1000);
        </script>
    </body>
    </html>';
}

function showErrorPage($errorMessage) {
    echo '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Error - MedCare Hospital</title>
        <style>
            body {
                font-family: "Segoe UI", Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            .container {
                background: white;
                padding: 2rem 3rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 90%;
                width: 500px;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 1rem;
            }
            .message {
                color: #34495e;
                margin: 1.5rem 0;
                font-size: 1.1rem;
            }
            .redirect-message {
                color: #7f8c8d;
                font-size: 0.9rem;
            }
            .error-icon {
                color: #e74c3c;
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .login-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 1rem;
                transition: background-color 0.3s;
            }
            .login-button:hover {
                background-color: #2980b9;
            }
            .countdown {
                color: #e74c3c;
                font-weight: bold;
            }
            @media (max-width: 480px) {
                .container {
                    padding: 1.5rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error-icon">✗</div>
            <h1>Verification Error</h1>
            <div class="message">' . $errorMessage . '</div>
            <a href="https://www.bmreducation.com/medcare/login.html" class="login-button">Go to Login</a>
            <div class="redirect-message">
                Redirecting to login page in <span class="countdown">5</span> seconds...
            </div>
        </div>
        <script>
            let countdown = 5;
            const countdownElement = document.querySelector(".countdown");
            
            const timer = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(timer);
                }
            }, 1000);
        </script>
    </body>
    </html>';
}

try {
    // Check if token exists and is valid
    $query = "SELECT id, email_verified FROM medcare_users 
             WHERE verification_token = :token LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row['email_verified']) {
            // Email already verified
            showSuccessPage("Your email is already verified. You can now login.", true);
            exit();
        }

        // Update user verification status
        $update_query = "UPDATE medcare_users 
                       SET email_verified = 1, 
                           verification_token = NULL,
                           email_verified_at = NOW() 
                       WHERE verification_token = :token";
        
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(":token", $token);

        if ($update_stmt->execute()) {
            // Log verification
            $log_query = "INSERT INTO medcare_user_activities 
                         (user_id, type, description, timestamp) 
                         VALUES 
                         (:user_id, 'verification', 'Email verified successfully', NOW())";
            $log_stmt = $db->prepare($log_query);
            $log_stmt->bindParam(":user_id", $row['id']);
            $log_stmt->execute();

            showSuccessPage("Your email has been verified successfully. You can now login.");
        } else {
            showErrorPage("Unable to verify email. Please try again later.");
        }
    } else {
        showErrorPage("The verification token is invalid or has expired.");
    }
} catch (Exception $e) {
    error_log("Email verification error: " . $e->getMessage());
    showErrorPage("An error occurred during verification. Please try again later.");
}
?> 