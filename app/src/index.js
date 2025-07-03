function openDialog1() {
  const dialog1 = document.querySelector(".example-action");
  const closeButton1 = dialog1.querySelector("mdui-button");

  dialog1.open = true;
  closeButton1.addEventListener("click", () => (dialog1.open = false));
}

function openErrorDialog() {
  const errorSnackbar = document.querySelector(".errorSnackbar");

  errorSnackbar.open = true;
}

function openBlockDialog() {
  const blockDialog = document.querySelector(".block-dialog");
  const closeButton2 = blockDialog.querySelector(".close-block-dialog");

  blockDialog.open = true;
  closeButton2.addEventListener("click", () => (blockDialog.open = false));
}

// 显示设置已保存反馈
function showSettingsSavedSnackbar() {
  const settingSnackbar = document.querySelector(".settingsSnackbar");

  // 如果当前 SnackBar 正在显示，先关闭它
  if (settingSnackbar.open) {
    settingSnackbar.open = false;
  }

  // 显示新的 SnackBar
  settingSnackbar.open = true;
}

function navigate(pageId) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  document.getElementById(pageId).style.display = "block";

  // 取消 active 属性
  var navigationItems = document.querySelectorAll("mdui-navigation-rail-item");
  for (var i = 0; i < navigationItems.length; i++) {
    navigationItems[i].removeAttribute("active");
  }

  // 设置当前页面的 active 属性
  if (pageId === "mainPage") {
    document.getElementById("toMain").setAttribute("active", "");
  } else if (pageId === "historyPage") {
    document.getElementById("toHistory").setAttribute("active", "");
  }
}

// 修改 mdui-button-icon#toSettings 的 onclick 事件以调用 navigate 函数
document.getElementById("toSettings").onclick = function () {
  navigate("settingPage");

  // 取消其他导航栏项的 active 属性
  document.getElementById("toMain").removeAttribute("active");
  document.getElementById("toHistory").removeAttribute("active");
};

function showTime() {
  var date = new Date();

  var month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = date.getDate();
  day = day < 10 ? "0" + day : day;
  var hour = date.getHours();
  hour = hour < 10 ? "0" + hour : hour; // 用三目运算符调整数字显示格式
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;

  var current = month + "-" + day + "&nbsp;&nbsp;" + hour + ":" + minute;

  document.getElementById("time").innerHTML = current;
}

const textField = document.getElementById("excludeNums");
const addButton = document.querySelector(".add-button"); // 确保引用正确
const msgList = document.querySelector(".msgList");
const unreadCount = document.getElementById("unreadCount");
const fontSizeSlider = document.querySelectorAll(".msgFontSize"); // 重命名变量以避免冲突
const showList = document.getElementById("showList"); // 获取展示列表的引用
const overviewList = document.querySelector(".overviewList"); // 获取概览列表的引用

let messageInterval; // 定义一个变量来存储定时器

function displayMessages() {
  const msgCards = document.querySelectorAll("mdui-card.msgCard");
  const scrollTime = parseInt(document.getElementById("msgScrollTime").value) * 1000; // 获取展示时间并转换为毫秒

  let currentIndex = 0;

  if (messageInterval) {
    clearInterval(messageInterval); // 清除现有的定时器
  }

  function showNextMessage() {
    if (currentIndex < msgCards.length) {
      const messageText = msgCards[currentIndex].querySelector("mdui-card-content").textContent;
      showList.textContent = messageText;
      currentIndex++;
    } else {
      currentIndex = 0; // 重新开始
    }
  }

  // 初始显示第一条消息
  showNextMessage();

  // 设置新的定时器
  messageInterval = setInterval(showNextMessage, scrollTime);
}

addButton.addEventListener("click", function () {
  const inputValue = textField.value;

  if (inputValue.trim() !== "") {
    const newCard = document.createElement("mdui-card");
    newCard.className = "msgCard";
    newCard.style.marginBottom = "0.5rem";
    newCard.style.width = "100%";
    newCard.style.padding = "1rem";
    newCard.clickable = true;

    const cardContent = document.createElement("mdui-card-content");
    cardContent.style.whiteSpace = "pre-wrap"; // 保留空白符并允许自动换行
    cardContent.style.overflowWrap = "break-word"; // 确保长单词可以换行

    const textNode = document.createTextNode(inputValue);

    cardContent.appendChild(textNode);

    newCard.appendChild(cardContent);
    msgList.appendChild(newCard);

    const overviewCard = document.createElement("mdui-list-item");
    overviewCard.rounded = true;
    overviewCard.description = inputValue;
    overviewCard.style.margin = "0.1rem";

    overviewList.appendChild(overviewCard);

    const cardCount = msgList.querySelectorAll("mdui-card").length;
    unreadCount.textContent = cardCount;

    textField.value = '';

    // 调用显示消息的函数
    displayMessages();
  }
});

fontSizeSlider.forEach((slider) => {
  slider.addEventListener("input", function () { // 使用 'input' 事件以实现实时更新
    let fontSizeValue = slider.value + "rem"; 

    const msgCards = document.querySelectorAll("mdui-card.msgCard");
    const viewCard = document.querySelector("mdui-card.viewCard");
    const showList = document.querySelector("div.showList");

    msgCards.forEach((card) => {
      card.style.fontSize = fontSizeValue;
    });
    if (viewCard) {
      viewCard.style.fontSize = fontSizeValue;
    }
    if (showList) {
      showList.style.fontSize = fontSizeValue;
    }
  });
});

// 初始化显示消息
window.onload = function () {
  // showTime();
  setInterval(showTime, 1000);
  displayMessages(); // 初始化显示消息
};
