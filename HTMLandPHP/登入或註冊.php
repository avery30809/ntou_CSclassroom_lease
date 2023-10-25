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
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登入測試</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            /*讓內距不影響box長跟寬*/
            font-family: 'Montserrat', sans-serif;
        }
        /* 主頁面樣式 */
        body {
            /* background-color: #c9d6ff;
            background: linear-gradient(to right, #e2e2e2, #c9d6ff); 由左到右的漸變色 */
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 100vh;
        }
        /* 主容器樣式 */
        .container {
            background-color: #fff;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
            position: relative;
            overflow: hidden;
            width: 768px;
            max-width: 100%;
            min-height: 480px;
        }
        /* 簡單敘述的排版 */
        .container p {
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0.3px;
            margin: 20px 0;
        }
        .container a {
            color: #333;
            font-size: 13px;
            margin: 15px 0 10px;
        }
        /* 按鈕樣式 */
        .container button {
            /* background-color: #512da8;
            color: #fff; */
            font-size: 12px;
            padding: 10px 45px;
            border: 1px solid transparent;
            border-radius: 8px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 10px;
            cursor: pointer;
        }

        /* 表單樣式 */
        .container form {
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 0 40px;
            height: 100%;
        }
        /* 輸入框樣式 */
        .container input {
            background-color: #eee;
            border: none;
            margin: 8px 0;
            padding: 10px 15px;
            font-size: 13px;
            border-radius: 8px;
            width: 100%;
            outline: none;
        }
        /* 表單容器樣式 */
        .form-container {
            position: absolute;
            top: 0;
            height: 100%;
            transition: all 0.6s ease-in-out;
        }
        .sign-in {
            left: 0;
            width: 50%;
            z-index: 2;
        }
        .container.active .sign-in {
            transform: translateX(100%);
        }
        /* 註冊表單樣式 */
        .sign-up {
            left: 0;
            width: 50%;
            z-index: 1;
            /*分層，放在登入畫面後*/
        }
        /* 啟用註冊表單的樣式 */
        .container.active .sign-up {
            transform: translateX(100%);
            z-index: 5;
        }
        /* 切換介面前容器樣式 */
        .toggle-container {
            position: absolute;
            top: 0;
            left: 50%;
            width: 50%;
            height: 100%;
            overflow: hidden;
            transition: all 0.6s ease-in-out;
            border-radius: 150px 0 0 100px;
            z-index: 1000;
        }
        /* 啟用切換容器的樣式 */
        .container.active .toggle-container {
            transform: translateX(-100%);
            border-radius: 0 150px 100px 0;
        }
        /* 切換容器樣式 */
        .toggle {
            background-color: #5489d9;
            /* background: linear-gradient(to right, #5c6bc0, #512da8); */
            height: 100%;
            color: #fff;
            position: relative;
            left: -100%;
            height: 100%;
            width: 200%;
            transform: translateX(0);
            transition: all 0.6s ease-in-out;
        }
        /* 啟用切換容器的樣式 */
        .container.active .toggle {
            transform: translateX(50%);
            /*左右對稱，各占50%*/
        }
        /* 切換面板樣式 */
        .toggle-panel {
            position: absolute;
            width: 50%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 0 30px;
            text-align: center;
            top: 0;
            transform: translateX(0);
            transition: all 0.6s ease-in-out;
        }
        /* 往左側切換面板樣式 */
        .toggle-left {
            transform: translateX(-200%);
        }
        /* 啟用左側切換面板的樣式 */
        .container.active .toggle-left {
            transform: translateX(0);
        }
        /* 右側切換面板樣式 */
        .toggle-right {
            right: 0;
            transform: translateX(0);
        }
        /* 啟用右側切換面板的樣式 */
        .container.active .toggle-right {
            transform: translateX(200%);
        }

        .email {
            display: flex;
            flex-direction: row;
            height: 50px;
        }

        .email-text {
            width: 146px !important;
        }

        .verification-button {
            width: 50px;
            border-radius: 10px;
            font-weight: 600;
            color: white !important;
            text-decoration: none;
            font-size: 15px !important;
            padding-top: 2px !important;
            /* padding-bottom: 10px !important; */
            padding-left: 11px;
            padding-right: 1px;
            margin-left: 8px !important;
            background-color: rgba(220, 84, 84, 0.607);
            color: white;
        }
    </style>
</head>

<body>
    <div class="container" id="container">

        <!-- 註冊表單 -->
        <div class="form-container sign-up">
            <form method="POST">
                <h1>註冊帳號</h1>
                <input type="text" placeholder="姓名">
                <div class="email">
                    <input type="text" class="email-text" placeholder="學號">
                    <span style="color: grey; position: relative; top: 27px;font-size: 50%;width: 100px">@mail.ntou.edu.tw</span>
                    <a href="AllClassRoom.html" target="_blank" class="verification-button">驗證</a>
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
                    <p>填寫詳細資料已註冊帳號</p>
                    <button class="hidden" id="login">登入</button>
                </div>

                <!-- 右側切換面板 - 註冊 -->
                <div class="toggle-panel toggle-right">
                    <h1>你好，使用者!</h1>
                    <p>輸入你的個人信息已登入系統</p>
                    <button class="hidden" id="register">註冊</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        const container = document.getElementById('container');
        const registerBtn = document.getElementById('register');

        const loginBtn = document.getElementById('login');

        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });


        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    </script>
</body>

</html>