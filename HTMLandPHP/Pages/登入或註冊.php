<?php
    session_start();
    //登入過就不會到這個畫面
    if(isset($_SESSION["userID"])) header("Location: Home.html");

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
    <link rel="stylesheet" href="../Assets/CSS/登入或註冊.css">
</head>

<body>
    <div class="container" id="container">

        <!-- 註冊表單 -->
        <div class="form-container sign-up">
            <form id="signup-form" method="POST">
                <h1>註冊帳號</h1>
                <input type="text" id="signup_username" name="username" placeholder="姓名" required>
                <div class="email">
                    <input type="text" id="signup_account" class="email-text" name="account" placeholder="學號">
                    <span style="color: grey; position: relative; top: 27px;font-size: 50%;width: 100px">@mail.ntou.edu.tw</span>
                    <button id="vertify" class="verification-button">驗證</button>
                </div>
                <input type="text" id="signup_verification_code" name="verification_code" placeholder="驗證碼" required>
                <input type="password" id="signup_pwd" name="pwd" placeholder="密碼" required>
                <input type="password" id="signup_confirm_pwd" name="confirm_pwd" placeholder="確認密碼" required>

                <button type="submit" name="sign-up-submit">Sign Up</button>
            </form>
        </div>

        <!-- 登入表單 -->
        <div class="form-container sign-in">
            <form id="login-form" method="POST">
                <h1>登入</h1>
                <h1 id="error-message" style="color: red; font-size: 90%; display: none;">帳號或密碼錯誤</h1>
                <input type="text" id="signin_account" name="account" placeholder="學號">
                <input type="password" id="signin_pwd" name="password" placeholder="密碼">
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
    <script src="../Assets/JS/登入或註冊.js"></script>
</body>

</html>