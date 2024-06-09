const TITLE = "Welcome to our ToDo App!!!";

function isEmpty(value) {
  if (value === null || value === undefined || value === "") {
    return true;
  } else {
    return false;
  }
}

async function signUpBtnClicked() {
  let nameInputEl = document.getElementById("user-name-input");
  let pswdInputEl = document.getElementById("password-input");

  let userInfo = {
    userName: nameInputEl.value,
    password: pswdInputEl.value,
  };

  if (isEmpty(userInfo.userName) || isEmpty(userInfo.password)) {
    alert("please enter your info!");
    return;
  }

  const response = await fetch("http://localhost:3000/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  const result = await response.json();

  setTimeout(displayApp, 500);

  let loginBtn = document.querySelector("#login-btn");

  loginBtn.innerText = "Logging In...";
}

async function loginBtnClicked() {
  let nameInputEl = document.getElementById("user-name-input");
  let pswdInputEl = document.getElementById("password-input");

  let userInfo = {
    userName: nameInputEl.value,
    password: pswdInputEl.value,
  };

  if (isEmpty(userInfo.userName) || isEmpty(userInfo.password)) {
    alert("please enter your info!");
    return;
  }

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  const result = await response.json();
  console.log(result);
  if (result.ok === false) {
    alert("Username or Password is not correct");
    nameInputEl.value = "";
    pswdInputEl.value = "";
    return;
  }

  setTimeout(displayApp, 500);

  let loginBtn = document.querySelector("#login-btn");

  loginBtn.innerText = "Logging In...";
}

function displayApp() {
  let container = document.querySelector(".todo-container");
  container.style.display = "block";

  let welcomeCtr = document.querySelector(".login");
  welcomeCtr.style.display = "none";

  displayTitle();
  displayTasks();
}

function displayTitleTillIndex(index) {
  let subTitle = TITLE.substring(0, index + 1);
  let h1El = document.querySelector("#app-title");
  if (index < TITLE.length - 1) subTitle += "_";
  h1El.innerText = subTitle;
}

function displayTitle() {
  for (let i = 0; i < TITLE.length; i++) {
    setTimeout(function () {
      displayTitleTillIndex(i);
    }, i * 100);
  }
}
