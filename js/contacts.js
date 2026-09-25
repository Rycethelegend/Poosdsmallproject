let contacts = [];
let openBox = false;

let currentEditId = 0;
let currentDeleteId = 0;


// TESTING
function test() {
    contacts = [
        { firstName: "john", lastName: "marten", email: "johnmartens123@gmail.com", phone: "+1-305-245-3242", id: 3 },
        { firstName: "chris", lastName: "sawyer", email: "chris777sawyer@gmail.com", phone: "+1-544-238-4892", id: 4 },
    ]

    renderList();
}


// SEARCH CONTACTS
function findContactById(id) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id == id) return contacts[i];
    }
    return null;
}

function searchContacts() {

    const search = document.getElementById("searchText").value;

    let tmp = { search: search, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";

                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error != "" && jsonObject.error != "No Records Found") {
                    contacts = [];
                    showListMessage(jsonObject.error);
                    return;
                }

                contacts = jsonObject.results ? jsonObject.results : [];
                renderList();

                // document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {

        contacts = [];
        // showListMessage(message);
    }
}

function renderList() {

    const region = document.getElementById("listRegion");
    region.innerHTML = "";

    if (contacts.length == 0) {
        // showListMessage("No contacts here yet. Use Add to create one.");
        return;
    }

    const template = document.getElementById("contactRowTemplate");

    for (let i = 0; i < contacts.length; i++) {

        const contact = contacts[i];

        let item = template.content.cloneNode(true);

        item.querySelector(".contactFirstName").textContent = contact.firstName;
        item.querySelector(".contactLastName").textContent = contact.lastName;

        item.querySelector(".contactEmail").textContent = contact.email;
        item.querySelector(".contactPhone").textContent = contact.phone;


        item.querySelector(".editButton").addEventListener("click", function () {
            editContact(contact.id)
        });

        item.querySelector(".deleteButton").addEventListener("click", function () {
            deleteContact(contact.id)
        });

        /*
        let menuBtn = node.querySelector(".menuBtn");
        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleMenu(c.id, this);
        });*/

        region.appendChild(item);
    }
}


// DELETE CONTACT
function deleteContact(id) {

    const contact = findContactById(id);
    if (contact == null) return;

    currentDeleteId = id;
    openDeleteBox();
}

function finishContactDelete() {
    closeDeleteBox();

    let tmp = { contactId: currentDeleteId, userId: userId };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("colorAddResult").innerHTML = "Color has been added";
                // message: delete successful
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        // document.getElementById("colorAddResult").innerHTML = err.message;
        // message: delete failed
    }
}


// EDIT CONTACT
function editContact(id) {
    if (openBox === true) return;
    openBox = true;

    const contact = findContactById(id);
    if (contact == null) return;

    currentEditId = id;

    document.getElementById("addFirstName").value = contact.firstName;
    document.getElementById("addLastName").value = contact.lastName;
    document.getElementById("addEmail").value = contact.email;
    document.getElementById("addPhone").value = contact.phone;

    console.log("opening edit box");
    openEditBox();
}

function finishContactEdit() {
    const firstNameBox = document.getElementById("addFirstName");
    const lastNameBox = document.getElementById("addLastName");
    const emailBox = document.getElementById("addEmail");
    const phoneBox = document.getElementById("addPhone");

    let tmp = { contactId: currentEditId, firstName: firstNameBox.value, lastName: lastNameBox.value, email: emailBox.value, phone: phoneBox.value, userId: userId };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("colorAddResult").innerHTML = "Color has been added";

                closeAddBox();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        // document.getElementById("colorAddResult").innerHTML = err.message;
    }
}


// ADD CONTACT
function saveContact() {
    const firstNameBox = document.getElementById("addFirstName");
    const lastNameBox = document.getElementById("addLastName");
    const emailBox = document.getElementById("addEmail");
    const phoneBox = document.getElementById("addPhone");

    let tmp = { firstName: firstNameBox.value, lastName: lastNameBox.value, email: emailBox.value, phone: phoneBox.value, userId: userId };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("colorAddResult").innerHTML = "Color has been added";

                closeAddBox();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        // document.getElementById("colorAddResult").innerHTML = err.message;
    }
}


// UI MENUS
function clearAddBox() 
{
    const firstNameBox = document.getElementById("addFirstName");
    const lastNameBox = document.getElementById("addLastName");
    const emailBox = document.getElementById("addEmail");
    const phoneBox = document.getElementById("addPhone");
    
    firstNameBox.value = '';
    lastNameBox.value = '';
    emailBox.value = '';
    phoneBox.value = '';
}

function openDeleteBox() {
    const deleteRegion = document.getElementById("deleteRegion"); //.removeAttribute("hidden");
    deleteRegion.style.display = "flex";
}

function closeDeleteBox() {
    const deleteRegion = document.getElementById("deleteRegion"); //.removeAttribute("hidden");
    deleteRegion.style.display = "none";
}

function openEditBox() {

    const addRegion = document.getElementById("addRegion"); //.removeAttribute("hidden");
    addRegion.style.display = "flex";

    const editButtons = document.getElementById("editButtons");
    editButtons.style.display = "flex";
}

function openAddBox() {
    if (openBox) return;
    openBox = true;

    const addRegion = document.getElementById("addRegion"); //.removeAttribute("hidden");
    addRegion.style.display = "flex";

    const addButtons = document.getElementById("addButtons");
    addButtons.style.display = "flex";
}

function closeAddBox() {
    const addRegion = document.getElementById("addRegion"); //.removeAttribute("hidden");
    addRegion.style.display = "none";

    const editButtons = document.getElementById("editButtons");
    editButtons.style.display = "none";

    const addButtons = document.getElementById("addButtons");
    addButtons.style.display = "none";

    clearAddBox();
    openBox = false;
}

function openContact() {
    const leftContainer = document.getElementById("leftContainer");
    const rightContainer = document.getElementById("rightContainer");

    leftContainer.classList.remove('slideIn');
    leftContainer.classList.add('slideOut'); // Slides left and away

    rightContainer.classList.remove('slidePrepare');
    rightContainer.classList.add('slideIn'); // Slides left; into center
}

function closeContact() {
    const leftContainer = document.getElementById("leftContainer");
    const rightContainer = document.getElementById("rightContainer");

    leftContainer.classList.remove('slideOut');
    leftContainer.classList.add('slideIn'); // Slides right; back into spot

    rightContainer.classList.remove('slideIn');
    rightContainer.classList.add('slidePrepare'); // Slides right; edge of screen
}