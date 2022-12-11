const API = "http://localhost:8001/products";

let inp = document.querySelector('#inp')
let inp1 = document.querySelector('#inp1')
let btn = document.querySelector('#btn')
let loginModal = document.querySelector(".login-modal")
let modalX = document.querySelector("#modal-close")
let loginClose = document.querySelector('.container')
let pageOpen = document.querySelector('.container1')
let postBtn = document.querySelector("#btnAdd")
let pagin = document.querySelector('.pagin')
// ? функция search
let inpSearch = document.querySelector('#btn-search')
let searchVal = "";

//? функция пагинация
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");


let list = document.querySelector("#product-list");
console.log(list);




btn.addEventListener('click', function () {
  let obj = {
    userName: inp.value,
    password: inp1.value,
  }
  if (!obj.userName.trim() ||
    !obj.password.trim()
  ) {
    loginModal.style.display = 'block'
    obj.userName.value = "";
    obj.password.value = "";
  }


  if (obj.userName.trim() &&
    obj.password.trim()
  ) {
    loginClose.style.display = 'none'
    pageOpen.style.display = 'block'
    pagin.style.display = 'block'
  }
})

modalX.addEventListener('click', () => {
  loginModal.style.display = 'none'
})


// ? логика добавления 
let btnAdd = document.querySelector('.btnAddpost')
let modalAdd = document.querySelector('#modal-add')
let modalAddBtn = document.querySelector('#btn-save-add')
let inpName = document.querySelector('#inp-name')
let inpText = document.querySelector('#inp-text')
let img = document.querySelector('#inp-Urlimage')
let modalCloseBtn = document.querySelector('#modal-add-close')
btnAdd.addEventListener('click', async function () {
  modalAdd.style.display = 'block';
})
modalCloseBtn.addEventListener('click', () => {
  modalAdd.style.display = 'none';
})

modalAddBtn.addEventListener("click", function (e) {
  modalAdd.style.display ='none'
  let obj = {
    inpName: inpName.value,
    inpText: inpText.value,
    img: img.value,
  };
  if (!obj.img.trim()) {
    alert("Нет картинки");
    // loginModal.style.display = 'block'
    return;
  }
  inpName.value = "";
  inpText.value = "";
  img.value = "";

 
  createPost(obj);
});

async function createPost(obj) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  render();
}
render();

