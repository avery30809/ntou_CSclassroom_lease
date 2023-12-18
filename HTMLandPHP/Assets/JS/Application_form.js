document.addEventListener("DOMContentLoaded", ()=>{
    // 用按鈕選擇條件清單
    let immediatelyButton = document.querySelector(".immediately");
    let reserveButton = document.querySelector(".reserve");

    // 定義在全局範圍的變數
    let selectedDate;
    let today;
    let isToday;

    let timeSlot = ["08:20~"];

    getForm();

    getSearchDate();
    function getSearchDate() {
        // 獲取查詢的日期值
        let testForm = new FormData();
        testForm.append("action", "searchDate")
        fetch("../../Controller/Api/UserController.php", {
            method: 'POST',
            body: testForm
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("selectedDatePlaceholder").textContent = data.date;
            // 將日期轉換為 JavaScript Date 物件
            selectedDate = new Date(data.date);

            // 取得今天的日期
            today = new Date();
            today.setHours(0, 0, 0, 0); // 將日期後設為 0，以進行日期比較
            selectedDate.setHours(0, 0, 0, 0); // 將時間日期後設為 0，以進行日期比較

            isToday = selectedDate.getTime() === today.getTime();
            // 比較選擇的日期和今天的日期
            if (isToday) {
                // 如果是今天，禁用預約借用按鈕
                immediatelyButton.classList.add("show");

            } else {
                // 如果不是今天，禁用立即借用按鈕
                reserveButton.classList.add("show");
            }
        });
    }
    function getForm() {
        fetch("../../Controller/Api/ClassroomController.php?action=getApplicationForm")
        .then(response => response.json())
        .then(data => {
            if(data["error"] === undefined) {
                console.log(data);
            }
            else {
                window.alert("尚未提交需要借用的時段");
                window.location.href ="index.html";
            }
        });
    }
    
    document.getElementById("form-title").innerHTML = `XXX教室<sub class="date" id="selectedDatePlaceholder"></sub>`;
    //////////////////////////////////////////////////////////////////////////////////////////
    //待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成
    function SendOut() {
        //如果是今天，傳送到管理員的立即借用
        if (isToday);

        //如果不是今天，傳送到管理員的預約借用
        else;

    }


    document.getElementById("cancel").addEventListener("click", Cancel, false);
    function Cancel() {
        const testForm = new FormData();
        testForm.append("action", "cancelForm")
        fetch("../../Controller/Api/ClassroomController.php", {
            method: 'POST',
            body: testForm
        });
        window.location.href = "index.html";
    }
}, false)