hash = window.location.pathname.replace(/\//g, "");
console.log(hash);
vote_result = [];

document.addEventListener("DOMContentLoaded", async () => {
  res = await fetch(`/api/data/${hash}`);
  try {
    data = await res.json();
  } catch (e) {
    window.location = "/";
  }

  document.querySelector("#title").innerHTML = data.title;
  document.querySelector("#name").innerHTML = data.name;

  temp1 = "";
  data.images.forEach((element, index) => {
    vote_result.push({ element: element, vote: null, comment: null });
    temp1 += `
        <div class="card" style="margin-bottom: 10px">
            <h5 class="card-header" style="font-size: 10px;">${element.slice(
              element.indexOf("-") + 1
            )}</h5>
            <img src="./images/${element}" style="width: 100%"></img>
            <div class="card-body" style="padding: 0.5rem;">
                <button onclick="_click(this.id)" id="${index}_like" class="btn btn-success" style="width: 24%">LIKE</button>
                <button onclick="_click(this.id)" id="${index}_ok" class="btn btn-primary" style="width: 24%">OKAY</button>
                <button onclick="_click(this.id)" id="${index}_dislike" class="btn btn-warning" style="width: 24%">DISLIKE</button>
                <button onclick="_click(this.id)" id="${index}_shit" class="btn btn-danger" style="width: 24%">SHIT</button>
                <div class="input-group mb-3" style="margin-top: 7px; margin-bottom: 0px! important;">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon3">comment</span>
                    </div>
                    <input onkeyup="_comment(this.id, this.value)" id="${index}_comment" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
                </div>
            </div>
        </div>
        `;
  });
  document.querySelector("#posts").innerHTML = temp1;
});

function _click(id) {
  [index, action] = id.split("_");
  _clear_click(index);
  document.getElementById(`${id}`).disabled = true;
  vote_result[index].vote = action;
  if (
    vote_result.every((e) => {
      return e.vote != null;
    })
  ) {
    document.querySelector(`#submit`).hidden = false;
  }
  console.log(vote_result);
}

function _comment(id, value) {
  [index, action] = id.split("_");
  vote_result[index].comment = value;
  console.log(vote_result);
}

function _clear_click(id) {
  document.getElementById(`${id}_like`).disabled = false;
  document.getElementById(`${id}_ok`).disabled = false;
  document.getElementById(`${id}_dislike`).disabled = false;
  document.getElementById(`${id}_shit`).disabled = false;
}

function _submit_vote() {
  fetch(`/api/vote/${hash}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vote_result),
  }).then(res=>{window.location = "./result.html"});
}
