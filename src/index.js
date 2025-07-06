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