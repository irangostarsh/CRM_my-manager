function login() 
{ let user = document.getElementById("username").value;
     let pass = document.getElementById("password").value;
      if(user === "admin" && pass === "1234"){ window.location.href = "dashboard.html"; }
      else{ document.getElementById("msg").innerHTML = "نام کاربری یا رمز عبور اشتباه است!"; } }
