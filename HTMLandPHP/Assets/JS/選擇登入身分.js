document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("user").addEventListener("click", ()=>{SignIn_Out(0)}, false);
    document.getElementById("admin").addEventListener("click", ()=>{SignIn_Out(1)}, false);

    function SignIn_Out(op) {
        var form = document.createElement('form');
        form.method = 'get';
        form.action = '登入或註冊.php';

        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'operation';
        input.value = op;

        form.appendChild(input);

        document.body.appendChild(form);

        form.submit();
    }
})