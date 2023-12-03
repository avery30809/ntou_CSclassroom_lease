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
                case 'getUserProfile':
                    $this->getUserProfile();
                    break;
                case 'logout':
                    $this->handleLogout();
                    break;
                case 'searchDate':
                    $this->handleSearchDate();
                    break;
                default:
                    break;
            }
        }
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
        //確保已經登入
        if(isset($_SESSION["userID"])) {
            unset($_SESSION["userID"]);
        }
    }
    //搜尋日期
    private function handleSearchDate() {
        if($_SERVER['REQUEST_METHOD'] == "POST") {
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
                echo "登入成功！ $op";
            } else {
                echo "帳號或密碼錯誤";
            }
        } catch (Exception $e) {
            // 處理例外情況
            echo "發生錯誤：" . $e->getMessage();
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