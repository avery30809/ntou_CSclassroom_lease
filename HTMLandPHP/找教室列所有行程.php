<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once("database/connect.php");

    $room = $_POST["room"];

    // 查詢該教室的所有預定活動日期
    $stmt = $conn->prepare("SELECT DISTINCT DateOfDay FROM roomschedule WHERE RoomName = ?");
    $stmt->execute([$room]);
    $result = $stmt->get_result()->fetch_all();

    // 檢查是否有預定活動
    if (sizeof($result) > 0) {
        echo "<h3>Schedule for Room: $room</h3>";
        echo "<ul>";

        // 顯示每個日期的預定活動
        foreach($result as $data) {
            $date = $data[0];
            echo "<li>Date: $date</li>";

            // 查詢該日期的預定活動
            $activities_stmt = $conn->prepare("SELECT HourOfDay, Activity FROM roomschedule WHERE RoomName = ? AND DateOfDay = ?");
            $activities_stmt->execute([$room, $date]);

            // 顯示預定活動
            echo "<ul>";
            $activities_res = $activities_stmt->get_result()->fetch_all();
            foreach($activities_res as $res) {
                $hour = $res[0];
                $activity = $res[1];
                echo "<li>$hour: $activity</li>";
            }
            echo "</ul>";
        }
        echo "</ul>";
    } else {
        echo "No schedule found for the specified room.";
    }
}
?>