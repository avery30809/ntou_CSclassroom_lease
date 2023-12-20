document.addEventListener("DOMContentLoaded", ()=>{
    // 用按鈕選擇條件清單
    let immediatelyButton = document.querySelector(".immediately");
    let reserveButton = document.querySelector(".reserve");
    let formDate;
    // 定義在全局範圍的變數
    let selectedDate;
    let today;
    let isToday;

    getForm();
    getSearchDate();
    function getSearchDate() {
        // 獲取查詢的日期值
        let testForm = new FormData();
        testForm.append("action", "searchDate");
        fetch("../../Controller/Api/UserController.php", {
            method: 'POST',
            body: testForm
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("selectedDatePlaceholder").textContent = data["date"];
            // 將日期轉換為 JavaScript Date 物件
            selectedDate = new Date(data["date"]);
            formDate = data["date"];
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
    
    let startTime, endTime, roomName;
    function getForm() {
        fetch("../../Controller/Api/ClassroomController.php?action=getApplicationForm")
        .then(response => response.json())
        .then(data => {
            if(data["error"] === undefined) {
                let formTitle = document.getElementById('form-title');
                let lineBlockDiv = document.querySelector('.line_block');
                startTime = parseInt(data["time"][0])+1;
                endTime = parseInt(data["time"][data["time"].length - 1])+1;
                roomName = data["room"];
                
                formTitle.innerHTML = `${roomName}<sub class="date" id="selectedDatePlaceholder"></sub>`;
                let newContent = '';
                newContent += `<span>第${startTime}節</span>
                                <img src="../../image/right.png">
                                <span>${endTime === 9 ? "第9節後" : `第${endTime}節`}</span>`;
                lineBlockDiv.insertAdjacentHTML('afterbegin', newContent);
            }
            else {
                window.alert("尚未提交需要借用的時段");
                window.location.href ="index.html";
            }
        });
    }
    
    document.getElementById("form-title").innerHTML = `XXX教室<sub class="date" id="selectedDatePlaceholder"></sub>`;
    //////////////////////////////////////////////////////////////////////////////////////////
    document.getElementById("sendOut").addEventListener("click", SendOut);
    function SendOut() {
        let formContent = document.getElementById("form_content");
        let testForm = new FormData();
        let currentDate = new Date();
        let formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
        const historyForm = {
            "roomName": roomName,
            "date": formDate,
            "startTime": startTime,
            "endTime": endTime,
            "content": formContent.value,
            "immediate": (isToday ? 1 : 0),
            "borrowTime": formattedDate
        };
        for (let key in historyForm) {
            testForm.append(key, historyForm[key]);
        }
        testForm.append("action", "submitForm");
        fetch("../../Controller/Api/HistoryController.php", {
            method: 'POST',
            body: testForm
        })
        .then(response => response.text())
        .then(data => {
            window.alert(data);
            window.location.href = "index.html";
        });
    }
    document.getElementById("cancel").addEventListener("click", Cancel, false);
    function Cancel() {
        const testForm = new FormData();
        testForm.append("action", "cancelForm");
        fetch("../../Controller/Api/ClassroomController.php", {
            method: 'POST',
            body: testForm
        });
        window.location.href = "index.html";
    }
}, false);