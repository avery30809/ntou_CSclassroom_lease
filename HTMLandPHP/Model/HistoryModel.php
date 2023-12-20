<?php
require_once __DIR__ . "/Database.php";
class HistoryModel extends Database
{
    public function getApplyRequest($userID) {
        try {
            $result = $this->query("SELECT * FROM userwantborrow WHERE userID = ? ORDER BY borrowTime DESC", [$userID]);
            return $result;
        } catch (Exception $e) {
            return false;
        }
    }
    public function insertApplication($roomName, $userID, $date, $start, $end, $content, $immediate, $borrowTime) {
        $result = $this->query("INSERT IGNORE INTO userwantborrow(RoomName, userID, date, startTime, endTime, content, immediate, borrowTime)"
                                . " VALUES (?,?,?,?,?,?,?,?)", [$roomName, $userID, $date, $start, $end, $content, $immediate, $borrowTime]);
    }
}