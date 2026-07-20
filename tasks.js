
//==========================================
// Local Storage
//==========================================

let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];


let editIndex = -1;


//==========================================
// Elements
//==========================================

const taskForm =
document.getElementById("taskForm");


const taskTitle =
document.getElementById("taskTitle");


const priority =
document.getElementById("priority");


const taskDate =
document.getElementById("taskDate");


const taskTime =
document.getElementById("taskTime");


const category =
document.getElementById("category");


const status =
document.getElementById("status");


const description =
document.getElementById("description");


const saveBtn =
document.getElementById("saveBtn");


//==========================================
// Cards
//==========================================

const allTasks =
document.getElementById("allTasks");


const pendingTasks =
document.getElementById("pendingTasks");


const doneTasks =
document.getElementById("doneTasks");


const urgentTasks =
document.getElementById("urgentTasks");


//==========================================
// Save Data
//==========================================

function saveTasks(){

localStorage.setItem(

"tasks",

JSON.stringify(tasks)

);

}



//==========================================
// Register Task
//==========================================

taskForm.addEventListener(

"submit",

function(e){

e.preventDefault();



let task = {


title:taskTitle.value,


priority:priority.value,


date:taskDate.value,


time:taskTime.value,


category:category.value,


status:status.value,


description:description.value,


completed:false,


createdAt:new Date().toLocaleString("fa-IR")


};



if(editIndex === -1){


tasks.push(task);


}else{


task.createdAt =
tasks[editIndex].createdAt;


task.completed =
tasks[editIndex].completed;


tasks[editIndex]=task;


editIndex=-1;


saveBtn.innerHTML="ثبت کار";


}



saveTasks();


updateCards();


renderTasks();


taskForm.reset();


});




//==========================================
// Reset
//==========================================

taskForm.addEventListener(

"reset",

function(){


setTimeout(()=>{


editIndex=-1;


saveBtn.innerHTML="ثبت کار";


},50);


});



//==========================================
// Date Status
//==========================================

function isLate(task){


if(task.completed)

return false;


if(!task.date)

return false;


return new Date(task.date) < new Date();


}



//==========================================
// Table
//==========================================

const taskTable =
document.getElementById("taskTable");


//==========================================
// Update Cards
//==========================================

function updateCards(){

let pending = 0;

let done = 0;

let urgent = 0;


tasks.forEach(task=>{


if(task.completed){

done++;

}else{

pending++;

}


if(task.priority=="فوری"){

urgent++;

}


});


allTasks.innerHTML = tasks.length;

pendingTasks.innerHTML = pending;

doneTasks.innerHTML = done;

urgentTasks.innerHTML = urgent;


}



//==========================================
// Priority Class
//==========================================

function priorityClass(value){


switch(value){


case "کم":

return "low";


case "متوسط":

return "medium";


case "زیاد":

return "high";


case "فوری":

return "urgent";


default:

return "";


}


}


//==========================================
// Status Class
//==========================================

function statusClass(value){


switch(value){


case "در انتظار":

return "pending";


case "در حال انجام":

return "running";


case "انجام شده":

return "completed";


default:

return "";


}


}



//==========================================
// Render Tasks
//==========================================

function renderTasks(list=tasks){


taskTable.innerHTML="";



list.forEach((task,index)=>{


let rowClass="";


if(task.completed){

rowClass="task-done";

}


if(isLate(task)){

rowClass+=" late-task";

}



taskTable.innerHTML += `


<tr class="${rowClass}">


<td>


<button

class="check-btn ${task.completed ? "checked":""}"

onclick="completeTask(${index})">


${task.completed ? "✓" : ""}


</button>


</td>



<td>

${index+1}

</td>



<td>

${task.title}

</td>



<td>

${task.category}

</td>



<td>


<span class="priority ${priorityClass(task.priority)}">


${task.priority}


</span>


</td>



<td>

${task.date || "-"}

</td>



<td>

${task.time || "-"}

</td>



<td>


<span class="status ${statusClass(task.status)}">


${task.completed ? "انجام شده" : task.status}


</span>


</td>



<td>


<button

class="action-btn view"

onclick="viewTask(${index})">


👁


</button>



<button

class="action-btn edit"

onclick="editTask(${index})">


✏


</button>



<button

class="action-btn delete"

onclick="deleteTask(${index})">


🗑


</button>



</td>



</tr>


`;


});


}



//==========================================
// Complete Task
//==========================================

function completeTask(index){


let task = tasks[index];



task.completed = !task.completed;



if(task.completed){


task.status="انجام شده";


// صدای تیک

let sound =
document.getElementById("tickSound");


if(sound){

sound.currentTime=0;

sound.play();

}


}else{


task.status="در انتظار";


}



saveTasks();


updateCards();


renderTasks();


}




//==========================================
// Delete
//==========================================

