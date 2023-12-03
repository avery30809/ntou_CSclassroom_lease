<?php
    session_start();

    if($_SERVER["REQUEST_METHOD"] == "POST") {
        require_once("database/connect.php");
        
        $activity = $_POST["activity"];
        $place = $_POST["place"];
        $hour = $_POST["hour"];
        $start = $_POST["start"];
        $end = $_POST["end"];

        // 轉換為 DateTime 物件
        $start_date = new DateTime($start);
        $end_date = new DateTime($end);
        // 包含最後一天
        $end_date->modify('+1 day');

        // 初始化迴圈的 DateInterval
        $interval = new DateInterval('P7D'); // P7D 代表七天

        // 初始化 DatePeriod 用於遍歷日期範圍
        $daterange = new DatePeriod($start_date, $interval, $end_date);

        // 若遇到重複的不會新增 而是跳過
        $stmt = $conn->prepare("INSERT IGNORE INTO roomschedule(RoomName, DateOfDay, HourOfDay, Activity) VALUES (?,?,?,?)");
        // 遍歷每一天
        foreach ($daterange as $date) {
            $stmt->execute([$place, $date->format('Y-m-d'), $hour, $activity]);
        }
    }
?>