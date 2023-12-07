<?php
require_once __DIR__ . "/../inc/bootstrap.php";
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
class VerificationModel extends Database{
    private $code, $pwd;
    public function __construct() {
        parent::__construct();
        require_once 'PHPMailer/src/Exception.php';
        require_once 'PHPMailer/src/SMTP.php';
        require_once 'PHPMailer/src/PHPMailer.php';
    }
    public function checkUser($account) {
        $res = $this->query("SELECT userID FROM userdata WHERE useraccount = ?", [$account]);
        if($res !== false) return true;
        return false;
    }
    public function sendEmail($userEmail, $action) {
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
            $this->content($mail, $action);
            
            $mail->addAddress($userEmail);
            if ($mail->send()) {
                if($action === "verify") {
                    $_SESSION['verification_code']['code'] = $this->code;
                    $_SESSION['verification_code']['id'] = explode('@',$userEmail)[0];
                    // 設置驗證碼的過期時間為5分鐘後的時間戳
                    $_SESSION['verification_code_expiration'] = time() + 300; // 300秒後
                }
                else if($action === "reset") {
                    $this->query("UPDATE userdata SET pwd = $this->pwd");
                }
            }
        } catch (Exception $ex) {}
    }
    private function content(&$mail, $action) {
        if($action === "verify"){
            $mail->Subject = "Email Verification Code";
            $this->generateCode();
            $mail->Body = "Your verification code is: $this->code";
        }
        else if($action === "reset") {
            $mail->Subject = "Reset password";
            $this->resetPWD();
            $mail->Body = "Your new pwd is: $this->pwd";
        }
        $mail->IsHTML(true); //設定郵件內容為HTML
    }
    private function generateCode() {
        $this->code = rand(100000, 999999);
    }
    private function resetPWD() {
        $ls = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        str_shuffle($ls);
        $len = 15;
        $this->pwd = "";
        for($i = 0; $i<$len; $i++) {
            $this->pwd = $this->pwd . $ls[rand(0, strlen($ls)-1)];
        }
    }
}