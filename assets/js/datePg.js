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
const likeImg = document.querySelector(".likeImage");
const likeName = document.querySelector(".likeName");
const backBtn = document.querySelector("#backBtn");
const forwardBtn = document.querySelector("#forwardBtn");
const goForItBtn = document.querySelector("#goForItBtn");
const emptyLikesBtn = document.querySelector("#likesEmptyBtn")



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

const getRandomActivity = () => {
    fetch(`https://www.boredapi.com/api/activity/`)
        .then(res => res.json())
        .then(data => {
            activity.innerHTML = data.activity
        })
}

var isThisArabic = function(string) {
    var arabic = /[\u0600-\u06FF]/;
    var evaluate = (arabic.test(string));
    return evaluate;
}

//TOP Event Event Listeners
shopBtn.addEventListener("click", function() {
    M_F_choices();
});

likeBtn.addEventListener("click", function() {
    console.log("Like button clicked");
});

/*===================================================*/

//BOTTOM Event Listeners
goForItBtn.addEventListener('click', function() {
    console.log("Go for It Button pressed");
});

backBtn.addEventListener('click', function() {
    console.log("Back Button pressed.");
});

backBtn.addEventListener('click', function() {
    console.log("Back Button pressed.");
});

forwardBtn.addEventListener('click', function() {
    console.log("Forward Button pressed.");
});

emptyLikesBtn.addEventListener('click', function() {
    console.log("Empty Likes button pressed.");
});

/*===================================================*/

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

//BEGIN LIKE HISTORY