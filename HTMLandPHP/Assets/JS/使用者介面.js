document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("menuBtn1").addEventListener("click", ()=>{
        clearAll();
        showEditstate();
    });
    document.getElementById("menuBtn2").addEventListener("click", ()=>{
        clearAll();
        showApplyrequest();
    });
    document.getElementById("immediatelyFormImg1").addEventListener("click", ()=>{toggleContent('ApplyrequestConntent1','immediatelyFormImg1')});
    document.getElementById("immediatelyFormImg2").addEventListener("click", ()=>{toggleContent('ApplyrequestConntent2','immediatelyFormImg2')});
    let userInformation = document.getElementById("userInformation");
    let Applyrequest = document.getElementById("Applyrequest");
    const logoutButton = document.getElementById("logoutBtn");
    const logoName = document.querySelector(".logo_name");

    //獲取使用者身分
    let user = {
        username: "",
        useraccount: "",
        email: "",
        phone: null
    };
    let testForm = new FormData();
    testForm.append("action", "getUserProfile");
    fetch("../../Controller/Api/UserController.php", {
        method: 'POST',
        body: testForm
    })
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

    function clearAll() {
        Applyrequest.classList.remove("show");
        userInformation.classList.remove("show");

    }
    function showEditstate() {
        userInformation.classList.add("show");
    }

    function showApplyrequest() {
        Applyrequest.classList.add("show");
    }

    function toggleContent(ApplyrequestConntentId, ApplyrequestImageId) {
        let ApplyrequestConntent = document.getElementById(ApplyrequestConntentId);
        let ApplyrequestImage = document.getElementById(ApplyrequestImageId);
        ApplyrequestConntent.classList.toggle("show");
        ApplyrequestImage.classList.toggle("show");
    }
    // function openImmediatelyFormContent1() {
    //     ApplyrequestConntent1.classList.toggle("show");
    // }
    // function openImmediatelyFormContent2() {
    //     ApplyrequestConntent2.classList.toggle("show");
    // }
    logoutButton.addEventListener("click", () => {
        let myForm = new FormData();
        myForm.append("action", "logout");
        fetch("../../Controller/Api/UserController.php", {
            method: 'POST',
            body: myForm
        });
        window.location.href = "../../Pages/Home.html";
    }, false);

})