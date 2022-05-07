//TOP Selectors
const topPic = document.getElementById("topPic");
const name_age = document.getElementById('name_age')
const email = document.getElementById('email')
const gender = document.getElementById('gender')
const activity = document.getElementById('activity')
const likeBtn = document.querySelector('#likeBtn')

//BOTTOM Selectors
const shopBtn = document.getElementById('shopBtn')
const likePhoto = document.querySelector(".likeImage");
const likeName = document.querySelector(".likeName");
const backBtn = document.querySelector("#backBtn");
const likeEmail = document.querySelector(".likeEmail");
const forwardBtn = document.querySelector("#forwardBtn");
const goForItBtn = document.querySelector("#goForItBtn");
const emptyLikesBtn = document.querySelector("#likesEmptyBtn")

likeStaging = {};


/* Parses user sexual preference (located top half). Counts how many options are unchecked.
If the unchecked count == 2 then it posts a window alert for input validation*/
var M_F_choices = function() {
    var choices = document.getElementsByName('gender');
    let choice;
    let url;
    let noCount = 0;
    for (var i = 0; i < choices.length; i++) {
        if (choices[i].checked) {
            choice = choices[i].value;
            url = "https://randomuser.me/api/?gender=" + choice;
            getRandomUserData(url);
            getRandomActivity();
        } else {
            noCount++;
        }
    }
    if (noCount == 2) {
        window.alert("Please choose if you are seeking a man or woman.");
    }
}

/*Handles API call based on user's sexual preference, renders photo from API photo URL.
Adjusts the ages to better match the returned pictures and filters out names in Arabic.
 Sets DOM elements with concatenated responses. 
*/
const getRandomUserData = (url) => {
    // console.log(url);
    if (url !== undefined) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                let imgLnk = data.results[0].picture.large;
                topPic.innerHTML = "<img src = " + imgLnk + " height='256' width='256'>";
                let age = adjustAge(data.results[0].dob.age);
                let theName = data.results[0].name.first + " " + data.results[0].name.last;
                isArabicName = isThisArabic(theName);
                if (!(isArabicName)) {
                    name_age.innerHTML = "<strong>" + data.results[0].name.first + " " + data.results[0].name.last + ", " + age + "</strong>";
                    email.innerHTML = data.results[0].email;
                    likeStaging.picture = "<img src = " + imgLnk + " height='256' width='256'>";
                    likeStaging.name = name_age.textContent;
                    likeStaging.email = email.textContent;
                }
            })
    }
}

/*Between 21 and 40-years old. If out of this range it picks a random age within that range*/
let adjustAge = function(age) {
    if (age >= 21 && age <= 40) {
        adjAge = age;
    } else {
        adjAge = Math.floor(Math.random() * (40 - 21 + 1) + 21);
    }
    return adjAge;
}

//Random Activity API Call
const getRandomActivity = () => {
    fetch(`https://www.boredapi.com/api/activity/?type=recreational`)
        .then(res => res.json())
        .then(data => {
            activity.innerHTML = "<strong> On first date: </strong>&nbsp;" + data.activity + ".";
            //console.log(LikeProps.randomKey);
        })
}

//Arabic Filter
var isThisArabic = function(string) {
    var arabic = /[\u0600-\u06FF]/;
    var evaluate = (arabic.test(string));
    return evaluate;
}



//when page loads, and photo DOMS are empty it  plants the question mark
window.onload = function() {
    let topPicNodesTest = topPic.hasChildNodes();
    let bottomPicNodesTest = likePhoto.hasChildNodes();
    if (!(topPicNodesTest)) {
        let myPic = document.createElement("img");
        myPic.setAttribute("src", "assets/img/questionMark.png");
        topPic.appendChild(myPic);
    }
    if (!(bottomPicNodesTest)) {
        let herPic = document.createElement("img");
        herPic.setAttribute("src", "assets/img/questionMark.png");
        likePhoto.appendChild(herPic);
    }
}

//LIKE HISTORY
likeThatObj = {};
pkHistory = [];

/*
Sets pk to 01 if pk is not in localStorage. 
Adds +1 to existing pk retrieved from localStorage. 
Finally updates pk local storage counter from either situation
Sends pk to LocalStorageRecorder
*/
var iLikeThatBtnFunc = function() {
    if (localStorage.getItem("pk") == null) {
        let num = 1;
        let birthPK = parseInt(localStorage.setItem("pk", "01"));
        LocalStorRecorder(1);
    } else {
        let getPK = localStorage.getItem("pk");
        let currPK = parseInt(getPK);
        currPK++;
        localStorage.setItem("pk", JSON.stringify(currPK));
        LocalStorRecorder(currPK);
    }
}

/* Creates object to record likes
Takes pk (int), runs through ternary --> if < 10 prepend '_0' else prepend  '_'
*/
LocalStorRecorder = function(pk) {
    likeThatObj = { picture: likeStaging.picture, name: likeStaging.name, email: likeStaging.email };
    let myKey = pk < 10 ? "_0" + pk : "_" + pk;
    localStorage.setItem(myKey, JSON.stringify(likeThatObj));
    setCurrLikeToLowerHalf(myKey);
}

