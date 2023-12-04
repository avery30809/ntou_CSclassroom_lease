document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("user").addEventListener("click", ()=>{SignIn_Out(0)}, false);
    document.getElementById("admin").addEventListener("click", ()=>{SignIn_Out(1)}, false);

    function SignIn_Out(op) {
        window.location.href = `登入或註冊.html?operation=${op}`;
    }
})