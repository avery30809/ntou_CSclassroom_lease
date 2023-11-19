<?php
    session_start();
    require_once("database/connect.php");
    
    //確保已經登入
    if(isset($_SESSION["userID"])) {
        $userID = $_SESSION["userID"];
        $result = $conn->query("SELECT username, useraccount, email, phone FROM userdata WHERE userID = $userID")->fetch_assoc();
        echo json_encode($result);
    }
    else {
        $obj = [
            'error' => 'not login'
        ];
        echo json_encode($obj);
    }
?>