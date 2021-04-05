document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#ren_url").addEventListener("click", (e) => {
    e.currentTarget.select();
    document.execCommand("copy");
    document.querySelector("#copied").hidden = false;
  });

  fetch("/api/vote/all")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      temp1 = "";
      console.log(res);
      res.forEach((el) => {
        temp1 += `
        <div class="card" style="margin: 5px 0;">
        <div class="card-body row" style="padding: 5px 14px;">
                <div class="col hash">${_get_date_diff_str(el.timestamp)}</div>
                <div class="col text-center"><a href="./${el.id}">${
          el.title
        }</a></div>
                <div class="col text-right" onclick="_show_user('${
                  el.user_id
                }')"><a href="#">${el.name}</a></div>
        </div>
        </div>
        `;
      });
      document.querySelector("#_recent_vote").innerHTML = temp1;
    });

  $("#form").submit(function (e) {
    e.preventDefault();

    document.querySelector("#submit_button").disabled = true;
    document.querySelector("#submit_button").innerHTML = "Uploading ...";

    var fd = new FormData($(this)[0]);
    $.ajax({
      url: $("#form").attr("action"),
      type: "POST",
      data: fd,
      processData: false,
      contentType: false,
      success: function (res) {
        _show_result();
        document.querySelector(
          "#ren_url"
        ).value = `${window.location.href}${res.hash}`;
        //document.querySelector("#ren_url").click();
      },
    });
    return false;
  });
});

// function _on_select(e) {
//   if (e.files.length > 20) {
//     clearFileInput(e);
//     document.querySelector("#file_warn").hidden = false;
//   } else {
//     document.querySelector("#file_warn").hidden = true;
//   }
// }

function _show_user(id) {
  _hide_display_all();
  document.querySelector("#_display_user").hidden = false;
  _focus_user(id ? id : getCookie("id"), id == getCookie("id") || id == null);
}

function _focus_user(name, owner) {
  console.log(owner);
  console.log(name);
  fetch("/api/vote/" + name)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      document.querySelector("#_display_user_user_name").innerHTML =
        res.user_name;
      temp1 = "";
      res.data.forEach((el) => {
        temp1 += `
        <div class="card" style="margin: 5px 0;">
        <div class="card-body row" style="padding: 5px 14px;">
                <div class="col hash"><a href="./${el.id}">${el.id}</a></div>
                <div class="col text-center"><a href="./${el.id}">${el.title}</a></div>
                <div class="col text-right">${el.name}</div>
        </div>
        </div>
        `;
      });
      document.querySelector("#_display_user_recent_vote").innerHTML = temp1;
    });
}

function _show_result() {
  _hide_display_all();
  document.querySelector("#result").hidden = false;
}

function _show_display_form() {
  _hide_display_all();
  document.querySelector("#_display_form").hidden = false;
}

function _hide_display_all() {
  document.querySelector("#_display_main").hidden = true;
  document.querySelector("#_display_user").hidden = true;
  document.querySelector("#_display_form").hidden = true;
  document.querySelector("#result").hidden = true;
}

function clearFileInput(ctrl) {
  try {
    ctrl.value = null;
  } catch (ex) {}
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}

function _get_date_diff_str(timestamp) {
  if (!timestamp) return "-";
  diff = (new Date() - new Date(timestamp)) / 1000 / 60 / 60;
  if (diff < 1) {
    temp1 = Math.floor((diff - Math.floor(diff)) * 60);
    if (temp1 == 0) return "now";
    return temp1 + "m";
  } else if (diff < 24) {
    return (
      Math.floor(diff) + "h " + Math.floor((diff - Math.floor(diff)) * 60) + "m"
    );
  } else {
    return (
      Math.floor(diff / 24) +
      "d " +
      Math.floor(diff % 24) +
      "h " +
      Math.floor((diff - Math.floor(diff)) * 60) +
      "m"
    );
  }
}
