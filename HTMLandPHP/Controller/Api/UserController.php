<?php
class UserController extends BaseController
{
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

    private function getUserProfile() {
        //確保已經登入
        if(isset($_SESSION["userID"])) {
            $userID = $_SESSION["userID"];
            $userDataModel = new UserDataModel();
            $result = $userDataModel->getUserProfile($userID);
            $this->sendOutput(json_encode($result));
        }
        else {
            $obj = [
                'error' => 'not login'
            ];
            $this->sendOutput(json_encode($obj));
        }
    }
    private function handleLogout() {
        //確保已經登入
        if(isset($_SESSION["userID"])) {
            unset($_SESSION["userID"]);
        }
    }
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