
//==========================================
// Local Storage
//==========================================

let transactions =

JSON.parse(localStorage.getItem("transactions")) || [];



//==========================================
// Edit
//==========================================

let editIndex = -1;



//==========================================
// Elements
//==========================================


const transactionForm =

document.getElementById("transactionForm");



const transactionType =

document.getElementById("transactionType");



const transactionTitle =

document.getElementById("transactionTitle");



const amount =

document.getElementById("amount");



const transactionDate =

document.getElementById("transactionDate");



const category =

document.getElementById("category");



const transactionDescription =

document.getElementById("transactionDescription");



const saveTransaction =

document.getElementById("saveTransaction");




//==========================================
// Cards
//==========================================


const totalIncome =

document.getElementById("totalIncome");



const totalExpense =

document.getElementById("totalExpense");



const totalProfit =

document.getElementById("totalProfit");



const transactionCount =

document.getElementById("transactionCount");




//==========================================
// Save
//==========================================


function saveTransactions(){


localStorage.setItem(

"transactions",

JSON.stringify(transactions)

);


}




//==========================================
// Register Transaction
//==========================================


transactionForm.addEventListener(

"submit",

function(e){


e.preventDefault();



let data={


type:transactionType.value,


title:transactionTitle.value,


amount:Number(amount.value),


date:transactionDate.value,


category:category.value,


description:transactionDescription.value,


createdAt:new Date().toLocaleString("fa-IR")


};




if(editIndex===-1){


transactions.push(data);



}else{


data.createdAt =

transactions[editIndex].createdAt;


transactions[editIndex]=data;


editIndex=-1;


saveTransaction.innerHTML="ثبت تراکنش";


}



saveTransactions();



updateReportCards();


renderTransactions();



transactionForm.reset();



});




//==========================================
// Update Cards
//==========================================


function updateReportCards(){


let income=0;


let expense=0;




transactions.forEach(item=>{


if(item.type==="income"){


income += item.amount;


}else{


expense += item.amount;


}



});





totalIncome.innerHTML =

income.toLocaleString("fa-IR")+" تومان";



totalExpense.innerHTML =

expense.toLocaleString("fa-IR")+" تومان";



totalProfit.innerHTML =

(income-expense)

.toLocaleString("fa-IR")+" تومان";



transactionCount.innerHTML =

transactions.length;



}





//==========================================
// Reset
//==========================================


transactionForm.addEventListener(

"reset",

function(){


setTimeout(()=>{


editIndex=-1;


saveTransaction.innerHTML="ثبت تراکنش";


},50);



});




//==========================================
// Table
//==========================================


const transactionTable =

document.getElementById("transactionTable");




//==========================================
// Type Class
//==========================================


function typeClass(type){


if(type==="income"){


return "income-badge";


}


return "expense-badge";


}



//==========================================
// Render Transactions
//==========================================


function renderTransactions(list=transactions){



transactionTable.innerHTML="";



list.forEach((item,index)=>{



transactionTable.innerHTML += `


<tr>



<td>

${index+1}

</td>




<td>


<span class="${typeClass(item.type)}">


${item.type==="income" ?

"درآمد 💰"

:

"هزینه 💸"

}


</span>


</td>




<td>

${item.title}

</td>




<td>


${item.amount.toLocaleString("fa-IR")}

 تومان


</td>




<td>

${item.category}

</td>




<td>

${item.date || "-"}

</td>




<td>



<button

class="action-btn view"

onclick="viewTransaction(${index})">


👁


</button>




<button

class="action-btn edit"

onclick="editTransaction(${index})">


✏


</button>





<button

class="action-btn delete"

onclick="deleteTransaction(${index})">


🗑


</button>




</td>



</tr>



`;



});



}




//==========================================
// Delete
//==========================================


function deleteTransaction(index){



if(!confirm("این تراکنش حذف شود؟"))

return;




transactions.splice(index,1);



saveTransactions();


updateReportCards();


renderTransactions();


}




//==========================================
// Edit
//==========================================


function editTransaction(index){


let item=transactions[index];



transactionType.value=item.type;



transactionTitle.value=item.title;



amount.value=item.amount;



transactionDate.value=item.date;



category.value=item.category;



transactionDescription.value=item.description;



editIndex=index;



saveTransaction.innerHTML="ویرایش تراکنش";



window.scrollTo({


top:0,


behavior:"smooth"


});



}




