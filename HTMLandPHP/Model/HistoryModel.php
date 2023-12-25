<?php
require_once __DIR__ . "/Database.php";
class HistoryModel extends Database
{
    public function getApplyRequest($userID) {
        try {
            $result = $this->query("SELECT * FROM history WHERE userID = ? ORDER BY borrowTime DESC", [$userID]);
            return $result;
        } catch (Exception $e) {
            return false;
        }
    }
    public function getHistoryForm() {
        try {
            $result = $this->query("SELECT * FROM history NATURAL JOIN userdata WHERE allow is NULL ORDER BY borrowTime DESC");
            return $result;
        } catch (Exception $e) {
            return false;
        }
    }
    public function insertApplication($roomName, $userID, $date, $start, $end, $content, $immediate, $borrowTime) {
        $result = $this->query("INSERT IGNORE INTO history(RoomName, userID, date, startTime, endTime, content, immediate, borrowTime)"
                                . " VALUES (?,?,?,?,?,?,?,?)", [$roomName, $userID, $date, $start, $end, $content, $immediate, $borrowTime]);
    }
    public function handleExamineForm($roomName, $userID, $date, $startTime, $allow) {
        $result = $this->query("UPDATE history SET allow = ? WHERE RoomName = ? and userID = ? and date = ? and startTime = ?"
                                , [$allow, $roomName, $userID, $date, $startTime]);
    }
}