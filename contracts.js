//=========================================
// Local Storage
//=========================================

let contracts =
JSON.parse(localStorage.getItem("contracts")) || [];

let editIndex = -1;

//=========================================
// Elements
//=========================================

const contractForm = document.getElementById("contractForm");

const title = document.getElementById("title");

const category = document.getElementById("category");

const file = document.getElementById("file");

const important = document.getElementById("important");

const description = document.getElementById("description");

const saveBtn = document.getElementById("saveBtn");

//=========================================
// Cards
//=========================================

const fileCount = document.getElementById("fileCount");

const pdfCount = document.getElementById("pdfCount");

const imageCount = document.getElementById("imageCount");

const importantCount =
document.getElementById("importantCount");

//=========================================
// Save
//=========================================

function saveContracts(){

localStorage.setItem(

"contracts",

JSON.stringify(contracts)

);

}

//=========================================
// Date
//=========================================

function getDate(){

return new Date().toLocaleString("fa-IR");

}

//=========================================
// File Reader
//=========================================

function readFile(selectedFile){

return new Promise((resolve)=>{

if(!selectedFile){

resolve(null);

return;

}

const reader=new FileReader();

reader.onload=function(e){

resolve(e.target.result);

}

reader.readAsDataURL(selectedFile);

});

}

//=========================================
// Register
//=========================================

contractForm.addEventListener(

"submit",

async function(e){

e.preventDefault();

let selectedFile=file.files[0];

let fileData=await readFile(selectedFile);

let contract={

title:title.value,

category:category.value,

description:description.value,

important:important.checked,

date:getDate(),

fileName:

selectedFile ?

selectedFile.name : "",

fileType:

selectedFile ?

selectedFile.type : "",

fileSize:

selectedFile ?

(selectedFile.size/1024).toFixed(1)+" KB" : "",

fileData:fileData

};

if(editIndex==-1){

contracts.push(contract);

}else{

contracts[editIndex]=contract;

editIndex=-1;

saveBtn.innerHTML="ذخیره فایل";

}

saveContracts();

updateCards();

renderTable();

contractForm.reset();

});

//=========================================
// File Type
//=========================================

function getFileClass(type){

if(type.includes("pdf"))

return "pdf";

if(type.includes("image"))

return "image";

if(type.includes("word"))

return "word";

if(type.includes("document"))

return "word";

return "other";

}


//=========================================
// Update Cards
//=========================================

function updateCards(){

let pdf=0;
let image=0;
let importantFiles=0;

contracts.forEach(item=>{

if(item.fileType.includes("pdf")) pdf++;

if(item.fileType.includes("image")) image++;

if(item.important) importantFiles++;

});

fileCount.innerHTML=contracts.length;
pdfCount.innerHTML=pdf;
imageCount.innerHTML=image;
importantCount.innerHTML=importantFiles;

}

//=========================================
// Render Table
//=========================================

const contractTable=document.getElementById("contractTable");