//==========================================
// View Details
//==========================================


function viewTransaction(index){


let item=transactions[index];



document.getElementById("modalBody").innerHTML=`

<h3>

${item.title}

</h3>


<hr>


<p>

<b>نوع:</b>

${item.type==="income"?"درآمد":"هزینه"}

</p>



<p>

<b>مبلغ:</b>

${item.amount.toLocaleString("fa-IR")} تومان

</p>



<p>

<b>تاریخ:</b>

${item.date || "-"}

</p>



<p>

<b>دسته:</b>

${item.category}

</p>



<p>

<b>توضیحات:</b>

${item.description || "-"}

</p>



`;



document

.getElementById("detailsModal")

.classList.add("active");



document

.getElementById("modalOverlay")

.classList.add("active");



}




//==========================================
// Close Modal
//==========================================


function closeModal(){


document

.getElementById("detailsModal")

.classList.remove("active");



document

.getElementById("modalOverlay")

.classList.remove("active");



}



//==========================================
// Search
//==========================================


const search =

document.getElementById("search");



if(search){


search.addEventListener("keyup",function(){



let value=

this.value.toLowerCase();



let filtered = transactions.filter(item=>{



return(


item.title.toLowerCase().includes(value)

||


item.category.toLowerCase().includes(value)

||


item.type.toLowerCase().includes(value)



);



});



renderTransactions(filtered);



});



}




//==========================================
// First Load
//==========================================


updateReportCards();


renderTransactions();


//==========================================
// Charts
//==========================================


let incomeExpenseChart;

let categoryChart;




//==========================================
// Monthly Report
//==========================================


function getMonthlyData(){


let months={};



transactions.forEach(item=>{


let month = item.date ? item.date.substring(0,7) : "بدون تاریخ";



if(!months[month]){


months[month]={

income:0,

expense:0

};


}



if(item.type==="income"){


months[month].income += item.amount;



}else{


months[month].expense += item.amount;



}



});



return months;


}





//==========================================
// Income Expense Chart
//==========================================


function createIncomeExpenseChart(){



const canvas =

document.getElementById("incomeExpenseChart");



if(!canvas)

return;



let data=getMonthlyData();



let labels=Object.keys(data);



let incomeValues=[];


let expenseValues=[];



labels.forEach(month=>{


incomeValues.push(data[month].income);



expenseValues.push(data[month].expense);



});




if(incomeExpenseChart){

incomeExpenseChart.destroy();

}



incomeExpenseChart = new Chart(canvas,{


type:"bar",


data:{


labels:labels,


datasets:[

{

label:"درآمد",

data:incomeValues

},


{

label:"هزینه",

data:expenseValues

}


]


},


options:{


responsive:true,


plugins:{


legend:{


position:"top"


}


}



}


});



}




//==========================================
// Expense Category Chart
//==========================================


function createCategoryChart(){



const canvas =

document.getElementById("categoryChart");



if(!canvas)

return;




let categories={};



transactions.forEach(item=>{



if(item.type==="expense"){



if(!categories[item.category]){


categories[item.category]=0;


}



categories[item.category]+=item.amount;



}



});




if(categoryChart){


categoryChart.destroy();


}




categoryChart=new Chart(canvas,{


type:"pie",


data:{


labels:Object.keys(categories),



datasets:[

{


data:Object.values(categories)


}


]


},



options:{


responsive:true


}


});




}





//==========================================
// Auto Save
//==========================================


window.addEventListener(

"beforeunload",

function(){


saveTransactions();


}

);




//==========================================
// ESC Close Modal
//==========================================


document.addEventListener(

"keydown",

function(e){



if(e.key==="Escape"){


closeModal();


}



}

);




//==========================================
// Overlay Close
//==========================================


const overlay =

document.getElementById("modalOverlay");



if(overlay){


overlay.addEventListener(

"click",

closeModal

);


}




//==========================================
// Initial Load
//==========================================


updateReportCards();


renderTransactions();


createIncomeExpenseChart();


createCategoryChart();



//==========================================
// END
//==========================================