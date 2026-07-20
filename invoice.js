/*====================================
        INVOICE.JS
=====================================*/


let invoiceCounter =
parseInt(localStorage.getItem("invoiceCounter")) || 1;


/*====================================
        START PAGE
=====================================*/

window.addEventListener("load", () => {

    generateInvoiceNumber();

    setCurrentDate();

    setCurrentTime();

});


/*====================================
        INVOICE NUMBER
=====================================*/

function generateInvoiceNumber(){

    const number =
    "INV-" +
    String(invoiceCounter).padStart(6,"0");

    document
    .getElementById("invoiceNumber")
    .value = number;

}


/*====================================
        DATE
=====================================*/

function setCurrentDate(){

    const today = new Date();

    const year = today.getFullYear();

    const month =
    String(today.getMonth()+1)
    .padStart(2,"0");

    const day =
    String(today.getDate())
    .padStart(2,"0");

    document
    .getElementById("invoiceDate")
    .value =
    `${year}-${month}-${day}`;

}


/*====================================
        TIME
=====================================*/

function setCurrentTime(){

    const now = new Date();

    const hour =
    String(now.getHours())
    .padStart(2,"0");

    const minute =
    String(now.getMinutes())
    .padStart(2,"0");

    document
    .getElementById("invoiceTime")
    .value =
    `${hour}:${minute}`;

}


/*====================================
        ADD NEW ROW
=====================================*/

document
.getElementById("addRowBtn")
.addEventListener("click",addRow);


function addRow(){

    const tbody =
    document.getElementById("invoiceBody");

    const rowNumber =
    tbody.rows.length+1;

    const row =
    document.createElement("tr");

    row.innerHTML=`

<td>${rowNumber}</td>

<td>
<input
type="text"
class="product-name"
placeholder="نام کالا">
</td>

<td>
<input
type="number"
class="product-count"
value="1">
</td>

<td>

<select class="product-unit">

<option>عدد</option>

<option>بسته</option>

<option>کارتن</option>

<option>کیلوگرم</option>

<option>متر</option>

<option>ساعت</option>

<option>روز</option>

</select>

</td>

<td>

<input
type="number"
class="product-price"
value="0">

</td>

<td>

<input
type="number"
class="product-discount"
value="0">

</td>

<td>

<input
type="text"
class="product-total"
value="0"
readonly>

</td>

<td>

<button
class="delete-row">

🗑

</button>

</td>

`;

    tbody.appendChild(row);

    attachEvents();

}


/*====================================
        DELETE ROW
=====================================*/

document.addEventListener("click",function(e){

    if(e.target.classList.contains("delete-row")){

        e.target.closest("tr").remove();

        updateRows();

        calculateInvoice();

    }

});


/*====================================
        UPDATE ROW NUMBER
=====================================*/

function updateRows(){

    const rows =
    document.querySelectorAll("#invoiceBody tr");

    rows.forEach((row,index)=>{

        row.cells[0].innerText =
        index+1;

    });

}


/*====================================
        EVENTS
=====================================*/

function attachEvents(){

    document
    .querySelectorAll(".product-count,.product-price,.product-discount")
    .forEach(input=>{

        input.oninput =
        calculateInvoice;

    });

}

attachEvents();


/*====================================
        CALCULATE ROW
=====================================*/

function calculateInvoice(){

    const rows =
    document.querySelectorAll("#invoiceBody tr");

    rows.forEach(row=>{

        const count =
        Number(
        row.querySelector(".product-count").value
        );

        const price =
        Number(
        row.querySelector(".product-price").value
        );

        const discount =
        Number(
        row.querySelector(".product-discount").value
        );

        let total =
        count*price;

        total =
        total-
        (total*discount/100);

        row.querySelector(".product-total").value =
        total.toLocaleString();

    });

}

/*====================================
        CALCULATE TOTALS
=====================================*/

