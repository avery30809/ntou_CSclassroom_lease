document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("menuBtn1").addEventListener("click", ()=>{
        clearAll();
        showEditstate();
    });
    document.getElementById("menuBtn2").addEventListener("click", ()=>{
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
        fetch("../Controller/Api/UserController.php?action=getUserProfile")
        .then(response => response.json())
        .then(data => {
            if (data.error === undefined) {
                user = data;
                logoName.innerHTML = user.username;
                document.getElementById("infoName").value = user.username;
                document.getElementById("userAccount").innerHTML = user.useraccount;
                if(user.phone !== null) document.getElementById("infoPhone").value = user.phone;
            }
            else {
                //沒有登入就回首頁
                window.alert("請先登入！");
                window.location.href = "Home.html";
            }
        });
    }
    getApplyRequest();
    function getApplyRequest() {
        fetch("../Controller/Api/HistoryController.php?action=getApplyRequest")
        .then(response => response.json())
        .then(datas => {
            datas.forEach((data, index) => {
                applyRequest.innerHTML +=  `<div class="content">
                                                <div class="title">
                                                    <p>${data[0]}<img src="../image/dropdownIcon48.png" class="immediatelyFormImg" data-index="${index}"></p>
                                                </div>
                                                <div class="text" data-index="${index}">
                                                    <p>借用日期: ${data[8]}</p>
                                                    <p>歸還日期: ${data[9] === null ? '未歸還' : data[9]}</p>
                                                    <p>借用目的: ${data[5]}</p>
                                                    <p>借用型態: ${data[6] === 1 ? '立即借用' : '預約借用'}</p>
                                                    <div class="ApplyrequestText">
                                                        <p>Start Time : </p>
                                                        <p>End Time : </p>
                                                        <p>第${data[3]}堂</p>
                                                        <p>${data[4] === 9 ? "第9堂後" : `第${data[4]}堂`}</p>
                                                        <button class=${data[7] === 1 ? 'OK' : 'accounting'}> ${data[7] === 1 ? '通過' : '審核中'}</button>
                                                    </div>
                                                </div>
                                            </div>`;
            });
            document.querySelectorAll('.immediatelyFormImg').forEach(img => {
                img.addEventListener('click', () => {
                    const index = img.getAttribute('data-index');
                    let applyRequestContent = document.querySelector(`.text[data-index="${index}"]`);
                    applyRequestContent.classList.toggle("show");
                    img.classList.toggle("show");
                });
            });
        });
    }
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
        fetch("../Controller/Api/UserController.php?action=logout");
        window.location.href = "../Pages/Home.html";
    }, false);
})