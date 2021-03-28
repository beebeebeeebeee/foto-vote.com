document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#login").addEventListener("submit", (e) => {
    fetch("/api/user/login", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
      body: JSON.stringify({
        account: document.querySelector("#login_account").value,
        password: document.querySelector("#login_password").value,
      }),
    })
      .then((res) => {
        if (res.status == 200) {
            window.location.href = `./`;
        }
        return res.json();
      })
      .then((res) => {
        document.querySelector("#login_alert").innerHTML = res.body;
        document.querySelector("#login_alert").hidden = false;
      });
  });

  document.querySelector("#register").addEventListener("submit", (e) => {
    fetch("/api/user/register", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
      body: JSON.stringify({
        name: document.querySelector("#register_username").value,
        account: document.querySelector("#register_account").value,
        password: document.querySelector("#register_password").value,
      }),
    })
      .then((res) => {
        if (res.status == 200) {
            window.location.href = `./`;
        }
        return res.json();
      })
      .then((res) => {
        document.querySelector("#register_alert").innerHTML = res.body;
        document.querySelector("#register_alert").hidden = false;
      });
  });
});