function calculateInvoice(){

    const rows =
    document.querySelectorAll("#invoiceBody tr");

    let subTotal = 0;

    let discountTotal = 0;

    rows.forEach(row=>{

        const count =
        Number(
        row.querySelector(".product-count").value
        ) || 0;

        const price =
        Number(
        row.querySelector(".product-price").value
        ) || 0;

        const discount =
        Number(
        row.querySelector(".product-discount").value
        ) || 0;

        let total = count * price;

        const discountPrice =
        total * discount / 100;

        total -= discountPrice;

        row.querySelector(".product-total").value =
        total.toLocaleString("fa-IR");

        subTotal += total;

        discountTotal += discountPrice;

    });

    updateSummary(subTotal,discountTotal);

}



/*====================================
        SUMMARY
=====================================*/

function updateSummary(subTotal,discountTotal){

    const shipping =
    Number(
    document.getElementById("shippingPrice").value
    ) || 0;

    const tax =
    Math.round(subTotal * 0.09);

    const finalPrice =
    subTotal + tax + shipping;

    document.getElementById("subTotal").innerText =
    subTotal.toLocaleString("fa-IR") + " تومان";

    document.getElementById("discountTotal").innerText =
    discountTotal.toLocaleString("fa-IR") + " تومان";

    document.getElementById("taxTotal").innerText =
    tax.toLocaleString("fa-IR") + " تومان";

    document.getElementById("finalPrice").innerText =
    finalPrice.toLocaleString("fa-IR") + " تومان";

}



/*====================================
        SHIPPING EVENT
=====================================*/

document
.getElementById("shippingPrice")
.addEventListener("input",()=>{

    let subTotal=0;

    let discountTotal=0;

    document
    .querySelectorAll("#invoiceBody tr")
    .forEach(row=>{

        const count =
        Number(row.querySelector(".product-count").value)||0;

        const price =
        Number(row.querySelector(".product-price").value)||0;

        const discount =
        Number(row.querySelector(".product-discount").value)||0;

        let total =
        count * price;

        const discountPrice =
        total * discount / 100;

        total -= discountPrice;

        subTotal += total;

        discountTotal += discountPrice;

    });

    updateSummary(subTotal,discountTotal);

});



/*====================================
        FIRST CALCULATE
=====================================*/

calculateInvoice();

/*====================================
        SAVE INVOICE
=====================================*/

let invoices =
JSON.parse(localStorage.getItem("crmInvoices")) || [];


document
.getElementById("saveInvoice")
.addEventListener("click",saveInvoice);


function saveInvoice(){

    const invoice={

        number:
        document.getElementById("invoiceNumber").value,

        date:
        document.getElementById("invoiceDate").value,

        customer:
        document.getElementById("customerName").value,

        phone:
        document.getElementById("customerPhone").value,

        status:
        document.getElementById("invoiceStatus").value,

        total:
        document.getElementById("finalPrice").innerText

    };


    invoices.push(invoice);

    localStorage.setItem(

        "crmInvoices",

        JSON.stringify(invoices)

    );


    invoiceCounter++;

    localStorage.setItem(

        "invoiceCounter",

        invoiceCounter

    );


    generateInvoiceNumber();

    loadInvoices();

    showMessage();

}


/*====================================
        LOAD INVOICES
=====================================*/

function loadInvoices(){

    const tbody =
    document.getElementById("invoiceList");

    tbody.innerHTML="";


    invoices.forEach((item,index)=>{

        tbody.innerHTML += `

<tr>

<td>${item.number}</td>

<td>${item.customer}</td>

<td>${item.date}</td>

<td>${item.total}</td>

<td>${item.status}</td>

<td>

<button
class="editInvoice"
data-index="${index}">

✏

</button>

<button
class="deleteInvoice"
data-index="${index}">

🗑

</button>

</td>

</tr>

`;

    });

}


loadInvoices();



/*====================================
        DELETE
=====================================*/

document.addEventListener("click",function(e){

if(e.target.classList.contains("deleteInvoice")){

    const index=
    e.target.dataset.index;

    invoices.splice(index,1);

    localStorage.setItem(

        "crmInvoices",

        JSON.stringify(invoices)

    );

    loadInvoices();

}

});



/*====================================
        SEARCH
=====================================*/

