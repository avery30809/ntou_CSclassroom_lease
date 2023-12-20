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
                default:
                    break;
            }
        }
    }
    private function getApplyRequest() {
        $userID = $_SESSION["userID"];
        $result = $this->historyModel->getApplyRequest($userID);
        $this->sendOutput(json_encode($result));
    }
    private function handleSubmitForm() {
        $roomName = $_POST["roomName"];
        $userID = $_SESSION["userID"];
        $date = $_POST["date"];
        $start = $_POST["startTime"];
        $end = $_POST["endTime"];
        $content = $_POST["content"];
        $immediate = $_POST["immediate"];
        $borrowTime = $_POST["borrowTime"];
        $this->historyModel->insertApplication($roomName, $userID, $date, $start, $end, $content, $immediate, $borrowTime);
        $this->sendOutput("提交成功");
        unset($_SESSION["application"]);
    }
}
$test = new HistoryController();
$test->handleRequest();