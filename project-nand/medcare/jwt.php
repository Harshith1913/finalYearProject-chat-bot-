<?php
function generateJWT($payload) {
    $secret_key = "your_secret_key"; // Store this securely
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    
    // Encode Header
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    
    // Encode Payload
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
    
    // Create Signature
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verifyJWT($token) {
    $secret_key = "your_secret_key";
    $token_parts = explode('.', $token);
    
    if (count($token_parts) != 3) {
        return false;
    }
    
    $signature = hash_hmac('sha256', $token_parts[0] . "." . $token_parts[1], $secret_key, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return hash_equals($base64UrlSignature, $token_parts[2]);
}
?>