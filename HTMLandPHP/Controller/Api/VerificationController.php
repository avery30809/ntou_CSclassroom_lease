<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once __DIR__ . "/../../inc/bootstrap.php";
class VerificationController extends BaseController{
    public function sendVerificationCode() {
        if($_SERVER["REQUEST_METHOD"] == "POST"){
            $userEmail = $_POST['email'];
            $verificationCodeModel = new VerificationCodeModel();
            $code = $verificationCodeModel->generateCode();
            $this->sendEmail($userEmail, $code);
        }
    }

    private function sendEmail($userEmail, $code) {
        require 'PHPMailer/src/Exception.php';
        require 'PHPMailer/src/SMTP.php';
        require 'PHPMailer/src/PHPMailer.php';
        
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
            $mail->Body = "Your verification code is: $code";
            $mail->IsHTML(true); //設定郵件內容為HTML
            
            $mail->addAddress($email);
            if ($mail->send()) {
                $_SESSION['verification_code'] = $code;
                // 設置驗證碼的過期時間為5分鐘後的時間戳
                $_SESSION['verification_code_expiration'] = time() + 300; // 300秒後
            }
        } catch (Exception $ex) {}
    }
}
$test = new VerificationController();
$test->sendVerificationCode();