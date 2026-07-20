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


/*==================================================
            LIVE CHART MANAGER
==================================================*/

let incomeChart = null;
let expenseChart = null;
let profitChart = null;
let cashFlowChart = null;


/*==================================================
            MONTH LABELS
==================================================*/

const monthLabels = [
"فروردین",
"اردیبهشت",
"خرداد",
"تیر",
"مرداد",
"شهریور",
"مهر",
"آبان",
"آذر",
"دی",
"بهمن",
"اسفند"
];


/*==================================================
            BUILD CHART DATA
==================================================*/

function buildChartData(){

const income = new Array(12).fill(0);

const expense = new Array(12).fill(0);

finance.transactions.forEach(item=>{

const d = new Date(item.date);

const month = d.getMonth();

if(item.type==="income")
income[month]+=item.amount;

if(item.type==="expense")
expense[month]+=item.amount;

});

const profit = income.map((v,i)=>v-expense[i]);

return {

income,

expense,

profit

};

}


/*==================================================
            DESTROY OLD CHARTS
==================================================*/

function destroyCharts(){

if(incomeChart)
incomeChart.destroy();

if(expenseChart)
expenseChart.destroy();

if(profitChart)
profitChart.destroy();

if(cashFlowChart)
cashFlowChart.destroy();

}


/*==================================================
            CREATE CHARTS
==================================================*/

