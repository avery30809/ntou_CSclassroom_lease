document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const message = document.getElementById("message");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // 发送登录请求到PHP后端
        fetch("login.php", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.textContent = "登录成功";
                window.location.href = "manager.html";
            } else {
                message.textContent = "登录失败，请检查用户名和密码";
            }
        })
        .catch(error => console.error("Error: " + error));
    });
});
