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
  await asyncForEach(data.images, async (element, index) => {
    vote_result.push({ element: element, vote: null, comment: null });
    img_direction = `<img src='./images/${element}' style="width: 100%;">`;
    const dimensions = await imageDimensions(`./images/${element}`);
    if (dimensions.height > dimensions.width) {
      img_direction = `<div class="vote-img" style="background-image: url('./images/${element}');"></div>`;
    }
    console.log(img_direction);
    temp1 += `
        <div class="card" style="margin-bottom: 10px">
            <h5 class="card-header" style="font-size: 10px;">${element.slice(
              element.indexOf("-") + 1
            )}</h5>
            ${img_direction}
            <div class="card-body" style="padding: 0.5rem;">
                <div class="d-flex justify-content-center">
                  <button onclick="_click(this.id)" id="${index}_like" class="btn btn-success vote-btn">LIKE</button>
                  <button onclick="_click(this.id)" id="${index}_ok" class="btn btn-primary vote-btn">OKAY</button>
                  <button onclick="_click(this.id)" id="${index}_dislike" class="btn btn-warning vote-btn">DISLIKE</button>
                  <button onclick="_click(this.id)" id="${index}_shit" class="btn btn-danger vote-btn">SHIT</button>
                </div>
                <div class="input-group mb-3" style="margin-top: 7px; margin-bottom: 0px! important;">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon3">comment</span>
                    </div>
                    <input id="${index}_comment" type="text" class="form-control" placeholder="optional" aria-describedby="basic-addon3">
                </div>
            </div>
        </div>
        `;
  });
  document.querySelector("#posts").innerHTML = temp1;
  document.querySelector(`#count_left`).innerHTML = `${
    vote_result.filter((e) => {
      return e.vote != null;
    }).length
  }/${vote_result.length}`;
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
    document.querySelector(`#not_submit`).hidden = true;
  }
  console.log(vote_result);

  document.querySelector(`#count_left`).innerHTML = `${
    vote_result.filter((e) => {
      return e.vote != null;
    }).length
  }/${vote_result.length}`;
}

function _clear_click(id) {
  document.getElementById(`${id}_like`).disabled = false;
  document.getElementById(`${id}_ok`).disabled = false;
  document.getElementById(`${id}_dislike`).disabled = false;
  document.getElementById(`${id}_shit`).disabled = false;
}

async function _submit_vote() {
  await asyncForEach(vote_result, (el, i) => {
    vote_result[i].comment =
      document.getElementById(`${i}_comment`).value != ""
        ? document.getElementById(`${i}_comment`).value
        : null;
  });
  fetch(`/api/vote/${hash}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vote_result),
  }).then((res) => {
    window.location = "./result.html";
  });
}

// helper to get dimensions of an image
const imageDimensions = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();

    // the following handler will fire after the successful loading of the image
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve({ width, height });
    };

    // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
    img.onerror = () => {
      reject("There was some problem with the image.");
    };

    img.src = file;
  });

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
