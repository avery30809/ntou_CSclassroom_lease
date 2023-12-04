<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once __DIR__ . "/../../inc/bootstrap.php";
class VerificationController extends BaseController{
    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $action = isset($_POST["action"]) ? $_POST["action"] : null;
            switch($action) {
                case 'verification':
                    $this->sendVerificationCode();
                    break;
                default:
                    break;
            }
        }
    }
    private function sendVerificationCode() {
        $userEmail = $_POST['email'];
        if(isset($_SESSION['verification_code_expiration'])) {
            if($_SESSION['verification_code_expiration'] > time()) {
                date_default_timezone_set("Asia/Taipei");
                $mytime = date('H:i:s', $_SESSION['verification_code_expiration']);
                $this->sendOutput("請於 $mytime 後嘗試");
            } else {
                unset($_SESSION['verification_code_expiration']);
                unset($_SESSION['verification_code']);
            }
        }
        $verificationCodeModel = new VerificationCodeModel();
        $code = $verificationCodeModel->generateCode();
        $this->sendEmail($userEmail, $code);
        $this->sendOutput("請去海大信箱接收驗證碼 記得在海大信箱選擇日期！");
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
            
            $mail->addAddress($userEmail);
            if ($mail->send()) {
                $_SESSION['verification_code'] = $code;
                // 設置驗證碼的過期時間為5分鐘後的時間戳
                $_SESSION['verification_code_expiration'] = time() + 300; // 300秒後
            }
        } catch (Exception $ex) {}
    }
}
$test = new VerificationController();
$test->handleRequest();