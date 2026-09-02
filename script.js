"use strict";


/* =========================================================
   MY MANAGER AUTH SYSTEM
   Version 3.0.0
========================================================= */


const STORAGE_KEY = "my_manager_users";
const SESSION_KEY = "my_manager_current_user";


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => {
    return document.querySelector(selector);
};


function getUsers() {

    try {

        const data =
            localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const users = JSON.parse(data);

        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        console.error(
            "خطا در خواندن کاربران:",
            error
        );

        return [];
    }
}


function saveUsers(users) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(users)
        );

        return true;

    } catch (error) {

        console.error(
            "خطا در ذخیره کاربران:",
            error
        );

        return false;
    }
}


function getCurrentUser() {

    try {

        const data =
            sessionStorage.getItem(SESSION_KEY);

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        return null;
    }
}


function setCurrentUser(user) {

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );
}


function removeCurrentUser() {

    sessionStorage.removeItem(
        SESSION_KEY
    );
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    text,
    type = "error"
) {

    const message =
        $("#message");

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className =
        `message show ${type}`;

}


function hideMessage() {

    const message =
        $("#message");

    if (!message) {
        return;
    }

    message.textContent = "";

    message.className =
        "message";
}


/* =========================================================
   USERNAME VALIDATION
========================================================= */

function validateUsername(username) {

    if (!username) {

        return {
            valid: false,
            message: "نام کاربری را وارد کنید."
        };
    }


    if (username.length < 3) {

        return {
            valid: false,
            message: "نام کاربری باید حداقل ۳ کاراکتر باشد."
        };
    }


    if (username.length > 30) {

        return {
            valid: false,
            message: "نام کاربری نباید بیشتر از ۳۰ کاراکتر باشد."
        };
    }


    /*
       حروف فارسی، انگلیسی، عدد و _
    */

    const usernameRegex =
        /^[\u0600-\u06FFa-zA-Z0-9_]+$/;


    if (!usernameRegex.test(username)) {

        return {
            valid: false,
            message:
                "نام کاربری فقط می‌تواند شامل حروف، عدد و _ باشد."
        };
    }


    return {
        valid: true
    };
}


/* =========================================================
   PASSWORD VALIDATION
========================================================= */

function validatePassword(password) {

    if (!password) {

        return {
            valid: false,
            message: "رمز عبور را وارد کنید."
        };
    }


    if (password.length < 6) {

        return {
            valid: false,
            message:
                "رمز عبور باید حداقل ۶ کاراکتر باشد."
        };
    }


    return {
        valid: true
    };
}


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

function updatePasswordStrength(password) {

    const progress =
        $("#strengthProgress");

    const text =
        $("#strengthText");

    if (!progress || !text) {
        return;
    }


    if (!password) {

        progress.style.width = "0%";

        text.textContent =
            "قدرت رمز عبور";

        return;
    }


    let score = 0;


    if (password.length >= 6) {
        score++;
    }

    if (password.length >= 10) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    if (score <= 2) {

        progress.style.width = "35%";
        progress.style.background = "#ef4444";

        text.textContent =
            "ضعیف";

        text.style.color =
            "#ef4444";

    } else if (score <= 4) {

        progress.style.width = "65%";
        progress.style.background = "#f59e0b";

        text.textContent =
            "متوسط";

        text.style.color =
            "#d97706";

    } else {

        progress.style.width = "100%";
        progress.style.background = "#16a34a";

        text.textContent =
            "قوی";

        text.style.color =
            "#16a34a";
    }
}


/* =========================================================
   LOGIN
========================================================= */

function loginUser(
    username,
    password
) {

    const users =
        getUsers();


    const normalizedUsername =
        username.trim().toLowerCase();


    const user =
        users.find(
            item =>
                item.username.toLowerCase() ===
                    normalizedUsername &&
                item.password === password
        );


    if (!user) {

        return {
            success: false,
            message:
                "نام کاربری یا رمز عبور اشتباه است."
        };
    }


    setCurrentUser({

        id: user.id,

        username: user.username,

        loginAt:
            new Date().toISOString()

    });


    return {
        success: true,
        user
    };
}


/* =========================================================
   REGISTER
========================================================= */

