<?php
    session_start();
    
    //確保已經登入
    if(isset($_SESSION["userID"])) {
        unset($_SESSION["userID"]);
    }
?>