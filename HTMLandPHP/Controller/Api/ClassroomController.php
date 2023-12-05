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
            // 每個教室有12個時間段 紀錄該時間段的活動名稱
            $activities["$room[0]"] = ["","","","","","","","","","","",""];
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
}
$test = new ClassroomController();
$test->handleRequest();