function renderTable(list=contracts){

contractTable.innerHTML="";

list.forEach((item,index)=>{

contractTable.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item.title}</td>

<td>${item.category}</td>

<td>

<span class="file-type ${getFileClass(item.fileType)}">

${item.fileName.split(".").pop().toUpperCase()}

</span>

</td>

<td>${item.fileSize}</td>

<td>

${
item.important ?

'<span class="important">⭐ مهم</span>'

:

'<span class="normal">عادی</span>'

}

</td>

<td>${item.date}</td>

<td>

<button

class="action-btn view"

onclick="viewContract(${index})">

👁

</button>

<button

class="action-btn download"

onclick="downloadContract(${index})">

⬇

</button>

<button

class="action-btn edit"

onclick="editContract(${index})">

✏

</button>

<button

class="action-btn delete"

onclick="deleteContract(${index})">

🗑

</button>

</td>

</tr>

`;

});

}

//=========================================
// Delete
//=========================================

function deleteContract(index){

if(!confirm("فایل حذف شود؟"))

return;

contracts.splice(index,1);

saveContracts();

updateCards();

renderTable();

}

//=========================================
// Edit
//=========================================

function editContract(index){

let item=contracts[index];

title.value=item.title;

category.value=item.category;

description.value=item.description;

important.checked=item.important;

editIndex=index;

saveBtn.innerHTML="ویرایش فایل";

window.scrollTo({

top:0,

behavior:"smooth"

});

}

//=========================================
// View
//=========================================

function viewContract(index){

let item=contracts[index];

let html=`

<h3>${item.title}</h3>

<hr>

<p><b>دسته بندی :</b> ${item.category}</p>

<p><b>تاریخ :</b> ${item.date}</p>

<p><b>حجم :</b> ${item.fileSize}</p>

<p><b>نام فایل :</b> ${item.fileName}</p>

<p><b>توضیحات :</b></p>

<p>${item.description}</p>

<hr>

`;

if(item.fileType.includes("pdf")){

html+=`

<iframe

src="${item.fileData}">

</iframe>

`;

}

else if(item.fileType.includes("image")){

html+=`

<img

src="${item.fileData}">

`;

}

else{

html+=`

<p>

پیش نمایش این فایل امکان پذیر نیست.

</p>

`;

}

document.getElementById("modalBody").innerHTML=html;

document.getElementById("detailsModal")

.classList.add("active");

document.getElementById("modalOverlay")

.classList.add("active");

}

//=========================================
// Close Modal
//=========================================

function closeModal(){

document.getElementById("detailsModal")

.classList.remove("active");

document.getElementById("modalOverlay")

.classList.remove("active");

}

//=========================================
// Download
//=========================================

function downloadContract(index){

let item=contracts[index];

let a=document.createElement("a");

a.href=item.fileData;

a.download=item.fileName;

a.click();

}

updateCards();

renderTable();

//=========================================
// Search
//=========================================

const search=document.getElementById("search");

search.addEventListener("keyup",function(){

let value=this.value.trim().toLowerCase();

let filtered=contracts.filter(item=>{

return(

item.title.toLowerCase().includes(value)

||

item.category.toLowerCase().includes(value)

);

});

currentPage=1;

renderTableWithPagination(filtered);

});

//=========================================
// Pagination
//=========================================

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

function renderTableWithPagination(list=contracts){

contractTable.innerHTML="";

let start=(currentPage-1)*rowsPerPage;

let end=start+rowsPerPage;

let pageItems=list.slice(start,end);

pageItems.forEach((item,index)=>{

contractTable.innerHTML+=`

<tr>

<td>${start+index+1}</td>

<td>${item.title}</td>

<td>${item.category}</td>

<td>

<span class="file-type ${getFileClass(item.fileType)}">

${item.fileName.split(".").pop().toUpperCase()}

</span>

</td>

<td>${item.fileSize}</td>

<td>

${item.important

?'<span class="important">⭐</span>'

:'-'}

</td>

<td>${item.date}</td>

<td>

<button

class="action-btn view"

onclick="viewContract(${contracts.indexOf(item)})">

👁

</button>

<button

class="action-btn download"

onclick="downloadContract(${contracts.indexOf(item)})">

⬇

</button>

<button

class="action-btn edit"

onclick="editContract(${contracts.indexOf(item)})">

✏

</button>

<button

class="action-btn delete"

onclick="deleteContract(${contracts.indexOf(item)})">

🗑

</button>

</td>

</tr>

`;

});

renderPagination(list);

}

//=========================================
// Reset Form
//=========================================

contractForm.addEventListener("reset",function(){

setTimeout(()=>{

editIndex=-1;

saveBtn.innerHTML="ذخیره فایل";

},50);

});

//=========================================
// Auto Save
//=========================================

window.addEventListener(

"beforeunload",

function(){

saveContracts();

}

);

//=========================================
// ESC Close Modal
//=========================================

document.addEventListener(

"keydown",

function(e){

if(e.key==="Escape"){

closeModal();

}

}

);

//=========================================
// Click Overlay
//=========================================

document

.getElementById("modalOverlay")

.addEventListener(

"click",

closeModal

);

//=========================================
// First Load
//=========================================

updateCards();

renderTableWithPagination();

//=========================================
// END
//=========================================