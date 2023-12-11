<?php
require_once __DIR__ . "/../inc/bootstrap.php";
class ClassroomModel extends Database{
    public function getAllClassroomName() {
        $result = $this->query("SELECT RoomName FROM classrooms");
        return $result;
    }
    public function searchActivities($date) {
        $result = $this->query("SELECT RoomName, HourOfDay, Activity FROM roomschedule WHERE DateOfDay = ?", [$date]);
        return $result;
    }
    public function insertCourse() {
        
    }
    public function searchSingleRoomActivities($roomName, $date) {
        $result = $this->query("SELECT HourOfDay, Activity FROM roomschedule WHERE RoomName = ? AND DateOfDay = ?", [$roomName, $date]);
        return $result;
    }
}