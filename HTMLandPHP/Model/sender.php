<?php

    session_start();

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'PHPMailer/src/Exception.php';
    require 'PHPMailer/src/SMTP.php';
    require 'PHPMailer/src/PHPMailer.php';
    
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $email = $_POST['email'];
        $verification_code = generateRandomCode();
        
        $mail = new PHPMailer(true);
        try{
            // Server 資訊
            $mail->IsSMTP();
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = "ssl";
            $mail->Host = "smtp.gmail.com";
            $mail->Port = 465;
            $mail->CharSet = "utf-8";
            // 登入
            $mail->Username = sender_account; //帳號
            $mail->Password = sender_password; //密碼
            // 寄件者
            $mail->setFrom(sender_account,"海大教室借用平台");
            // 郵件資訊
            $mail->Subject = 'Email Verification Code';
            $mail->Body = "Your verification code is: $verification_code";
            $mail->IsHTML(true); //設定郵件內容為HTML
            
            $mail->addAddress($email);
            if ($mail->send()) {
                $_SESSION['verification_code'] = $verification_code;
                // 設置驗證碼的過期時間為5分鐘後的時間戳
                $_SESSION['verification_code_expiration'] = time() + 300; // 300秒後
            }
        } catch (Exception $ex) {
        }
    }
    function generateRandomCode() {
        return rand(100000, 999999); // 生成六位數驗證碼
    }
?>