function registerUser(
    username,
    password
) {

    const validation =
        validateUsername(username);


    if (!validation.valid) {

        return {
            success: false,
            message: validation.message
        };
    }


    const passwordValidation =
        validatePassword(password);


    if (!passwordValidation.valid) {

        return {
            success: false,
            message:
                passwordValidation.message
        };
    }


    const users =
        getUsers();


    const normalizedUsername =
        username.trim().toLowerCase();


    const alreadyExists =
        users.some(
            user =>
                user.username.toLowerCase() ===
                normalizedUsername
        );


    if (alreadyExists) {

        return {
            success: false,
            message:
                "این نام کاربری قبلاً ثبت شده است."
        };
    }


    const newUser = {

        id:
            crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(),

        username:
            username.trim(),

        password:
            password,

        createdAt:
            new Date().toISOString()

    };


    users.push(newUser);


    const saved =
        saveUsers(users);


    if (!saved) {

        return {
            success: false,
            message:
                "ذخیره حساب انجام نشد. حافظه مرورگر را بررسی کنید."
        };
    }


    return {
        success: true,
        user: newUser
    };
}


/* =========================================================
   SWITCH LOGIN / REGISTER
========================================================= */

let isRegisterMode = false;


function switchMode() {

    isRegisterMode =
        !isRegisterMode;


    hideMessage();


    const loginForm =
        $("#loginForm");

    const registerForm =
        $("#registerForm");

    const formTitle =
        $("#formTitle");

    const formSubtitle =
        $("#formSubtitle");

    const switchText =
        $("#switchText");

    const switchButton =
        $("#switchButton");

    const headerIcon =
        $("#headerIcon");


    if (isRegisterMode) {

        loginForm.classList.add("hidden");

        registerForm.classList.remove("hidden");


        formTitle.textContent =
            "ساخت حساب کاربری";


        formSubtitle.textContent =
            "اطلاعات حساب خود را انتخاب کنید";


        switchText.textContent =
            "قبلاً حساب ساخته‌اید؟";


        switchButton.textContent =
            "وارد شوید";


        headerIcon.textContent =
            "✨";


        setTimeout(() => {

            $("#registerUsername")?.focus();

        }, 100);

    } else {

        registerForm.classList.add("hidden");

        loginForm.classList.remove("hidden");


        formTitle.textContent =
            "خوش آمدید";


        formSubtitle.textContent =
            "برای ورود به حساب خود اطلاعاتتان را وارد کنید";


        switchText.textContent =
            "حساب کاربری ندارید؟";


        switchButton.textContent =
            "ثبت‌نام کنید";


        headerIcon.textContent =
            "🔐";


        setTimeout(() => {

            $("#loginUsername")?.focus();

        }, 100);
    }
}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function setupPasswordToggles() {

    document
        .querySelectorAll(
            ".password-toggle"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;

                    const input =
                        document.getElementById(
                            targetId
                        );

                    if (!input) {
                        return;
                    }


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.textContent =
                            "🙈";

                    } else {

                        input.type =
                            "password";

                        button.textContent =
                            "👁";
                    }

                }
            );
        });
}


/* =========================================================
   LOGIN FORM
========================================================= */

function setupLogin() {

    const form =
        $("#loginForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            hideMessage();


            const username =
                $("#loginUsername")
                    .value
                    .trim();


            const password =
                $("#loginPassword")
                    .value;


            if (!username) {

                showMessage(
                    "نام کاربری را وارد کنید."
                );

                $("#loginUsername")
                    .focus();

                return;
            }


            if (!password) {

                showMessage(
                    "رمز عبور را وارد کنید."
                );

                $("#loginPassword")
                    .focus();

                return;
            }


            const button =
                form.querySelector(
                    ".submit-button"
                );


            button.classList.add(
                "loading"
            );


            setTimeout(() => {

                const result =
                    loginUser(
                        username,
                        password
                    );


                button.classList.remove(
                    "loading"
                );


                if (!result.success) {

                    showMessage(
                        result.message,
                        "error"
                    );


                    $(".auth-card")
                        .classList.add(
                            "shake"
                        );


                    setTimeout(() => {

                        $(".auth-card")
                            .classList.remove(
                                "shake"
                            );

                    }, 400);


                    return;
                }


                showMessage(
                    `خوش آمدید ${result.user.username} 🌟`,
                    "success"
                );


                /*
                    اگر صفحه اصلی پروژه شما مثلاً
                    dashboard.html است، اینجا تغییر بده.
                */

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);

            }, 350);

        }
    );
}


