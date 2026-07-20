//==========================================
// Local Storage
//==========================================

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let editIndex = -1;

//==========================================
// Elements
//==========================================

const orderForm = document.getElementById("orderForm");

const fullname = document.getElementById("fullname");

const mobile = document.getElementById("mobile");

const brand = document.getElementById("brand");

const type = document.getElementById("type");

const time = document.getElementById("time");

const status = document.getElementById("status");

const price = document.getElementById("price");

const discount = document.getElementById("discount");

const paid = document.getElementById("paid");

const remain = document.getElementById("remain");

const paymentType = document.getElementById("paymentType");

const checkCount = document.getElementById("checkCount");

const checkCountBox = document.getElementById("checkCountBox");

const checksContainer = document.getElementById("checksContainer");

const address = document.getElementById("address");

const saveBtn = document.getElementById("saveBtn");

//==========================================
// Save
//==========================================

function saveOrders(){

localStorage.setItem(

"orders",

JSON.stringify(orders)

);

}

//==========================================
// Date
//==========================================

function getDate(){

return new Date().toLocaleString("fa-IR");

}

//==========================================
// Calculate Remain
//==========================================

function calculateRemain(){

let total = Number(price.value) || 0;

let dis = Number(discount.value) || 0;

let pay = Number(paid.value) || 0;

remain.value = total - dis - pay;

}

price.addEventListener("input",calculateRemain);

discount.addEventListener("input",calculateRemain);

paid.addEventListener("input",calculateRemain);

//==========================================
// Payment Type
//==========================================

paymentType.addEventListener("change",function(){

if(this.value=="چک"){

checkCountBox.style.display="block";

createChecks();

}else{

checkCountBox.style.display="none";

checksContainer.innerHTML="";

}

});

//==========================================
// Check Count
//==========================================

checkCount.addEventListener("input",createChecks);

//==========================================
// Create Checks
//==========================================

function createChecks(){

checksContainer.innerHTML="";

let count = Number(checkCount.value);

if(count<1)return;

for(let i=1;i<=count;i++){

checksContainer.innerHTML+=`

<div class="check-card">

<h3>

چک شماره ${i}

</h3>

<div class="grid">

<div>

<label>

مبلغ چک

</label>

<input
type="number"
class="checkPrice">

</div>

<div>

<label>

تاریخ سررسید

</label>

<input
type="date"
class="checkDate">

</div>

<div>

<label>

شماره صیادی

</label>

<input
type="text"
class="checkCode">

</div>

</div>

</div>

`;

}

}

//==========================================
// Register Order
//==========================================

orderForm.addEventListener(

"submit",

function(e){

e.preventDefault();

let checks=[];

document.querySelectorAll(".check-card").forEach(card=>{

checks.push({

price:

card.querySelector(".checkPrice").value,

date:

card.querySelector(".checkDate").value,

code:

card.querySelector(".checkCode").value

});

});

let order={

fullname:fullname.value,

mobile:mobile.value,

brand:brand.value,

type:type.value,

time:time.value,

status:status.value,

price:Number(price.value),

discount:Number(discount.value),

paid:Number(paid.value),

remain:Number(remain.value),

paymentType:paymentType.value,

checkCount:Number(checkCount.value),

checks:checks,

address:address.value,

date:getDate()

};

if(editIndex==-1){

orders.push(order);

}else{

order.date=orders[editIndex].date;

orders[editIndex]=order;

editIndex=-1;

saveBtn.innerHTML="ثبت سفارش";

}

saveOrders();

renderTable();

updateCards();

orderForm.reset();

remain.value="";

checksContainer.innerHTML="";

checkCountBox.style.display="none";

});

//==========================================
// Cards
//==========================================

const orderCount = document.getElementById("orderCount");
const totalPrice = document.getElementById("totalPrice");
const paidPrice = document.getElementById("paidPrice");
const remainPrice = document.getElementById("remainPrice");
const orderTable = document.getElementById("orderTable");

