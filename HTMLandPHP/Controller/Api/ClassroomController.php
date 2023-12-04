<?php
require_once __DIR__ . "/../../inc/bootstrap.php";
class ClassroomController extends BaseController{
    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $action = isset($_POST["action"]) ? $_POST["action"] : null;

            switch ($action) {
                case 'getAllClassroomName':
                    $this->getAllClassroomName();
                    break;
                default:
                    break;
            }
        }
    }
    private function getAllClassroomName() {
        $classroomModel = new ClassroomModel();
        $classroomsName = $classroomModel->getAllClassroomName();

        $this->sendOutput(json_encode($classroomsName));
    }
}
$test = new ClassroomController();
$test->handleRequest();