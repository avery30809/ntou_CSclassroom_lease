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
}
$test = new VerificationController();
$test->handleRequest();