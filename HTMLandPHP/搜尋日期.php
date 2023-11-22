<?php
    session_start();
    if($_SERVER['REQUEST_METHOD'] == "POST") {
        if(isset($_POST["date"])) {
            $_SESSION["date"] = $_POST["date"];

        }
        else if(isset($_SESSION["date"])){
            $obj = [
                "date" => $_SESSION["date"]
            ];
            echo json_encode($obj);
        }
    }
?>