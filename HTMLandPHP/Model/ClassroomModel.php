<?php
require_once __DIR__ . "/../inc/bootstrap.php";
class ClassroomModel extends Database{
    public function getAllClassroomName() {
        $result = $this->query("SELECT RoomName FROM classrooms");
        return $result;
    }
    // 找某一天的所有教室行程
    public function searchActivities($date) {
        $result = $this->query("SELECT RoomName, HourOfDay, Activity FROM roomschedule WHERE DateOfDay = ?", [$date]);
        return $result;
    }
    public function insertCourse($place, $date, $hour, $activity, $userID) {
        $this->query("INSERT IGNORE INTO roomschedule(RoomName, DateOfDay, HourOfDay, Activity, userID) VALUES (?,?,?,?,?)", [$place, $date, $hour, $activity, $userID]);
    }
    // 找某一天某個教室的行程(包含使用者)
    public function searchSingleRoomActivities($roomName, $date) {
        $result = $this->query("SELECT HourOfDay, Activity, username, email, phone FROM roomschedule NATURAL JOIN userdata WHERE RoomName = ? AND DateOfDay = ?", [$roomName, $date]);
        return $result;
    }
    public function insertApplication($roomName, $userID, $date, $start, $end, $content, $immediate) {
        $result = $this->query("INSERT IGNORE INTO userwantborrow(RoomName, userID, date, startTime, endTime, content, immediate)"
                                . " VALUES (?,?,?,?,?,?,?)", [$roomName, $userID, $date, $start, $end, $content, $immediate]);
    }
}