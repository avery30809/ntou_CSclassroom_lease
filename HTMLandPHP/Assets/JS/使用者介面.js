document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("menuBtn1").addEventListener("click", ()=>{
        clearAll();
        showEditstate();
    });
    document.getElementById("menuBtn2").addEventListener("click", ()=>{
        getApplyRequest();
        clearAll();
        showApplyRequest();
    });

    let userInformation = document.getElementById("userInformation");
    let applyRequest = document.getElementById("applyRequest");
    const logoutButton = document.getElementById("logoutBtn");
    const logoName = document.querySelector(".logo_name");

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
        fetch(`../../Controller/Api/UserController.php?action=getUserProfile&ID=${window.localStorage.getItem("ID")}`)
        .then(response => response.json())
        .then(data => {
            if (data.error === undefined && window.localStorage.getItem("ID")!="1") {
                user = data;
                logoName.innerHTML = user.username;
                document.getElementById("infoName").value = user.username;
                document.getElementById("userAccount").innerHTML = user.useraccount;
                if(user.phone !== null) document.getElementById("infoPhone").value = user.phone;
            }
            else if(window.localStorage.getItem("ID")=="1") {
                window.location.href = "../../Pages/Admin interface.html";
            }
            else {
                //沒有登入就回首頁
                window.alert("請先登入！");
                window.location.href = "Home.html";
            }
        });
    }
    function getApplyRequest() {
        let content = "";
        applyRequest.innerHTML = "";
        fetch(`../../Controller/Api/HistoryController.php?action=getApplyRequest&ID=${window.localStorage.getItem("ID")}`)
        .then(response => response.json())
        .then(datas => {
            if (datas.error !== undefined) {
                //console.log("啥都沒");
                return;
            }
            content += `<div class="requestBody">`;
            datas.forEach((data, index) => {
                content +=  `<div class="content">
                                <div class="title">
                                    <p>${data[0]} ${data[2]}<img src="../../image/dropdownIcon48.png" class="immediatelyFormImg" data-index="${index}"></p>
                                </div>
                                <div class="text" data-index="${index}">
                                    <p>借用日期: ${data[8]}</p>
                                    <p>歸還日期: ${data[9] == 0 ? '尚未借用':data[10] == null ? '未歸還' : data[10]}</p>
                                    <p>借用目的: ${data[5]}</p>
                                    <p>借用型態: ${data[6] === 1 ? '立即借用' : '預約借用'}</p>
                                    <div class="ApplyrequestText">
                                        <p>Start Time : </p>
                                        <p>End Time : </p>
                                        <p>第${data[3]}堂</p>
                                        <p>${data[4] === 9 ? "第9堂後" : `第${data[4]}堂`}</p>
                                        ${(data[7]!=0 && data[9]!=1)?`<button class="cancelButton" data-argument="${data[0]} ${data[1]} ${data[2]} ${data[3]} ${data[4]} ${data[7]}">取消請求</button>`:""}
                                        <span class=${data[7] == 1 ? 'approve' : data[7] == 0 ? 'reject' : 'accounting'}>
                                                    ${data[7] == 1 ? '通過' : data[7] == 0 ? '拒絕' : '審核中'}</span>
                                    </div>
                                </div>
                                <div id="myModal" class="modal">
                                    <div class="modal-content">
                                        <span class="close" id="closeModal">&times;</span>
                                        <p>確定取消？</p>
                                        <button id="confirmBtn">確認</button>
                                        <button id="cancelBtn">取消</button>
                                    </div>
                                </div>
                            </div>`;
            });
            content += `</div>`;
            applyRequest.innerHTML = content;
            document.querySelectorAll('.immediatelyFormImg').forEach(img => {
                img.addEventListener('click', () => {
                    const index = img.getAttribute('data-index');
                    let applyRequestContent = document.querySelector(`.text[data-index="${index}"]`);
                    applyRequestContent.classList.toggle("show");
                    img.classList.toggle("show");
                });
            });
            document.querySelectorAll(".cancelButton").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.target.parentElement.parentElement.nextElementSibling.style.display = 'block';
                    keyDoubleCheck(e.target);
                }, false);
            });
        });
    }
    document.getElementById("userInformation").addEventListener("submit", (e)=>{
        e.preventDefault();
        let testForm = new FormData(e.target);
        testForm.append("account", user.useraccount);
        testForm.append("action", "updateProfile");
        fetch("../../Controller/Api/UserController.php", {
            method: "POST",
            body: testForm
        })
        .then(response=>response.text())
        .then(data=>{
            window.alert(data);
            window.location.reload();
        });
    }, false);
    function clearAll() {
        applyRequest.classList.remove("show");
        userInformation.classList.remove("show");

    }
    function showEditstate() {
        userInformation.classList.add("show");
    }
    function showApplyRequest() {
        applyRequest.classList.add("show");
    }
    logoutButton.addEventListener("click", () => {
        fetch("../../Controller/Api/UserController.php?action=logout");
        window.location.href = "../../Pages/Home.html";
        window.localStorage.removeItem("ID");
    }, false);

    // 雙重按鈕確認取消
    function keyDoubleCheck(target) {
        let modal = target.parentElement.parentElement.nextElementSibling;
        let modalContent = modal.children[0];
        let span = modalContent.children[0];
        let confirmBtn = modalContent.children[2];
        let cancelBtn = modalContent.children[3];
    
        span.onclick = function () {
            modal.style.display = 'none';
        };
    
        confirmBtn.onclick = function () {
            // 在這裡放置確認按下後的處理邏輯
            let arg = target.getAttribute("data-argument").split(" ");
            modal.style.display = 'none';
            const testForm = new FormData();
            testForm.append("roomName", arg[0]);
            testForm.append("userID", arg[1]);
            testForm.append("date", arg[2]);
            testForm.append("startTime", arg[3]);
            testForm.append("action", "cancelHistory");
            fetch("../../Controller/Api/HistoryController.php", {
                method: 'POST',
                body: testForm
            })
            .then(response=>response.text())
            .then(data=>{
                getApplyRequest();
                if(arg[5] == 1) {
                    testForm.set("action", "applicationCancel");
                    testForm.append("times", arg[4]-arg[3]+1);
                    fetch("../../Controller/Api/ClassroomController.php", {
                        method: "POST",
                        body: testForm
                    })
                    .then(res=>res.text())
                    .then(dt=>{
                        console.log(dt);
                    })
                }
            });
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
})