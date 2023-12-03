<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once("database/connect.php");

    $date = $_POST["date"];

    // 查詢指定日期的所有預定活動
    $stmt = $conn->prepare("SELECT RoomName, HourOfDay, Activity FROM roomschedule WHERE DateOfDay = ?");
    $stmt->execute([$date]);
    $result = $stmt->get_result()->fetch_all();

    // 檢查是否有預定活動
    if (sizeof($result) > 0) {
        echo "<h3>Daily Schedule for $date</h3>";
        echo "<ul>";

        // 顯示每個教室的預定活動
        foreach($result as $res) {
            $room = $res[0];
            $hour = $res[1];
            $activity = $res[2];
            echo "<li>$room - $hour: $activity</li>";
        }

        echo "</ul>";
    } else {
        echo "No schedule found for the specified date.";
    }
}
?>