function deleteTask(index){


if(!confirm("کار حذف شود؟"))

return;



tasks.splice(index,1);



saveTasks();


updateCards();


renderTasks();


}




//==========================================
// Edit
//==========================================

function editTask(index){


let task=tasks[index];


taskTitle.value=task.title;


priority.value=task.priority;


taskDate.value=task.date;


taskTime.value=task.time;


category.value=task.category;


status.value=task.status;


description.value=task.description;



editIndex=index;



saveBtn.innerHTML="ویرایش کار";


window.scrollTo({

top:0,

behavior:"smooth"

});


}




//==========================================
// View Details
//==========================================

function viewTask(index){


let task=tasks[index];



document.getElementById("modalBody").innerHTML=`


<h3>

${task.title}

</h3>


<hr>


<p>

<b>دسته:</b>

${task.category}

</p>



<p>

<b>اولویت:</b>

${task.priority}

</p>



<p>

<b>تاریخ:</b>

${task.date || "-"}

</p>



<p>

<b>ساعت:</b>

${task.time || "-"}

</p>



<p>

<b>وضعیت:</b>

${task.status}

</p>



<p>

<b>توضیحات:</b>

</p>



<p>

${task.description || "-"}

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



updateCards();

renderTasks();




//==========================================
// Search
//==========================================

const search =
document.getElementById("search");


search.addEventListener("keyup",function(){


let value =
this.value.trim().toLowerCase();



let filtered = tasks.filter(task=>{


return(

task.title.toLowerCase().includes(value)

||

task.category.toLowerCase().includes(value)

||

task.priority.toLowerCase().includes(value)

||

task.status.toLowerCase().includes(value)


);


});



currentPage=1;


renderTasksWithPagination(filtered);



});



//==========================================
// Filter
//==========================================

const filterStatus =
document.getElementById("filterStatus");



filterStatus.addEventListener("change",function(){


let value=this.value;



let filtered;



switch(value){



case "pending":


filtered=tasks.filter(task=>!task.completed);

break;



case "progress":


filtered=tasks.filter(task=>

task.status==="در حال انجام"

);

break;



case "done":


filtered=tasks.filter(task=>

task.completed

);

break;



case "urgent":


filtered=tasks.filter(task=>

task.priority==="فوری"

);

break;



case "late":


filtered=tasks.filter(task=>

isLate(task)

);

break;



default:


filtered=tasks;


}



currentPage=1;


renderTasksWithPagination(filtered);



});




//==========================================
// Pagination
//==========================================

let currentPage=1;


const rowsPerPage=10;



function renderPagination(list){


const pagination =

document.getElementById("pagination");



pagination.innerHTML="";



let pages =

Math.ceil(list.length / rowsPerPage);



if(pages<=1)

return;



for(let i=1;i<=pages;i++){


let button=

document.createElement("button");



button.innerHTML=i;



if(i===currentPage){

button.classList.add("active");

}



button.onclick=function(){


currentPage=i;


renderTasksWithPagination(list);


};



pagination.appendChild(button);



}



}




//==========================================
// Table Pagination
//==========================================

function renderTasksWithPagination(list=tasks){



taskTable.innerHTML="";



let start=

(currentPage-1)*rowsPerPage;



let end=

start+rowsPerPage;



let pageItems=

list.slice(start,end);




pageItems.forEach((task,index)=>{


taskTable.innerHTML += `


<tr class="

${task.completed ? "task-done":""}

${isLate(task) ? "late-task":""}

">


<td>


<button

class="check-btn ${task.completed?"checked":""}"

onclick="completeTask(${tasks.indexOf(task)})">


${task.completed?"✓":""}


</button>


</td>



<td>

${start+index+1}

</td>



<td>

${task.title}

</td>



<td>

${task.category}

</td>



<td>


<span class="priority ${priorityClass(task.priority)}">

${task.priority}

</span>


</td>



<td>

${task.date || "-"}

</td>



<td>

${task.time || "-"}

</td>



<td>


<span class="status ${statusClass(task.status)}">

${task.completed?"انجام شده":task.status}

</span>


</td>



<td>


<button

class="action-btn view"

onclick="viewTask(${tasks.indexOf(task)})">

👁

</button>



<button

class="action-btn edit"

onclick="editTask(${tasks.indexOf(task)})">

✏

</button>



<button

class="action-btn delete"

onclick="deleteTask(${tasks.indexOf(task)})">

🗑

</button>


</td>



</tr>



`;



});



renderPagination(list);



}




//==========================================
// Auto Save
//==========================================

window.addEventListener(

"beforeunload",

function(){


saveTasks();


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

document

.getElementById("modalOverlay")

.addEventListener(

"click",

closeModal

);




//==========================================
// First Load
//==========================================

updateCards();


renderTasksWithPagination();



//==========================================
// END
//==========================================
