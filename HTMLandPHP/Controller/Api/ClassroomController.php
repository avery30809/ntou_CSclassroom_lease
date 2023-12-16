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
                case 'getAllClassroomName':
                    $this->getAllClassroomName();
                    break;
                case 'getCondition':
                    $this->getDateClassCondition();
                    break;
                case 'submitSelectedSlot':
                    $this->handleSubmitSelectedSlot();
                    break;
                case 'getWeeklySchedule':
                    $this->getWeeklySchedule();
                case 'fastInsert':
                    $this->handleFastInsert();
                default:
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
        $roomName = $_POST['roomName'];
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
    private function handleSubmitSelectedSlot() {
        if(isset($_POST['state']))
            $this->sendOutput(json_encode($_POST['state']));
        else {
            $obj = [
                'error' => 'empty select'
            ];
            $this->sendOutput(json_encode($obj));
        }
    }
    private function handleFastInsert() {
        $activity = $_POST['activity'];
        $room = $_POST['room'];
        $start = $_POST['start']+8;
        $end = $_POST['end']+8;
        $date = $_POST['date'];
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
                $this->classroomModel->insertCourse($room, $date, $i, $activity);
            }
            $this->sendOutput("新增成功！");
        }
        else {
            $this->sendOutput("有衝堂 請調整時間");
        }
    }
}
$test = new ClassroomController();
$test->handleRequest();