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
        fetch("../../Controller/Api/UserController.php", {
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
        queryTimeInterval = document.querySelector(".inputTimeInterval"),
        popup = document.getElementById("popup"),
        dropdownStart = document.querySelector(".dropdownStart"),
        dropdownEnd = document.querySelector(".dropdownEnd");

    //以後會被資料庫所取代
    let allClassroomName = [];
    let activities = {};
    const startTime = ["第一節", "第二節", "第三節", "第四節", "第五節", "第六節", "第七節", "第八節", "第九節"],
        endTime = ["第一節", "第二節", "第三節", "第四節", "第五節", "第六節", "第七節", "第八節", "第九節後"];

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
            getDateClassCondition();
        });
    }
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
        return (100-(count*100/startTime.length)).toFixed(2);
    }

    //查詢結果格式
    function showResult(room) {
        return `<span><span class="classroomName">${room}</span></span><span>${room.slice(0, 3) == "INS" ? "電資大樓" : "電綜大樓"}</span><span class="totalBar"><div class="nowState-bar">${roomCondition(room)}%</div></span><span class="borrowSpace"><button class="borrow">借用</button></span><div class="wrap"></div>`;
    }
    function getColorByPercentage(percentage) {
        percentage = parseFloat(percentage);
        let saturation = 70; // 控制飽和度
        let lightness = 50; // 控制亮度
        
        let hue;
        if (percentage <= 50) {
            hue = Math.round(120 - (percentage / 50) * 60); // 綠到黃
        } else {
            hue = Math.round(120 - percentage * 6 / 5); // 黃到紅
        }
        // hue 120-綠 60-黃 0-紅
        return 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
    }
    //加入點擊借用的監聽器
    function addBorrowListener() {
        let elements = document.querySelectorAll(".borrow");
        for(let i=0; i<elements.length; i++) {
            elements[i].addEventListener("click", showPopupClassroom, false);
        }
    }
    //加入點擊教室名稱的監聽器
    function addNameListenter() {
        let elements = document.querySelectorAll(".classroomName");
        for(let i=0; i<elements.length; i++) {
            elements[i].addEventListener("click", showPopupCourse, false);
        }
    }

    //列出所有教室狀態
    function showDefault() {
        let content = "";
        content += '<span>教室名稱</span><span>教室位置</span><span>借用情況</span><div class="wrap"></div>';

        allClassroomName.forEach((classroom) => {
            content += showResult(classroom);
        });
        document.getElementById("showClassroom").innerHTML = content;
        setBarColor();
        addBorrowListener();
        addNameListenter();
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
    document.getElementById("time1").addEventListener("click", (event) => {
        event.stopPropagation();
        dropdownStart.classList.toggle("active");
        dropdownEnd.classList.remove("active");
        optionMenu.classList.remove("active");
        popup.classList.remove("open-popup");
    })
    document.getElementById("time2").addEventListener("click", (event) => {
        event.stopPropagation();
        dropdownEnd.classList.toggle("active");
        dropdownStart.classList.remove("active");
        optionMenu.classList.remove("active");
        popup.classList.remove("open-popup");
    })
    //監聽所有點擊事件 關閉彈跳視窗與下拉式選單
    document.addEventListener("click", (event) => {
        dropdownStart.classList.remove("active");
        dropdownEnd.classList.remove("active");
        optionMenu.classList.remove("active");
        popup.classList.remove("open-popup");
    })

    //顯示以教室名稱或特定時段搜尋的結果
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let queryStartTime = document.getElementById("time1").value,
            queryEndTime = document.getElementById("time2").value;

        let searchMethod = sBtn_text.innerHTML=="輸入教室名稱"?true:false;//true 找教室名稱 false 找特定時間

        if (searchMethod) {
            let properClassroomName = [];
            for (let i = 0; i < allClassroomName.length; i++) {
                if (allClassroomName[i].startsWith(queryClassRoom.value)) properClassroomName.push(allClassroomName[i]);
            }
            let content = '<span>教室名稱</span><span>教室位置</span><span>借用情況</span><div class="wrap"></div>';
            properClassroomName.forEach((roomName)=>{
                content += showResult(roomName);
            },false);
            queryClassRoom.value = "";
            document.getElementById("showClassroom").innerHTML = content;
            setBarColor();
            addBorrowListener();
            addNameListenter();
        }
        else if (queryStartTime != "" && queryEndTime != "") {
            let content = '<span>教室名稱</span><span>教室位置</span><span>借用情況</span><div class="wrap"></div>';
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
            setBarColor();
            addBorrowListener();
            addNameListenter();
        }
    })

    function setBarColor() {
        let barElements = document.querySelectorAll(".nowState-bar");
        barElements.forEach((element)=>{
            let percentage = element.innerHTML;
            element.style.background = getColorByPercentage(percentage);
            element.style.width = `${percentage}`;
        })
    }

    selectBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        optionMenu.classList.toggle("active");
        dropdownStart.classList.remove("active");
        dropdownEnd.classList.remove("active");
        popup.classList.remove("open-popup");
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
        })
    })

    //彈跳視窗
    popup.addEventListener("click", (event)=>{event.stopPropagation();},false);

    // 點擊教室開啟彈跳視窗的函數
    function showPopupClassroom(event) {
        event.stopPropagation();
        popup.classList.add("open-popup");
        optionMenu.classList.remove("active");
        dropdownStart.classList.remove("active");
        dropdownEnd.classList.remove("active");
        popup.style.width = "600px";
        let roomName = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.querySelector(".classroomName").innerHTML;
        document.getElementById("popupName").innerHTML = roomName;
        document.querySelector(".content").innerHTML = `<form id="borrowForm"></form>`;
        addBorrowForm(roomName);

        document.getElementById("borrowForm").addEventListener("submit", (event)=>{
            event.preventDefault();
            const myForm = new FormData(document.getElementById("borrowForm"));
            myForm.append("action", "submitSelectedSlot");
            fetch("../../Controller/Api/ClassroomController.php", {
                method: 'POST',
                body: myForm
            })
            .then(response=>response.json())
            .then(data => {
                if(data['error'] === undefined) {
                    const applicationForm = new FormData();
                    for(let i=0; i<data.length; i++) {
                        applicationForm.append("TimeSlot[]", data[i]);
                    }
                    applicationForm.append("roomName", roomName);
                    applicationForm.append("action", "createApplicationForm");
                    fetch("../../Controller//Api/UserController.php", {
                        method: 'POST',
                        body: applicationForm
                    })
                    window.location.href = 'Application form.html';
                }
            })
        }, false);

        let disabledElements = document.querySelectorAll(".classroomState");
        disabledElements.forEach((element)=>{
            if(element.getAttribute("disabled") !== null) {
                element.nextElementSibling.addEventListener("click", ()=>{
                    element.setAttribute("disabled", null);
                    element.checked = false;
                    window.alert("不可借用此時段！");
                }, false);
            }
            else {
                element.nextElementSibling.addEventListener("click", ()=>{
                    element.removeAttribute("disabled");
                }, false);
            }
        })
    }
    // 加入popup表單的內容
    function addBorrowForm(roomName) {
        let timeList = ["08:20～09:10", "09:20～10:10", "10:20～11:10", "11:15～12:05", "12:10～13:00", "13:10～14:00", "14:10～15:00", "15:10～16:00", "16:10～"];
        let content = `<span>節次</span><span>時間段</span><span>借用狀態</span>
        <div class="wrap"></div>`;

        for(let i=0; i<startTime.length; i++) {
            content += `
            <span>${startTime[i]}</span><span>${timeList[i]}</span>
            <span>
                <input id='ck${i}' type='checkbox' class='classroomState' name='state[]' value='${startTime[i]}' ${activities[roomName][i] == ""?'':'disabled="null"'}>
                <label for='ck${i}'></label>
            </span>
            <div class="wrap"></div>`;
        }
        content += `<button class="borrowSubmit" type='submit'>確認</button>`;
        document.getElementById("borrowForm").innerHTML = content;
    }

    function showPopupCourse(event) {
        event.stopPropagation();
        popup.classList.add("open-popup");
        optionMenu.classList.remove("active");
        dropdownStart.classList.remove("active");
        dropdownEnd.classList.remove("active");
        popup.style.width = "900px";
        let roomName = event.target.innerHTML;
        document.getElementById("popupName").innerHTML = roomName + "課表";
        let testForm = new FormData();
        testForm.append("roomName", roomName);
        testForm.append("action", "getWeeklySchedule");
        fetch("../../Controller/Api/ClassroomController.php", {
            method: 'POST',
            body: testForm
        })
        .then(response=>response.json())
        .then(data => {
            let schedule =  [
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""]
            ];
            let userData = [
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""]
            ];
            for(let i=0; i<data.length; i++) {
                if(data[i]) {
                    for(let j=0; j<data[i].length; j++) {
                        schedule[i][data[i][j][0]-8] = data[i][j][1];
                        userData[i][data[i][j][0]-8] = `${data[i][j][2]} ${data[i][j][3]} ${data[i][j][4]}`;
                    }
                }
            }
            document.querySelector(".content").innerHTML = weeklySchedule(schedule, userData);
        })
    }

    function weeklySchedule(schedule, userData) {
        let timeList = ["08:20～09:10", "09:20～10:10", "10:20～11:10", "11:15～12:05", "12:10～13:00", "13:10～14:00", "14:10～15:00", "15:10～16:00", "16:10～16:55"];
        let content = `
        <table border='1'>
            <tr>
                <td></td>
                <td>禮拜日</td>
                <td>禮拜一</td>
                <td>禮拜二</td>
                <td>禮拜三</td>
                <td>禮拜四</td>
                <td>禮拜五</td>
                <td>禮拜六</td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <!-- 新增方塊 -->
                    <div class="block">
                        <span>課程名稱</span>
                    </div>
                </td>
                <td>
                    <!-- 新增方塊 -->
                    <div class="block">
                        <span>課程名稱</span>
                    </div>
                </td>
                <td>
                    <!-- 新增方塊 -->
                    <div class="block">
                        <span>課程名稱</span>
                    </div>
                </td>
                <td>
                    <!-- 新增方塊 -->
                    <div class="block">
                        <span>課程名稱</span>
                    </div>
                </td>
                <td>
                    <!-- 新增方塊 -->
                    <div class="block">
                        <span>課程名稱</span>
                    </div>
                </td>
                <td>
                    <!-- 新增方塊 -->
                    <div class="block">
                        <span>課程名稱</span>
                    </div>
                </td>
                <td>
                    <!-- 新增方塊 -->
                    <div class="addBlock">
                        <span>課程名稱</span>
                    </div>
                </td>
            </tr>
        `;
        for (let i = 0; i < startTime.length; i++) {
            content += `
            <tr>
                <td>${startTime[i]}<br>${timeList[i]}</td>`;

            const order = [6, 0, 1, 2, 3, 4, 5];
            for (let j of order) {
                let userDataSplit;
                content += `<td class='schedule-cell'>${schedule[j][i]}`;
                if(userData[j][i]) {
                    userDataSplit = userData[j][i].split(" ");
                    content += `<div class="userData-popup">${userDataSplit[0]==""?"":"借用人: "+userDataSplit[0]}${userDataSplit[1]==""?"":"<br>信箱: "+userDataSplit[1]}${userDataSplit[2]=="null"?"":"<br>電話: "+userDataSplit[2]}</div>`;
                }
                content += "</td>";
            }
            content += `</tr>`;
        }

        content += "</table>";
        return content;
    }
    // 顯示使用者訊息
    const userDataCells = document.querySelectorAll('.userDataCell');

    userDataCells.forEach(cell => {
        cell.addEventListener('mouseover', function () {
            const popup = this.querySelector('.userData-popup');
            popup.style.display = 'block';
        });

        cell.addEventListener('mouseout', function () {
            const popup = this.querySelector('.userData-popup');
            popup.style.display = 'none';
        });
    });

    function closePopupClassroom() {
        popup.classList.remove("open-popup");
    }

})