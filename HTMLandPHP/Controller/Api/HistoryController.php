<?php
require_once __DIR__ . "/../../inc/bootstrap.php";
class HistoryController extends BaseController
{
    private $historyModel;
    public function __construct() {
        parent::__construct();
        $this->historyModel = new HistoryModel();
    }
    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $action = $_POST["action"] ?? null;
            switch ($action) {
                case 'submitForm':
                    $this->handleSubmitForm();
                    break;
                case 'examineForm':
                    $this->handleExamineForm();
                    break;
                default:
                    break;
            }
        }
        else if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $action = $_GET["action"] ?? null;
            switch ($action) {
                case 'getApplyRequest':
                    $this->getApplyRequest();
                    break;
                case 'getHistoryForm':
                    $this->getHistoryForm();
                    break;
                default:
                    break;
            }
        }
    }
    private function getHistoryForm() {
        $result = $this->historyModel->getHistoryForm();
        $obj = [
            'error' => 'no history'
        ];
        if ($result === false) {
            $this->sendOutput(json_encode($obj));
        } else {
            $this->sendOutput(json_encode($result));
        }
    }
    private function handleExamineForm() {
        $roomName = $_POST["roomName"] ?? null;
        $userID = $_POST["userID"] ?? null;
        $date = $_POST["date"] ?? null;
        $startTime = $_POST["startTime"] ?? null;
        $allow = $_POST["allow"] ?? null;
        $result = $this->historyModel->handleExamineForm($roomName, $userID, $date, $startTime, $allow);
        return $result;
    }
    private function getApplyRequest() {
        $userID = $_SESSION["userID"];
        $result = $this->historyModel->getApplyRequest($userID);
        $obj = [
            'error' => 'not login'
        ];
        if ($result === false) {
            $this->sendOutput(json_encode($obj));
        } else {
            $this->sendOutput(json_encode($result));
        }
    }
    private function handleSubmitForm() {
        $roomName = $_POST["roomName"];
        $userID = $_SESSION["userID"];
        $date = $_POST["date"];
        $start = $_POST["startTime"];
        $end = $_POST["endTime"];
        $content = $_POST["content"];
        $immediate = $_POST["immediate"];
        date_default_timezone_set("Asia/Taipei");
        $borrowTime = date('Y-m-d H:i:s');
        $this->historyModel->insertApplication($roomName, $userID, $date, $start, $end, $content, $immediate, $borrowTime);
        $this->sendOutput("提交成功");
        unset($_SESSION["application"]);
    }
}
$test = new HistoryController();
$test->handleRequest();