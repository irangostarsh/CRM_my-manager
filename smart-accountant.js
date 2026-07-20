/*==================================================
        SMART ACCOUNTANT V4
        CORE SYSTEM
==================================================*/

const STORAGE_KEY = "crm_finance_v4";

/*==================================================
        DEFAULT DATABASE
==================================================*/

const defaultFinanceData = {

    profile: {

        company: "",

        owner: ""

    },

    cash: 0,

    bank: 0,

    receivable: 0,

    payable: 0,

    goal: 0,

    profitPercent: 30,

    taxPercent: 10,

    currency: "تومان",

    transactions: [],

    customers: [],

    products: [],

    logs: [],

    settings: {

        darkMode: false,

        language: "fa"

    }

};


/*==================================================
        DATABASE
==================================================*/

let finance = loadFinance();


/*==================================================
        LOAD DATABASE
==================================================*/

function loadFinance(){

    const saved = localStorage.getItem(STORAGE_KEY);

    if(saved){

        try{

            return JSON.parse(saved);

        }catch(e){

            console.error(e);

        }

    }

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(defaultFinanceData)

    );

    return structuredClone(defaultFinanceData);

}


/*==================================================
        SAVE DATABASE
==================================================*/

function saveFinance(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(finance)

    );

}


/*==================================================
        RESET DATABASE
==================================================*/

function resetFinance(){

    if(confirm("تمام اطلاعات حذف شود؟")){

        finance = structuredClone(defaultFinanceData);

        saveFinance();

        location.reload();

    }

}


/*==================================================
        SYSTEM LOG
==================================================*/

function addLog(action){

    finance.logs.unshift({

        action,

        date:new Date().toLocaleString("fa-IR")

    });

    if(finance.logs.length>300){

        finance.logs.pop();

    }

    saveFinance();

}


/*==================================================
        UPDATE STATUS
==================================================*/

function updateStatus(){

    document.getElementById("lastUpdate").innerText =

    new Date().toLocaleString("fa-IR");

}


/*==================================================
        FORMAT MONEY
==================================================*/

function money(value){

    value = Number(value)||0;

    return value.toLocaleString("fa-IR")+

    " "+finance.currency;

}


/*==================================================
        UPDATE DASHBOARD
==================================================*/

function updateDashboard(){

    document.getElementById("cashAmount").innerText=

    money(finance.cash);

    document.getElementById("bankAmount").innerText=

    money(finance.bank);

    document.getElementById("receivableAmount").innerText=

    money(finance.receivable);

    document.getElementById("payableAmount").innerText=

    money(finance.payable);

    document.getElementById("goalAmount").innerText=

    money(finance.goal);

}


/*==================================================
        CALCULATE NET PROFIT
==================================================*/

function calculateProfit(){

    let income=0;

    let expense=0;

    finance.transactions.forEach(item=>{

        if(item.type==="income"){

            income+=item.amount;

        }

        if(item.type==="expense"){

            expense+=item.amount;

        }

    });

    const profit=income-expense;

    document.getElementById("netProfit").innerText=

    money(profit);

}


/*==================================================
        INITIALIZE
==================================================*/

window.addEventListener("load",()=>{

    updateDashboard();

    calculateProfit();

    updateStatus();

});


/*==================================================
        TRANSACTIONS MANAGER
==================================================*/

const transactionForm =
document.getElementById("transactionForm");

const transactionBody =
document.getElementById("transactionBody");


/*==================================================
        SAVE TRANSACTION
==================================================*/

transactionForm.addEventListener("submit",function(e){

e.preventDefault();

const transaction={

id:Date.now(),

type:document.getElementById("transactionType").value,

title:document.getElementById("transactionTitle").value,

amount:Number(document.getElementById("transactionAmount").value),

category:document.getElementById("transactionCategory").value,

account:document.getElementById("transactionAccount").value,

date:document.getElementById("transactionDate").value,

description:document.getElementById("transactionDescription").value

};

finance.transactions.push(transaction);

updateAccounts(transaction);

saveFinance();

addLog("ثبت تراکنش : "+transaction.title);

renderTransactions();

updateDashboard();

calculateProfit();

transactionForm.reset();

});


/*==================================================
        UPDATE ACCOUNTS
==================================================*/

function updateAccounts(item){

switch(item.account){

case "صندوق":

if(item.type=="income") finance.cash+=item.amount;

if(item.type=="expense") finance.cash-=item.amount;

break;

case "بانک":

if(item.type=="income") finance.bank+=item.amount;

if(item.type=="expense") finance.bank-=item.amount;

break;

case "کارت":

if(item.type=="income") finance.bank+=item.amount;

if(item.type=="expense") finance.bank-=item.amount;

break;

}

}


/*==================================================
        RENDER TABLE
==================================================*/