function updateCards(){

    let total=0;
    let paidTotal=0;
    let remainTotal=0;

    orders.forEach(item=>{

        total += Number(item.price);
        paidTotal += Number(item.paid);
        remainTotal += Number(item.remain);

    });

    orderCount.innerHTML=orders.length;

    totalPrice.innerHTML=
    total.toLocaleString("fa-IR");

    paidPrice.innerHTML=
    paidTotal.toLocaleString("fa-IR");

    remainPrice.innerHTML=
    remainTotal.toLocaleString("fa-IR");

}

//==========================================
// Render Table
//==========================================

function renderTable(list=orders){

    orderTable.innerHTML="";

    list.forEach((item,index)=>{

        orderTable.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item.fullname}</td>

<td>${item.type}</td>

<td>${item.brand}</td>

<td>${item.time}</td>

<td>${Number(item.price).toLocaleString("fa-IR")}</td>

<td>${Number(item.discount).toLocaleString("fa-IR")}</td>

<td>${Number(item.paid).toLocaleString("fa-IR")}</td>

<td>${Number(item.remain).toLocaleString("fa-IR")}</td>

<td>${item.paymentType}</td>

<td>${item.status}</td>

<td>${item.date}</td>

<td>

<button
class="action-btn view"
onclick="viewOrder(${index})">

👁

</button>

<button
class="action-btn edit"
onclick="editOrder(${index})">

✏

</button>

<button
class="action-btn delete"
onclick="deleteOrder(${index})">

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

function deleteOrder(index){

if(!confirm("سفارش حذف شود؟"))

return;

orders.splice(index,1);

saveOrders();

renderTable();

updateCards();

}

//==========================================
// Edit
//==========================================

function editOrder(index){

let item=orders[index];

fullname.value=item.fullname;
mobile.value=item.mobile;
brand.value=item.brand;
type.value=item.type;
time.value=item.time;
status.value=item.status;

price.value=item.price;
discount.value=item.discount;
paid.value=item.paid;
remain.value=item.remain;

paymentType.value=item.paymentType;

address.value=item.address;

editIndex=index;

saveBtn.innerHTML="ویرایش سفارش";

// نمایش بخش چک

if(item.paymentType=="چک"){

checkCountBox.style.display="block";

checkCount.value=item.checkCount;

createChecks();

setTimeout(()=>{

document.querySelectorAll(".check-card").forEach((card,i)=>{

card.querySelector(".checkPrice").value=item.checks[i].price;

card.querySelector(".checkDate").value=item.checks[i].date;

card.querySelector(".checkCode").value=item.checks[i].code;

});

},100);

}else{

checkCountBox.style.display="none";

checksContainer.innerHTML="";

}

window.scrollTo({

top:0,

behavior:"smooth"

});

}

//==========================================
// View Details
//==========================================

function viewOrder(index){

let item=orders[index];

let html=`

<h3>${item.fullname}</h3>

<hr>

<p><b>شماره موبایل:</b> ${item.mobile}</p>

<p><b>نام برند:</b> ${item.brand}</p>

<p><b>نوع سفارش:</b> ${item.type}</p>

<p><b>زمان توسعه:</b> ${item.time}</p>

<p><b>مبلغ قرارداد:</b> ${Number(item.price).toLocaleString("fa-IR")}</p>

<p><b>تخفیف:</b> ${Number(item.discount).toLocaleString("fa-IR")}</p>

<p><b>پرداختی:</b> ${Number(item.paid).toLocaleString("fa-IR")}</p>

<p><b>مانده:</b> ${Number(item.remain).toLocaleString("fa-IR")}</p>

<p><b>نوع پرداخت:</b> ${item.paymentType}</p>

<p><b>وضعیت:</b> ${item.status}</p>

<p><b>آدرس:</b> ${item.address}</p>

<p><b>تاریخ ثبت:</b> ${item.date}</p>

`;

if(item.paymentType=="چک"){

html+="<hr><h3>اطلاعات چک‌ها</h3>";

item.checks.forEach((check,i)=>{

html+=`

<div class="check-view">

<h4>چک شماره ${i+1}</h4>

<p>مبلغ: ${Number(check.price).toLocaleString("fa-IR")}</p>

<p>سررسید: ${check.date}</p>

<p>شماره صیادی: ${check.code}</p>

</div>

`;

});

}

document.getElementById("modalBody").innerHTML=html;

document.getElementById("detailsModal").classList.add("active");

document.getElementById("modalOverlay").classList.add("active");

}

function closeModal(){

document.getElementById("detailsModal").classList.remove("active");

document.getElementById("modalOverlay").classList.remove("active");

}

updateCards();

renderTable();

//==========================================
// Search
//==========================================

const search = document.getElementById("search");

search.addEventListener("keyup",function(){

let value=this.value.trim().toLowerCase();

let filtered=orders.filter(item=>{

return(

item.fullname.toLowerCase().includes(value)

||

item.mobile.includes(value)

||

item.brand.toLowerCase().includes(value)

||

item.type.toLowerCase().includes(value)

||

item.status.toLowerCase().includes(value)

);

});

currentPage=1;

renderTable(filtered);

});

//==========================================
// Pagination
//==========================================

let currentPage=1;

const rowsPerPage=10;

function renderPagination(list){

const pagination=document.getElementById("pagination");

pagination.innerHTML="";

let pages=Math.ceil(list.length/rowsPerPage);

if(pages<=1)return;

for(let i=1;i<=pages;i++){

let btn=document.createElement("button");

btn.innerHTML=i;

if(i==currentPage){

btn.classList.add("active");

}

btn.onclick=function(){

currentPage=i;

renderTableWithPagination(list);

}

pagination.appendChild(btn);

}

}

function renderTableWithPagination(list=orders){

orderTable.innerHTML="";

let start=(currentPage-1)*rowsPerPage;

let end=start+rowsPerPage;

let pageItems=list.slice(start,end);

pageItems.forEach((item,index)=>{

orderTable.innerHTML+=`

<tr>

<td>${start+index+1}</td>

<td>${item.fullname}</td>

<td>${item.type}</td>

<td>${item.brand}</td>

<td>${item.time}</td>

<td>${Number(item.price).toLocaleString("fa-IR")}</td>

<td>${Number(item.discount).toLocaleString("fa-IR")}</td>

<td>${Number(item.paid).toLocaleString("fa-IR")}</td>

<td>${Number(item.remain).toLocaleString("fa-IR")}</td>

<td>${item.paymentType}</td>

<td>${item.status}</td>

<td>${item.date}</td>

<td>

<button
class="action-btn view"
onclick="viewOrder(${orders.indexOf(item)})">

👁

</button>

<button
class="action-btn edit"
onclick="editOrder(${orders.indexOf(item)})">

✏

</button>

<button
class="action-btn delete"
onclick="deleteOrder(${orders.indexOf(item)})">

🗑

</button>

</td>

</tr>

`;

});

renderPagination(list);

}

//==========================================
// Validation
//==========================================

mobile.addEventListener("input",function(){

this.value=this.value.replace(/\D/g,'');

});

price.addEventListener("input",function(){

this.value=this.value.replace(/\D/g,'');

calculateRemain();

});

discount.addEventListener("input",function(){

this.value=this.value.replace(/\D/g,'');

calculateRemain();

});

paid.addEventListener("input",function(){

this.value=this.value.replace(/\D/g,'');

calculateRemain();

});

//==========================================
// Reset Form
//==========================================

orderForm.addEventListener("reset",function(){

setTimeout(()=>{

remain.value="";

paymentType.value="نقدی";

checkCount.value=1;

checkCountBox.style.display="none";

checksContainer.innerHTML="";

editIndex=-1;

saveBtn.innerHTML="ثبت سفارش";

},50);

});

//==========================================
// Auto Save
//==========================================

window.addEventListener("beforeunload",function(){

saveOrders();

});

//==========================================
// First Load
//==========================================

updateCards();

renderTableWithPagination();

//==========================================
// Close Modal By ESC
//==========================================

document.addEventListener("keydown",function(e){

if(e.key==="Escape"){

closeModal();

}

});

//==========================================
// Close Modal By Click
//==========================================

document.getElementById("modalOverlay")

.addEventListener("click",closeModal);

//==========================================
// END
//==========================================