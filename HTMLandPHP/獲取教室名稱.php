<?php
    session_start();
    if($_SERVER['REQUEST_METHOD'] == "POST") {
        require_once("database/connect.php");
        $result = $conn->query("SELECT RoomName FROM classrooms");
        $classrooms = $result->fetch_all();
        echo json_encode($classrooms);
    }
?>