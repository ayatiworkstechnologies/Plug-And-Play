<?php
header('Content-Type: application/json');

include './conn.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'mailer/Exception.php';
require 'mailer/PHPMailer.php';
require 'mailer/SMTP.php';

$googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxwJq2NhYk1WA8qEeEVnKMvJnMG8l0HqUKvYAb-tcZXZkNX-TudycSArV6PhhPGB9PM2g/exec';

function jsonResponse($status, $message, $extra = []) {
    echo json_encode(array_merge([
        'status' => $status,
        'message' => $message
    ], $extra));
    exit;
}

function formatTimeLabel($hour) {
    $hour = (int)$hour;
    if ($hour === 12) return '12:00 PM';
    if ($hour === 23) return '11:00 PM';
    if ($hour > 12) return sprintf('%02d:00 PM', $hour - 12);
    return sprintf('%02d:00 AM', $hour);
}

function mailRow($label, $value) {
    return '
    <tr>
      <td style="padding:13px 15px;background:#f9fafb;border:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#111827;width:35%;">' . htmlspecialchars($label) . '</td>
      <td style="padding:13px 15px;background:#ffffff;border:1px solid #e5e7eb;font-size:14px;color:#374151;">' . $value . '</td>
    </tr>';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    jsonResponse('error', 'Invalid request method.');
}

$name          = trim($_POST['name'] ?? '');
$email         = trim($_POST['email'] ?? '');
$mobile        = trim($_POST['mobile'] ?? '');
$players_count = intval($_POST['players_count'] ?? 0);
$games         = $_POST['games'] ?? [];
$booking_date  = trim($_POST['booking_date'] ?? '');
$start_time    = trim($_POST['start_time'] ?? '');
$end_time      = trim($_POST['end_time'] ?? '');
$message       = trim($_POST['message'] ?? '');

if (!is_array($games)) {
    $games = [];
}

$gamesText = implode(', ', $games);

if (
    $name === '' ||
    $email === '' ||
    $mobile === '' ||
    $players_count <= 0 ||
    empty($games) ||
    $booking_date === '' ||
    $start_time === '' ||
    $end_time === ''
) {
    http_response_code(400);
    jsonResponse('error', 'Please fill all required fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    jsonResponse('error', 'Please enter a valid email address.');
}

if (!preg_match('/^[0-9]{10}$/', $mobile)) {
    http_response_code(400);
    jsonResponse('error', 'Phone number must be 10 digits.');
}

if ($players_count > 15) {
    http_response_code(400);
    jsonResponse('error', 'Maximum 15 players only allowed.');
}

if ((int)$end_time <= (int)$start_time) {
    http_response_code(400);
    jsonResponse('error', 'End time must be after start time.');
}

if (((int)$end_time - (int)$start_time) < 1) {
    http_response_code(400);
    jsonResponse('error', 'Minimum booking slot is 1 hour.');
}

/* DB SAVE */
$stmt = $conn->prepare("
    INSERT INTO game_bookings
    (name, email, mobile, players_count, games, booking_date, start_time, end_time, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    http_response_code(500);
    jsonResponse('error', 'Database preparation failed: ' . $conn->error);
}

$stmt->bind_param(
    "sssisssss",
    $name,
    $email,
    $mobile,
    $players_count,
    $gamesText,
    $booking_date,
    $start_time,
    $end_time,
    $message
);

if (!$stmt->execute()) {
    http_response_code(500);
    jsonResponse('error', 'Failed to save booking: ' . $stmt->error);
}

/* GOOGLE SHEET */
$sheetSaved = false;
$sheetError = '';

$sheetPayload = [
    'name'          => $name,
    'email'         => $email,
    'mobile'        => $mobile,
    'players_count' => $players_count,
    'games'         => $gamesText,
    'booking_date'  => $booking_date,
    'start_time'    => formatTimeLabel($start_time),
    'end_time'      => formatTimeLabel($end_time),
    'message'       => $message,
    'created_at'    => date('Y-m-d H:i:s'),
    'source'        => 'Plug And Play Website'
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
    $sheetError = $curlError ?: 'Google Sheet HTTP ' . $httpCode;
}

/* EMAIL */
$mailSent = false;
$mailError = '';

$emailBody = '
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 15px;background:#f3f4f6;">
    <tr>
      <td align="center">
        <table width="650" cellpadding="0" cellspacing="0" style="max-width:650px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:22px 26px;background:#0b1118;">
              <div style="font-size:22px;font-weight:700;color:#FFCE1B;">New Game Booking</div>
              <div style="padding-top:6px;font-size:13px;color:#cbd5e1;">A new booking request has been received.</div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                ' . mailRow('Full Name', htmlspecialchars($name)) . '
                ' . mailRow('Email', htmlspecialchars($email)) . '
                ' . mailRow('Mobile', htmlspecialchars($mobile)) . '
                ' . mailRow('Players Count', htmlspecialchars($players_count)) . '
                ' . mailRow('Selected Games', htmlspecialchars($gamesText)) . '
                ' . mailRow('Booking Date', htmlspecialchars($booking_date)) . '
                ' . mailRow('Start Time', htmlspecialchars(formatTimeLabel($start_time))) . '
                ' . mailRow('End Time', htmlspecialchars(formatTimeLabel($end_time))) . '
                ' . mailRow('Message', nl2br(htmlspecialchars($message))) . '
              </table>
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
    $mail->Subject = 'New Game Booking - Plug And Play';
    $mail->Body    = $emailBody;
    $mail->AltBody = "Name: $name\nEmail: $email\nMobile: $mobile\nPlayers: $players_count\nGames: $gamesText\nDate: $booking_date\nStart: " . formatTimeLabel($start_time) . "\nEnd: " . formatTimeLabel($end_time) . "\nMessage: $message";

    $mail->send();
    $mailSent = true;
} catch (Exception $e) {
    $mailError = $mail->ErrorInfo ?: $e->getMessage();
}

$stmt->close();
$conn->close();

if ($sheetSaved && $mailSent) {
    jsonResponse('success', 'Booking submitted successfully.');
}

if ($sheetSaved || $mailSent) {
    jsonResponse('warning', 'Booking saved, but one notification service had an issue.', [
        'sheet_saved' => $sheetSaved,
        'mail_sent' => $mailSent,
        'sheet_error' => $sheetError,
        'mail_error' => $mailError
    ]);
}

jsonResponse('warning', 'Booking saved in database, but Google Sheet and email failed.', [
    'sheet_error' => $sheetError,
    'mail_error' => $mailError
]);
?>