//==========================================
// Local Storage
//==========================================

let projects = JSON.parse(localStorage.getItem("projects")) || [];

let editIndex = -1;

//==========================================
// Elements
//==========================================

const projectForm = document.getElementById("projectForm");

const projectName = document.getElementById("projectName");
const customerName = document.getElementById("customerName");
const projectType = document.getElementById("projectType");

const manager = document.getElementById("manager");
const developer = document.getElementById("developer");
const designer = document.getElementById("designer");

const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const progress = document.getElementById("progress");

const priority = document.getElementById("priority");

const status = document.getElementById("status");

const description = document.getElementById("description");

const saveBtn = document.getElementById("saveBtn");

//==========================================
// Cards
//==========================================

const projectCount =
document.getElementById("projectCount");

const activeCount =
document.getElementById("activeCount");

const completedCount =
document.getElementById("completedCount");

const lateCount =
document.getElementById("lateCount");

//==========================================
// Save
//==========================================

function saveProjects(){

localStorage.setItem(

"projects",

JSON.stringify(projects)

);

}

//==========================================
// Date Check
//==========================================

function isLate(date,statusValue){

if(statusValue==="تحویل شده")

return false;

if(!date)

return false;

return new Date(date) < new Date();

}

//==========================================
// Register
//==========================================

projectForm.addEventListener(

"submit",

function(e){

e.preventDefault();

let project={

projectName:projectName.value,

customerName:customerName.value,

projectType:projectType.value,

manager:manager.value,

developer:developer.value,

designer:designer.value,

startDate:startDate.value,

endDate:endDate.value,

progress:Number(progress.value),

priority:priority.value,

status:status.value,

description:description.value,

createdAt:new Date().toLocaleString("fa-IR")

};

if(editIndex==-1){

projects.push(project);

}else{

project.createdAt=

projects[editIndex].createdAt;

projects[editIndex]=project;

editIndex=-1;

saveBtn.innerHTML="ثبت پروژه";

}

saveProjects();

updateCards();

renderTable();

projectForm.reset();

});

//==========================================
// Progress Validation
//==========================================

progress.addEventListener(

"input",

function(){

if(this.value>100)

this.value=100;

if(this.value<0)

this.value=0;

}

);

//==========================================
// Table
//==========================================

const projectTable =
document.getElementById("projectTable");

//==========================================
// Cards
//==========================================

function updateCards(){

let active=0;

let completed=0;

let late=0;

projects.forEach(item=>{

if(item.status=="در حال انجام")

active++;

if(item.status=="تحویل شده")

completed++;

if(isLate(item.endDate,item.status))

late++;

});

projectCount.innerHTML=projects.length;

activeCount.innerHTML=active;

completedCount.innerHTML=completed;

lateCount.innerHTML=late;

}

//==========================================
// Priority Class
//==========================================

function priorityClass(value){

switch(value){

case "کم":

return "priority-low";

case "متوسط":

return "priority-medium";

case "زیاد":

return "priority-high";

case "فوری":

return "priority-urgent";

default:

return "";

}

}

//==========================================
// Status Class
//==========================================

function statusClass(value){

switch(value){

case "شروع نشده":

return "waiting";

case "در حال انجام":

return "running";

case "تست":

return "testing";

case "تحویل شده":

return "done";

case "متوقف شده":

return "stop";

default:

return "";

}

}

//==========================================
// Render Table
//==========================================