/* Random User API does not have a UID. So upon user pressing like button, the data from that API is sent to the lower half.
Also used to recall data when user interacts with forward and back buttons
*/
setCurrLikeToLowerHalf = function(pk) {
    let objectFromLocalStorage = localStorage.getItem(pk);
    let myObj = JSON.parse(objectFromLocalStorage);
    likePhoto.innerHTML = myObj.picture;
    likeName.innerHTML = "<strong>" + myObj.name + "<\strong>";
    likeEmail.textContent = myObj.email;
}

//Returns unique, sorted array of all the pk keys from localStorage objects containing like results.
pkManagement = function() {
    let pksNow = Object.keys(localStorage);
    let temp = "";
    for (var i = 0; i < pksNow.length; i++) {
        temp = pksNow[i];
        if (temp.startsWith("_")) {
            pkHistory.push(temp);
        }
    }
    return pkHistory.filter(uniqueArrayValues).sort();
    //return pkHistory;
}

//src: https://appdividend.com/2022/01/28/how-to-get-distinct-values-from-array-in-javascript/
const uniqueArrayValues = function(value, index, self) {
    return self.indexOf(value) === index;
}



// var btnPresentPositiontoString = function(pos) {
//     let string = "_" + pos;
//     return string;
// }


/* FORWARD, BACKWARD BUTTON FUNCTIONS*/

var ForwardBackBtnClick = function(event) {
    //debugger;
    var currPK = localStorage.getItem("pk");
    let currPKasInt = Math.floor(currPK);
    var lsStorageNm = "HistBtnPKPosition";
    var buttonPressed = event.target.getAttribute("id");
    let btnPresentPosition = localStorage.getItem(lsStorageNm);
    let fwBtnTest = btnPresentPosition == null || (btnPresentPosition == "_undefined" || btnPresentPosition == "undefined");
    let backBtnTest = btnPresentPosition == null || (btnPresentPosition == "undefined" || btnPresentPosition == "undefined");
    let btnNextPosition;
    if (buttonPressed == "forwardBtn") {
        if (fwBtnTest) {
            console.log(btnPresentPosition);
            var numberOne = "_01"
            btnPresentPosition = localStorage.setItem(lsStorageNm, numberOne);
            setCurrLikeToLowerHalf(numberOne);
        }
        if (!fwBtnTest) {
            console.log(btnPresentPosition);
            let x = btnPresentPositiontoInt();
            if (x >= 1 && x < currPKasInt) {
                x++;
                btnNextPosition = x < 10 ? "_0" + x : "_" + x;
                btnPresentPosition = localStorage.setItem(lsStorageNm, btnNextPosition);
                setCurrLikeToLowerHalf(btnNextPosition);
            } else if (x >= 1 && x >= currPKasInt) {
                // debugger;
                localStorage.setItem(lsStorageNm, "_01");
                setCurrLikeToLowerHalf("_01");
            }
        }
    }
    if (buttonPressed == "backBtn") {
        let x;
        let zz;
        if (backBtnTest) {
            x = currPKasInt;
            localStorage.setItem(lsStorageNm, x);
        }
        let y = btnPresentPositiontoInt();
        if (y > 1 && y <= currPKasInt) {
            y--;
            btnNextPosition = y < 10 ? "_0" + y : "_" + y;
            btnPresentPosition = localStorage.setItem(lsStorageNm, btnNextPosition);
            setCurrLikeToLowerHalf(btnNextPosition);
        } else if (y <= 1) {
            zz = currPKasInt < 10 ? "_0" + currPKasInt : "_" + currPKasInt;
            btnNextPosition = localStorage.setItem(lsStorageNm, zz);
            setCurrLikeToLowerHalf(zz);
        }
        console.log(btnNextPosition);
    }
}

var btnPresentPositiontoInt = function() {
    let x = localStorage.getItem("HistBtnPKPosition");
    x = Math.floor(x.replace('_', ""));
    return x;
}



/*========================================*/

//TOP Event Event Listeners
shopBtn.addEventListener("click", M_F_choices);
likeBtn.addEventListener("click", iLikeThatBtnFunc);

/*===================================================*/

/*BOTTOM Half Event Listeners */


backBtn.addEventListener('click', ForwardBackBtnClick);
forwardBtn.addEventListener('click', ForwardBackBtnClick);

goForItBtn.addEventListener('click', function() {
    window.alert("Have a wonderful time!!");
});

emptyLikesBtn.addEventListener('click', function() {
    if (window.confirm("Are you sure you want to ERASE all your likes?")) {
        localStorage.clear();
        likePhoto.innerHTML = "<img src='assets/img/questionMark.png'>";
        likeName.innerHTML = "";
    };
});