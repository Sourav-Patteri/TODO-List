// JavaScript Document
let TODOItems = [];
let completedItems = [];
const FORM = document.getElementsByTagName('form');
let btn = document.getElementById('btn');
let item = document.getElementById('item');
let listDiv = document.getElementById('list-container');
let cross = document.getElementsByClassName("delete");
let listItems = document.querySelectorAll('li');
let completedList = document.getElementById('complete-container');

btn.addEventListener('click', addtodo);
FORM[0].addEventListener('submit', function(event){
  event.preventDefault();
});
item.addEventListener('keydown', addlistAfterKeyDown);

function addlistAfterKeyDown(event){
  if(item.value.length > 0 && event.keyCode === 13){
    addtodo();
  }
}

for (let i = 0; i < listItems.length; i++) {
  listItems[i].addEventListener('click', checkOrUncheck);
  listItems[i].previousElementSibling.addEventListener('change', function() {
    listItems[i].click();
  });

}

  delItem();  

function addtodo(){
  if (item.value.length > 0) {
    let li = document.createElement('li');
    let div = document.createElement('div');
    let checkbox = document.createElement('input');
    let delbtn = document.createElement('button');
    delbtn.append("X");
    setAttributes(checkbox, {"type": "checkbox", "class": "check"})
    setAttributes(delbtn,{"class": "delete"});
    div.setAttribute("class", "item-container");
    li.append(item.value.trim());
    div.append(checkbox, li, delbtn);
    listDiv.append(div);
    item.value = "";

    TODOItems.push(div);

    li.previousElementSibling.addEventListener('change', function() {
      li.click();
    });
    li.addEventListener("click", checkOrUncheck);
    //END STRIKETHROUGH
    delItem();   
  }
}


function delItem(){
  for(i = 0; i < cross.length; i++){
    cross[i].onclick = function(){
        let itemDiv = this.parentElement;
        itemDiv.style.display = 'none';
    }
  }
}  

function checkOrUncheck(e){
  if (e.target.parentElement.classList.contains('completed')) {  
  e.target.previousElementSibling.checked = false;
  listDiv.append(e.target.parentElement);
  setAttributes(e.target.parentElement, {'class': 'item-container'});
} else {
  e.target.style.display = 'none';
  completedList.append(e.target.parentElement);
  e.target.style.display = 'block';
  e.target.previousElementSibling.checked = true;
  setAttributes(e.target.parentElement, {'class': 'item-container completed'});
  }
}

//helper function to set multiple attributes at once
function setAttributes(element, attributes) {
  for(var key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}
