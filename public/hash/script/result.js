hash = window.location.pathname.split("/")[1];
console.log(hash);
vote_result = [];

document.addEventListener("DOMContentLoaded", async () => {
  res = await fetch(`/api/vote/result/${hash}`);
  try {
    data = await res.json();
  } catch (e) {
    window.location = "/";
  }
  console.log(data);

  document.querySelector("#title").innerHTML = data.title;
  document.querySelector("#name").innerHTML = data.name;

  temp1 = "";
  full_mark = 0;
  data.data.forEach((element, index) => {
    index == 0 ? (full_mark = element.marks) : null;
    comment = "";
    element.comment.forEach(el=>{
        comment+=`
                <div class="card" style="margin-top: 10px;">
                    <div class="card-body" style="padding: 2px 10px">
                        ${el}
                    </div>
                </div>
                `
    })
    temp1 += `
        <div class="card" style="margin-bottom: 10px">
            <h5 class="card-header" style="font-size: 10px;">${element.element.slice(
              element.element.indexOf("-") + 1
            )}
            <span class="badge badge-primary float-right" style="padding: 2px 6px; font-size: 10px;">${element.marks} pt</span>
            </h5>
            
            <img src="./images/${element.element}" style="width: 100%"></img>
            <div class="card-body" style="padding: 0.5rem;">
                <div class="progress" style="height: 20px; width: 100%; margin-top: 5px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: ${Math.round(element.vote_ab.like/element.length*100)}%" aria-valuenow="${Math.round(element.vote_ab.like/element.length*100)}" aria-valuemin="0" aria-valuemax="100">${element.vote_ab.like} LIKE</div>
                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${Math.round(element.vote_ab.ok/element.length*100)}%" aria-valuenow="${Math.round(element.vote_ab.ok/element.length*100)}" aria-valuemin="0" aria-valuemax="100">${element.vote_ab.ok} OKAY</div>
                    <div class="progress-bar bg-warning" role="progressbar" style="width: ${Math.round(element.vote_ab.dislike/element.length*100)}%" aria-valuenow="${Math.round(element.vote_ab.dislike/element.length*100)}" aria-valuemin="0" aria-valuemax="100">${element.vote_ab.dislike}  DISLIKE</div>
                    <div class="progress-bar bg-danger" role="progressbar" style="width: ${Math.round(element.vote_ab.shit/element.length*100)}%" aria-valuenow="${Math.round(element.vote_ab.shit/element.length*100)}" aria-valuemin="0" aria-valuemax="100">${element.vote_ab.shit} SHIT</div>
                </div>
                ${comment}
            </div>
        </div>
        `;
  });
  if(data.data.length==0){
    temp1 = "it seem no one vote this yet.<br>go invite more people to help you vote!"
  }
  document.querySelector("#posts").innerHTML = temp1;
});
