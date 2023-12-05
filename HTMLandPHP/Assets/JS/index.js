document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("popupCloseBtn").addEventListener("click", closePopupClassroom, false);
    //preload image
    let image = {
        home: new Image(),
        dropdownIcon: new Image(),
        right: new Image(),
        queryIcon: new Image(),
        close: new Image(),
        usericon: new Image()
    }
    for(const [key, value] of Object.entries(image)) {
        value.src = `../../image/${key}.png`;
    }
    document.getElementById("homeIcon").src = image.home.src;
    document.getElementById("dropdownIcon").src = image.dropdownIcon.src;
    document.getElementById("rightIcon").src = image.right.src;
    document.getElementById("queryIcon").src = image.queryIcon.src;
    document.getElementById("closeIcon").src = image.close.src;


    //獲取使用者身分
    let user = {
        username: "",
        useraccount: "",
        email: "",
        phone: null
    };
    getUserProfile();
    function getUserProfile() {
        //獲取使用者身分
        let testForm = new FormData();
        testForm.append("action", "getUserProfile");
        fetch("../../Controller/APi/UserController.php", {
            method: 'POST',
            body: testForm
        })
        .then(response => response.json())
        .then(data => {
            if(data.error === undefined) {
                user = data;
                document.getElementById("login-signup").innerHTML = "<img id='usericon'>" + user.username;
                document.getElementById("usericon").src = image.usericon.src;
                document.getElementById("login-signup").addEventListener("click", function (event) {
                    window.location.href = "../../Pages/使用者介面.html";
                }, false);
            }
            else {
                //沒有登入就回首頁
                window.alert("請先登入！");
                window.location.href = "../../Pages/Home.html";
            }
        });
    }

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
            document.getElementById("selectedDatePlaceholder").textContent = data.date + " 教室狀態查詢結果";
        });
    }
    // 大部分功能
    const optionMenu = document.querySelector(".select-menu"),
        selectBtn = optionMenu.querySelector(".select-btn"),
        options = optionMenu.querySelectorAll(".option"),
        sBtn_text = optionMenu.querySelector(".sBtn-text"),
        queryBlank = document.querySelector(".blank"),
        queryClassRoom = document.querySelector(".inputClassRoomName"),
        queryTimeInterval = document.querySelector(".inputTimeInterval");

    //以後會被資料庫所取代
    let allClassroomName = [];
    let activities = {};
    const startTime = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
        endTime = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

    getAllClassroomName();
    function getAllClassroomName() {
        let testForm = new FormData();
        testForm.append("action", "getAllClassroomName")
        fetch("../../Controller/Api/ClassroomController.php", {
            method: 'POST',
            body: testForm
        })
        .then(response => response.json())
        .then(datas => {
            datas.forEach((data) => {
                allClassroomName.push(data[0]);
                let room = document.createElement("option")
                room.innerHTML = data[0];
                document.getElementById("classroomNameList").appendChild(room);
            });
        });
    }
    getDateClassCondition();
    function getDateClassCondition() {
        let testForm = new FormData();
        testForm.append("action", "getCondition");
        fetch("../../Controller/Api/ClassroomController.php", {
            method: 'POST',
            body: testForm
        })
        .then(response => response.json())
        .then(datas => {
            allClassroomName.forEach((room) => {
                activities[room] = datas[room];
            });
            showDefault();
        });
    }

    //計算借用情況
    function roomCondition(room) {
        let count = 0;
        activities[room].forEach((activity)=>{
            if(activity == "") count++;
        });
        return `${(100-(count*100/startTime.length)).toFixed(2)}%`;
    }

    //查詢結果格式
    function showResult(room) {
        return `<span onclick="showPopupClassroom(event)" class="classroomName">${room}</span><span class="gap">${room.slice(0, 3) == "INS" ? "電資大樓" : "電綜大樓"}</span><div class="totalBar"><div class="nowState-bar">${roomCondition(room)}</div></div><div class="wrap"></div>`
    }

    //列出所有教室狀態
    function showDefault() {
        let content = "";
        content += '<span style="width: 70px;">教室名稱</span><span class="gap">教室位置</span><span>借用情況</span><div class="wrap"></div>';

        allClassroomName.forEach((classroom) => {
            content += showResult(classroom);
        });
        document.getElementById("showClassroom").innerHTML = content;
    }

    //下拉式選單
    //選完開始才可以選結束時間
    document.querySelectorAll(".startList li").forEach((item) => {
        item.addEventListener("click", () => {
            document.getElementById("time1").value = item.textContent;
            document.getElementById("time2").removeAttribute("disabled");
            document.getElementById("time2").value = "";
            //讓結束時間可以保持必定比開始時間大
            let i = startTime.indexOf(document.getElementById("time1").value);
            let myList = document.querySelector(".endList");
            myList.innerHTML = "";
            endTime.slice(i).forEach((time) => {
                let newItem = document.createElement("li");
                newItem.textContent = time;
                //更新endList的eventlistener
                newItem.addEventListener("click", () => {
                    document.getElementById("time2").value = newItem.textContent;
                })
                myList.appendChild(newItem);
            })
        })
    })
    document.getElementById("time1").addEventListener("click", () => {
        event.stopPropagation();
        let temp = document.querySelector(".dropdownStart");
        temp.style.display = temp.style.display === "block" ? "none" : "block";
        document.querySelector(".dropdownEnd").style.display = "none";
        optionMenu.classList.remove("active");
    })
    document.getElementById("time2").addEventListener("click", () => {
        event.stopPropagation();
        let temp = document.querySelector(".dropdownEnd");
        temp.style.display = temp.style.display === "block" ? "none" : "block";
        document.querySelector(".dropdownStart").style.display = "none";
        optionMenu.classList.remove("active");
    })
    //監聽所有點擊事件 關閉彈跳視窗與下拉式選單
    document.addEventListener("click", (event) => {
        let a = document.querySelector(".dropdownStart"),
            b = document.querySelector(".dropdownEnd");
        a.style.display = "none";
        b.style.display = "none";
        optionMenu.classList.remove("active");
        popup.classList.remove("open-popup");
    })

    //顯示以教室名稱或特定時段搜尋的結果
    form.addEventListener("submit", () => {
        event.preventDefault();
        let queryStartTime = document.getElementById("time1").value,
            queryEndTime = document.getElementById("time2").value;

        let searchMethod = sBtn_text.innerHTML=="輸入教室名稱"?true:false;//true 找教室名稱 false 找特定時間

        if (searchMethod) {
            let properClassroomName = [];
            for (let i = 0; i < allClassroomName.length; i++) {
                if (allClassroomName[i].startsWith(queryClassRoom.value)) properClassroomName.push(allClassroomName[i]);
            }
            let content = '<span style="width: 70px;">教室名稱</span><span class="gap">教室位置</span><span>借用情況</span><div class="wrap"></div>';
            properClassroomName.forEach((roomName)=>{
                content += showResult(roomName);
            },false);
            queryClassRoom.value = "";
            document.getElementById("showClassroom").innerHTML = content;
        }
        else if (queryStartTime != "" && queryEndTime != "") {
            let content = '<span style="width: 70px;">教室名稱</span><span class="gap">教室位置</span><span>借用情況</span><div class="wrap"></div>';
            const properClassroomName = new Set();
            for(let i=startTime.findIndex((element)=>element == queryStartTime); i<=endTime.findIndex((element)=>element == queryEndTime); i++) {
                allClassroomName.forEach((room)=>{
                    if(activities[room][i] == "")
                        properClassroomName.add(room);
                });
            }
            allClassroomName.forEach((roomName)=>{
                if(properClassroomName.has(roomName))
                    content += showResult(roomName);
            },false);
            document.getElementById("showClassroom").innerHTML = content;
        }
    })

    selectBtn.addEventListener("click", () => {
        event.stopPropagation();
        optionMenu.classList.toggle("active");
    });

    options.forEach(option => {
        option.addEventListener("click", () => {
            let selectedOption = option.querySelector(".option-text").innerText;
            sBtn_text.innerText = selectedOption;

            if (selectedOption === "輸入教室名稱") {
                queryBlank.style.display = "none";
                queryClassRoom.style.display = "flex";
                queryTimeInterval.style.display = "none";
                queryBlank.removeAttribute("disabled");
                document.querySelector(".queryButton").removeAttribute("disabled");
            }
            else if (selectedOption === "選擇特定時段") {
                queryBlank.style.display = "none";
                queryClassRoom.style.display = "none";
                queryTimeInterval.style.display = "flex";
                queryBlank.removeAttribute("disabled");
                document.querySelector(".queryButton").removeAttribute("disabled");
            }
            else {
                queryBlank.style.display = "flex";
                queryClassRoom.style.display = "none";
                queryTimeInterval.style.display = "none";
                queryBlank.setAttribute("disabled", true);
                document.querySelector(".queryButton").setAttribute("disabled", true);
                showDefault();
            }

            optionMenu.classList.remove("active");
        })
    })

    //彈跳視窗
    let popup = document.getElementById("popup");
    popup.addEventListener("click", (event)=>{event.stopPropagation();},false);

    // 點擊教室開啟彈跳視窗的函數
    function showPopupClassroom(event) {
        event.stopPropagation();
        popup.classList.add("open-popup");
        let roomName = event.target.innerHTML;
        document.getElementById("popupName").innerHTML = roomName;
    }

    function closePopupClassroom() {
        popup.classList.remove("open-popup");
    }

})