//=============================
// Local Storage
//=============================

let customers = JSON.parse(localStorage.getItem("customers")) || [];

let editIndex = -1;

const customerForm = document.getElementById("customerForm");
const fullname = document.getElementById("fullname");
const mobile = document.getElementById("mobile");
const status = document.getElementById("status");
const brand = document.getElementById("brand");
const customerTable = document.getElementById("customerTable");
const search = document.getElementById("search");

const totalCustomers = document.getElementById("totalCustomers");
const activeCustomers = document.getElementById("activeCustomers");
const inactiveCustomers = document.getElementById("inactiveCustomers");

const saveBtn = document.getElementById("saveBtn");

//=============================
// Save
//=============================

function saveCustomers(){

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

}

//=============================
// Statistics
//=============================

function updateCards(){

    totalCustomers.innerHTML = customers.length;

    let active = customers.filter(
        x=>x.status=="فعال"
    ).length;

    let inactive = customers.filter(
        x=>x.status=="غیرفعال"
    ).length;

    activeCustomers.innerHTML = active;

    inactiveCustomers.innerHTML = inactive;

}

//=============================
// Duplicate Mobile
//=============================

function duplicateMobile(number){

    return customers.findIndex(

        item=>item.mobile===number

    );

}

//=============================
// Add/Edit
//=============================

customerForm.addEventListener("submit",function(e){

e.preventDefault();

if(fullname.value.trim()==""){

alert("نام را وارد کنید");

return;

}

if(mobile.value.length!=11){

alert("شماره موبایل معتبر نیست");

return;

}

if(editIndex==-1){

let check=duplicateMobile(mobile.value);

if(check!=-1){

alert("این شماره قبلاً ثبت شده است.");

return;

}

customers.push({

fullname:fullname.value,

mobile:mobile.value,

status:status.value,

brand:brand.value

});

}else{

let check=duplicateMobile(mobile.value);

if(check!=-1 && check!=editIndex){

alert("شماره موبایل تکراری است");

return;

}

customers[editIndex]={

fullname:fullname.value,

mobile:mobile.value,

status:status.value,

brand:brand.value

};

editIndex=-1;

saveBtn.innerHTML="ثبت مشتری";

}

saveCustomers();

renderTable();

updateCards();

customerForm.reset();

});

//=============================
// Delete
//=============================

function deleteCustomer(index){

let ok=confirm("آیا حذف شود؟");

if(!ok) return;

customers.splice(index,1);

saveCustomers();

renderTable();

updateCards();

}

//=============================
// Edit
//=============================

function editCustomer(index){

fullname.value=

customers[index].fullname;

mobile.value=

customers[index].mobile;

status.value=

customers[index].status;

brand.value=

customers[index].brand;

editIndex=index;

saveBtn.innerHTML="ویرایش اطلاعات";

window.scrollTo({

top:0,

behavior:"smooth"

});

}

//=============================
// Pagination
//=============================

let currentPage = 1;
const rowsPerPage = 10;

//=============================
// Render Table
//=============================

function renderTable(list = customers){

    customerTable.innerHTML = "";

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;

    let pageItems = list.slice(start, end);

    pageItems.forEach((item,index)=>{

        let statusClass =
        item.status=="فعال"
        ? "status-active"
        : "status-inactive";

        customerTable.innerHTML += `

        <tr>

            <td>${start + index + 1}</td>

            <td>${item.fullname}</td>

            <td>${item.mobile}</td>

            <td>

                <span class="${statusClass}">
                    ${item.status}
                </span>

            </td>

            <td>${item.brand}</td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editCustomer(${customers.indexOf(item)})">

                    ویرایش

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteCustomer(${customers.indexOf(item)})">

                    حذف

                </button>

            </td>

        </tr>

        `;

    });

    renderPagination(list);

}

//=============================
// Search
//=============================

search.addEventListener("keyup",function(){

    currentPage = 1;

    let value =
    this.value.trim().toLowerCase();

    let filtered = customers.filter(item=>{

        return (

            item.fullname
            .toLowerCase()
            .includes(value)

            ||

            item.mobile
            .includes(value)

            ||

            item.brand
            .toLowerCase()
            .includes(value)

        );

    });

    renderTable(filtered);

});

//=============================
// Pagination
//=============================

function renderPagination(list){

    const pagination =
    document.getElementById("pagination");

    pagination.innerHTML="";

    let pages =
    Math.ceil(list.length / rowsPerPage);

    if(pages<=1) return;

    for(let i=1;i<=pages;i++){

        let btn =
        document.createElement("button");

        btn.innerHTML=i;

        if(i==currentPage){

            btn.classList.add("active");

        }

        btn.onclick=function(){

            currentPage=i;

            renderTable(list);

        }

        pagination.appendChild(btn);

    }

}

//=============================
// Sort
//=============================

customers.sort((a,b)=>{

    return a.fullname.localeCompare(

        b.fullname,

        "fa"

    );

});

//=============================
// Update
//=============================

updateCards();

renderTable();

//=============================
// Save on Exit
//=============================

window.addEventListener(

"beforeunload",

function(){

saveCustomers();

}

);