/* =========================================================
   REGISTER FORM
========================================================= */

function setupRegister() {

    const form =
        $("#registerForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            hideMessage();


            const username =
                $("#registerUsername")
                    .value
                    .trim();


            const password =
                $("#registerPassword")
                    .value;


            const confirmPassword =
                $("#registerPasswordConfirm")
                    .value;


            const usernameValidation =
                validateUsername(username);


            if (!usernameValidation.valid) {

                showMessage(
                    usernameValidation.message
                );

                $("#registerUsername")
                    .focus();

                return;
            }


            const passwordValidation =
                validatePassword(password);


            if (!passwordValidation.valid) {

                showMessage(
                    passwordValidation.message
                );

                $("#registerPassword")
                    .focus();

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "رمز عبور و تکرار آن یکسان نیست."
                );

                $("#registerPasswordConfirm")
                    .focus();

                return;
            }


            const button =
                form.querySelector(
                    ".submit-button"
                );


            button.classList.add(
                "loading"
            );


            setTimeout(() => {

                const result =
                    registerUser(
                        username,
                        password
                    );


                button.classList.remove(
                    "loading"
                );


                if (!result.success) {

                    showMessage(
                        result.message,
                        "error"
                    );

                    return;
                }


                showMessage(
                    "حساب شما با موفقیت ساخته شد. اکنون وارد شوید.",
                    "success"
                );


                /*
                    فرم را پاک می‌کنیم.
                */

                form.reset();

                updatePasswordStrength("");


                /*
                    بعد از ساخت حساب،
                    کاربر به فرم ورود می‌رود.
                */

                setTimeout(() => {

                    switchMode();

                    $("#loginUsername")
                        .value =
                        result.user.username;

                    $("#loginPassword")
                        .focus();

                }, 900);

            }, 350);

        }
    );
}


/* =========================================================
   PASSWORD STRENGTH EVENT
========================================================= */

function setupPasswordStrength() {

    const password =
        $("#registerPassword");


    if (!password) {
        return;
    }


    password.addEventListener(
        "input",
        () => {

            updatePasswordStrength(
                password.value
            );

        }
    );
}


/* =========================================================
   WELCOME SOUND
========================================================= */

function setupWelcomeSound() {

    const audio =
        $("#welcomeSound");


    if (!audio) {
        return;
    }


    if (
        sessionStorage.getItem(
            "voicePlayed"
        )
    ) {

        return;
    }


    audio.loop = false;

    audio.currentTime = 0;


    const playSound =
        () => {

            audio
                .play()
                .then(() => {

                    sessionStorage.setItem(
                        "voicePlayed",
                        "true"
                    );

                })
                .catch(() => {

                    // مرورگر اجازه پخش خودکار نداد

                });

        };


    window.addEventListener(
        "load",
        () => {

            playSound();

        }
    );


    /*
        اگر Autoplay توسط مرورگر بسته شد،
        با اولین کلیک صدا اجرا می‌شود.
    */

    document.addEventListener(
        "click",
        function playOnce() {

            if (
                sessionStorage.getItem(
                    "voicePlayed"
                )
            ) {

                return;
            }


            playSound();


            if (
                sessionStorage.getItem(
                    "voicePlayed"
                )
            ) {

                document.removeEventListener(
                    "click",
                    playOnce
                );
            }

        }
    );
}


/* =========================================================
   CHECK CURRENT SESSION
========================================================= */

function checkCurrentSession() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    /*
       اگر کاربر قبلاً وارد شده باشد،
       دوباره صفحه ورود را نشان نده.
    */

    console.log(
        "کاربر وارد شده:",
        currentUser.username
    );

    /*
       اگر نمی‌خواهی ورود قبلی باعث انتقال
       خودکار شود، این قسمت را دست نزن.

       برای انتقال خودکار می‌توانی این را فعال کنی:

       window.location.href = "dashboard.html";
    */
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPasswordToggles();

        setupLogin();

        setupRegister();

        setupPasswordStrength();

        checkCurrentSession();

        setupWelcomeSound();


        const switchButton =
            $("#switchButton");


        if (switchButton) {

            switchButton.addEventListener(
                "click",
                switchMode
            );
        }

    }
);
