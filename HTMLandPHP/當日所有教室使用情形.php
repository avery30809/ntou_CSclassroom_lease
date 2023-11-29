<?php
    session_start();
    if($_SERVER['REQUEST_METHOD'] == "POST") {
        require_once("database/connect.php");
        
        $date = $_SESSION['date'];

        // 獲取所有教室
        $getRooms = $conn->query("SELECT RoomName FROM classrooms")->fetch_all();
        $activities = [];
        foreach($getRooms as $room) {
            // 每個教室有11個時間段 紀錄該時間段的活動名稱
            $activities["$room[0]"] = ["","","","","","","","","","",""];
        }

        // 查詢指定日期的所有預定活動
        $stmt = $conn->prepare("SELECT RoomName, HourOfDay, Activity FROM roomschedule WHERE DateOfDay = ?");
        $stmt->execute([$date]);
        $result = $stmt->get_result()->fetch_all();

        // 檢查是否有預定活動
        if (sizeof($result) > 0) {
            // 每個教室的預定活動
            foreach($result as $res) {
                $room = $res[0];
                $hour = $res[1];
                $activity = $res[2];
                $activities["$room"][$hour-9] = $activity;
            }
        }
        echo json_encode($activities);
    }
?>