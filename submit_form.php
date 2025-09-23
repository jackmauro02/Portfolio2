<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Replace this with your real email
    $to = "jackmauro02@gmail.com"; 

    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Validate fields
    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        http_response_code(400);
        echo "Please complete the form correctly.";
        exit;
    }

    // Email content
    $subject = "New Contact Message from $name";
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Email headers
    $headers = "From: $name <$email>";

    // Send the email
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo "Thank you! Your message has been sent.";
    } else {
        http_response_code(500);
        echo "Something went wrong and we couldn’t send your message.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission.";
}
?>
