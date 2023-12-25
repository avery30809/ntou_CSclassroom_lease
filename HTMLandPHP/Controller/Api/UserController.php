<?php
require_once __DIR__ . "/../../inc/bootstrap.php";
class UserController extends BaseController
{
    private $userModel;
    public function __construct() {
        parent::__construct();
        $this->userModel = new UserModel();
    }
    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $action = isset($_POST["action"]) ? $_POST["action"] : null;
            switch ($action) {
                case 'login':
                    $this->handleLogin();
                    break;
                case 'register':
                    $this->handleRegister();
                    break;
                case 'searchDate':
                    $this->handleSearchDate();
                    break;
                case 'forgetPWD':
                    $this->handleForgetPWD();
                    break;
                case 'updateProfile':
                    $this->handleUpdateProfile();
                    break;
                default:
                    break;
            }
        }
        else if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $action = isset($_GET["action"]) ? $_GET["action"] : null;
            switch ($action) {
                case 'getID':
                    $this->getID();
                    break;
                case 'getUserName':
                    $this->getUserName();
                    break;
                case 'getUserProfile':
                    $this->getUserProfile();
                    break;
                case 'logout':
                    $this->handleLogout();
                    break;
                default:
                    break;
            }
        }
    }
    private function getUserName() {
        $userID = $_POST['userID'] ?? null;
        $result = $this->userModel->getUserName($userID);
        $this->sendOutput(json_encode($result[0]));
    }
    //獲取身分資訊
    private function getUserProfile() {
        //確保已經登入
        if(isset($_SESSION["userID"])) {
            $userID = $_SESSION["userID"];
            $result = $this->userModel->getUserProfile($userID);
            $this->sendOutput(json_encode($result));
        }
        else {
            $obj = [
                'error' => 'not login'
            ];
            $this->sendOutput(json_encode($obj));
        }
    }
    //登出
    private function handleLogout() {
        session_destroy();
    }
    //搜尋日期
    private function handleSearchDate() {
        if(isset($_POST["date"])) {
            $_SESSION["date"] = $_POST["date"];
        }
        else if(isset($_SESSION["date"])){
            $obj = [
                "date" => $_SESSION["date"]
            ];
            $this->sendOutput(json_encode($obj));
        }
    }
    //登入
    private function handleLogin() {
        $account = isset($_POST['account']) ? $_POST['account'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';
        $op = isset($_POST['operation']) ? $_POST['operation'] : 0;
        try {
            $result = $this->userModel->authenticate($account, $password, $op);

            if ($result) {
                $_SESSION["userID"] = $result[0];
                $this->sendOutput("登入成功！ $op");
            } else {
                $this->sendOutput("帳號或密碼錯誤");
            }
        } catch (Exception $e) {
            // 處理例外情況
            $this->sendOutput("發生錯誤：" . $e->getMessage());
        }
    }
    //註冊
    private function handleRegister() {
        //確認是否驗證過email
        if(isset($_SESSION['verification_code']) && $_SESSION['verification_code']['id'] === $_POST['account']) {
            if($_SESSION['verification_code_expiration']<time()) {
                $this->sendOutput("驗證碼過期 請重新認證");
                return;
            }
            $username = $_POST["username"];
            $account = $_POST["account"];
            $verification_code = $_POST["verification_code"];
            $password = $_POST["pwd"];
            $confirm_pwd = $_POST["confirm_pwd"];
            $email = "$account@mail.ntou.edu.tw";
            if($verification_code != $_SESSION['verification_code']['code']){
                $this->sendOutput('驗證碼錯誤');
            }
            else if($password !== $confirm_pwd) {
                $this->sendOutput('密碼不匹配 請確認密碼');
            }
            else {
                $result = $this->userModel->register($username, $account, $password, $email);
                //確認帳號是第一次註冊
                if($result) $this->sendOutput('帳號已存在');
                else{
                    unset($_SESSION["verification_code"]);
                    unset($_SESSION["verification_code_expiration"]);
                    $this->sendOutput('註冊成功！');
                };
            }
        }
        else {
            $this->sendOutput('請先進行認證');
        }
    }

    // 用於管理員新增課程時獲取使用者的連絡資訊
    private function getID() {
        $account = $_GET['account'];
        $result = $this->userModel->accountGetID($account);
        if($result)
            $this->sendOutput($result[0]);
        else 
            $this->sendOutput("未找到使用者");
    }

    // 忘記密碼
    private function handleForgetPWD() {
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
                $result = $this->userModel->resetPWD($account);
                //確認帳號是否有註冊過
                if($result == false) $this->sendOutput('此帳號不存在');
                else{
                    unset($_SESSION["verification_code"]);
                    unset($_SESSION["verification_code_expiration"]);
                    $this->sendOutput('新密碼已送出 請去海大信箱接收新密碼 記得在海大信箱選擇日期！');
                };
            }
        }
        else {
            $this->sendOutput('請先進行認證');
        }
    }
    private function handleUpdateProfile() {
        $username = $_POST['username'] ?? '';
        $account = $_POST['account'];
        $password = $_POST['oldPWD'] ?? '';
        $newPWD = $_POST['newPWD'] ?? '';
        $phone = $_POST['phone']!='' ? $_POST['phone']:null;
        $op = 0;
        
        if($username == '') {
            $this->sendOutput("使用者名稱不得為空！");
            return;
        }

        if($password != '') {
            try {
                $result = $this->userModel->authenticate($account, $password, $op);
                if ($result) {
                    if($newPWD == '') {
                        $this->sendOutput("新密碼不得為空！");
                        return;
                    }
                    $ID = $result[0];
                    $this->userModel->updateProfile($ID, $username, $newPWD, $phone);
                    $this->sendOutput("更新成功！");
                } else {
                    $this->sendOutput("舊密碼不相符！");
                }
            } catch (Exception $e) {
                // 處理例外情況
                $this->sendOutput("發生錯誤：" . $e->getMessage());
            }
        }
        else {
            try {
                $ID = $_SESSION['userID'];
                $this->userModel->updateProfileNoPWD($ID, $username, $phone);
                $this->sendOutput("更新成功！");
            } catch (Exception $e) {
                // 處理例外情況
                $this->sendOutput("發生錯誤：" . $e->getMessage());
            }
        }
    }
/* 
* "/user/list" Endpoint - Get list of users 

    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $userModel = new UserModel();
                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }
                $arrUsers = $userModel->getUsers($intLimit);
                $responseData = json_encode($arrUsers);
            } catch (Error $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
        // send output 
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)), 
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
*/
}
$test = new UserController();
$test->handleRequest();