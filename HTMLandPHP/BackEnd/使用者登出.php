<?php
    session_start();
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        //確保已經登入
        if(isset($_SESSION["userID"])) {
            unset($_SESSION["userID"]);
        }
    }
?>