<?php

    require_once("connect.php");

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        // 獲取前端提交的教室名稱
        $selectedClassroom = $_POST['roomname'];
    
         // 使用預處理語句以防止 SQL 注入攻擊
        $stmt = $conn->prepare("SELECT Week, one,two,three,four,five,six,seven FROM course WHERE RoomName = ?");
        $stmt->bind_param("s", $selectedClassroom);
        $stmt->execute();

        $result = $stmt->get_result();
        $classrooms = $result->fetch_all();
        echo json_encode($classrooms);
    }
    
?>