// JavaScript Document
let TODOItems = window.localStorage.getItem("pendingTasks") == null ? [] : window.localStorage.getItem("pendingTasks").split("||"); // array with all pending list items
let CompletedItems = window.localStorage.getItem("completedTasks") == null ? [] : window.localStorage.getItem("completedTasks").split("||"); // array with all completed list items
const FORM = document.getElementsByTagName('form');
let btn = document.getElementById('btn');
let item = document.getElementById('item');
let listDiv = document.getElementById('list-container');
let cross = document.getElementsByClassName("delete");
let listItems = document.querySelectorAll('li'); //storing li reference in listItems
let completedList = document.getElementById('complete-container');
let tweetbtns = document.getElementsByClassName('tweet');

let cb = new Codebird();
cb.setConsumerKey("n4Uytauvib9rWUp0SMdUmqtjT", "ycBf8koaYogVqU9C94fZSGC3O0OBAygJHo5KDP0w40vuZUAnW1");
cb.setToken("720471955-xrbb7Bm6uebBgWzbdjHFbKHL07VIUpm897EgMQiX", "QorUeFUTuGYIVzFBuLILjY3ZEhik7uBZzwdQbH8ujTi8r");

if ((window.localStorage.getItem("pendingTasks") != null && window.localStorage.getItem("pendingTasks") !== "") || ((window.localStorage.getItem("completedTasks") != null) && window.localStorage.getItem("completedTasks") !== "")) {
    readTasks(); //load stored tasks to page
}
//onclick eventlistener to add the user input to the list
btn.addEventListener('click', addtodo);

//preventing default behaviour of form submits which reloads the page
FORM[0].addEventListener('submit', function(event) {
    event.preventDefault();
});

//event listener so that on enter the item is added too
item.addEventListener('keydown', addlistAfterKeyDown);

//looping through each listitem adding event listeners for the check box and the list
for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('click', checkOrUncheck);
    listItems[i].previousElementSibling.addEventListener('change', function() {
        listItems[i].click();
    });
}
//calling delete function so that the pre-existing list items can be deleted.
delItem();
tweet();

//function to enter item if you hit "enter" or "return" key on the keyboard
function addlistAfterKeyDown(event) {
    if (item.value.length > 0 && event.keyCode === 13) {
        addtodo();
    }
}

function addtodo() {
    if (item.value.length > 0) { //makes sure that an empty input field doesn't create a list element
        let li = document.createElement('li'); // creates an element "li" and other elements needed for each item
        let div = document.createElement('div');
        let checkbox = document.createElement('input');
        let delbtn = document.createElement('button');
        delbtn.innerText = "X"; //setting necessary attributes to the created elements
        div.setAttribute("class", "item-container");
        setAttributes(checkbox, { //setAttributes is a function defined just to make setting of multiple attributes easier
            "type": "checkbox",
            "name": "checkbox",
            "class": "check"
        });
        setAttributes(delbtn, {
            "class": "delete"
        });
        TODOItems.push(item.value.trim()); //localStorage Try
        window.localStorage.setItem("pendingTasks", TODOItems.join("||"));
        li.append(item.value.trim()); //trimming trailing white spaces
        div.append(checkbox, li, delbtn); //finally appending to parent elements, using the newer append method instead of appendChild
        listDiv.append(div);
        if (listDiv.childElementCount > 1) {
            listDiv.style.display = "flex";
        } //logic so that the disappeared pending lists(if all tasks are marked completed the pending list dissapears) come back on addition of a new task
        item.value = ""; //Reset text input field to empty string
        li.previousElementSibling.addEventListener('change', function() {
            li.click();
        });
        li.addEventListener("click", checkOrUncheck);
        //event listener for newly added items
        delItem(); //delete functionality for newly added items
    }
}
//function to delete item - setting display to none
function delItem() {
    if (listDiv.childElementCount == 1 && completedList.childElementCount == 1) {
        listDiv.style.display = "none";
        completedList.style.display = "none";
    }
    for (let i = 0; i < cross.length; i++) {
        cross[i].onclick = function(e) {
            let index = TODOItems.indexOf(e.target.previousElementSibling.textContent);
            TODOItems.splice(index, 1);
            window.localStorage.setItem("pendingTasks", TODOItems.join("||"));
            let index2 = CompletedItems.indexOf(e.target.previousElementSibling.textContent);
            CompletedItems.splice(index2, 1);
            window.localStorage.setItem("completedTasks", TODOItems.join("||"));
            catSound(); //this might be a little too much sorry!
            let itemDiv = this.parentElement;
            itemDiv.style.display = 'none';
        }
    }
}

function tweet() {
    for (let i = 0; i < tweetbtns.length; i++) {
        tweetbtns[i].onclick = function(e) {
            let text = e.target.previousElementSibling.previousElementSibling.textContent;
            if (confirm('Would you like to tweet - Completed ' + text)) {
                cb.__call("statuses_update", {
                    status:"Completed "+text
                }, function(
                    reply,
                    rate,
                    err
                ) {});
            }
        }
    }

}