document
.getElementById("searchInvoice")
.addEventListener("keyup",function(){

const value=
this.value.toLowerCase();

const rows=
document.querySelectorAll("#invoiceList tr");

rows.forEach(row=>{

const text=
row.innerText.toLowerCase();

row.style.display=
text.includes(value)
?
""
:
"none";

});

});



/*====================================
        MESSAGE
=====================================*/

function showMessage(){

const box=
document.getElementById("invoiceMessage");

box.style.display="block";

setTimeout(()=>{

box.style.display="none";

},2000);

}

/*====================================
        PREVIEW
=====================================*/

document
.getElementById("printPreview")
.addEventListener("click",function(){

    window.print();

});



/*====================================
        PRINT BUTTON
=====================================*/

document
.getElementById("printInvoice")
.addEventListener("click",function(){

    window.print();

});



/*====================================
        CLEAR FORM
=====================================*/

document
.getElementById("clearInvoice")
.addEventListener("click",clearInvoice);



function clearInvoice(){

    if(!confirm("آیا از پاک کردن فرم مطمئن هستید؟"))
    return;

    document
    .querySelectorAll("input")
    .forEach(input=>{

        if(

            input.id!="invoiceNumber"

            &&

            input.type!="button"

        ){

            input.value="";

        }

    });


    document
    .querySelectorAll("textarea")
    .forEach(text=>{

        text.value="";

    });


    document
    .querySelectorAll("select")
    .forEach(select=>{

        select.selectedIndex=0;

    });


    document
    .getElementById("invoiceBody")
    .innerHTML="";


    addRow();

    calculateInvoice();

}



/*====================================
        PREVIEW MODAL
=====================================*/

document
.getElementById("closePreview")
.addEventListener("click",()=>{

document
.getElementById("invoiceModal")
.style.display="none";

});



/*====================================
        PDF
=====================================*/

document
.getElementById("pdfInvoice")
.addEventListener("click",downloadPDF);


function downloadPDF(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);

doc.text("Invoice",20,20);

doc.setFontSize(12);

doc.text(

"Invoice Number : "

+

document
.getElementById("invoiceNumber")
.value,

20,

40

);

doc.text(

"Customer : "

+

document
.getElementById("customerName")
.value,

20,

55

);

doc.text(

"Total : "

+

document
.getElementById("finalPrice")
.innerText,

20,

70

);

doc.save(

document
.getElementById("invoiceNumber")
.value

+

".pdf"

);

}



/*====================================
        SHARE
=====================================*/

document
.getElementById("shareInvoice")
.addEventListener("click",()=>{

alert("در نسخه بعدی اشتراک گذاری اضافه می‌شود.");

});

/*====================================
        EDIT INVOICE
=====================================*/

document.addEventListener("click",function(e){

if(!e.target.classList.contains("editInvoice")) return;

const index=e.target.dataset.index;

const item=invoices[index];

document.getElementById("invoiceNumber").value=item.number;

document.getElementById("invoiceDate").value=item.date;

document.getElementById("customerName").value=item.customer;

document.getElementById("customerPhone").value=item.phone;

document.getElementById("invoiceStatus").value=item.status;

alert("فاکتور برای ویرایش بارگذاری شد.");

});


/*====================================
        PREVIEW
=====================================*/

document
.getElementById("invoiceNumber")
.addEventListener("dblclick",previewInvoice);

function previewInvoice(){

const modal=
document.getElementById("invoiceModal");

const box=
document.getElementById("invoicePreview");

box.innerHTML=`

<h2 style="text-align:center">

${document.getElementById("invoiceNumber").value}

</h2>

<hr>

<p>

<b>مشتری :</b>

${document.getElementById("customerName").value}

</p>

<p>

<b>تلفن :</b>

${document.getElementById("customerPhone").value}

</p>

<p>

<b>تاریخ :</b>

${document.getElementById("invoiceDate").value}

</p>

<p>

<b>جمع کل :</b>

${document.getElementById("finalPrice").innerText}

</p>

`;

modal.style.display="flex";

}


