const LANG_KEY="crm_language";


const translations={

"داشبورد":"Dashboard",
"تنظیمات":"Settings",
"فاکتور":"Invoice",
"مشتریان":"Customers",
"کالاها":"Products",
"گزارش‌ها":"Reports",
"ذخیره":"Save",
"حذف":"Delete",
"ویرایش":"Edit",
"درآمد":"Income",
"هزینه":"Expense",
"سود":"Profit",
"جستجو":"Search"

};



function translatePage(){


let lang=

localStorage.getItem(LANG_KEY)||"fa";


if(lang==="en"){


document.documentElement.dir="ltr";


document.querySelectorAll("*")

.forEach(el=>{


if(el.children.length===0){


let text=el.innerText.trim();


if(translations[text]){


el.innerText=

translations[text];


}


}


});



}

else{


document.documentElement.dir="rtl";

}


}





document

.getElementById("languageSelect")

?.addEventListener(

"change",

function(){


localStorage.setItem(

LANG_KEY,

this.value

);


location.reload();


});





window.addEventListener(

"load",

translatePage

);