function renderTable(list=projects){

projectTable.innerHTML="";

list.forEach((item,index)=>{

projectTable.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item.projectName}</td>

<td>${item.customerName}</td>

<td>${item.projectType}</td>

<td>${item.manager}</td>

<td>

<div class="progress">

<div
class="progress-fill"
style="width:${item.progress}%">

${item.progress}%

</div>

</div>

</td>

<td>

<span class="${priorityClass(item.priority)}">

${item.priority}

</span>

</td>

<td>

<span class="status ${statusClass(item.status)}">

${item.status}

</span>

</td>

<td>

${item.endDate}

</td>

<td>

<button

class="action-btn view"

onclick="viewProject(${index})">

👁

</button>

<button

class="action-btn edit"

onclick="editProject(${index})">

✏

</button>

<button

class="action-btn delete"

onclick="deleteProject(${index})">

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

function deleteProject(index){

if(!confirm("پروژه حذف شود؟"))

return;

projects.splice(index,1);

saveProjects();

updateCards();

renderTable();

}

//==========================================
// Edit
//==========================================

function editProject(index){

let item=projects[index];

projectName.value=item.projectName;

customerName.value=item.customerName;

projectType.value=item.projectType;

manager.value=item.manager;

developer.value=item.developer;

designer.value=item.designer;

startDate.value=item.startDate;

endDate.value=item.endDate;

progress.value=item.progress;

priority.value=item.priority;

status.value=item.status;

description.value=item.description;

editIndex=index;

saveBtn.innerHTML="ویرایش پروژه";

window.scrollTo({

top:0,

behavior:"smooth"

});

}

//==========================================
// View
//==========================================

function viewProject(index){

let item=projects[index];

document.getElementById("modalBody").innerHTML=`

<h3>${item.projectName}</h3>

<hr>

<p><b>مشتری :</b> ${item.customerName}</p>

<p><b>نوع پروژه :</b> ${item.projectType}</p>

<p><b>مدیر پروژه :</b> ${item.manager}</p>

<p><b>برنامه نویس :</b> ${item.developer}</p>

<p><b>طراح UI :</b> ${item.designer}</p>

<p><b>تاریخ شروع :</b> ${item.startDate}</p>

<p><b>تاریخ تحویل :</b> ${item.endDate}</p>

<p><b>پیشرفت :</b> ${item.progress}%</p>

<p><b>اولویت :</b> ${item.priority}</p>

<p><b>وضعیت :</b> ${item.status}</p>

<p><b>توضیحات :</b></p>

<p>${item.description}</p>

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

const search = document.getElementById("search");

search.addEventListener("keyup", function () {

    let value = this.value.trim().toLowerCase();

    let filtered = projects.filter(item => {

        return (

            item.projectName.toLowerCase().includes(value) ||

            item.customerName.toLowerCase().includes(value) ||

            item.manager.toLowerCase().includes(value) ||

            item.projectType.toLowerCase().includes(value) ||

            item.status.toLowerCase().includes(value)

        );

    });

    currentPage = 1;

    renderTableWithPagination(filtered);

});

//==========================================
// Pagination
//==========================================

let currentPage = 1;

const rowsPerPage = 10;

function renderPagination(list){

    const pagination =
    document.getElementById("pagination");

    pagination.innerHTML = "";

    let pages = Math.ceil(list.length / rowsPerPage);

    if(pages <= 1) return;

    for(let i=1;i<=pages;i++){

        let btn = document.createElement("button");

        btn.innerHTML = i;

        if(i == currentPage){

            btn.classList.add("active");

        }

        btn.onclick = function(){

            currentPage = i;

            renderTableWithPagination(list);

        };

        pagination.appendChild(btn);

    }

}

function renderTableWithPagination(list = projects){

    projectTable.innerHTML = "";

    let start = (currentPage-1) * rowsPerPage;

    let end = start + rowsPerPage;

    let pageItems = list.slice(start,end);

    pageItems.forEach((item,index)=>{

        projectTable.innerHTML += `

<tr>

<td>${start+index+1}</td>

<td>${item.projectName}</td>

<td>${item.customerName}</td>

<td>${item.projectType}</td>

<td>${item.manager}</td>

<td>

<div class="progress">

<div
class="progress-fill"
style="width:${item.progress}%">

${item.progress}%

</div>

</div>

</td>

<td>

<span class="${priorityClass(item.priority)}">

${item.priority}

</span>

</td>

<td>

<span class="status ${statusClass(item.status)}">

${item.status}

</span>

</td>

<td>${item.endDate}</td>

<td>

<button
class="action-btn view"
onclick="viewProject(${projects.indexOf(item)})">

👁

</button>

<button
class="action-btn edit"
onclick="editProject(${projects.indexOf(item)})">

✏

</button>

<button
class="action-btn delete"
onclick="deleteProject(${projects.indexOf(item)})">

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

projectForm.addEventListener("reset",function(){

    setTimeout(()=>{

        editIndex = -1;

        saveBtn.innerHTML = "ثبت پروژه";

    },50);

});

//==========================================
// Auto Save
//==========================================

window.addEventListener("beforeunload",function(){

    saveProjects();

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
