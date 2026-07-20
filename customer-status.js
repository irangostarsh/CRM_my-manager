//==========================================
// Local Storage
//==========================================

let customerStatus =
JSON.parse(localStorage.getItem("customerStatus")) || [];

let editIndex = -1;

//==========================================
// Elements
//==========================================

const statusForm =
document.getElementById("statusForm");

const fullName =
document.getElementById("fullName");

const mobile =
document.getElementById("mobile");

const brand =
document.getElementById("brand");

const status =
document.getElementById("status");

const lastCall =
document.getElementById("lastCall");

const nextCall =
document.getElementById("nextCall");

const seller =
document.getElementById("seller");

const source =
document.getElementById("source");

const price =
document.getElementById("price");

const description =
document.getElementById("description");

const saveBtn =
document.getElementById("saveBtn");

//==========================================
// Cards
//==========================================

const allCustomers =
document.getElementById("allCustomers");

const acceptedCount =
document.getElementById("acceptedCount");

const halfCount =
document.getElementById("halfCount");

const cancelCount =
document.getElementById("cancelCount");

const followCount =
document.getElementById("followCount");

//==========================================
// Save
//==========================================

function saveData(){

localStorage.setItem(

"customerStatus",

JSON.stringify(customerStatus)

);

}

//==========================================
// Mobile Validation
//==========================================

function validMobile(number){

return /^09\d{9}$/.test(number);

}

//==========================================
// Register
//==========================================

statusForm.addEventListener(

"submit",

function(e){

e.preventDefault();

// اعتبار شماره موبایل

if(!validMobile(mobile.value.trim())){

alert("شماره موبایل معتبر نیست.");

mobile.focus();

return;

}

let customer={

fullName:fullName.value,

mobile:mobile.value,

brand:brand.value,

status:status.value,

lastCall:lastCall.value,

nextCall:nextCall.value,

seller:seller.value,

source:source.value,

price:price.value,

description:description.value,

createdAt:new Date().toLocaleString("fa-IR")

};

if(editIndex==-1){

customerStatus.push(customer);

}else{

customer.createdAt=

customerStatus[editIndex].createdAt;

customerStatus[editIndex]=customer;

editIndex=-1;

saveBtn.innerHTML="ثبت اطلاعات";

}

saveData();

updateCards();

renderTable();

statusForm.reset();

});

//==========================================
// Today
//==========================================

function today(){

return new Date()

.toISOString()

.split("T")[0];

}

//==========================================
// Need Follow
//==========================================

function needFollow(item){

if(!item.nextCall)

return false;

return item.nextCall <= today();

}


//==========================================
// Table
//==========================================

const statusTable =
document.getElementById("statusTable");

//==========================================
// Update Cards
//==========================================

function updateCards(){

let accepted=0;
let half=0;
let cancel=0;
let follow=0;

customerStatus.forEach(item=>{

switch(item.status){

case "قبول کرده":
accepted++;
break;

case "50 / 50":
half++;
break;

case "کنسل شده":
cancel++;
break;

case "نیاز به پیگیری":
follow++;
break;

}

});

allCustomers.innerHTML=customerStatus.length;

acceptedCount.innerHTML=accepted;

halfCount.innerHTML=half;

cancelCount.innerHTML=cancel;

followCount.innerHTML=follow;

}

//==========================================
// Status Class
//==========================================

function statusClass(value){

switch(value){

case "قبول کرده":
return "accepted";

case "50 / 50":
return "half";

case "در حال مذاکره":
return "negotiation";

case "نیاز به پیگیری":
return "follow";

case "کنسل شده":
return "cancel";

default:
return "";

}

}

//==========================================
// Render Table
//==========================================

