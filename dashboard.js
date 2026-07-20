
//==========================================
// BANK CARDS STORAGE
//==========================================

let bankCards =

JSON.parse(localStorage.getItem("bankCards")) || [];



let selectedCardIndex = -1;



//==========================================
// ELEMENTS
//==========================================


const bankContainer =

document.getElementById("bankCardsContainer");



const bankModal =

document.getElementById("bankModal");





//==========================================
// OPEN / CLOSE FORM
//==========================================


function openBankCardForm(){


bankModal.classList.add("active");


}




function closeBankCardForm(){


bankModal.classList.remove("active");


}




//==========================================
// SAVE BANK CARD
//==========================================


function saveBankCard(){



let card={


bank:

document.getElementById("bankName").value,



cardNumber:

document.getElementById("cardNumber").value,



owner:

document.getElementById("cardOwner").value,



cvv:

document.getElementById("cvv").value,



expire:

document.getElementById("expireDate").value,



iban:

document.getElementById("iban").value,



balance:

Number(

document.getElementById("cardBalance").value

)||0,



history:[]



};





bankCards.push(card);





localStorage.setItem(

"bankCards",

JSON.stringify(bankCards)

);




renderBankCards();



closeBankCardForm();




document.querySelector(".bank-form-box")

.querySelectorAll("input")

.forEach(input=>{


input.value="";


});



}




//==========================================
// BANK NAME
//==========================================


function getBankName(bank){


let names={


pasargad:"پاسارگاد",


saderat:"صادرات",


mellat:"ملت",


sepah:"سپه",


sepino:"سپینو",


blu:"بلو بانک",


maskan:"مسکن",


other:"بانک"



};



return names[bank] || "بانک";


}





//==========================================
// BANK CLASS
//==========================================


function getBankClass(bank){


return "bank-"+bank;


}



//==========================================
// RENDER BANK CARDS
//==========================================


function renderBankCards(){


bankContainer.innerHTML="";



bankCards.forEach((card,index)=>{



bankContainer.innerHTML += `



<div class="bank-card-template ${getBankClass(card.bank)}">





<div class="bank-card-header">



<div class="bank-logo">


${getBankName(card.bank)}


</div>



<div class="chip">

💳

</div>



</div>






<div class="card-number">


${card.cardNumber || "6037 **** **** ****"}


</div>







<div class="card-info">



<div>


<span>

مالک

</span>


<strong>

${card.owner || "-"}

</strong>


</div>





<div>


<span>

انقضا

</span>


<strong>

${card.expire || "--/--"}

</strong>


</div>





<div>


<span>

CVV2

</span>


<strong>

***

</strong>


</div>



</div>








<div class="balance-box">


<span>

موجودی

</span>



<h2>


${card.balance.toLocaleString("fa-IR")}

تومان


</h2>



</div>







<div class="card-actions">



<button

onclick="openBalanceModal(${index})">


💰 تغییر موجودی


</button>




<button

onclick="showCardHistory(${index})">


📜 تاریخچه


</button>




<button

onclick="deleteBankCard(${index})">


🗑 حذف


</button>




</div>






</div>



`;



});



}





//==========================================
// DELETE CARD
//==========================================


function deleteBankCard(index){



if(!confirm("کارت حذف شود؟"))

return;



bankCards.splice(index,1);



localStorage.setItem(

"bankCards",

JSON.stringify(bankCards)

);



renderBankCards();



}





//==========================================
// FORMAT CARD NUMBER
//==========================================


function formatCardNumber(number){



return number

.replace(/\s/g,'')

.replace(/(.{4})/g,'$1 ')

.trim();



}




//==========================================
// LOAD CARDS
//==========================================


renderBankCards();




//==========================================
// BALANCE MODAL
//==========================================


const balanceModal =

document.getElementById("balanceModal");




function openBalanceModal(index){


selectedCardIndex=index;


balanceModal.classList.add("active");


}




function closeBalanceModal(){


balanceModal.classList.remove("active");


}





//==========================================
// SAVE BALANCE CHANGE
//==========================================


function saveBalanceChange(){



let type =

document.getElementById("balanceType").value;



let amount =

Number(

document.getElementById("balanceAmount").value

);



let description =

document.getElementById("balanceDescription").value;





if(!amount || selectedCardIndex===-1)

return;





let card =

bankCards[selectedCardIndex];






if(type==="plus"){


card.balance += amount;


}else{


card.balance -= amount;


}





if(card.balance < 0){


card.balance=0;


}





card.history.push({



type:type,



amount:amount,



description:

description || "بدون توضیح",



date:

new Date()

.toLocaleString("fa-IR")



});






localStorage.setItem(

"bankCards",

JSON.stringify(bankCards)

);






renderBankCards();




closeBalanceModal();





document.getElementById("balanceAmount").value="";


document.getElementById("balanceDescription").value="";



}




//==========================================
// SHOW HISTORY
//==========================================


function showCardHistory(index){


let card =

bankCards[index];



let table =

document.getElementById("cardHistoryTable");



if(!table)

return;



table.innerHTML="";





card.history.forEach(item=>{



table.innerHTML += `



<tr>



<td>


${item.type==="plus"

?

"افزایش ➕"

:

"کاهش ➖"

}


</td>





<td>


${item.amount.toLocaleString("fa-IR")}

تومان


</td>





<td>


${item.description}


</td>





<td>


${item.date}


</td>



</tr>



`;



});



}





//==========================================
// AUTO SAVE
//==========================================


window.addEventListener(

"beforeunload",

function(){


localStorage.setItem(

"bankCards",

JSON.stringify(bankCards)

);


}

);





//==========================================
// CLOSE MODAL ESC
//==========================================


document.addEventListener(

"keydown",

function(e){


if(e.key==="Escape"){


closeBankCardForm();


closeBalanceModal();


}



}

);




//==========================================
// START
//==========================================


renderBankCards();






//====================================
// NOTES SYSTEM
//====================================


let notes = JSON.parse(

localStorage.getItem("dashboardNotes")

) || [];



let selectedNote = null;







//====================================
// ELEMENTS
//====================================


const notesList =

document.getElementById("notesList");



const noteModal =

document.getElementById("noteModal");









//====================================
// OPEN / CLOSE NOTE FORM
//====================================



function openNoteForm(){


    noteModal.classList.add("active");


}




function closeNoteForm(){


    noteModal.classList.remove("active");


    document.getElementById("newNoteTitle").value="";

    document.getElementById("newNoteText").value="";

    document.getElementById("newNotePin").checked=false;


}









//====================================
// CREATE NOTE
//====================================



function createNote(){



let title =

document.getElementById("newNoteTitle").value;



let text =

document.getElementById("newNoteText").value;



let pin =

document.getElementById("newNotePin").checked;






if(title.trim()===""){


alert("عنوان یادداشت را وارد کنید");


return;


}







let note = {


id:Date.now(),



title:title,



text:text,



pin:pin,



created:new Date()

.toLocaleString("fa-IR"),



updated:new Date()

.toLocaleString("fa-IR")


};








notes.unshift(note);





saveNotes();





renderNotes();





closeNoteForm();





}









//====================================
// SAVE STORAGE
//====================================



function saveNotes(){


localStorage.setItem(

"dashboardNotes",

JSON.stringify(notes)

);


}


