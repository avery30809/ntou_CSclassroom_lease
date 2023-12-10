// 用按鈕選擇條件清單
let immediatelyButton = document.querySelector(".immediately");
let reserveButton = document.querySelector(".reserve");

// 定義在全局範圍的變數
let selectedDate;
let today;
let isToday;

// 獲取查詢的日期值
fetch("搜尋日期.php", { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        document.getElementById("selectedDatePlaceholder").textContent = data.date;

        // 將日期轉換為 JavaScript Date 物件
        selectedDate = new Date(data.date);

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

function CheckImmediatelyForm() {
    // 檢查立即借用按鈕是否被禁用
    if (selectedDate.getTime() != today.getTime()) {
        alert("非借用當日無法立即借用，請選擇預約借用！");
        return;
    }
}

function CheckReserveForm() {
    // 檢查預約借用按鈕是否被禁用
    if (selectedDate.getTime() === today.getTime()) {
        alert("借用當日請選擇立即借用！");
        return;
    }
}
//////////////////////////////////////////////////////////////////////////////////////////
//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成//待完成
function SendOut() {
    //如果是今天，傳送到管理員的立即借用
    if (isToday);

    //如果不是今天，傳送到管理員的預約借用
    else;

}


function Cancel() {
    window.location.href = "index.html";
}