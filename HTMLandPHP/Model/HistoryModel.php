<?php
require_once __DIR__ . "/Database.php";
class HistoryModel extends Database
{
    public function getApplyRequest($userID) {
        try {
            $result = $this->query("SELECT * FROM history WHERE userID = ? ORDER BY borrowTime DESC, startTime ASC", [$userID]);
            return $result;
        } catch (Exception $e) {
            return false;
        }
    }
    public function getHistoryForm() {
        try {
            $result = $this->query("SELECT userID, RoomName, date, startTime, endTime, content, immediate, allow, borrowTime, borrowed, returnTime, username, email, phone FROM history NATURAL JOIN userdata WHERE allow is NULL ORDER BY borrowTime DESC, startTime ASC");
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
    public function getKeyRecord($date) {
        $result = $this->query("SELECT RoomName, username, content, date, startTime, endTime, returnTime, userID, borrowed, email, phone FROM history NATURAL JOIN userdata WHERE allow=1 AND date <= '$date' ORDER BY borrowed, ISNULL(returnTime) DESC, date DESC, startTime ASC, returnTime ASC");
        return $result;
    }
    public function setKeyRecord($roomName, $userID, $date, $startTime, $returnTime) {
        $this->query("UPDATE history SET returnTime = ? WHERE RoomName = ? and userID = ? and date = ? and startTime = ?"
                    , [$returnTime, $roomName, $userID, $date, $startTime]);
    }
    public function setBorrowedKeyRecord($roomName, $userID, $date, $startTime) {
        $this->query("UPDATE history SET borrowed = '1' WHERE RoomName = ? and userID = ? and date = ? and startTime = ?"
                    , [$roomName, $userID, $date, $startTime]);
    }
    public function getAllowedHistory() {
        $result = $this->query("SELECT userID, RoomName, date, startTime, endTime, content, immediate, allow, borrowTime, borrowed, returnTime, username, email, phone FROM history NATURAL JOIN userdata WHERE allow = 1 and borrowed = 0 ORDER BY date DESC, startTime ASC");
        return $result;
    }
    public function cancelHistory($roomName, $userID, $date, $startTime) {
        $this->query("DELETE FROM history WHERE RoomName = ? and userID = ? and date = ? and startTime = ?"
        , [$roomName, $userID, $date, $startTime]);
    }
    public function fastInsert($room, $userID, $date, $startTime, $endTime, $content, $immediate, $allow, $borrowTime) {
        $this->query("INSERT IGNORE INTO history(RoomName, userID, date, startTime, endTime, content, immediate, allow, borrowTime)"
                                . " VALUES (?,?,?,?,?,?,?,?,?)", [$room, $userID, $date, $startTime, $endTime, $content, $immediate, $allow, $borrowTime]);
    }
}