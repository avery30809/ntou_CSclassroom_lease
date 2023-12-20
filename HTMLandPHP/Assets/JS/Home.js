document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("datePicker").addEventListener("change", updateLabel, false);
    document.getElementById("chooseBtn").addEventListener("click", showDateform, false);

    const now = new Date();

    const datePicker = document.getElementById("datePicker");
    const queryButton = document.querySelector(".verification-button");
    queryButton.addEventListener("click", searchDate, false);

    let chooseText = document.getElementById("chooseText");
    let choosedate = document.getElementById("choosedate");

    datePicker.value = dateToString(now);
    datePicker.min = dateToString(now);
    datePicker.max = add30(now);

    let selectedDate = datePicker.value;

    function dateToString(date) {
        let temp = new Date(date);
        //格式化日，如果小於9，前面補0
        let day = ("0" + temp.getDate()).slice(-2);
        //格式化月，如果小於9，前面補0
        let month = ("0" + (temp.getMonth() + 1)).slice(-2);
        //拼裝完整日期格式
        let result = temp.getFullYear() + "-" + (month) + "-" + (day);
        return result;
    }

    function add30(date) {
        let resultDate = new Date(date);
        resultDate.setDate(resultDate.getDate() + 30);
        return dateToString(resultDate);
    }

    //獲取使用者身分
    let user = {
        username: "",
        useraccount: "",
        email: "",
        phone: null
    };
    fetch("../Controller/Api/UserController.php?action=getUserProfile")
    .then(response => response.json())
    .then(data => {
        //已登入
        if(data.error === undefined) {
            user = data;
            document.getElementById("login-signup").innerHTML = "<img src='../image/usericon.png' class='usericon'>" + user.username;
            document.getElementById("login-signup").addEventListener("click", function (event) {
                window.location.href = "../Pages/使用者介面.html";
            }, false);
        }
        //未登入
        else {
            document.getElementById("login-signup").addEventListener("click", function (event) {
                window.location.href = "../Pages/選擇登入身分.html";
            }, false);
        }
    });

    function updateLabel() {
        //if(dateToString(now) > datePicker.value || add30(now) < datePicker.value )
            //window.location.href = "https://www.youtube.com/watch?v=zL19uMsnpSU";
        //else 
            selectedDate = datePicker.value;
    }

    function searchDate() {
        const formdata = new FormData();
        formdata.append("date", selectedDate);
        formdata.append("action", "searchDate");

        fetch("../Controller/Api/UserController.php", {
            method: 'POST',
            body: formdata
        });
        window.location.href = "../Pages/index.html";
    }

    function showDateform() {
        chooseText.classList.add("delete");
        choosedate.classList.add("show");
        
    }
});