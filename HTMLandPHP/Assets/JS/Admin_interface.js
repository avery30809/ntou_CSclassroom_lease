document.addEventListener("DOMContentLoaded", () => {
    const allClassroomName = [];
    getClassroomName();
    function getClassroomName() {
        fetch("../../Controller/Api/ClassroomController.php?action=getAllClassroomName")
        .then(response => response.json())
        .then(datas => {
            datas.forEach((data) => {
                allClassroomName.push(data[0]);
                fastRoom.value = allClassroomName[0];
                classRoom.value = allClassroomName[0];
                let room = [document.createElement("li"), document.createElement("li")];
                room[0].innerHTML = data[0];
                room[1].innerHTML = data[0];
                room[0].addEventListener("click", ()=>{
                    classRoom.value = room[0].innerHTML;
                }, false);
                room[1].addEventListener("click", ()=>{
                    fastRoom.value = room[1].innerHTML;
                }, false);
                document.getElementById("classRoomSelect").appendChild(room[0]);
                document.getElementById("fastRoomSelect").appendChild(room[1]);
            });
        });
    }
    if(window.localStorage.getItem("ID")!=1) {
        //沒有登入就回首頁
        window.alert("請先登入！");
        window.location.href = "Home.html";
    }

    document.getElementById("logoutBtn").addEventListener("click", ()=>{
        fetch("../../Controller/Api/UserController.php?action=logout");
        window.location.href = "../../Pages/Home.html";
    }, false);

    // 快速新增的下拉式選單
    const fastDropdownRoom = document.getElementById("fastDropdownRoom"),
        fastDropdownLessonStart = document.getElementById("fastDropdownLessonStart"),
        fastDropdownLessonEnd = document.getElementById("fastDropdownLessonEnd"),
        StartTime = ["第一節", "第二節", "第三節", "第四節", "第五節", "第六節", "第七節", "第八節", "第九節"],
        EndTime = ["第一節", "第二節", "第三節", "第四節", "第五節", "第六節", "第七節", "第八節", "第九節"],
        WeekTime = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    document.getElementById("fastRoomBox").addEventListener("click", (event) => {
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        fastDropdownRoom.classList.toggle("show");
        fastDropdownLessonStart.classList.remove("show");
        fastDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element) => {
            if (element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("fastLessonBoxStart").addEventListener("click", (event) => {
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        fastDropdownLessonStart.classList.toggle("show");
        fastDropdownRoom.classList.remove("show");
        fastDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element) => {
            if (element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("fastLessonBoxEnd").addEventListener("click", (event) => {
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        fastDropdownLessonEnd.classList.toggle("show");
        fastDropdownRoom.classList.remove("show");
        fastDropdownLessonStart.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element) => {
            if (element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.addEventListener("click", (event) => {
        document.querySelectorAll(".fastDropdown").forEach((element) => {
            element.classList.remove("show");
        });
        document.querySelectorAll(".checked").forEach((element) => {
            element.classList.remove("checked");
        });
        document.querySelectorAll(".classDropdown").forEach((element) => {
            element.classList.remove("show");
        });
    }, false);
    const fastRoom = document.getElementById("fastRoomBox"),
        fastLessonBoxStart = document.getElementById("fastLessonBoxStart"),
        fastLessonBoxEnd = document.getElementById("fastLessonBoxEnd");

    document.getElementById("fastLessonSelectStart").childNodes.forEach((element) => {
        element.addEventListener("click", () => {
            fastLessonBoxStart.value = element.innerHTML;
            fastLessonBoxEnd.value = element.innerHTML;
            let i = StartTime.indexOf(element.innerHTML);
            document.getElementById("fastLessonSelectEnd").innerHTML = "";
            EndTime.slice(i).forEach((time) => {
                let newItem = document.createElement("li");
                newItem.innerHTML = time;
                newItem.addEventListener("click", () => {
                    fastLessonBoxEnd.value = newItem.textContent;
                });
                document.getElementById("fastLessonSelectEnd").appendChild(newItem);
            });
        }, false);
    });

    document.getElementById("fastLessonSelectEnd").childNodes.forEach((element) => {
        element.addEventListener("click", () => {
            fastLessonBoxEnd.value = element.innerHTML;
        }, false);
    });

    const fastForm = document.querySelector(".fastAddForm");

    fastForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let myForm = new FormData(fastForm);
        myForm.append("action", "fastInsert");
        myForm.set("start", StartTime.indexOf(myForm.get("start")));
        myForm.set("end", EndTime.indexOf(myForm.get("end")));
        fetch(`../../Controller/Api/UserController.php?account=${myForm.get("userAccount")}&action=getID`)
        .then(response => response.text())
        .then(data => {
            if(data !== "未找到使用者") {
                myForm.append("userID", data);
                fetch("../../Controller/Api/ClassroomController.php", {
                    method: 'POST',
                    body: myForm
                })
                .then(response => response.text())
                .then(res => {
                    window.alert(res.replace(" ", "\n"));
                });
            }
            else {
                window.alert("未找到該使用者");
            }
        });
    }, false);

    // 課表新增的下拉式選單
    const classDropdownWeek = document.getElementById("classDropdownWeek"),
        classDropdownRoom = document.getElementById("classDropdownRoom"),
        classDropdownLessonStart = document.getElementById("classDropdownLessonStart"),
        classDropdownLessonEnd = document.getElementById("classDropdownLessonEnd");

    document.getElementById("classWeekBox").addEventListener("click", (event) => {
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownWeek.classList.toggle("show");
        classDropdownRoom.classList.remove("show");
        classDropdownLessonStart.classList.remove("show");
        classDropdownLessonEnd.classList.remove("show");
    });

    document.getElementById("classRoomBox").addEventListener("click", (event) => {
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownRoom.classList.toggle("show");
        classDropdownWeek.classList.remove("show");
        classDropdownLessonStart.classList.remove("show");
        classDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element) => {
            if (element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("classLessonBoxStart").addEventListener("click", (event) => {
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownLessonStart.classList.toggle("show");
        classDropdownWeek.classList.remove("show");
        classDropdownRoom.classList.remove("show");
        classDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element) => {
            if (element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("classLessonBoxEnd").addEventListener("click", (event) => {
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownLessonEnd.classList.toggle("show");
        classDropdownWeek.classList.remove("show");
        classDropdownRoom.classList.remove("show");
        classDropdownLessonStart.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element) => {
            if (element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    const classWeek = document.getElementById("classWeekBox"),
        classRoom = document.getElementById("classRoomBox"),
        classLessonBoxStart = document.getElementById("classLessonBoxStart"),
        classLessonBoxEnd = document.getElementById("classLessonBoxEnd");

    document.getElementById("classWeekSelect").childNodes.forEach((element) => {
        element.addEventListener("click", () => {
            classWeek.value = element.innerHTML;
        }, false);
    }, false);

    document.getElementById("classLessonSelectStart").childNodes.forEach((element) => {
        element.addEventListener("click", () => {
            classLessonBoxStart.value = element.innerHTML;
            classLessonBoxEnd.value = element.innerHTML;
            let i = StartTime.indexOf(element.innerHTML);
            document.getElementById("classLessonSelectEnd").innerHTML = "";
            EndTime.slice(i).forEach((time) => {
                let newItem = document.createElement("li");
                newItem.innerHTML = time;
                newItem.addEventListener("click", () => {
                    classLessonBoxEnd.value = newItem.textContent;
                });
                document.getElementById("classLessonSelectEnd").appendChild(newItem);
            });
        }, false);
    });

    document.getElementById("classLessonSelectEnd").childNodes.forEach((element) => {
        element.addEventListener("click", () => {
            classLessonBoxEnd.value = element.innerHTML;
        }, false);
    });

    const classForm = document.querySelector(".classAddForm");

    classForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let myForm = new FormData(classForm);
        if (myForm.get("semesterStart") > myForm.get("semesterEnd")) {
            window.alert("學期開始時間不得大於結束時間！");
            return;
        }
        myForm.append("action", "classInsert");
        myForm.set("week", WeekTime.indexOf(myForm.get("week")));
        myForm.set("start", StartTime.indexOf(myForm.get("start")));
        myForm.set("end", EndTime.indexOf(myForm.get("end")));
        fetch(`../../Controller/Api/UserController.php?account=${myForm.get("userAccount")}&action=getID`)
        .then(response => response.text())
        .then(data => {
            if(data !== "未找到使用者"){
                myForm.append("userID", data);
                fetch("../../Controller/Api/ClassroomController.php", {
                    method: 'POST',
                    body: myForm
                })
                .then(response => response.text())
                .then(res => {
                    window.alert(res.replace(" ", "\n"));
                });
            }
            else {
                window.alert("未找到該使用者");
            }
        });
    }, false);

    const body = document.querySelector("body"),
        sidebar = body.querySelector("nav"),
        leftArrow = document.getElementById("leftArrow"),
        sidebarToggle = body.querySelector(".sidebar-toggle");

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        if (sidebar.classList.contains("close")) {
            leftArrow.classList.add("show");
        } else {
            leftArrow.classList.remove("show");
        }
    })
    let username = document.getElementById("username");
    username.addEventListener("click", () => {
        window.location.href = "使用者介面.html";
    });

    // 當點擊左側選當後在右側顯示
    let borrowRequestBtn = document.querySelector(".menu-borrowRequest");
    let keyRecordBtn = document.querySelector(".menu-keyRecord");
    let classScheduleBtn = document.querySelector(".menu-classSchedule");
    let classroomInquiryBtn = document.querySelector(".menu-classroomInquiry");
    let borrowRequest = document.getElementById("borrowRequest");
    let keyRecord = document.getElementById("keyRecord");
    let classSchedule = document.getElementById("classSchedule");
    let classroomInquiry = document.getElementById("classroomInquiry");

    borrowRequestBtn.addEventListener("click", () => {
        showBtn("borrowRequest");
        getHistoryForm();
    });

    keyRecordBtn.addEventListener("click", () => {
        showBtn("keyRecord");
        getKeyRecord();
    });

    classScheduleBtn.addEventListener("click", () => {
        showBtn("classSchedule");
    });

    classroomInquiryBtn.addEventListener("click", () => {
        showBtn("classroomInquiry");
    });

    function showBtn(btnID) {
        let main = document.getElementById(btnID);
        clearAll();
        main.classList.add("show");
    }

    function clearAll() {
        borrowRequest.classList.remove("show");
        keyRecord.classList.remove("show");
        classSchedule.classList.remove("show");
        classroomInquiry.classList.remove("show");
    }
    // 用按鈕選擇條件清單

    //-----點擊按鈕後改變顏色
    let immediatelyButton = document.getElementById("immediately");
    let reserveButton = document.getElementById("reserve");

    let fastAddButton = document.getElementById("fastAdd");
    let classAddButton = document.getElementById("classAdd");

    //-----點擊按鈕後顯示多個清單
    //// 1.借用請求
    let immediatelyForm = document.querySelector(".immediatelyForm");
    let reserveForm = document.querySelector(".reserveForm");

    //// 2. 課表排程
    let fastAddForm = document.querySelector(".fastAddForm");
    let classAddForm = document.querySelector(".classAddForm");

    //-----點擊箭頭後顯示清單內容(1.內容,2.圖片)
    let immediatelyFormBody = document.getElementById("immediatelyFormcontent");
    let immediatelyFormImage = document.getElementById("immediatelyFormImg");

    let reserveFormBody = document.getElementById("reserveFormcontent");
    let reserveFormImage = document.getElementById("reserveFormImg");

    let returnButton = document.getElementById('returnButton');


    immediatelyButton.addEventListener("click", () => {
        clearAllForm();
        openImmediatelyForm();
    });

    reserveButton.addEventListener("click", () => {
        clearAllForm();
        openReserveForm();
    });

    fastAddButton.addEventListener("click", () => {
        clearAllForm();
        openFastAddForm();
    });

    classAddButton.addEventListener("click", () => {
        clearAllForm();
        openClassAddForm();
    });
    /*
    // <!-- 雙重按鈕確認歸還
    returnButton.addEventListener("click", () => {
        keyDoubleCheck();
    });
    */
    ///////////////////////////////////////////////////////////////////////////////////

    function clearAllForm() {
        //// 1.借用請求
        immediatelyButton.classList.remove("show");
        reserveButton.classList.remove("show");

        immediatelyForm.classList.remove("show");
        reserveForm.classList.remove("show");

        //// 2. 課表排程
        fastAddForm.classList.remove("show");
        classAddForm.classList.remove("show");

        classAddButton.classList.remove("show");
        fastAddButton.classList.remove("show");

    }

    //// 1.借用請求
    function openImmediatelyForm() {
        immediatelyButton.classList.add("show");
        immediatelyForm.classList.add("show");
    }

    function openReserveForm() {
        reserveButton.classList.add("show");
        reserveForm.classList.add("show");
    }

    //// 2. 課表排程
    function openFastAddForm() {
        fastAddButton.classList.add("show");
        fastAddForm.classList.add("show");
    }
    function openClassAddForm() {
        classAddButton.classList.add("show");
        classAddForm.classList.add("show");
    }
    //點箭頭控制清單開關
    // function openImmediatelyFormContent() {
    //     immediatelyFormBody.classList.toggle("show");
    //     immediatelyFormImage.classList.toggle("show");
    // }
    // function openReserveFormContent() {
    //     reserveFormBody.classList.toggle("show");
    //     reserveFormImage.classList.toggle("show");
    // }
    ////////////////////////////////////////////////////////////////////////////////////

    
    // 雙重按鈕確認歸還
    function keyDoubleCheck(target) {
        let modal = target.nextElementSibling;
        let span = modal.children[0];
        let confirmBtn = span.children[2];
        let cancelBtn = span.children[3];
        target.onclick = function () {
            modal.style.display = 'block';
        };
    
        span.onclick = function () {
            modal.style.display = 'none';
        };
    
        confirmBtn.onclick = function () {
            // 在這裡放置確認按下後的處理邏輯
            if(target.innerHTML == "尚未借用") {
                modal.style.display = 'none';
                const testForm = new FormData();
                let arg = target.getAttribute("data-argument").split(" ");
                testForm.append("roomName", arg[0]);
                testForm.append("userID", arg[1]);
                testForm.append("date", arg[2]);
                testForm.append("startTime", arg[3]);
                testForm.append("action", "setBorrowed");
                fetch("../../Controller/Api/HistoryController.php", {
                    method: 'POST',
                    body: testForm
                })
                .then(response=>response.text())
                .then(data=>{
                    target.innerHTML = "未歸還";
                    getHistoryForm();
                })
            }
            else {
                modal.style.display = 'none';
                const testForm = new FormData();
                let arg = target.getAttribute("data-argument").split(" ");
                testForm.append("roomName", arg[0]);
                testForm.append("userID", arg[1]);
                testForm.append("date", arg[2]);
                testForm.append("startTime", arg[3]);
                testForm.append("action", "setKeyRecord");
                fetch("../../Controller/Api/HistoryController.php", {
                    method: 'POST',
                    body: testForm
                })
                .then(response=>response.text())
                .then(data=>{
                    target.innerHTML = "已歸還";
                    target.disabled = true;
                    getHistoryForm();
                })
            }
        };
    
        cancelBtn.onclick = function () {
            // 在這裡放置取消按下後的處理邏輯
            modal.style.display = 'none';
        };
    
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    
    }
    function getHistoryForm() {
        fetch("../../Controller/Api/HistoryController.php?action=getHistoryForm")
        .then(response => response.json())
        .then(datas => {
            //console.log(datas);
            if (datas.error !== undefined) {
                immediatelyForm.innerHTML = "";
                reserveForm.innerHTML = "";
                return;
            }
            let imContent = "";
            let rvContent = "";
            datas.forEach((data, index) => {
                console.log(data);
                if (data[6] === 1) {
                    imContent += `<div class="content">
                                        <div class="title">
                                            <p>${data[1]}<img src="../../image/dropdownIcon48.png" class="immediatelyFormImg" data-index="${index}" alt="immediatelyFormImg2"></p>
                                        </div>
                                        <div class="text" data-index="${index}">
                                            <p>${data[11]}</p>
                                            <p>借用目的: ${data[5]}</p>
                                            <p>借用日期: ${data[8]}</p>
                                            <p>歸還日期: 尚未借用</p>
                                            <div class="accounting">
                                                <p>Start Time : </p>
                                                <p>End Time : </p>
                                                <p>第${data[3]}堂</p>
                                                <p>${data[4] === 9 ? "第9堂後" : `第${data[4]}堂`}</p>
                                                <button class="handleFormButton" data-argument = "${data[1]} ${data[0]} ${data[2]} ${data[3]} 0 ${data[4]} ${data[5]}">拒絕</button>
                                                <button class="handleFormButton" data-argument = "${data[1]} ${data[0]} ${data[2]} ${data[3]} 1 ${data[4]} ${data[5]}">同意</button>
                                            </div>
                                        </div>
                                    </div>`;
                } else {                      
                    rvContent += `<div class="content">
                                                <div class="title">
                                                    <p>${data[1]}<img src="../../image/dropdownIcon48.png" class="reserveFormImg" data-index="${index}" alt="reserveFormImg2"></p>
                                                </div>
                                                <div class="text" data-index="${index}">
                                                    <p>${data[11]}</p>
                                                    <p>借用目的: ${data[5]}</p>
                                                    <p>借用日期: ${data[8]}</p>
                                                    <p>歸還日期: 尚未借用</p>
                                                    <div class="accounting">
                                                        <p>Start Time : </p>
                                                        <p>End Time : </p>
                                                        <p>第${data[3]}堂</p>
                                                        <p>${data[4] === 9 ? "第9堂後" : `第${data[4]}堂`}</p>
                                                        <button class="handleFormButton" data-argument = "${data[1]} ${data[0]} ${data[2]} ${data[3]} 0 ${data[4]} ${data[5]}">拒絕</button>
                                                        <button class="handleFormButton" data-argument = "${data[1]} ${data[0]} ${data[2]} ${data[3]} 1 ${data[4]} ${data[5]}">同意</button>
                                                    </div>
                                                </div>
                                            </div>`;
                }
            });
            immediatelyForm.innerHTML = imContent;
            reserveForm.innerHTML = rvContent;
            document.querySelectorAll('.handleFormButton').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    let arg = event.target.getAttribute("data-argument").split(" ");
                    let testForm = new FormData();
                    testForm.append("roomName", arg[0]);
                    testForm.append("userID", parseInt(arg[1]));
                    testForm.append("date", arg[2]);
                    testForm.append("startTime", parseInt(arg[3]));
                    testForm.append("allow", parseInt(arg[4]));
                    testForm.append("action", "examineForm");
                    
                    fetch("../../Controller/Api/HistoryController.php", {
                        method: "POST",
                        body: testForm
                    })
                    .then(response => response.text())
                    .then(data => {
                        getHistoryForm();
                        if(arg[4]=='0') return;
                        testForm.set("action", "applicationApprove");
                        testForm.append("times", arg[5]-arg[3]+1);
                        testForm.append("activity", arg[6]);
                        fetch("../../Controller/Api/ClassroomController.php", {
                            method: "POST",
                            body: testForm
                        })
                        .then(res=>res.text())
                        .then(dt=>{
                            console.log(dt);
                        })
                    });
                });
            });
            document.querySelectorAll('.immediatelyFormImg').forEach(img => {
                img.addEventListener('click', () => {
                    const index = img.getAttribute('data-index');
                    let formContent = document.querySelector(`.text[data-index="${index}"]`);
                    formContent.classList.toggle("show");
                    img.classList.toggle("show");
                });
            });
            document.querySelectorAll('.reserveFormImg').forEach(img => {
                img.addEventListener('click', () => {
                    const index = img.getAttribute('data-index');
                    let formContent = document.querySelector(`.text[data-index="${index}"]`);
                    formContent.classList.toggle("show");
                    img.classList.toggle("show");
                });
            });
        });
    }
    function getKeyRecord() {
        let content = `<div class="keyRecordTitle">
                        <span style=width:10%;'>借用教室</span>
                        <span style='width:15%;'>借用者</span>
                        <span style='width:20%;'>借用目的</span>
                        <span style='width:20%;'>借用時間</span>
                        <span style='width:10%;'>預計歸還</span>
                        <span style='width:20%;'>實際歸還</span>
                        <span style='width:5%'>借用狀態</span>
                    </div>`;
        fetch("../../Controller/Api/HistoryController.php?action=getKeyRecord")
        .then(response=>response.json())
        .then(datas=>{
            if(datas.error === undefined) {
                content += `<div class="keyRecordBody">`;
                datas.forEach(data=>{
                    content += `<div class="keyRecordContent">
                                    <span style='width:10%;'>${data[0]}</span>
                                    <span style='width:15%;'>${data[1]}</span>
                                    <span style='width:20%;'>${data[2]}</span>
                                    <span style='width:20%;'>${data[3]} 第${data[4]}節</span>
                                    <span style='width:10%;'>第${data[5]}節</span>
                                    <span style='width:20%;'>${data[6] ?? "無"}</span>
                        
                                    <!-- 雙重按鈕確認歸還 -->
                                    <button class="returnButton" data-argument="${data[0]} ${data[7]} ${data[3]} ${data[4]}">${data[8]==0?"尚未借用":data[6]==null?"未歸還":"已歸還"}</button>
                        
                                    <div id="myModal" class="modal">
                                        <div class="modal-content">
                                            <span class="close" id="closeModal">&times;</span>
                                            <p>${data[8]==0?"確定借用？":"確認歸還？"}</p>
                                            <button id="confirmBtn">確認</button>
                                            <button id="cancelBtn">取消</button>
                                        </div>
                                    </div>
                                </div>`;
                });
            }
            content += "</div>";
            document.getElementById("keyRecord").innerHTML = content;
            document.querySelectorAll(".returnButton").forEach(element=>{
                if(element.innerHTML==="已歸還") {
                    element.disabled = true;
                }
                element.addEventListener("click", (e)=>{
                    e.target.nextElementSibling.style.display = 'block';
                    keyDoubleCheck(e.target);
                }, false);
            })
        });
    }
});