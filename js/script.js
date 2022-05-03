const pic = document.getElementById("pic");
const name_age = document.getElementById('name_age')
const email = document.getElementById('email')
const gender = document.getElementById('gender')
const activity = document.getElementById('activity')
const button = document.getElementById('button1')

/* Parses user sexual preference. Counts how many options are unchecked.
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
                pic.innerHTML = "<img src = " + imgLnk + " height='256' width='256'>";
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


button.addEventListener("click", function() {
    M_F_choices();
    getRandomActivity()
});