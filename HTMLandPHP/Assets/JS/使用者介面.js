document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("menuBtn1").addEventListener("click", ()=>{
        clearAll();
        showEditstate();
    });
    document.getElementById("menuBtn2").addEventListener("click", ()=>{
        clearAll();
        showApplyrequest();
    });
    document.getElementById("immediatelyFormImg1").addEventListener("click", ()=>{toggleContent('applyRequestContent1','immediatelyFormImg1')});
    document.getElementById("immediatelyFormImg2").addEventListener("click", ()=>{toggleContent('applyRequestContent2','immediatelyFormImg2')});
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
        fetch("../../Controller/Api/UserController.php?action=getUserProfile")
        .then(response => response.json())
        .then(data => {
            if (data.error === undefined) {
                user = data;
                logoName.innerHTML = user.username;
            }
            else {
                //沒有登入就回首頁
                window.alert("請先登入！");
                window.location.href = "Home.html";
            }
        });
    }

    function clearAll() {
        applyRequest.classList.remove("show");
        userInformation.classList.remove("show");

    }
    function showEditstate() {
        userInformation.classList.add("show");
    }

    function showApplyrequest() {
        applyRequest.classList.add("show");
    }

    function toggleContent(applyRequestContentId, applyRequestImageId) {
        let applyRequestContent = document.getElementById(applyRequestContentId);
        let applyRequestImage = document.getElementById(applyRequestImageId);
        applyRequestContent.classList.toggle("show");
        applyRequestImage.classList.toggle("show");
    }
    logoutButton.addEventListener("click", () => {
        fetch("../../Controller/Api/UserController.php?action=logout");
        window.location.href = "../../Pages/Home.html";
    }, false);

})