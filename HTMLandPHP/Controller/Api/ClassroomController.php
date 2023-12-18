<?php
require_once __DIR__ . "/../../inc/bootstrap.php";
class ClassroomController extends BaseController{
    private $classroomModel;
    public function __construct() {
        parent::__construct();
        $this->classroomModel = new ClassroomModel();
    }
    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $action = isset($_POST["action"]) ? $_POST["action"] : null;

            switch ($action) {
                case 'createApplicationForm':
                    $this->createApplicationForm();
                    break;
                case 'fastInsert':
                    $this->handleFastInsert();
                    break;
                case 'classInsert':
                    $this->handleClassInsert();
                    break;
                case 'cancelForm':
                    $this->handleCancelForm();
                    break;
                case 'submitForm':
                    $this->handleSubmitForm();
                    break;
                default:
                    break;
            }
        }
        else if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $action = isset($_GET["action"]) ? $_GET["action"] : null;
            
            switch ($action) {
                case 'getAllClassroomName':
                    $this->getAllClassroomName();
                    break;
                case 'getCondition':
                    $this->getDateClassCondition();
                    break;
                case 'getApplicationForm':
                    $this->getApplicationForm();
                    break;
                case 'getWeeklySchedule':
                    $this->getWeeklySchedule();
                    break;
            }
        }
    }
    private function getAllClassroomName() {
        $classroomsName = $this->classroomModel->getAllClassroomName();

        $this->sendOutput(json_encode($classroomsName));
    }
    private function getDateClassCondition() {
        $date = $_SESSION['date'];

        // 獲取所有教室
        $getRooms = $this->classroomModel->getAllClassroomName();
        $activities = [];
        foreach($getRooms as $room) {
            // 每個教室有9個時間段 紀錄該時間段的活動名稱
            $activities["$room[0]"] = ["","","","","","","","",""];
        }

        // 查詢指定日期的所有預定活動
        $result = $this->classroomModel->searchActivities($date);

        // 檢查是否有預定活動
        if ($result) {
            // 每個教室的預定活動
            foreach($result as $res) {
                $room = $res[0];
                $hour = $res[1];
                $activity = $res[2];
                $activities["$room"][$hour-8] = $activity;
            }
        }
        $this->sendOutput(json_encode($activities));
    }
    private function getWeeklySchedule() {
        $roomName = $_GET['roomName'];
        $selectDay = new DateTime($_SESSION['date']);

        // 本周星期一日期
        $thisMonday = clone $selectDay;
        $thisMonday->modify('this week');

        // 本周星期日日期
        $thisSunday = clone $selectDay;
        $thisSunday->modify('this week +6 days');

        $currentDate = clone $thisMonday;
        $result = [];
        while ($currentDate <= $thisSunday) {
            array_push($result, $this->classroomModel->searchSingleRoomActivities($roomName, $currentDate->format("Y-m-d")));
            $currentDate->modify('+1 day');
        }
        $this->sendOutput(json_encode($result));
    }
    private function handleFastInsert() {
        $activity = $_POST['activity'];
        $room = $_POST['room'];
        $start = $_POST['start']+8;
        $end = $_POST['end']+8;
        $date = $_POST['date'];
        $userID = $_POST['userID'];
        $activities = $this->classroomModel->searchActivities($date);

        $flag = true;
        if($activities) {
            foreach($activities as $item) {
                if($start <= $item[1] && $item[1] <= $end) {
                    $flag = false;
                }
            }
        }
        if($flag) {
            for($i=$start; $i<=$end; $i++){
                $this->classroomModel->insertCourse($room, $date, $i, $activity, $userID);
            }
            $this->sendOutput("新增成功！");
        }
        else {
            $this->sendOutput("有衝堂 請調整時間");
        }
    }
    private function handleClassInsert() {
        $activity = $_POST["activity"];
        $semesterStart = $_POST["semesterStart"];
        $semesterEnd = $_POST["semesterEnd"];
        $week = $_POST["week"];
        $room = $_POST["room"];
        $start = $_POST["start"]+8;
        $end = $_POST["end"]+8;
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
        
        $flag = true;
        // 遍歷每一天
        foreach ($daterange as $date) {
            for($i=$start; $i<=$end; $i++) {
                if($flag)
                    $activities = $this->classroomModel->searchActivities($date->format('Y-m-d'));

                if($flag && $activities) {
                    foreach($activities as $item) {
                        if($i == $item[1]) {
                            $flag = false;
                        }
                    }
                }
                $this->classroomModel->insertCourse($room, $date->format('Y-m-d'), $i, $activity, $userID);
            }
        }
        if($flag) {
            $this->sendOutput("新增成功！");
        }
        else {
            $this->sendOutput("有部分衝堂 已忽略衝堂的新增");
        }
    }
    // 產生借用表單
    private function createApplicationForm() {
        $application = [
            "room" => $_POST["roomName"],
            "time" => $_POST["TimeSlot"]
        ];
        $_SESSION["application"] = $application;
    }
    // 取得借用表單內容
    private function getApplicationForm() {
        if(isset($_SESSION["application"]))
            $this->sendOutput(json_encode($_SESSION["application"]));
        else {
            $obj = [
                "error" => "no TimeSlot"
            ];
            $this->sendOutput(json_encode($obj));
        }
    }
    private function handleCancelForm() {
        unset($_SESSION["application"]);
    }
    private function handleSubmitForm() {
        $roomName = $_POST["roomName"];
        $userID = $_SESSION["userID"];
        $date = $_POST["selectedDate"];
        $start = $_POST["startTime"]+7;
        $end = $_POST["endTime"]+8;
        $content = $_POST["content"];
        $immediate = $_POST["immediate"];
        $this->classroomModel->insertApplication($roomName, $userID, $date, $start, $end, $content, $immediate);
        $this->sendOutput("提交成功");
        unset($_SESSION["application"]);
    }
}
$test = new ClassroomController();
$test->handleRequest();