function renderTable(list=customerStatus){

statusTable.innerHTML="";

list.forEach((item,index)=>{

statusTable.innerHTML+=`

<tr class="${needFollow(item) ? "need-call" : ""}">

<td>${index+1}</td>

<td>${item.fullName}</td>

<td>${item.mobile}</td>

<td>${item.brand}</td>

<td>

<span class="status-badge ${statusClass(item.status)}">

${item.status}

</span>

</td>

<td>${item.lastCall || "-"}</td>

<td>${item.nextCall || "-"}</td>

<td>${item.seller}</td>

<td>

${item.price ?

Number(item.price).toLocaleString("fa-IR")+" تومان"

:

"-"

}

</td>

<td>

<button
class="action-btn view"
onclick="viewCustomer(${index})">

👁

</button>

<button
class="action-btn edit"
onclick="editCustomer(${index})">

✏

</button>

<button
class="action-btn delete"
onclick="deleteCustomer(${index})">

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

function deleteCustomer(index){

if(!confirm("اطلاعات حذف شود؟"))

return;

customerStatus.splice(index,1);

saveData();

updateCards();

renderTable();

}

//==========================================
// Edit
//==========================================

function editCustomer(index){

let item=customerStatus[index];

fullName.value=item.fullName;

mobile.value=item.mobile;

brand.value=item.brand;

status.value=item.status;

lastCall.value=item.lastCall;

nextCall.value=item.nextCall;

seller.value=item.seller;

source.value=item.source;

price.value=item.price;

description.value=item.description;

editIndex=index;

saveBtn.innerHTML="ویرایش اطلاعات";

window.scrollTo({

top:0,

behavior:"smooth"

});

}

//==========================================
// View
//==========================================

function viewCustomer(index){

let item=customerStatus[index];

document.getElementById("modalBody").innerHTML=`

<h3>${item.fullName}</h3>

<hr>

<p><b>شماره موبایل :</b> ${item.mobile}</p>

<p><b>برند :</b> ${item.brand}</p>

<p><b>وضعیت :</b> ${item.status}</p>

<p><b>آخرین تماس :</b> ${item.lastCall || "-"}</p>

<p><b>تماس بعدی :</b> ${item.nextCall || "-"}</p>

<p><b>مسئول فروش :</b> ${item.seller}</p>

<p><b>روش آشنایی :</b> ${item.source}</p>

<p><b>مبلغ پیشنهادی :</b>

${item.price ?

Number(item.price).toLocaleString("fa-IR")+" تومان"

:

"-"}

</p>

<p><b>توضیحات :</b></p>

<p>${item.description || "-"}</p>

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

updateCards();

renderTable();

//==========================================
// Search
//==========================================

const search =
document.getElementById("search");

search.addEventListener("keyup",function(){

let value=this.value.trim().toLowerCase();

let filtered=customerStatus.filter(item=>{

return(

item.fullName.toLowerCase().includes(value)||

item.mobile.toLowerCase().includes(value)||

item.brand.toLowerCase().includes(value)||

item.seller.toLowerCase().includes(value)||

item.status.toLowerCase().includes(value)

);

});

currentPage=1;

renderTableWithPagination(filtered);

});

//==========================================
// Pagination
//==========================================

let currentPage=1;

const rowsPerPage=10;

function renderPagination(list){

const pagination=
document.getElementById("pagination");

pagination.innerHTML="";

let pages=Math.ceil(list.length/rowsPerPage);

if(pages<=1)return;

for(let i=1;i<=pages;i++){

let btn=document.createElement("button");

btn.innerHTML=i;

if(i===currentPage){

btn.classList.add("active");

}

btn.onclick=function(){

currentPage=i;

renderTableWithPagination(list);

};

pagination.appendChild(btn);

}

}

//==========================================
// Render Pagination Table
//==========================================

function renderTableWithPagination(list=customerStatus){

statusTable.innerHTML="";

let start=(currentPage-1)*rowsPerPage;

let end=start+rowsPerPage;

let pageItems=list.slice(start,end);

pageItems.forEach((item,index)=>{

statusTable.innerHTML+=`

<tr class="${needFollow(item) ? "need-call" : ""}">

<td>${start+index+1}</td>

<td>${item.fullName}</td>

<td>${item.mobile}</td>

<td>${item.brand}</td>

<td>

<span class="status-badge ${statusClass(item.status)}">

${item.status}

</span>

</td>

<td>${item.lastCall||"-"}</td>

<td>${item.nextCall||"-"}</td>

<td>${item.seller}</td>

<td>

${item.price?

Number(item.price).toLocaleString("fa-IR")+" تومان"

:"-"}

</td>

<td>

<button
class="action-btn view"
onclick="viewCustomer(${customerStatus.indexOf(item)})">

👁

</button>

<button
class="action-btn edit"
onclick="editCustomer(${customerStatus.indexOf(item)})">

✏

</button>

<button
class="action-btn delete"
onclick="deleteCustomer(${customerStatus.indexOf(item)})">

🗑

</button>

</td>

</tr>

`;

});

renderPagination(list);

}

//==========================================
// Reset Form
//==========================================

statusForm.addEventListener("reset",function(){

setTimeout(()=>{

editIndex=-1;

saveBtn.innerHTML="ثبت اطلاعات";

},50);

});

//==========================================
// Auto Save
//==========================================

window.addEventListener("beforeunload",function(){

saveData();

});

//==========================================
// ESC Close Modal
//==========================================

document.addEventListener("keydown",function(e){

if(e.key==="Escape"){

closeModal();

}

});

//==========================================
// Overlay Close
//==========================================

document

.getElementById("modalOverlay")

.addEventListener("click",closeModal);

//==========================================
// First Load
//==========================================

updateCards();

renderTableWithPagination();

//==========================================
// END
//==========================================