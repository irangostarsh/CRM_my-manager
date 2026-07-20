

//====================================
// NOTES SYSTEM
//====================================


let notes = JSON.parse(

localStorage.getItem("dashboardNotes")

) || [];



let selectedNote = null;







//====================================
// ELEMENTS
//====================================


const notesList =

document.getElementById("notesList");



const noteModal =

document.getElementById("noteModal");









//====================================
// OPEN / CLOSE NOTE FORM
//====================================



function openNoteForm(){


    noteModal.classList.add("active");


}




function closeNoteForm(){


    noteModal.classList.remove("active");


    document.getElementById("newNoteTitle").value="";

    document.getElementById("newNoteText").value="";

    document.getElementById("newNotePin").checked=false;


}









//====================================
// CREATE NOTE
//====================================



function createNote(){



let title =

document.getElementById("newNoteTitle").value;



let text =

document.getElementById("newNoteText").value;



let pin =

document.getElementById("newNotePin").checked;






if(title.trim()===""){


alert("عنوان یادداشت را وارد کنید");


return;


}







let note = {


id:Date.now(),



title:title,



text:text,



pin:pin,



created:new Date()

.toLocaleString("fa-IR"),



updated:new Date()

.toLocaleString("fa-IR")


};








notes.unshift(note);





saveNotes();





renderNotes();





closeNoteForm();





}









//====================================
// SAVE STORAGE
//====================================



function saveNotes(){


localStorage.setItem(

"dashboardNotes",

JSON.stringify(notes)

);


}


//====================================
// RENDER NOTES LIST
//====================================



function renderNotes(){



    notesList.innerHTML="";



    if(notes.length===0){


        notesList.innerHTML=`

        <div class="empty-note">

        📝 هنوز یادداشتی ندارید

        </div>

        `;


        return;


    }







    notes.forEach(note=>{



        let item=document.createElement("div");



        item.className="note-item";



        if(selectedNote && selectedNote.id===note.id){

            item.classList.add("active");

        }





        item.innerHTML=`



        <h3>

        ${note.pin ? "📌 " : ""}

        ${note.title}

        </h3>



        <p>

        ${note.text.substring(0,60)}

        ...

        </p>



        `;





        item.onclick=function(){


            openNote(note.id);


        };






        notesList.appendChild(item);





    });



}









//====================================
// OPEN NOTE
//====================================



function openNote(id){



    let note = notes.find(n=>n.id===id);




    if(!note)

    return;





    selectedNote=note;






    document.getElementById("noteId").value=

    note.id;






    document.getElementById("noteTitle").value=

    note.title;







    document.getElementById("noteText").value=

    note.text;








    document.getElementById("noteDate").innerHTML=

    "ایجاد: "+note.created;





    document.getElementById("noteUpdate").innerHTML=

    "ویرایش: "+note.updated;






    renderNotes();





}









//====================================
// SAVE EDIT NOTE
//====================================



function saveNote(){



    if(!selectedNote){



        alert("یک یادداشت انتخاب کنید");

        return;


    }







    selectedNote.title =

    document.getElementById("noteTitle").value;





    selectedNote.text =

    document.getElementById("noteText").value;






    selectedNote.updated =

    new Date().toLocaleString("fa-IR");







    saveNotes();



    renderNotes();



    openNote(selectedNote.id);



    alert("یادداشت ذخیره شد");



}









//====================================
// DELETE NOTE
//====================================



function deleteNote(){



if(!selectedNote){



alert("یادداشتی انتخاب نشده");

return;


}






if(confirm("حذف شود؟")){



notes = notes.filter(

n=>n.id!==selectedNote.id

);





selectedNote=null;



saveNotes();



renderNotes();





document.getElementById("noteTitle").value="";

document.getElementById("noteText").value="";



}



}







//====================================
// SEARCH NOTES
//====================================



function searchNotes(){



let value =

document.getElementById("noteSearch")

.value

.toLowerCase();







let items =

document.querySelectorAll(".note-item");





items.forEach(item=>{



if(item.innerText

.toLowerCase()

.includes(value)){



item.style.display="block";



}else{



item.style.display="none";


}



});



}







//====================================
// AUTO LOAD
//====================================



document.addEventListener(

"DOMContentLoaded",

function(){



renderNotes();



}

);