function createCharts(){

destroyCharts();

const data = buildChartData();



incomeChart = new Chart(

document.getElementById("incomeChart"),

{

type:"bar",

data:{

labels:monthLabels,

datasets:[{

label:"درآمد",

data:data.income,

backgroundColor:"#22c55e"

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

);



expenseChart = new Chart(

document.getElementById("expenseChart"),

{

type:"bar",

data:{

labels:monthLabels,

datasets:[{

label:"هزینه",

data:data.expense,

backgroundColor:"#ef4444"

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

);



profitChart = new Chart(

document.getElementById("profitChart"),

{

type:"line",

data:{

labels:monthLabels,

datasets:[{

label:"سود",

data:data.profit,

borderColor:"#2563eb",

backgroundColor:"rgba(37,99,235,.15)",

fill:true,

tension:.4

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

);



cashFlowChart = new Chart(

document.getElementById("cashFlowChart"),

{

type:"doughnut",

data:{

labels:[

"صندوق",

"بانک"

],

datasets:[{

data:[

finance.cash,

finance.bank

],

backgroundColor:[

"#16a34a",

"#2563eb"

]

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

);

}


/*==================================================
            UPDATE CHARTS
==================================================*/

function updateCharts(){

createCharts();

}


/*==================================================
            AUTO REFRESH
==================================================*/

function refreshDashboard(){

refreshSystem();

updateCharts();

}


/*==================================================
            AFTER SAVE
==================================================*/

function afterTransactionChanged(){

saveFinance();

refreshDashboard();

}


/*==================================================
            START
==================================================*/

window.addEventListener("load",()=>{

createCharts();

});



/*==================================================
        SMART ANALYZER ENGINE
==================================================*/

function updateSmartAnalyzer(){

updateTopCustomers();

updateTopProducts();

buildSmartAnalysis();

buildWarnings();

buildSuggestions();

updateActivityLog();

}


/*==================================================
        TOP CUSTOMERS
==================================================*/

function updateTopCustomers(){

const customers={};

finance.transactions.forEach(item=>{

if(item.type!="income") return;

const customer=item.customer || "بدون نام";

if(!customers[customer]){

customers[customer]={

count:0,

amount:0

};

}

customers[customer].count++;

customers[customer].amount+=item.amount;

});

const list=Object.entries(customers)

.sort((a,b)=>b[1].amount-a[1].amount);

const body=document.getElementById("topCustomersBody");

body.innerHTML="";

list.slice(0,10).forEach((item,index)=>{

body.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item[0]}</td>

<td>${item[1].count}</td>

<td>${money(item[1].amount)}</td>

</tr>

`;

});

}


/*==================================================
        TOP PRODUCTS
==================================================*/

function updateTopProducts(){

const products={};

finance.products.forEach(product=>{

if(!products[product.name]){

products[product.name]={

count:0,

amount:0

};

}

products[product.name].count+=product.count;

products[product.name].amount+=product.total;

});

const body=document.getElementById("topProductsBody");

body.innerHTML="";

Object.entries(products)

.sort((a,b)=>b[1].count-a[1].count)

.slice(0,10)

.forEach((item,index)=>{

body.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item[0]}</td>

<td>${item[1].count}</td>

<td>${money(item[1].amount)}</td>

</tr>

`;

});

}


/*==================================================
        SMART ANALYSIS
==================================================*/

function buildSmartAnalysis(){

const box=document.getElementById("analysisContainer");

box.innerHTML="";

let income=0;

let expense=0;

finance.transactions.forEach(item=>{

if(item.type==="income") income+=item.amount;

if(item.type==="expense") expense+=item.amount;

});

const profit=income-expense;

box.innerHTML+=`

<div class="analysisCard">

💰 مجموع درآمد

<br>

<b>${money(income)}</b>

</div>

`;

box.innerHTML+=`

<div class="analysisCard">

📉 مجموع هزینه

<br>

<b>${money(expense)}</b>

</div>

`;

box.innerHTML+=`

<div class="analysisCard">

💎 سود واقعی

<br>

<b>${money(profit)}</b>

</div>

`;

}


/*==================================================
        WARNINGS
==================================================*/

function buildWarnings(){

const box=document.getElementById("warningContainer");

box.innerHTML="";

if(finance.cash<0){

box.innerHTML+=`

<div class="warningItem">

⚠ موجودی صندوق منفی شده است.

</div>

`;

}

if(finance.bank<100000){

box.innerHTML+=`

<div class="warningItem">

⚠ موجودی بانک کم است.

</div>

`;

}

if(finance.transactions.length==0){

box.innerHTML+=`

<div class="warningItem">

⚠ هنوز تراکنشی ثبت نشده است.

</div>

`;

}

}


/*==================================================
        SMART SUGGESTIONS
==================================================*/

function buildSuggestions(){

const box=document.getElementById("suggestionContainer");

box.innerHTML="";

box.innerHTML+=`

<div class="suggestionItem">

📈 پیشنهاد می‌شود فروش این ماه را افزایش دهید.

</div>

`;

box.innerHTML+=`

<div class="suggestionItem">

💳 هزینه‌های غیرضروری را بررسی کنید.

</div>

`;

box.innerHTML+=`

<div class="suggestionItem">

🏦 بخشی از موجودی صندوق را به بانک منتقل کنید.

</div>

`;

}


/*==================================================
        LIVE ACTIVITY
==================================================*/

function updateActivityLog(){

const box=document.getElementById("liveActivityContainer");

box.innerHTML="";

finance.logs.slice(0,15).forEach(log=>{

box.innerHTML+=`

<div class="activityItem">

${log.date}

<br>

${log.action}

</div>

`;

});

}


/*==================================================
        AUTO UPDATE
==================================================*/

updateSmartAnalyzer();


/*==================================================
        SMART REPORT ENGINE
==================================================*/


/*==================================================
        CALCULATE REPORT DATA
==================================================*/

function getReportData(period="all"){

let income=0;

let expense=0;

let count=0;


const now=new Date();


finance.transactions.forEach(item=>{


const date=new Date(item.date);


let include=true;



if(period==="today"){

include=

date.toDateString()

===

now.toDateString();

}



if(period==="month"){

include=

date.getMonth()

===

now.getMonth()

&&

date.getFullYear()

===

now.getFullYear();

}



if(period==="year"){

include=

date.getFullYear()

===

now.getFullYear();

}



if(include){


count++;


if(item.type==="income"){

income+=item.amount;

}



if(item.type==="expense"){

expense+=item.amount;

}


}


});


return {

income,

expense,

profit:income-expense,

count

};


}



/*==================================================
        BUILD REPORT
==================================================*/

function generateSmartReport(period="month"){


const data=getReportData(period);


const box=

document.getElementById("smartReportBox");



box.innerHTML=`

<div class="reportCard">


<h3>

📊 گزارش مالی

</h3>


<p>

تعداد تراکنش:

<b>

${data.count}

</b>

</p>


<p>

💰 درآمد:

<b>

${money(data.income)}

</b>

</p>


<p>

📉 هزینه:

<b>

${money(data.expense)}

</b>

</p>


<p>

💎 سود:

<b>

${money(data.profit)}

</b>

</p>


</div>

`;



}



/*==================================================
        FINANCIAL HEALTH
==================================================*/

function calculateFinancialHealth(){


const data=getReportData("month");


let score=100;



if(data.profit<=0){

score-=40;

}



if(data.expense>data.income){

score-=30;

}



if(finance.transactions.length<5){

score-=20;

}



if(score<0)

score=0;



let status="";



if(score>=80)

status="عالی 🟢";


else if(score>=50)

status="متوسط 🟡";


else

status="ضعیف 🔴";



document.getElementById("healthScore")

.innerText=score;



document.getElementById("healthStatus")

.innerText=status;



document.getElementById("lastAnalyze")

.innerText=

new Date()

.toLocaleString("fa-IR");



}



/*==================================================
        COMPARE MONTHS
==================================================*/

function compareMonths(){


const now=new Date();


let current=0;

let previous=0;



finance.transactions.forEach(item=>{


const date=new Date(item.date);


if(item.type!=="income")

return;



if(

date.getMonth()

===

now.getMonth()

){

current+=item.amount;

}



if(

date.getMonth()

===

now.getMonth()-1

){

previous+=item.amount;

}


});



let result=0;


if(previous>0){

result=

Math.round(

((current-previous)/previous)*100

);

}



return result;


}



/*==================================================
        AI REPORT MESSAGE
==================================================*/

function createAIReport(){


const growth=compareMonths();


const box=

document.getElementById("analysisContainer");



if(!box) return;



box.innerHTML+=`

<div class="analysisCard">

🤖 تحلیل:

<br>

فروش شما نسبت به ماه قبل

<b>

${growth}٪

</b>

تغییر داشته است.

</div>

`;

}



/*==================================================
        EXPORT TEXT REPORT
==================================================*/

function exportTextReport(){


const data=getReportData("month");



const text=

`

گزارش مالی

----------------

درآمد:

${money(data.income)}


هزینه:

${money(data.expense)}


سود:

${money(data.profit)}


تعداد تراکنش:

${data.count}

`;



const blob=new Blob(

[text],

{

type:"text/plain"

}

);



const link=document.createElement("a");


link.href=

URL.createObjectURL(blob);



link.download=

"financial-report.txt";


link.click();


}



/*==================================================
        BUTTONS
==================================================*/


document

.getElementById("printReport")

?.addEventListener(

"click",

()=>window.print()

);



document

.getElementById("downloadPDF")

?.addEventListener(

"click",

()=>{

alert(

"بخش PDF در نسخه بعدی با موتور خروجی حرفه‌ای فعال می‌شود."

);

}

);



document

.getElementById("downloadExcel")

?.addEventListener(

"click",

exportTextReport

);



/*==================================================
        START REPORT
==================================================*/

generateSmartReport();

calculateFinancialHealth();

createAIReport();


/*==================================================
        SMART AI ASSISTANT ENGINE
==================================================*/


let chatHistory = 
JSON.parse(
localStorage.getItem("ai_chat_history")
)
|| [];



/*==================================================
        SAVE CHAT
==================================================*/

function saveChat(){

localStorage.setItem(

"ai_chat_history",

JSON.stringify(chatHistory)

);

}



/*==================================================
        ADD MESSAGE
==================================================*/

function addChatMessage(type,text){

const box =
document.getElementById("chatContainer");


const div=document.createElement("div");


div.className=

type==="user"

?

"userMessage"

:

"aiMessage";


div.innerHTML=text;


box.appendChild(div);


chatHistory.push({

type,

text,

date:new Date().toLocaleString("fa-IR")

});


saveChat();


box.scrollTop=box.scrollHeight;

}



/*==================================================
        FINANCIAL DATA ANALYSIS
==================================================*/

function getFinanceAnswer(question){


let q=question.toLowerCase();



let data=getReportData("month");



/* درآمد */

if(
q.includes("درآمد") ||
q.includes("فروش")
){

return`

💰 درآمد این ماه:

<b>

${money(data.income)}

</b>

`;

}



/* هزینه */

if(
q.includes("هزینه")
||
q.includes("خرج")
){

return`

📉 هزینه این ماه:

<b>

${money(data.expense)}

</b>

`;

}



/* سود */

if(
q.includes("سود")
||
q.includes("سودم")
){

return`

💎 سود تقریبی:

<b>

${money(data.profit)}

</b>

`;

}



/* تراکنش */

if(
q.includes("تراکنش")
){

return`

📋 تعداد تراکنش‌ها:

<b>

${finance.transactions.length}

</b>

`;

}



/* صندوق */

if(
q.includes("صندوق")
){

return`

👛 موجودی صندوق:

<b>

${money(finance.cash)}

</b>

`;

}



/* بانک */

if(
q.includes("بانک")
){

return`

🏦 موجودی بانک:

<b>

${money(finance.bank)}

</b>

`;

}



/* مشتری */

if(
q.includes("مشتری")
){

return`

👥 برای مشاهده مشتریان برتر، بخش تحلیل مشتریان را بررسی کنید.

`;

}



/* کالا */

if(
q.includes("کالا")
||
q.includes("محصول")
){

return`

📦 تحلیل کالاها از اطلاعات ثبت شده در سیستم انجام می‌شود.

`;

}



return null;


}





/*==================================================
        GENERAL AI ANSWER
==================================================*/

function getGeneralAnswer(question){


let q=question.toLowerCase();



if(
q.includes("سلام")
||
q.includes("درود")
){

return`

سلام 👋

من مدیر مالی هوشمند شما هستم.

می‌توانم اطلاعات مالی سیستم را تحلیل کنم.

`;

}



if(
q.includes("crm")
){

return`

CRM یعنی مدیریت ارتباط با مشتری.

سیستمی برای مدیریت مشتریان، فروش و ارتباطات است.

`;

}



if(
q.includes("html")
){

return`

HTML زبان ساختاردهی صفحات وب است.

`;

}



if(
q.includes("javascript")
||
q.includes("جاوا")
){

return`

JavaScript زبان برنامه‌نویسی برای ایجاد تعامل در صفحات وب است.

`;

}



if(
q.includes("خداحافظ")
){

return`

موفق باشید 🌱

`;

}



return`

من سوال شما را متوجه نشدم.

می‌توانید درباره درآمد، هزینه، سود، فروش یا اطلاعات عمومی سوال کنید.

`;

}





/*==================================================
        ASK AI
==================================================*/


function askSmartAI(){


const input=

document.getElementById("chatInput");


const question=

input.value.trim();



if(!question)

return;



addChatMessage(

"user",

question

);



let answer=

getFinanceAnswer(question);



if(!answer){

answer=

getGeneralAnswer(question);

}



setTimeout(()=>{


addChatMessage(

"ai",

answer

);


},

400);



input.value="";


}



/*==================================================
        BUTTON
==================================================*/


document

.getElementById("sendChat")

?.addEventListener(

"click",

askSmartAI

);



document

.getElementById("chatInput")

?.addEventListener(

"keypress",

function(e){

if(e.key==="Enter")

askSmartAI();

}

);



/*==================================================
        LOAD HISTORY
==================================================*/

window.addEventListener(

"load",

()=>{


chatHistory.forEach(item=>{


addChatMessage(

item.type,

item.text

);


});


}

);

/*==================================================
        SETTINGS MANAGER
==================================================*/


/*==================================================
        LOAD SETTINGS
==================================================*/

function loadSettings(){


document.getElementById("monthlyGoal").value=

finance.goal || 0;


document.getElementById("profitPercent").value=

finance.profitPercent || 30;


document.getElementById("taxPercent").value=

finance.taxPercent || 10;


document.getElementById("currency").value=

finance.currency || "تومان";


if(finance.profile){

document.getElementById("companyName")?.value=

finance.profile.company || "";

document.getElementById("ownerName")?.value=

finance.profile.owner || "";

}


applyTheme();


}



/*==================================================
        SAVE SETTINGS
==================================================*/

function saveSettings(){


finance.goal=

Number(

document.getElementById("monthlyGoal").value

)||0;



finance.profitPercent=

Number(

document.getElementById("profitPercent").value

)||0;



finance.taxPercent=

Number(

document.getElementById("taxPercent").value

)||0;



finance.currency=

document.getElementById("currency").value;



if(!finance.profile){

finance.profile={};

}



finance.profile.company=

document.getElementById("companyName")?.value || "";



finance.profile.owner=

document.getElementById("ownerName")?.value || "";



saveFinance();


addLog(

"تغییر تنظیمات سیستم"

);



refreshSystem();


alert(

"تنظیمات ذخیره شد"

);


}



/*==================================================
        DARK MODE
==================================================*/


function toggleDarkMode(){


finance.settings.darkMode=

!finance.settings.darkMode;


saveFinance();


applyTheme();


}



function applyTheme(){


if(

finance.settings

&&

finance.settings.darkMode

){


document.body.classList.add("dark");


}else{


document.body.classList.remove("dark");


}



}



/*==================================================
        LANGUAGE
==================================================*/


function changeLanguage(lang){


finance.settings.language=lang;


saveFinance();


if(lang==="en"){


document.documentElement.dir="ltr";


document.documentElement.lang="en";


}

else{


document.documentElement.dir="rtl";


document.documentElement.lang="fa";


}


}



/*==================================================
        AUTO SAVE INPUTS
==================================================*/


document

.querySelectorAll(

".financeSettings input"

)

.forEach(input=>{


input.addEventListener(

"change",

()=>{


saveFinance();


}

);


});



/*==================================================
        BUTTON EVENTS
==================================================*/


document

.getElementById("saveFinanceSettings")

?.addEventListener(

"click",

saveSettings

);



document

.getElementById("darkModeButton")

?.addEventListener(

"click",

toggleDarkMode

);



document

.getElementById("languageSelect")

?.addEventListener(

"change",

function(){

changeLanguage(this.value);

}

);



/*==================================================
        START
==================================================*/

loadSettings();

/*==================================================
        BACKUP & RESTORE MANAGER
==================================================*/


const BACKUP_VERSION = "1.0";



/*==================================================
        EXPORT DATA
==================================================*/

function exportBackup(){


const backup={


version:BACKUP_VERSION,


createdAt:new Date()
.toLocaleString("fa-IR"),


data:finance


};



const json=

JSON.stringify(

backup,

null,

2

);



const blob=new Blob(

[json],

{

type:"application/json"

}

);



const url=

URL.createObjectURL(blob);



const link=document.createElement("a");


link.href=url;


link.download=

"CRM-Finance-Backup.json";


link.click();



URL.revokeObjectURL(url);



addLog(

"ایجاد فایل پشتیبان"

);


}



/*==================================================
        IMPORT DATA
==================================================*/


function importBackup(file){


const reader=new FileReader();



reader.onload=function(e){


try{


const backup=

JSON.parse(e.target.result);



if(!backup.data){


throw "invalid";


}



if(

confirm(

"اطلاعات فعلی جایگزین شود؟"

)

){


finance=

backup.data;



saveFinance();



addLog(

"بازیابی اطلاعات"

);



alert(

"بازیابی انجام شد"

);



location.reload();



}



}

catch(error){


alert(

"فایل پشتیبان معتبر نیست"

);


}



};



reader.readAsText(file);



}



/*==================================================
        FILE SELECT
==================================================*/


document

.getElementById("importData")

?.addEventListener(

"click",

()=>{


document

.getElementById("jsonFile")

.click();



}

);



document

.getElementById("jsonFile")

?.addEventListener(

"change",

function(){


if(this.files.length){


importBackup(

this.files[0]

);


}


});



/*==================================================
        EXPORT BUTTON
==================================================*/


document

.getElementById("exportData")

?.addEventListener(

"click",

exportBackup

);



/*==================================================
        AUTO BACKUP
==================================================*/


function autoBackup(){


const backup={


time:Date.now(),


data:finance


};



localStorage.setItem(

"crm_auto_backup",

JSON.stringify(backup)

);


}



setInterval(

autoBackup,

60000

);



/*==================================================
        RESTORE AUTO BACKUP
==================================================*/


function restoreAutoBackup(){


const backup=

localStorage.getItem(

"crm_auto_backup"

);



if(!backup){


alert(

"بکاپ خودکاری وجود ندارد"

);


return;


}



const result=

JSON.parse(backup);



if(

confirm(

"بازگردانی آخرین بکاپ؟"

)

){


finance=result.data;


saveFinance();


location.reload();


}


}



/*==================================================
        DELETE ALL DATA
==================================================*/


function deleteAllData(){


const answer=

confirm(

"تمام اطلاعات مالی حذف شود؟ این کار برگشت ندارد!"

);



if(answer){


localStorage.removeItem(

"crm_finance_v4"

);



localStorage.removeItem(

"ai_chat_history"

);



alert(

"اطلاعات حذف شد"

);



location.reload();



}


}



document

.getElementById("resetFinance")

?.addEventListener(

"click",

deleteAllData

);



/*==================================================
        START
==================================================*/


console.log(

"Backup Manager Ready ✅"

);


/*==================================================
        CUSTOMER & PRODUCT MANAGER
==================================================*/


/*==================================================
        ADD CUSTOMER
==================================================*/

function addCustomer(data){


const customer={

id:Date.now(),

name:data.name,

phone:data.phone,

email:data.email,

address:data.address,

debt:Number(data.debt)||0,

purchases:[],

created:new Date()
.toLocaleString("fa-IR")

};



finance.customers.push(customer);


saveFinance();


addLog(

"ثبت مشتری جدید: "+data.name

);


renderCustomers();


}



/*==================================================
        RENDER CUSTOMERS
==================================================*/

function renderCustomers(){


const box=

document.getElementById(

"customerBody"

);


if(!box) return;



box.innerHTML="";



finance.customers.forEach((customer,index)=>{


box.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${customer.name}</td>

<td>${customer.phone || "-"}</td>

<td>${money(customer.debt)}</td>

<td>

<button onclick="editCustomer(${customer.id})">

✏️

</button>


<button onclick="deleteCustomer(${customer.id})">

🗑

</button>


</td>

</tr>

`;

});


}



/*==================================================
        DELETE CUSTOMER
==================================================*/

function deleteCustomer(id){


if(!confirm("حذف مشتری؟"))

return;



finance.customers=

finance.customers.filter(

c=>c.id!==id

);



saveFinance();


renderCustomers();


addLog(

"حذف مشتری"

);


}



/*==================================================
        EDIT CUSTOMER
==================================================*/

function editCustomer(id){


const customer=

finance.customers.find(

c=>c.id===id

);



if(!customer)

return;



document.getElementById("customerName").value=

customer.name;


document.getElementById("customerPhone").value=

customer.phone;


document.getElementById("customerDebt").value=

customer.debt;



deleteCustomer(id);


}



/*==================================================
        ADD PRODUCT
==================================================*/

function addProduct(data){


const product={


id:Date.now(),


name:data.name,


buy:Number(data.buy)||0,


sell:Number(data.sell)||0,


stock:Number(data.stock)||0,


sales:0,


created:new Date()
.toLocaleString("fa-IR")


};



finance.products.push(product);


saveFinance();


addLog(

"ثبت کالا: "+data.name

);


renderProducts();


}



/*==================================================
        PRODUCT TABLE
==================================================*/

function renderProducts(){


const box=

document.getElementById(

"productBody"

);



if(!box)

return;



box.innerHTML="";



finance.products.forEach((product,index)=>{


box.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${product.name}</td>

<td>${product.stock}</td>

<td>${money(product.sell)}</td>

<td>

<button onclick="editProduct(${product.id})">

✏️

</button>


<button onclick="deleteProduct(${product.id})">

🗑

</button>

</td>

</tr>

`;

});


}



/*==================================================
        DELETE PRODUCT
==================================================*/

function deleteProduct(id){


finance.products=

finance.products.filter(

p=>p.id!==id

);



saveFinance();


renderProducts();


}



/*==================================================
        UPDATE STOCK
==================================================*/

function updateStock(productId,count){


const product=

finance.products.find(

p=>p.id===productId

);



if(product){


product.stock-=count;


product.sales+=count;


}



saveFinance();


renderProducts();


}



/*==================================================
        CUSTOMER PURCHASE
==================================================*/

function addCustomerPurchase(

customerId,

invoice

){



const customer=

finance.customers.find(

c=>c.id===customerId

);



if(!customer)

return;



customer.purchases.push(invoice);



customer.debt+=

invoice.remaining || 0;



saveFinance();


}



/*==================================================
        TOP SELLING PRODUCTS
==================================================*/

function getBestProducts(){


return finance.products

.sort(

(a,b)=>b.sales-a.sales

)

.slice(0,10);


}



/*==================================================
        START
==================================================*/

renderCustomers();

renderProducts();


console.log(

"Customer & Product Manager Ready ✅"

);


/*==================================================
        SMART INVOICE MANAGER
==================================================*/


let currentInvoiceItems = [];



/*==================================================
        CREATE INVOICE
==================================================*/


function createInvoice(){


const invoice={


id:Date.now(),


number:

"INV-"+Date.now(),


customer:

document.getElementById("invoiceCustomer")?.value || "",


items:

currentInvoiceItems,


discount:

Number(

document.getElementById("invoiceDiscount")?.value

)||0,


tax:

Number(

document.getElementById("invoiceTax")?.value

)||0,


paid:

Number(

document.getElementById("invoicePaid")?.value

)||0,


date:

new Date()

.toLocaleDateString("fa-IR")


};



invoice.subTotal=

calculateInvoiceTotal();



invoice.total=

invoice.subTotal

-

invoice.discount

+

invoice.tax;



invoice.remaining=

invoice.total

-

invoice.paid;



if(!finance.invoices){

finance.invoices=[];

}



finance.invoices.push(invoice);



updateInventory(invoice);


updateCustomer(invoice);


saveFinance();



addLog(

"ساخت فاکتور "+invoice.number

);



currentInvoiceItems=[];


renderInvoice();


alert(

"فاکتور ذخیره شد"

);


}



/*==================================================
        ADD ITEM
==================================================*/


function addInvoiceItem(){


const productId=

Number(

document.getElementById("invoiceProduct").value

);



const count=

Number(

document.getElementById("invoiceCount").value

);



const product=

finance.products.find(

p=>p.id===productId

);



if(!product)

return;



const item={


id:product.id,


name:product.name,


count,


price:product.sell,


total:

count*

product.sell


};



currentInvoiceItems.push(item);



renderInvoice();



}



/*==================================================
        CALCULATE TOTAL
==================================================*/

function calculateInvoiceTotal(){


let total=0;



currentInvoiceItems.forEach(item=>{


total+=item.total;


});


return total;


}



/*==================================================
        RENDER INVOICE
==================================================*/

function renderInvoice(){


const box=

document.getElementById(

"invoiceItems"

);



if(!box)

return;



box.innerHTML="";



currentInvoiceItems.forEach((item,index)=>{


box.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item.name}</td>

<td>${item.count}</td>

<td>${money(item.price)}</td>

<td>${money(item.total)}</td>

<td>

<button onclick="removeInvoiceItem(${index})">

❌

</button>

</td>

</tr>

`;

});



const total=

calculateInvoiceTotal();



document.getElementById(

"invoiceSubtotal"

).innerText=

money(total);



}



/*==================================================
        REMOVE ITEM
==================================================*/


function removeInvoiceItem(index){


currentInvoiceItems.splice(

index,

1

);



renderInvoice();


}



/*==================================================
        UPDATE STOCK
==================================================*/

function updateInventory(invoice){



invoice.items.forEach(item=>{


const product=

finance.products.find(

p=>p.id===item.id

);



if(product){


product.stock-=item.count;


product.sales+=item.count;


}



});


}



/*==================================================
        UPDATE CUSTOMER
==================================================*/


function updateCustomer(invoice){


const customer=

finance.customers.find(

c=>c.name===invoice.customer

);



if(customer){


customer.purchases.push(invoice);


customer.debt+=invoice.remaining;


}


}



/*==================================================
        SEARCH INVOICES
==================================================*/

function renderInvoices(){


const box=

document.getElementById(

"invoiceBody"

);



if(!box)

return;



box.innerHTML="";



if(!finance.invoices)

return;



finance.invoices.forEach((inv,index)=>{


box.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${inv.number}</td>

<td>${inv.customer}</td>

<td>${money(inv.total)}</td>

<td>${money(inv.remaining)}</td>

<td>${inv.date}</td>

<td>

<button>

📄

</button>

</td>

</tr>

`;

});


}



/*==================================================
        PRINT INVOICE
==================================================*/

function printInvoice(){


window.print();


}



/*==================================================
        START
==================================================*/


if(!finance.invoices){

finance.invoices=[];

saveFinance();

}


renderInvoices();


console.log(

"Smart Invoice Manager Ready ✅"

);

/*==================================================
        SYSTEM CORE ENGINE
==================================================*/


const SystemCore = {


    version:"4.0",


    initialized:false,



    /*==============================================
            START SYSTEM
    ==============================================*/

    init:function(){


        if(this.initialized)

            return;


        this.initialized=true;


        this.connectEvents();


        this.refreshAll();


        addLog(

        "سیستم هوشمند راه‌اندازی شد"

        );


        console.log(

        "Smart CRM System Ready ✅"

        );


    },



    /*==============================================
            CONNECT MODULES
    ==============================================*/

    connectEvents:function(){



        window.addEventListener(

        "financeUpdated",

        ()=>{


            this.refreshAll();


        });


    },



    /*==============================================
            GLOBAL REFRESH
    ==============================================*/

    refreshAll:function(){


        try{


            saveFinance();



            updateDashboard();



            updateDashboardCards();



            calculateProfit();



            renderTransactions();



            renderCustomers();



            renderProducts();



            renderInvoices();



            updateSmartAnalyzer();



            generateSmartReport();



            calculateFinancialHealth();



            updateCharts();



            updateStatus();



        }

        catch(error){


            console.error(

            "System Error:",

            error

            );


        }



    }



};





/*==================================================
        EVENT DISPATCHER
==================================================*/


function systemUpdate(){


window.dispatchEvent(

new Event(

"financeUpdated"

)

);


}



/*==================================================
        OVERRIDE SAVE
==================================================*/


const oldSaveFinance = saveFinance;


saveFinance=function(){


oldSaveFinance();


systemUpdate();


};





/*==================================================
        DATA VALIDATION
==================================================*/

function validateSystem(){


if(!finance.transactions)

finance.transactions=[];


if(!finance.customers)

finance.customers=[];


if(!finance.products)

finance.products=[];


if(!finance.invoices)

finance.invoices=[];


if(!finance.logs)

finance.logs=[];



saveFinance();


}





/*==================================================
        ERROR PROTECTION
==================================================*/

window.onerror=function(

message,

source,

line

){


addLog(

"خطای سیستم در خط "+line

);


return false;


};





/*==================================================
        START APPLICATION
==================================================*/


validateSystem();


SystemCore.init();
