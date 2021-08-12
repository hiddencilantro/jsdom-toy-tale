let addToy = false;
const divCollect = document.querySelector('#toy-collection');

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', e => {
        e.preventDefault();
        postToyObject(e.target);
      });
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToyObjects();
});

function getToyObjects() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(json => {
    json.forEach(toy => {
      makeToy(toy);
    });
  })
}

function makeToy(toy) {
  let h2 = document.createElement('h2');
  h2.innerText = toy.name;

  let img = document.createElement('img');
  img.src = toy.image;
  img.setAttribute('class', 'toy-avatar');

  let p = document.createElement('p');
  p.innerText = `${toy.likes} likes`;

  let button = document.createElement('button');
  button.setAttribute('class', 'like-btn');
  button.setAttribute('id', toy.id);
  button.innerText = 'Like <3';
  button.addEventListener('click', e => addLike(e));

  let divCard = document.createElement('div');
  divCard.setAttribute('class', 'card');
  divCard.append(h2, img, p, button);
  divCollect.append(divCard);
}

function postToyObject(formData) {
  let dataObject = {
    "name": formData.name.value,
    "image": formData.image.value,
    "likes": 0
  }
  let configObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(dataObject)
  }
  fetch('http://localhost:3000/toys', configObj)
  .then(response => response.json())
  .then(json => makeToy(json))
}

function addLike(e) {
  e.preventDefault();
  let likeCount = parseInt(e.target.previousElementSibling.innerText) + 1;
  let configObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      "likes": likeCount
    })
  };
  fetch(`http://localhost:3000/toys/${e.target.id}`, configObj)
  .then(response => response.json())
  .then(json => {
    e.target.previousElementSibling.innerText = `${json.likes} likes`;
  })
}
