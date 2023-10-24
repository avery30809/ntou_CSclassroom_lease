<!DOCTYPE html>
<!--
Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
Click nbfs://nbhost/SystemFileSystem/Templates/Other/html.html to edit this template
-->

<!DOCTYPE html>
<html>
    <head>
        <meta charset = "utf-8">
        <title>海大教室借用系統</title>
        <style>
            @import url(https://fonts.googleapis.com/earlyaccess/cwtexfangsong.css);

            *
            {
                padding: 0px;
                margin: 0px;
                font-family: "cwTeXFangSong";
            }

            .loginAndRegistrationTitle
            {
                font-size: 100px;
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .account
            {
                font-size: 30px;
                position: absolute;
                top: 40%;
                left: 33%;
            }

            .password
            {
                font-size: 30px;
                position: absolute;
                top: 50%;
                left: 33%;
            }

            .accountInput
            {
                font-size: 30px;
                position: absolute;
                top: 40%;
                left: 40%;
                width: 300px;
            }

            .passwordInput
            {
                font-size: 30px;
                position: absolute;
                top: 50%;
                left: 40%;
                width: 300px;
            }

            .loginButton
            {
                font-size: 30px;
                position: absolute;
                top: 70%;
                left: 35%;
                width: 150px;
            }

            .registrationButton
            {
                font-size: 30px;
                position: absolute;
                top: 70%;
                left: 50%;
                width: 150px;
            }

            .registrationConfirmPassword
            {
                font-size: 30px;
                position: absolute;
                top: 60%;
                left: 30%;
            }

            .registrationConfirmPasswordInput
            {
                font-size: 30px;
                position: absolute;
                top: 60%;
                left: 40%;
                width: 300px;
            }

            .registrationConfirmButton
            {
                font-size: 30px;
                position: absolute;
                top: 80%;
                left: 50%;
                width: 150px;
                transform: translate(-50%, -50%);
            }

        </style>
        <script>
            function login()
            {
                document.getElementById("display").innerHTML = "\
                <form action = 'index.php' method = 'POST'>\n\
                    <span class = 'loginAndRegistrationTitle'>海大教室借用系統</span>\n\
                    <label class = 'account'>帳號：</label>\n\
                    <input type = 'text' id = 'loginAccount' class = 'accountInput' name = 'account'>\n\
                    <label class = 'password'>密碼：</label>\n\
                    <input type = 'password' id = 'loginPassword' class = 'passwordInput' name = 'password'>\n\
                    <input type = 'submit' id = 'loginButton' value = '登入' class = 'loginButton'>\n\
                    <input type = 'button' id = 'registrationButton' value = '註冊' class = 'registrationButton'>\n\
                </form>";
                document.getElementById("registrationButton").addEventListener("click", registration, false);
            }

            function registration()
            {   
                document.getElementById("display").innerHTML = "\
                <form action = '###.php' method = 'POST'>\n\
                    <span class = 'loginAndRegistrationTitle'>註冊帳號</span>\n\
                    <label class = 'account'>帳號：</label>\n\
                    <input type = 'text' id = 'registrationAccount' class = 'accountInput'>\n\
                    <label class = 'password'>密碼：</label>\n\
                    <input type = 'password' id = 'registrationPassword' class = 'passwordInput'>\n\
                    <label class = 'registrationConfirmPassword'>確認密碼：</label>\n\
                    <input type = 'password' id = 'registrationConfirmPassword' class = 'registrationConfirmPasswordInput'>\n\
                    <input type = 'button' id = 'registrationConfirmButton' value = '確認' class='registrationConfirmButton'>\n\
                </form>";

                document.getElementById("registrationConfirmButton").addEventListener("click", checkPassword, false);
            }

            function checkPassword()
            {
                if(registrationPassword.value != registrationConfirmPassword.value)
                {
                    alert("第二次密碼與第一次密碼不相符，請重新輸入");
                }
                else
                {
                    alert("註冊成功！");
                    login();
                }
            }

            if(window.name = "")
            {
                window.name = "login";
                window.addEventListener("load", login, false);
            }
            else if(window.name = "login")
            {
                window.name = "login";
                window.addEventListener("load", login, false);
            }
            else if(window.name = "registration")
            {
                window.name = "registration";
                window.addEventListener("load", registration, false);
            }

        </script>
    </head>
    <body id = "body">
        <!--輸入錯誤的話就alert有錯誤並重新刷新頁面-->
        <?php if(isset($_GET['error'])){$error = urldecode($_GET['error']);echo '<script>alert("帳號或密碼錯誤");window.location.replace("test.php");</script>';}?>
        <div id = "display"></div>
    </body>
</html>