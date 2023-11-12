<?php
    session_start();

    require_once("database/connect.php");
    $result = $conn->query("SELECT RoomName FROM classrooms");
    $classrooms = $result->fetch_all();
    echo json_encode($classrooms);
?>