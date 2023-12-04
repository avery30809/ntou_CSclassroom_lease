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
                let room = document.createElement("option");
                room.innerHTML = data[0];
                document.getElementById("classroomNameList").appendChild(room);
            });
        });
    }
    const body = document.querySelector("body"),
        sidebar = body.querySelector("nav"),
        leftArrow = document.getElementById("leftArrow");
    sidebarToggle = body.querySelector(".sidebar-toggle");

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        if (sidebar.classList.contains("close")) {
            localStorage.setItem("status", "close");
            leftArrow.classList.add("show");
        } else {
            localStorage.setItem("status", "open");
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