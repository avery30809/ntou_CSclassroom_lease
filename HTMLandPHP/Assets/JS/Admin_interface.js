let image = {
    home: new Image()
};
image.home.src = "../../image/home.png";

document.addEventListener("DOMContentLoaded", () => {
    const allClassroomName = [];
    getClassroomName();
    function getClassroomName() {
        const testForm = new FormData();
        testForm.append("action", "getAllClassroomName");
        fetch("../../Controller/Api/ClassroomController.php", {
            method: 'POST',
            body: testForm
        })
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

    // 快速新增的下拉式選單
    const fastDropdownRoom = document.getElementById("fastDropdownRoom"),
        fastDropdownLessonStart = document.getElementById("fastDropdownLessonStart"),
        fastDropdownLessonEnd = document.getElementById("fastDropdownLessonEnd"),
        StartTime = ["第一節", "第二節", "第三節", "第四節", "第五節", "第六節", "第七節", "第八節", "第九節"],
        EndTime = ["第一節", "第二節", "第三節", "第四節", "第五節", "第六節", "第七節", "第八節", "第九節"],
        WeekTime = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    document.getElementById("fastRoomBox").addEventListener("click", (event)=>{
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        fastDropdownRoom.classList.toggle("show");
        fastDropdownLessonStart.classList.remove("show");
        fastDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element)=>{
            if(element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("fastLessonBoxStart").addEventListener("click", (event)=>{
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        fastDropdownLessonStart.classList.toggle("show");
        fastDropdownRoom.classList.remove("show");
        fastDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element)=>{
            if(element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("fastLessonBoxEnd").addEventListener("click", (event)=>{
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        fastDropdownLessonEnd.classList.toggle("show");
        fastDropdownRoom.classList.remove("show");
        fastDropdownLessonStart.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element)=>{
            if(element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.addEventListener("click",(event)=>{
        document.querySelectorAll(".fastDropdown").forEach((element)=>{
            element.classList.remove("show");
        });
        document.querySelectorAll(".checked").forEach((element)=>{
            element.classList.remove("checked");
        });
        document.querySelectorAll(".classDropdown").forEach((element)=>{
            element.classList.remove("show");
        });
    }, false);
    const fastRoom = document.getElementById("fastRoomBox"),
        fastLessonBoxStart = document.getElementById("fastLessonBoxStart"),
        fastLessonBoxEnd = document.getElementById("fastLessonBoxEnd");

    document.getElementById("fastLessonSelectStart").childNodes.forEach((element)=>{
        element.addEventListener("click", ()=>{
            fastLessonBoxStart.value = element.innerHTML;
            fastLessonBoxEnd.value = element.innerHTML;
            let i = StartTime.indexOf(element.innerHTML);
            document.getElementById("fastLessonSelectEnd").innerHTML = "";
            EndTime.slice(i).forEach((time)=>{
                let newItem = document.createElement("li");
                newItem.innerHTML = time;
                newItem.addEventListener("click", () => {
                    fastLessonBoxEnd.value = newItem.textContent;
                });
                document.getElementById("fastLessonSelectEnd").appendChild(newItem);
            });
        }, false);
    });

    document.getElementById("fastLessonSelectEnd").childNodes.forEach((element)=>{
        element.addEventListener("click", ()=>{
            fastLessonBoxEnd.value = element.innerHTML;
        }, false);
    });

    const fastForm = document.querySelector(".fastAddForm");

    fastForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        let myForm = new FormData(fastForm);
        myForm.append("action", "fastInsert");
        myForm.set("start", StartTime.indexOf(myForm.get("start")));
        myForm.set("end", EndTime.indexOf(myForm.get("end")));
        getIDForm = new FormData();
        getIDForm.append("account", myForm.get("userAccount"));
        getIDForm.append("action", "getID");
        fetch("../../Controller/Api/UserController.php", {
            method: 'POST',
            body: getIDForm
        })
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

    document.getElementById("classWeekBox").addEventListener("click", (event)=>{
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownWeek.classList.toggle("show");
        classDropdownRoom.classList.remove("show");
        classDropdownLessonStart.classList.remove("show");
        classDropdownLessonEnd.classList.remove("show");
    });

    document.getElementById("classRoomBox").addEventListener("click", (event)=>{
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownRoom.classList.toggle("show");
        classDropdownWeek.classList.remove("show");
        classDropdownLessonStart.classList.remove("show");
        classDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element)=>{
            if(element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("classLessonBoxStart").addEventListener("click", (event)=>{
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownLessonStart.classList.toggle("show");
        classDropdownWeek.classList.remove("show");
        classDropdownRoom.classList.remove("show");
        classDropdownLessonEnd.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element)=>{
            if(element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    document.getElementById("classLessonBoxEnd").addEventListener("click", (event)=>{
        event.stopPropagation();
        event.target.parentElement.classList.toggle("checked");
        classDropdownLessonEnd.classList.toggle("show");
        classDropdownWeek.classList.remove("show");
        classDropdownRoom.classList.remove("show");
        classDropdownLessonStart.classList.remove("show");
        document.querySelectorAll(".checked").forEach((element)=>{
            if(element != event.target.parentElement)
                element.classList.remove("checked");
        });
    });
    const classWeek = document.getElementById("classWeekBox"),
        classRoom = document.getElementById("classRoomBox"),
        classLessonBoxStart = document.getElementById("classLessonBoxStart"),
        classLessonBoxEnd = document.getElementById("classLessonBoxEnd");
    
    document.getElementById("classWeekSelect").childNodes.forEach((element)=>{
        element.addEventListener("click", ()=>{
            classWeek.value = element.innerHTML;
        }, false);
    }, false);

    document.getElementById("classLessonSelectStart").childNodes.forEach((element)=>{
        element.addEventListener("click", ()=>{
            classLessonBoxStart.value = element.innerHTML;
            classLessonBoxEnd.value = element.innerHTML;
            let i = StartTime.indexOf(element.innerHTML);
            document.getElementById("classLessonSelectEnd").innerHTML = "";
            EndTime.slice(i).forEach((time)=>{
                let newItem = document.createElement("li");
                newItem.innerHTML = time;
                newItem.addEventListener("click", () => {
                    classLessonBoxEnd.value = newItem.textContent;
                });
                document.getElementById("classLessonSelectEnd").appendChild(newItem);
            });
        }, false);
    });

    document.getElementById("classLessonSelectEnd").childNodes.forEach((element)=>{
        element.addEventListener("click", ()=>{
            classLessonBoxEnd.value = element.innerHTML;
        }, false);
    });

    const classForm = document.querySelector(".classAddForm");

    classForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        let myForm = new FormData(classForm);
        if(myForm.get("semesterStart") > myForm.get("semesterEnd")) {
            window.alert("學期開始時間不得大於結束時間！");
            return;
        }
        myForm.append("action", "classInsert");
        myForm.set("week", WeekTime.indexOf(myForm.get("week")));
        myForm.set("start", StartTime.indexOf(myForm.get("start")));
        myForm.set("end", EndTime.indexOf(myForm.get("end")));
        getIDForm = new FormData();
        getIDForm.append("account", myForm.get("userAccount"));
        getIDForm.append("action", "getID");
        fetch("../../Controller/Api/UserController.php", {
            method: 'POST',
            body: getIDForm
        })
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
    });
    
    keyRecordBtn.addEventListener("click", () => {
        showBtn("keyRecord");
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
    
    for (let i = 1; i <= 3; i++) {
        let imgId = "reserveFormImg" + i;
        let contentId = "reserveFormContent" + i;
        let img = document.getElementById(imgId);
        img.addEventListener("click", () => {
            reserveFormToggleContent(contentId, imgId);
        });
    }
    
    for (let i = 1; i <= 2; i++) {
        let imgId = "immediatelyFormImg" + i;
        let contentId = "immediatelyFormContent" + i;
        let img = document.getElementById(imgId);
        img.addEventListener("click", () => {
            immediatelyFormToggleContent(contentId, imgId);
        });
    }
    
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
        fastAddForm.classList.add("show");
    }
    function openClassAddForm() {
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
    function immediatelyFormToggleContent(contentId, imageId) {
        let immediatelyFormContent = document.getElementById(contentId);
        let immediatelyFormImage = document.getElementById(imageId);
        immediatelyFormContent.classList.toggle("show");
        immediatelyFormImage.classList.toggle("show");
    }
    function reserveFormToggleContent(contentId, imageId) {
        let reserveFormContent = document.getElementById(contentId);
        let reserveFormImage = document.getElementById(imageId);
        reserveFormContent.classList.toggle("show");
        reserveFormImage.classList.toggle("show");
    }
});