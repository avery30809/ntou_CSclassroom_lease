<?php
require_once __DIR__ . "/../../inc/bootstrap.php";
class VerificationController extends BaseController{
    private $verificationModel;
    public function __construct() {
        parent::__construct();
        $this->verificationModel = new VerificationModel();
    }
    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $action = isset($_POST["action"]) ? $_POST["action"] : null;
            switch($action) {
                case 'verification':
                    $this->sendVerificationCode();
                    break;
                case 'resetPWD':
                    $this->handleResetPWD();
                    break;
                default:
                    break;
            }
        }
    }
    private function sendVerificationCode() {
        $userEmail = $_POST['email'];
        if(isset($_SESSION['verification_code_expiration']) && $_SESSION['verification_code']['id'] === explode('@', $userEmail)[0]) {
            if($_SESSION['verification_code_expiration'] > time()) {
                date_default_timezone_set("Asia/Taipei");
                $mytime = date('H:i:s', $_SESSION['verification_code_expiration']);
                $this->sendOutput("請於 $mytime 後嘗試");
                return;
            } else {
                unset($_SESSION['verification_code_expiration']);
                unset($_SESSION['verification_code']);
            }
        }
        $this->verificationModel->sendEmail($userEmail, "verify");
        $this->sendOutput("請去海大信箱接收驗證碼 記得在海大信箱選擇日期！");
    }
    private function sendResetPWD($userEmail) {
        if(isset($_SESSION['verification_code_expiration']) && $_SESSION['verification_code']['id'] === explode('@', $userEmail)[0]) {
            if($_SESSION['verification_code_expiration'] > time()) {
                date_default_timezone_set("Asia/Taipei");
                $mytime = date('H:i:s', $_SESSION['verification_code_expiration']);
                $this->sendOutput("請於 $mytime 後嘗試");
                return;
            } else {
                unset($_SESSION['verification_code_expiration']);
                unset($_SESSION['verification_code']);
            }
        }
        $this->verificationModel->sendEmail($userEmail, "reset");
        $this->sendOutput("請去海大信箱接收新密碼 記得在海大信箱選擇日期！");
    }
    //忘記密碼(尚未測試)
    private function handleResetPWD() {
        //確認是否驗證過email
        if(isset($_SESSION['verification_code']) && $_SESSION['verification_code']['id'] === $_POST['account']) {
            if($_SESSION['verification_code_expiration']<time()) {
                $this->sendOutput("驗證碼過期 請重新認證");
                return;
            }
            $account = $_POST["account"];
            $verification_code = $_POST["verification_code"];
            $email = "$account@mail.ntou.edu.tw";
            if($verification_code != $_SESSION['verification_code']['code']){
                $this->sendOutput('驗證碼錯誤');
            }
            else {
                $check = $this->verificationModel->checkUser($account);
                if($check)
                    $this->sendResetPWD($email);
                else
                    $this->sendOutput("尚未註冊！");
            }
        }
        else {
            $this->sendOutput('請先進行認證');
        }
    }
}
$test = new VerificationController();
$test->handleRequest();