async function render() {
  let profile = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=2`)
  .then((res) => res.json())
  .catch((err) => console.log(err));
  drawPaginationButtons()
  list.innerHTML = "";

  profile.forEach((data) => {
    let newElem = document.createElement("div");
    let cardAdd = document.querySelector('.wrap')
    modalAddBtn.addEventListener('click', () => {
      cardAdd.style.display = 'block';
    })
    newElem.innerHTML = `
    <style>
    *{
      background-color: #fff;
    }
    .wrap{
      width: 45%;
      margin: 0 auto;
      display:block;
      margin-bottom: 2%;
    }
    .header__menu{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo{
      width: 40px;
      height: 40px;
      border-radius: 40px;
    }
    .header__logo-title {
      font-size: 20px;
      font-weight: 300;
    }
    .btn-edit{
      background-color: #fff;
      border: none;
    }
    .btn-edit-btn{
      width: 40px;
      height: 40px;
    }
    .intro__card{
      width: 100%;
      height: 100%;
    }
    .intro__image{
      width: 100%;
      height: 450px;
    }
    .footer__menu-menu{
      display:flex;
    }
    .footer__menu{
      display:flex;
      justify-content:space-between;
    }
    .footer__icons{
      margin-top: 20px;
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .icon {
      width: 36px;
      height: 40px;
    }
    .icon2{
      width: 48px;
      height: 44px;
    }
    .footer-desc{
      font-size: 18px;
      font-weight: 300;
    }
    .btn-delete{
      margin-top: 20px;
      border-radius: 18px;
      padding: 10px 20px;
      transition:0.4s
    }
    .btn-delete:hover{
      background-color: black;
      color:white;
      transition:0.4s;
    }
  </style>
    <div class="wrap">
    <div class="headerapp">
      <div class="header__menu">
        <img src="${data.img}" alt="" class="header-logo">
        <h4 class="header__logo-title">${data.inpName}</h4>
        <button class="btn-edit"> 
          <img src="./img/iconspoints.png" alt=""  id=${data.id} class="btn-edit-btn">
        </button>
      </div> <hr style="margin:20px 0;"> 
      <div class="intro__card">
        <img src="${data.img}" alt="" class="intro__image"> <br>
      </div>
      <footer class="footer">
        <div class="footer__menu">
          <div class="footer__menu-menu">
            <img src="./img/like-logo.png" alt="" class="footer__icons">
            <img src="./img/message-logo.png" alt="" class="footer__icons icon">
            <img src="./img/otravit.png" alt="" class="footer__icons icon2">
          </div>
          <img src="./img/save.png" alt="" class="footer__icons ">
        </div>
        <p class="footer-desc">
          ${data.inpText}
        </p>
        <button class="btn-delete" id = ${data.id}> Удалить пост </button>
      </footer>
    </div>
  </div>
`;
    list.append(newElem);
  });
}
//! функция удаления
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then(() => {
      list.innerHTML = "";
      render();
    });
  }
});

//? функция редактирование

let editName = document.querySelector('#inp-edit-name')
let editText = document.querySelector('#inp-edit-text')
let editImage = document.querySelector('#inp-edit-Urlimage')
let modalEdit = document.querySelector('#modal-edit')
let editSaveBtn = document.querySelector('.btn-save-edit')

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-edit-btn')) {
    modalEdit.style.display = 'block';
    let modalEditclose = document.querySelector('#modal-edit-close')
    modalEditclose.addEventListener('click' , () => {
      modalEdit.style.display = 'none';
    })
    let id = e.target.id
    fetch(`${API}/${id}`).then((res) => res.json())
      .then((data) => {
        editName.value = data.inpName;
        editText.value = data.inpText;
        editImage.value = data.img;
        editSaveBtn.setAttribute('id', data.id)
      })
  }
})
editSaveBtn.addEventListener('click', function () {
  let id = this.id;
  let inpName = editName.value;
  let inpText = editText.value;
  let img = editImage.value;
  if (!inpName || !inpText || !img) return;


  let editedProduct = {
    inpName: inpName,
    inpText: inpText,
    img: img,
  };
  saveEdit(editedProduct, id);
  modalEdit.style.display = 'none'
});
async function saveEdit(editedProduct, id) {
  await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(editedProduct),
  });
  render();
}




inpSearch.addEventListener("input", () => { 
  if (inpSearch.value.trim() === "") {
    searchVal = inpSearch.value;
    render();
    return;
  }
});



async function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
  .then((res) => res.json())
  .then((data) => {
    pageTotalCount = Math.ceil(data.length / 2);
  });
  paginationList.innerHTML = "";
  
  for (let i = 1; i <= pageTotalCount; i++) {
    if (currentPage == i) {
      let page1 = document.createElement("li");
      page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
      paginationList.append(page1);
    } else {
      let page1 = document.createElement("li");
      page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
      paginationList.append(page1);
    }
  }
}

if (currentPage == 1) {
  prev.classList.toggle("disabled");
}

if (currentPage == pageTotalCount) {
  next.classList.toggle("disabled");
}


prev.addEventListener('click', () => {
  if(currentPage <=1){
    return
  }
  currentPage--
  render()
})

next.addEventListener('click', () => {
  
  if(currentPage >= pageTotalCount){
    return
  }
  currentPage++
  render()
})

document.addEventListener('click', function(e){
  if (e.target.classList.contains('page_number')){
    currentPage = e.target.innerText
    render()
  }
})

//? end