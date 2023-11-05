<?php
    session_start();
    //註冊後端
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        //確認是否驗證過email
        if(isset($_SESSION['verification_code'])) {
            $username = $_POST["username"];
            $account = $_POST["account"];
            $verification_code = $_POST["verification_code"];
            $password = $_POST["pwd"];
            $confirm_pwd = $_POST["confirm_pwd"];
            $email = "$account@mail.ntou.edu.tw";
            if($verification_code != $_SESSION['verification_code']){
                echo '驗證碼錯誤';
            }
            else if($password !== $confirm_pwd) {
                echo '密碼不匹配\n請確認密碼';
            }
            else {
                require_once("database/connect.php");
                $result = $conn->query("SELECT useraccount FROM userdata WHERE useraccount = '$account'")->fetch_assoc();
                //確認帳號是第一次註冊
                if(!empty($result)) {
                    echo '帳號已存在';
                }
                else {
                    $conn->query("INSERT INTO userdata VALUES ('$username','$account','$password','$email')");
                    echo '註冊成功！';
                }
            }
        }
        else {
            echo '請先進行認證';
        }
    }
?>