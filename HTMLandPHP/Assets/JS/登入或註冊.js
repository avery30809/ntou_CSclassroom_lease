document.addEventListener("DOMContentLoaded", ()=>{
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');

    const loginBtn = document.getElementById('login');
    const vertifyBtn = document.getElementById('vertify');

    const signupform = document.getElementById("signup-form");
    const loginform = document.getElementById("login-form");

    const forgetPWD = document.getElementById('forgetPWD');
    const back = document.getElementById('back');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
    //登入
    loginform.addEventListener('submit', (event) => {
        event.preventDefault();

        const account = document.getElementById("signin_account").value;
        const password = document.getElementById("signin_pwd").value;
        const op = new URL(window.location.href).searchParams.get("operation");
        
        const formData = new FormData();
        formData.append("account", account);
        formData.append("password", password);
        formData.append("operation", op);
        formData.append("action", "login");
        fetch("../../Controller/Api/UserController.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            let temp = data.split(' ');
            if (temp[0] === "登入成功！") {
                if(temp[1] == 0) window.location.href = "../../Pages/Home.html";
                else if(temp[1] == 1) window.location.href = "../../Pages/Admin interface.html";
            } else {
                const errorMessage = document.getElementById("error-message");
                errorMessage.innerText = temp[0];
                errorMessage.style.display = "block";
                errorMessage.style.transition = "opacity 4s";
                errorMessage.style.opacity = 1;
                setTimeout(function() {
                    errorMessage.style.opacity = 0;
                }, 10);
                setTimeout(function() {
                    errorMessage.style.display = "none";
                }, 3000);
            }
        })
        .catch(error => {
            console.error("Fetch error", error);
        });
    });
    //註冊
    signupform.addEventListener("submit",(event)=>{
        event.preventDefault();

        const formData = new FormData();
        const username = document.getElementById("signup_username").value;
        const account = document.getElementById("signup_account").value;
        const code = document.getElementById("signup_verification_code").value;
        const pwd = document.getElementById("signup_pwd").value;
        const confirm_pwd = document.getElementById("signup_confirm_pwd").value;

        formData.append("username",username);
        formData.append("account",account);
        formData.append("verification_code",code);
        formData.append("pwd",pwd);
        formData.append("confirm_pwd",confirm_pwd);
        formData.append("action", "register");
        fetch('../../Controller/Api/UserController.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            window.alert(data.replace(" ", "\n"));
            if(data == "註冊成功！") window.location.reload();
        });
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
    //驗證
    vertifyBtn.addEventListener('click', () => {
        const ID = document.getElementById("signup_account").value;
        if(ID !== "") {
            const formData = new FormData();
            const email = ID + "@mail.ntou.edu.tw";
            formData.append("email", email);
            formData.append("action", "verification");

            fetch('../../Controller/Api/VerificationController.php', {
                method: 'POST',
                body: formData
            })
            .then(response=>response.text())
            .then(data=>{
                window.alert(data.replace(" ", "\n"));
            })
        }
        else {
            window.alert("請輸入學號");
        }
    });
    //忘記密碼
    // document.getElementById("forgetPWD").addEventListener("click", ()=>{
    //     container.classList.add("down");
    // }, false);

    forgetPWD.addEventListener('click', () => {
        container.classList.add("down");
    }, false);
    back.addEventListener('click', () => {
        container.classList.remove("down");
    }, false);

})