function renderTransactions(){

transactionBody.innerHTML="";

finance.transactions.forEach((item,index)=>{

transactionBody.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item.type}</td>

<td>${item.title}</td>

<td>${money(item.amount)}</td>

<td>${item.category}</td>

<td>${item.account}</td>

<td>${item.date}</td>

<td>

<button onclick="editTransaction(${item.id})">

✏️

</button>

<button onclick="deleteTransaction(${item.id})">

🗑

</button>

</td>

</tr>

`;

});

updateSummary();

}


/*==================================================
        DELETE
==================================================*/

function deleteTransaction(id){

if(!confirm("حذف شود؟")) return;

finance.transactions=

finance.transactions.filter(t=>t.id!=id);

saveFinance();

renderTransactions();

updateDashboard();

calculateProfit();

addLog("حذف تراکنش");

}


/*==================================================
        EDIT
==================================================*/

function editTransaction(id){

const item=

finance.transactions.find(t=>t.id==id);

if(!item) return;

document.getElementById("transactionType").value=item.type;

document.getElementById("transactionTitle").value=item.title;

document.getElementById("transactionAmount").value=item.amount;

document.getElementById("transactionCategory").value=item.category;

document.getElementById("transactionAccount").value=item.account;

document.getElementById("transactionDate").value=item.date;

document.getElementById("transactionDescription").value=item.description;

deleteTransaction(id);

}


/*==================================================
        SUMMARY
==================================================*/

function updateSummary(){

let income=0;

let expense=0;

finance.transactions.forEach(item=>{

if(item.type=="income") income+=item.amount;

if(item.type=="expense") expense+=item.amount;

});

document.getElementById("totalIncome").innerText=

money(income);

document.getElementById("totalExpense").innerText=

money(expense);

document.getElementById("balanceAmount").innerText=

money(income-expense);

document.getElementById("transactionCount").innerText=

finance.transactions.length;

}


/*==================================================
        SEARCH
==================================================*/

document

.getElementById("searchTransaction")

.addEventListener("input",function(){

const value=this.value.toLowerCase();

const rows=transactionBody.querySelectorAll("tr");

rows.forEach(row=>{

row.style.display=

row.innerText.toLowerCase().includes(value)

?

""

:

"none";

});

});


/*==================================================
        FILTER
==================================================*/

document

.getElementById("filterType")

.addEventListener("change",function(){

const value=this.value;

const rows=transactionBody.querySelectorAll("tr");

rows.forEach(row=>{

if(value=="all"){

row.style.display="";

}else{

row.style.display=

row.children[1].innerText==value

?

""

:

"none";

}

});

});


/*==================================================
        START
==================================================*/

renderTransactions();


/*==================================================
            ACCOUNT MANAGER
==================================================*/

function recalculateAccounts(){

finance.cash=0;
finance.bank=0;

let income=0;
let expense=0;

finance.transactions.forEach(item=>{

    if(item.account==="صندوق"){

        if(item.type==="income")
            finance.cash+=item.amount;

        if(item.type==="expense")
            finance.cash-=item.amount;

    }

    if(item.account==="بانک" || item.account==="کارت"){

        if(item.type==="income")
            finance.bank+=item.amount;

        if(item.type==="expense")
            finance.bank-=item.amount;

    }

    if(item.type==="income")
        income+=item.amount;

    if(item.type==="expense")
        expense+=item.amount;

});

finance.netProfit=income-expense;

saveFinance();

}


/*==================================================
            ANIMATE NUMBER
==================================================*/

function animateValue(id,end){

const el=document.getElementById(id);

if(!el) return;

let start=0;

const duration=800;

const step=Math.max(1,Math.ceil(end/60));

const timer=setInterval(()=>{

    start+=step;

    if(start>=end){

        start=end;

        clearInterval(timer);

    }

    el.innerText=money(start);

},duration/60);

}


/*==================================================
            UPDATE DASHBOARD
==================================================*/

function updateDashboardCards(){

animateValue("cashAmount",finance.cash);

animateValue("bankAmount",finance.bank);

animateValue("receivableAmount",finance.receivable);

animateValue("payableAmount",finance.payable);

animateValue("goalAmount",finance.goal);

animateValue("netProfit",finance.netProfit||0);

}


/*==================================================
            TODAY CALCULATE
==================================================*/

function calculateToday(){

let income=0;
let expense=0;

const today=new Date().toLocaleDateString("fa-IR");

finance.transactions.forEach(item=>{

    const d=new Date(item.date)
    .toLocaleDateString("fa-IR");

    if(d===today){

        if(item.type==="income")
            income+=item.amount;

        if(item.type==="expense")
            expense+=item.amount;

    }

});

const profit=income-expense;

document.getElementById("todayIncome").innerText=
money(income);

document.getElementById("todayExpense").innerText=
money(expense);

document.getElementById("todayProfit").innerText=
money(profit);

}


/*==================================================
            MONTH CALCULATE
==================================================*/

function calculateMonth(){

let sale=0;

const now=new Date();

finance.transactions.forEach(item=>{

    const d=new Date(item.date);

    if(
        d.getMonth()===now.getMonth()
        &&
        d.getFullYear()===now.getFullYear()
    ){

        if(item.type==="income")
            sale+=item.amount;

    }

});

document.getElementById("monthSale").innerText=
money(sale);

}


/*==================================================
            REFRESH SYSTEM
==================================================*/

function refreshSystem(){

recalculateAccounts();

updateDashboardCards();

updateSummary();

calculateProfit();

calculateToday();

calculateMonth();

renderTransactions();

updateStatus();

}


/*==================================================
            REFRESH BUTTON
==================================================*/

document
.getElementById("refreshDashboard")
.addEventListener("click",()=>{

refreshSystem();

addLog("بروزرسانی داشبورد");

});


/*==================================================
            AUTO SAVE
==================================================*/

setInterval(()=>{

saveFinance();

},5000);


/*==================================================
            FIRST RUN
==================================================*/

refreshSystem();

console.log("Account Manager Ready");