/*====================================
        EXCEL
=====================================*/

document
.getElementById("excelInvoice")
.addEventListener("click",downloadExcel);

function downloadExcel(){

const wb=XLSX.utils.book_new();

const data=[];

document
.querySelectorAll("#invoiceBody tr")
.forEach(row=>{

data.push({

"کالا":

row.querySelector(".product-name").value,

"تعداد":

row.querySelector(".product-count").value,

"قیمت":

row.querySelector(".product-price").value,

"تخفیف":

row.querySelector(".product-discount").value,

"جمع":

row.querySelector(".product-total").value

});

});

const ws=
XLSX.utils.json_to_sheet(data);

XLSX.utils.book_append_sheet(

wb,

ws,

"Invoice"

);

XLSX.writeFile(

wb,

document.getElementById("invoiceNumber").value+".xlsx"

);

}


/*====================================
        SHARE
=====================================*/

document
.getElementById("shareInvoice")
.addEventListener("click",async()=>{

if(navigator.share){

await navigator.share({

title:"فاکتور",

text:document.getElementById("invoiceNumber").value

});

}else{

alert("مرورگر از اشتراک گذاری پشتیبانی نمی‌کند.");

}

});


/*====================================
        SAVE PRODUCTS
=====================================*/

function getProducts(){

    const products=[];

    document
    .querySelectorAll("#invoiceBody tr")
    .forEach(row=>{

        products.push({

            name:
            row.querySelector(".product-name").value,

            count:
            row.querySelector(".product-count").value,

            unit:
            row.querySelector(".product-unit").value,

            price:
            row.querySelector(".product-price").value,

            discount:
            row.querySelector(".product-discount").value,

            total:
            row.querySelector(".product-total").value

        });

    });

    return products;

}


/*====================================
        UPDATE SAVE
=====================================*/

function saveInvoice(){

    const invoice={

        number:invoiceNumber.value,

        date:invoiceDate.value,

        customer:customerName.value,

        phone:customerPhone.value,

        status:invoiceStatus.value,

        total:finalPrice.innerText,

        products:getProducts(),

        description:invoiceDescription.value

    };

    invoices.push(invoice);

    localStorage.setItem(

        "crmInvoices",

        JSON.stringify(invoices)

    );

    invoiceCounter++;

    localStorage.setItem(

        "invoiceCounter",

        invoiceCounter

    );

    generateInvoiceNumber();

    loadInvoices();

    showMessage();

}



/*====================================
        LOAD PRODUCTS
=====================================*/

function loadInvoice(index){

    const item=invoices[index];

    invoiceNumber.value=item.number;

    invoiceDate.value=item.date;

    customerName.value=item.customer;

    customerPhone.value=item.phone;

    invoiceStatus.value=item.status;

    invoiceDescription.value=item.description;

    invoiceBody.innerHTML="";

    item.products.forEach((p,i)=>{

        addRow();

        const row=

        invoiceBody.rows[i];

        row.querySelector(".product-name").value=p.name;

        row.querySelector(".product-count").value=p.count;

        row.querySelector(".product-unit").value=p.unit;

        row.querySelector(".product-price").value=p.price;

        row.querySelector(".product-discount").value=p.discount;

        row.querySelector(".product-total").value=p.total;

    });

    calculateInvoice();

}



/*====================================
        EDIT
=====================================*/

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("editInvoice")){

loadInvoice(

e.target.dataset.index

);

}

});



/*====================================
        AUTO SAVE
=====================================*/

window.addEventListener("beforeunload",()=>{

localStorage.setItem(

"lastInvoice",

JSON.stringify({

customer:customerName.value,

phone:customerPhone.value,

description:invoiceDescription.value

})

);

});



/*====================================
        RESTORE
=====================================*/

window.addEventListener("load",()=>{

const last=

JSON.parse(

localStorage.getItem("lastInvoice")

);

if(last){

customerName.value=last.customer;

customerPhone.value=last.phone;

invoiceDescription.value=last.description;

}

});



/*====================================
        END
=====================================*/

console.log(

"CRM Invoice System Ready"

);