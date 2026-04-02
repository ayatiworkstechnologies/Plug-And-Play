<?php
header('Content-Type: application/json');

include './conn.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'mailer/Exception.php';
require 'mailer/PHPMailer.php';
require 'mailer/SMTP.php';

$googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz2-Wtf2jsew-MoyE4vrmc2178oF_YievnBUE894iOPdGuP8i37NDm7WJC5E7Jf2o9X/exec';

function jsonResponse($status, $message, $extra = []) {
    echo json_encode(array_merge([
        'status' => $status,
        'message' => $message
    ], $extra));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    jsonResponse('error', 'Invalid request method.');
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$mobile  = trim($_POST['mobile'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $mobile === '' || $subject === '' || $message === '') {
    http_response_code(400);
    jsonResponse('error', 'All fields are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    jsonResponse('error', 'Please enter a valid email address.');
}

if (!preg_match('/^[0-9]{10}$/', $mobile)) {
    http_response_code(400);
    jsonResponse('error', 'Phone number must be 10 digits.');
}

/* DB SAVE */
$stmt = $conn->prepare("INSERT INTO contact_enquiries (name, email, mobile, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())");

if (!$stmt) {
    http_response_code(500);
    jsonResponse('error', 'Database preparation failed: ' . $conn->error);
}

$stmt->bind_param("sssss", $name, $email, $mobile, $subject, $message);

if (!$stmt->execute()) {
    http_response_code(500);
    jsonResponse('error', 'Failed to save enquiry: ' . $stmt->error);
}

/* GOOGLE SHEETS */
$sheetSaved = false;
$sheetError = '';

$sheetPayload = [
    'name'       => $name,
    'email'      => $email,
    'mobile'     => $mobile,
    'subject'    => $subject,
    'message'    => $message,
    'created_at' => date('Y-m-d H:i:s'),
    'source'     => 'Plug And Play Website'
];

$ch = curl_init($googleScriptUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($sheetPayload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$sheetResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if (!$curlError && $httpCode >= 200 && $httpCode < 300) {
    $sheetSaved = true;
} else {
    $sheetError = $curlError ?: ('Google Sheet HTTP ' . $httpCode);
}

/* EMAIL */
$mailSent = false;
$mailError = '';

$emailBody = '
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>New Contact Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 15px;background:#f3f4f6;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:20px 24px;background:#0b1118;">
              <div style="font-size:22px;font-weight:700;line-height:1.3;color:#84eeff;">New Contact Enquiry</div>
              <div style="padding-top:6px;font-size:13px;color:#cbd5e1;line-height:1.5;">A new form submission has been received.</div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#111827;width:35%;">Full Name</td>
                  <td style="padding:14px 16px;background:#ffffff;border:1px solid #e5e7eb;font-size:14px;color:#374151;">' . htmlspecialchars($name) . '</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#111827;">Email Address</td>
                  <td style="padding:14px 16px;background:#ffffff;border:1px solid #e5e7eb;font-size:14px;color:#374151;">' . htmlspecialchars($email) . '</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#111827;">Phone Number</td>
                  <td style="padding:14px 16px;background:#ffffff;border:1px solid #e5e7eb;font-size:14px;color:#374151;">' . htmlspecialchars($mobile) . '</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#111827;">Subject</td>
                  <td style="padding:14px 16px;background:#ffffff;border:1px solid #e5e7eb;font-size:14px;color:#374151;">' . htmlspecialchars($subject) . '</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#111827;">Message</td>
                  <td style="padding:14px 16px;background:#ffffff;border:1px solid #e5e7eb;font-size:14px;color:#374151;">' . nl2br(htmlspecialchars($message)) . '</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280;">
              ' . date("Y") . ' Plug And Play. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'mail.ayatiworks.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'emailsmtp@ayatiworks.com';
    $mail->Password   = 'hYd@W,$nwNjC';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('emailsmtp@ayatiworks.com', 'Plug And Play Enquiry');
    $mail->addAddress('balaji@ayatiworks.com');
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission - Plug And Play';
    $mail->Body    = $emailBody;
    $mail->AltBody = "Name: $name\nEmail: $email\nMobile: $mobile\nSubject: $subject\nMessage: $message";

    $mail->send();
    $mailSent = true;
} catch (Exception $e) {
    $mailError = $mail->ErrorInfo ?: $e->getMessage();
}

$stmt->close();
$conn->close();

if ($sheetSaved && $mailSent) {
    jsonResponse('success', 'Thank you! Your enquiry has been submitted successfully.', [
        'redirect' => 'thankyou.html'
    ]);
}

if ($sheetSaved || $mailSent) {
    jsonResponse('warning', 'Saved successfully, but one notification service had an issue.', [
        'sheet_saved' => $sheetSaved,
        'mail_sent' => $mailSent,
        'sheet_error' => $sheetError,
        'mail_error' => $mailError
    ]);
}

http_response_code(500);
jsonResponse('error', 'Saved in database, but Google Sheet sync and email notification failed.', [
    'sheet_error' => $sheetError,
    'mail_error' => $mailError
]);
?>






 $mail->isSMTP();
    $mail->Host       = 'mail.ayatiworks.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'emailsmtp@ayatiworks.com';
    $mail->Password   = 'hYd@W,$nwNjC';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('emailsmtp@ayatiworks.com', 'Plug And Play Enquiry');
    $mail->addAddress('balaji@ayatiworks.com');
    $mail->addReplyTo($email, $name);