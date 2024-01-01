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
                case 'setKeyRecord':
                    $this->handleSetKeyRecord();
                    break;
                case 'setBorrowed':
                    $this->handleSetBorrowedKeyRecord();
                    break;
                case 'cancelHistory':
                    $this->handleCancelHistory();
                    break;
                case 'fastInsert':
                    $this->handleFastInsert();
                    break;
                case 'classInsert':
                    $this->handleClassInsert();
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
                case 'getKeyRecord':
                    $this->handleGetKeyRecord();
                    break;
                case 'getAllowedHistory':
                    $this->handleAllowedHistory();
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
        $userID = $_GET["ID"];
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
        $userID = $_POST["userID"];
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
    private function handleGetKeyRecord() {
        date_default_timezone_set("Asia/Taipei");
        $date = date("Y-m-d");
        $result = $this->historyModel->getKeyRecord($date);
        if($result == false) {
            $obj = ['error'=> "沒有任何紀錄"];
            $this->sendOutput(json_encode($obj));
            return;
        }
        $this->sendOutput(json_encode($result));
    }
    private function handleSetKeyRecord() {
        date_default_timezone_set("Asia/Taipei");
        $returnTime = date("Y-m-d H:i:s");
        $roomName = $_POST['roomName'];
        $userID = $_POST['userID'];
        $date = $_POST['date'];
        $startTime = $_POST['startTime'];
        $this->historyModel->setKeyRecord($roomName, $userID, $date, $startTime, $returnTime);
    }
    private function handleSetBorrowedKeyRecord() {
        $roomName = $_POST['roomName'];
        $userID = $_POST['userID'];
        $date = $_POST['date'];
        $startTime = $_POST['startTime'];
        $this->historyModel->setBorrowedKeyRecord($roomName, $userID, $date, $startTime);
    }
    private function handleAllowedHistory() {
        $result = $this->historyModel->getAllowedHistory();
        if($result == false) {
            $obj = ['error'=> "沒有任何紀錄"];
            $this->sendOutput(json_encode($obj));
            return;
        }
        $this->sendOutput(json_encode($result));
    }
    private function handleCancelHistory() {
        $roomName = $_POST['roomName'];
        $userID = $_POST['userID'];
        $date = $_POST['date'];
        $startTime = $_POST['startTime'];
        $this->historyModel->cancelHistory($roomName, $userID, $date, $startTime);
    }
    private function handleFastInsert() {
        $activity = $_POST['activity'];
        $room = $_POST['room'];
        $start = $_POST['start']+1;
        $end = $_POST['end']+1;
        $date = $_POST['date'];
        $userID = $_POST['userID'];
        date_default_timezone_set("Asia/Taipei");
        $borrowTime = date('Y-m-d H:i:s');
        $immediate = $date == date('Y-m-d');
        $this->historyModel->fastInsert($room, $userID, $date, $start, $end, $activity, $immediate, 1, $borrowTime);
    }
    private function handleClassInsert() {
        $activity = $_POST["activity"];
        $semesterStart = $_POST["semesterStart"];
        $semesterEnd = $_POST["semesterEnd"];
        $week = $_POST["week"];
        $room = $_POST["room"];
        $start = $_POST["start"]+1;
        $end = $_POST["end"]+1;
        $userID = $_POST["userID"];

        // 轉換為 DateTime 物件
        $start_date = new DateTime($semesterStart);
        $end_date = new DateTime($semesterEnd);

        // 課程開始的第一天
        $start_date->modify("this week +$week days");

        // 包含最後一天
        $end_date->modify('+1 day');

        // 初始化迴圈的 DateInterval
        $interval = new DateInterval('P7D'); // P7D 代表七天

        // 初始化 DatePeriod 用於遍歷日期範圍
        $daterange = new DatePeriod($start_date, $interval, $end_date);
        
        date_default_timezone_set("Asia/Taipei");
        $borrowTime = date('Y-m-d H:i:s');
        // 遍歷每一天
        foreach ($daterange as $date) {
            $immediate = $date == date('Y-m-d');
            $this->historyModel->fastInsert($room, $userID, $date->format('Y-m-d'), $start, $end, $activity, $immediate, 1, $borrowTime);
        }
    }
}
$test = new HistoryController();
$test->handleRequest();