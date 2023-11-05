<?php
    //登入後端
    session_start();

    if(isset($_POST['sign-in-submit'])){

        $account = $_POST["account"];
        $password = $_POST["password"];

        require_once('database/connect.php');
        $result = $conn->query("SELECT useraccount, pwd FROM userdata WHERE isAdmin = TRUE");
        $admin = $result->fetch_assoc();

        if($account == $admin["useraccount"] && $password == $admin["pwd"]) {
            header("Location: AllClassRoom.html");
            exit();
        } 
        $username = $conn->query("SELECT username FROM userdata WHERE useraccount = '$account' AND pwd = '$password'")->fetch_assoc();
        if (!empty($username)) {
            header("Location: AllClassRoom.html");
            exit();
        } else {
            $_SESSION['Error']='Invalid account or password';
        }
    }
    if (isset($_SESSION['verification_code']) && isset($_SESSION['verification_code_expiration'])) {
        // 檢查是否過期
        if (time() > $_SESSION['verification_code_expiration']) {
            unset($_SESSION['verification_code']);
            unset($_SESSION['verification_code_expiration']);
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登入測試</title>
    <link rel="stylesheet" href="CSS/登入或註冊.css">
</head>

<body>
    <div class="container" id="container">

        <!-- 註冊表單 -->
        <div class="form-container sign-up">
            <form method="POST">
                <h1>註冊帳號</h1>
                <input type="text" placeholder="姓名">
                <div class="email">
                    <input type="text" class="email-text" placeholder="學號" id="studentID">
                    <span style="color: grey; position: relative; top: 27px;font-size: 50%;width: 100px">@mail.ntou.edu.tw</span>
                    <button id="vertify" class="verification-button">驗證</button>
                </div>
                <input type="text" placeholder="驗證碼">
                <input type="password" placeholder="密碼">
                <input type="password" placeholder="確認密碼">

                <button>Sign Up</button>
            </form>
        </div>

        <!-- 登入表單 -->
        <div class="form-container sign-in">
            <form method="POST">
                <h1>登入</h1>
                <?php
                    if(isset($_SESSION["Error"])){
                        echo '<h1 id="error-message" style="color: red; font-size: 90%">帳號或密碼錯誤</h1>';
                        echo '<script>
                            let element = document.getElementById("error-message");
                            if(element) {
                                element.style.display = "block";
                                element.style.transition = "opacity 4s";
                                element.style.opacity = 1;
                                setTimeout(function() {
                                    element.style.opacity = 0;
                                }, 10);
                                setTimeout(function() {
                                    element.style.display = "none";
                                }, 3000);
                            }
                        </script>';
                        unset($_SESSION['Error']);
                    }
                ?>
                <input type="text" name="account" placeholder="學號">
                <input type="password" name="password" placeholder="密碼">
                <a href="#">忘記密碼了嗎 ?</a>
                <button type="submit" name="sign-in-submit">Sign In</button>
            </form>
        </div>

        <!-- 切換容器 -->
        <div class="toggle-container">
            <div class="toggle">
                <!-- 切換容器中包含的兩個切換面板 -->

                <!-- 左側切換面板 - 登入 -->
                <div class="toggle-panel toggle-left">
                    <h1>歡迎回來!</h1>
                    <p>填寫詳細資料以註冊帳號</p>
                    <button class="hidden" id="login">登入</button>
                </div>

                <!-- 右側切換面板 - 註冊 -->
                <div class="toggle-panel toggle-right">
                    <h1>你好，使用者!</h1>
                    <p>輸入你的個人信息以登入系統</p>
                    <button class="hidden" id="register">註冊</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        const container = document.getElementById('container');
        const registerBtn = document.getElementById('register');

        const loginBtn = document.getElementById('login');
        const vertifyBtn = document.getElementById('vertify');
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });


        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
        vertifyBtn.addEventListener('click', () => {
            event.preventDefault(); // 阻止表單預設的提交行為
            const formData = new FormData();
            const email = document.getElementById("studentID").value + "@mail.ntou.edu.tw";
            formData.append("email", email);

            fetch('sendemail/sender.php', {
                method: 'POST',
                body: formData
            });
            vertifyBtn.disabled = true;
            setTimeout(()=>{
                vertifyBtn.disabled = false; 
            },5*60*1000);
        });
    </script>
</body>

</html>