//here's our function to add a line through
function checkOrUncheck(e) {
    //User can also uncheck a task.
    if (e.target.parentElement.classList.contains('completed')) {
        beeptwice();
        e.target.previousElementSibling.checked = false;
        listDiv.append(e.target.parentElement);
        setAttributes(e.target.parentElement, {
            'class': 'item-container'
        });
        e.target.nextElementSibling.nextElementSibling.remove();
        TODOItems.push(e.target.innerText.trim());
        window.localStorage.setItem("pendingTasks", TODOItems.join("||"));
        let index = CompletedItems.indexOf(e.target.innerText);
        CompletedItems.splice(index, 1);
        window.localStorage.setItem("completedTasks", CompletedItems.join("||"));

        if (listDiv.childElementCount > 1) {
            listDiv.style.display = "flex";
        }
    } else {
        beep();
        e.target.style.display = 'none';
        let tweetbtn = document.createElement('button');
        tweetbtn.innerText = 'Tweet';
        tweetbtn.setAttribute('class', 'tweet');
        e.target.parentElement.append(tweetbtn);
        completedList.append(e.target.parentElement);
        e.target.style.display = 'block';
        e.target.previousElementSibling.checked = true;
        setAttributes(e.target.parentElement, {
            'class': 'item-container completed'
        });
        if (listDiv.childElementCount == 1) {
            listDiv.style.display = "none";
        }
        CompletedItems.push(e.target.innerText.trim()); //localStorage
        window.localStorage.setItem("completedTasks", CompletedItems.join("||"));
        let index = TODOItems.indexOf(e.target.innerText);
        TODOItems.splice(index, 1);
        window.localStorage.setItem("pendingTasks", TODOItems.join("||"));
        tweet();
    }
}

//storing to the local storage so list doesn't reset on refresh.
function readTasks() {
    for (let i = 0; i < TODOItems.length; i++) {
        if (TODOItems[i] !== "") {
            let li = document.createElement('li'); // creates an element "li" and other elements needed for each item
            let div = document.createElement('div');
            let checkbox = document.createElement('input');
            let delbtn = document.createElement('button');
            delbtn.innerText = "X"; //setting necessary attributes to the created elements
            div.setAttribute("class", "item-container");
            setAttributes(checkbox, { //setAttributes is a function defined just to make setting of multiple attributes easier
                "type": "checkbox",
                "name": "checkbox",
                "class": "check"
            });
            setAttributes(delbtn, {
                "class": "delete"
            });
            li.append(TODOItems[i]);
            div.append(checkbox, li, delbtn); //finally appending to parent elements, using the newer append method instead of appendChild
            listDiv.append(div);
            li.previousElementSibling.addEventListener('change', function() {
                li.click();
            });
            li.addEventListener("click", checkOrUncheck);
        }
    }
    for (let i = 0; i < CompletedItems.length; i++) {
        if (CompletedItems[i] !== "") {
            let li = document.createElement('li'); // creates an element "li" and other elements needed for each item
            let div = document.createElement('div');
            let checkbox = document.createElement('input');
            let delbtn = document.createElement('button');
            let tweetbtn = document.createElement('button');
            delbtn.innerText = "X"; //setting necessary attributes to the created elements
            tweetbtn.innerText = 'Tweet';
            tweetbtn.setAttribute('class', 'tweet');
            div.setAttribute("class", "item-container");
            setAttributes(checkbox, { //setAttributes is a function defined just to make setting of multiple attributes easier
                "type": "checkbox",
                "name": "checkbox",
                "class": "check"
            });
            setAttributes(delbtn, {
                "class": "delete"
            });
            li.append(CompletedItems[i]);
            div.append(checkbox, li, delbtn, tweetbtn);
            completedList.append(div);
            li.previousElementSibling.addEventListener('change', function() {
                li.click();
            });
            li.addEventListener("click", checkOrUncheck);
            li.display = 'block';
            checkbox.checked = true;
            setAttributes(div, {
                'class': 'item-container completed'
            });
        }
    }
    if (listDiv.childElementCount > 1) {
        listDiv.style.display = "flex";
    } //logic so that the disappeared pending lists(if all tasks are marked completed the pending list dissapears) come back on addition of a new task
    delItem(); //delete functionality for newly added items
}

//helper function to set multiple attributes at once
function setAttributes(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}
//beep is a function instantiating a new Audio object with a data uri to produce sounds
//two beeps when unchecking a checked task
function beeptwice() {
    beep();
    setTimeout(function() {
        beep();
    }, 100);
    setTimeout(function() {
        beep();
    }, 200);
}

//these functions use data uri's to produce beep and a cat sound but are very long so code folding will be helpful.:)
function beep() {
    let snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

function catSound() {
    let snd = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAABOAADBdwAGCQwQEBMWGR0dICMmJiotMDMzNzo9PUBER0pKTVFUVFdaXWFhZGdqam5xdHd3e36BhISIi46OkZWYm5ueoqWlqKuusrK1uLu7v8LFyMjMz9LS1dnc39/i5unp7O/z9vb5/P8AAAAATGF2ZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwXcld7XaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7JgAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OC4yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7JgAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OC4yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7JgAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OC4yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7JgAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OC4yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7JgAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OC4yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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");
    snd.play();
}