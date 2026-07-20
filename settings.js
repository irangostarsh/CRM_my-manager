/*=====================================
        SETTINGS.JS
======================================*/

// گرفتن المنت ها
const username = document.getElementById("username");
const email = document.getElementById("email");
const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");

const darkMode = document.getElementById("darkMode");
const lightMode = document.getElementById("lightMode");

const saveBtn = document.getElementById("saveSettings");
const saveMessage = document.getElementById("saveMessage");


/*=====================================
        LOAD SETTINGS
======================================*/

window.onload = function () {

    // نام
    if(localStorage.getItem("username")){
        username.value = localStorage.getItem("username");
    }

    // ایمیل
    if(localStorage.getItem("email")){
        email.value = localStorage.getItem("email");
    }

    // عکس
    if(localStorage.getItem("profileImage")){
        profilePreview.src = localStorage.getItem("profileImage");
    }

    // تم
    const theme = localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

        darkMode.checked=true;

        lightMode.checked=false;

    }else{

        document.body.classList.remove("dark");

        lightMode.checked=true;

        darkMode.checked=false;

    }

};


/*=====================================
        CHANGE PROFILE IMAGE
======================================*/

profileImage.addEventListener("change",function(){

    const file=this.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(e){

        profilePreview.src=e.target.result;

        localStorage.setItem(
            "profileImage",
            e.target.result
        );

    }

    reader.readAsDataURL(file);

});


/*=====================================
        DARK MODE
======================================*/

darkMode.addEventListener("change",function(){

    if(this.checked){

        lightMode.checked=false;

        document.body.classList.add("dark");

    }

});


/*=====================================
        LIGHT MODE
======================================*/

lightMode.addEventListener("change",function(){

    if(this.checked){

        darkMode.checked=false;

        document.body.classList.remove("dark");

    }

});


/*=====================================
        SAVE SETTINGS
======================================*/

saveBtn.addEventListener("click",function(){

    localStorage.setItem(
        "username",
        username.value
    );

    localStorage.setItem(
        "email",
        email.value
    );

    if(darkMode.checked){

        localStorage.setItem(
            "theme",
            "dark"
        );

    }else{

        localStorage.setItem(
            "theme",
            "light"
        );

    }

    saveMessage.style.display="block";

    setTimeout(function(){

        saveMessage.style.display="none";

    },2000);

});