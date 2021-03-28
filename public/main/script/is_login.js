fetch("/api/user/login", {
  method: "POST", // or 'PUT'
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  withCredentials: true,
}).then((res) => {
  console.log(res);
  if (res.status == 400) window.location.href = `./login.html`;
});

function logout() {
  fetch("/api/user/logout", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    withCredentials: true,
  }).then((res) => {
    if (res.status == 200) window.location.href = `./login.html`;
  });
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#user_name").innerHTML = getCookie("name");
  document.querySelector("#submit_name").value = getCookie("name");
  document.querySelector("#submit_id").value = getCookie("id");

});
