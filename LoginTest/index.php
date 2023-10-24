<!DOCTYPE html>
<!--
Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
Click nbfs://nbhost/SystemFileSystem/Templates/Project/PHP/PHPProject.php to edit this template
-->
<?php
    function Error(){
        $error = "Invalid username or password"; // Error message for unsuccessful login
        header("Location: test.php?error=" . urlencode($error));
    }
    $account = $_POST["account"];
    $password = $_POST["password"];

    require_once('database/connect.php');
    $result = $conn->query("SELECT useraccount, pwd FROM userdata WHERE isAdmin = TRUE");
    $admin = $result->fetch_assoc();

    if($account == $admin["useraccount"] && $password == $admin["pwd"]) {
        header("Location: welcomeAdmin.php");
        exit();
    } 
    $username = $conn->query("SELECT username FROM userdata WHERE useraccount = '$account' AND pwd = '$password'")->fetch_assoc();
    if (isset($username)) {
        header("Location: welcome.php");
        exit();
    } else {
        Error();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Result</title>
</head>
<body>
    <?php if (isset($error)) {
        echo "<p>$error</p>";
        echo "<a href='test.html'>Back to Login</a>";
    } ?>
</body>
</html>