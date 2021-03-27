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
      res.forEach((el)=>{
        temp1+=`
        <tr>
          <th scope="row"><a href="./${el.id}">${el.id}</a></th>
          <td>${el.name}</td>
          <td>${el.title}</td>
        </tr>
        `
      })
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
        document.querySelector("#form").hidden = true;
        document.querySelector("#result").hidden = false;
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

function _show_display_form() {
  document.querySelector("#_display_form").hidden = false;
  document.querySelector("#_display_main").hidden = true;
}

function clearFileInput(ctrl) {
  try {
    ctrl.value = null;
  } catch (ex) {}
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}
