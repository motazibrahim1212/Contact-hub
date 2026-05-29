/* ============================= */
/* ========= SELECTORS ========= */
/* ============================= */

var fullName = document.getElementById("fullName");
var phoneNumber = document.getElementById("number");
var email = document.getElementById("email");
var address = document.getElementById("address");
var groub = document.getElementById("groub");
var notes = document.getElementById("notes");

var nameError = document.getElementById("nameError");
var numberError = document.getElementById("numberError");
var emailError = document.getElementById("emailError");

var favoriteCheck = document.getElementById("favoriteCheck");
var emergencyCheck = document.getElementById("emergencyCheck");

var emergencyCard = document.getElementById("emergencyCard");
var favoriteCard = document.getElementById("favoriteCard");
var groubCard = document.getElementById("groubCard");

var myEmergencyCounter = document.querySelector(".emergencyCounter");
var myFavoriteCounter = document.querySelector(".favoriteCounter");
var total = document.querySelector(".totalCounter");
var manageCounter = document.querySelector(".manageCounter");

var lightBox = document.querySelector(".lightBox");
var saveBtn = document.querySelector(".saveBtn");
var container = document.querySelector(".contactsContainer");

/* ============================= */
/* ========= VARIABLES ========= */
/* ============================= */

var contactsList = [];
var cartoona = "";
var currentUpdate = null;

/* ============================= */
/* ========= INIT ============== */
/* ============================= */

// Load data from localStorage
if (localStorage.getItem("contacts") != null) {
    contactsList = JSON.parse(localStorage.getItem("contacts"));
    renderContacts(); // غيرنا الاسم لـ renderContacts عشان يعبر عن وظيفته صح
}

/* ============================= */
/* ========= EVENTS ============ */
/* ============================= */

// Open / Close Modal
document.addEventListener("click", function (e) {
    if (e.target.closest(".addBtn")) {
        currentUpdate = null; // تصفير دائم عند إضافة اسم جديد
        clearForm();
        lightBox.classList.remove("d-none");
    }

    if (e.target.closest(".closeBtn")) {
        lightBox.classList.add("d-none");
        clearForm();
    }
});

// Save Contact (Add / Edit)
saveBtn.addEventListener("click", function () {

    // Validation check
    if (
        !nameRegex.test(fullName.value) ||
        !numRegex.test(phoneNumber.value) ||
        !emailRegex.test(email.value)
    ) {
        Swal.fire({
            title: "Invalid Data!",
            text: "Please enter valid name, phone and email",
            icon: "error"
        });
        return;
    }

    // Create new contact object
    var contactData = {
        name: fullName.value,
        phone: phoneNumber.value,
        email: email.value,
        address: address.value,
        groub: groub.value,
        notes: notes.value,
        emergency: emergencyCheck.checked,
        favorite: favoriteCheck.checked,
    };

    // Add or Update
    if (currentUpdate === null) {
        contactsList.push(contactData);
    } else {
        contactsList[currentUpdate] = contactData;
        currentUpdate = null; // تصدير العداد بعد التعديل نجاحاً
    }

    // Save & render
    localStorage.setItem("contacts", JSON.stringify(contactsList));
    renderContacts();
    clearForm(); // الفورم تتمسح هنا فقط بعد الحفظ بنجاح
    lightBox.classList.add("d-none");
});

/* ============================= */
/* ========= FUNCTIONS ========= */
/* ============================= */

// Clear form inputs
function clearForm() {
    fullName.value = "";
    phoneNumber.value = "";
    email.value = "";
    address.value = "";
    groub.value = "";
    notes.value = "";
    emergencyCheck.checked = false;
    favoriteCheck.checked = false;
    
    // تنظيف كلاسات الـ validation
    fullName.classList.remove("is-valid", "is-invalid");
    phoneNumber.classList.remove("is-valid", "is-invalid");
    email.classList.remove("is-valid", "is-invalid");
}

// Render contacts + sidebar + counters
function renderContacts() {

    var favoriteCounter = 0;
    var emergencyCounter = 0;

    cartoona = "";
    favoriteCard.innerHTML = "";
    emergencyCard.innerHTML = "";

    for (var i = 0; i < contactsList.length; i++) {

        /* ===== MAIN CARD ===== */
        cartoona += `
        <div class="col-md-6">
          <div class="contactCard py-3" data-index="${i}">
            <div class="card contact-card border-0 shadow-sm rounded-4 p-3">

              <div class="d-flex align-items-center gap-3 mb-3">
                <span class="avatar-circle">
                  ${contactsList[i].name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h5 class="fw-bold mb-1">${contactsList[i].name}</h5>
                  <small class="text-muted d-flex align-items-center gap-2">
                    <i class="fa-solid fa-phone"></i>
                    ${contactsList[i].phone}
                  </small>
                </div>
              </div>

              <div class="mb-3">
                <p class="mb-2 text-muted">
                  <i class="fa-solid fa-envelope"></i>
                  ${contactsList[i].email}
                </p>

                <p class="mb-2 text-muted">
                  <i class="fa-solid fa-location-dot"></i>
                  ${contactsList[i].address}
                </p>
              </div>

              <div class="d-flex justify-content-between align-items-center pt-3 border-top">

                <div class="d-flex">
                  <a href="tel:${contactsList[i].phone}" class="icon-btn call">
                    <i class="fa-solid fa-phone"></i>
                  </a>
                  <a href="mailto:${contactsList[i].email}" class="icon-btn mail">
                    <i class="fa-solid fa-envelope"></i>
                  </a>
                </div>

                <div class="d-flex">

                  <button type="button" class="btn p-1 icon-btn star" data-action="favorite">
                    <i class="fa-solid fa-star ${contactsList[i].favorite ? "text-warning" : ""}" data-action="favorite"></i>
                  </button>

                  <button type="button" class="btn p-1 icon-btn heart" data-action="emergency">
                    <i class="fa-solid fa-heart ${contactsList[i].emergency ? "text-danger" : ""}" data-action="emergency"></i>
                  </button>

                  <button type="button" class="btn p-1 icon-btn edit" onclick="editContact(${i})">
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button type="button" class="btn p-1 icon-btn delete" onclick="deleteContact(${i})">
                    <i class="fa-solid fa-trash"></i>
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>`;

        /* ===== SIDEBAR FAVORITE ===== */
        if (contactsList[i].favorite) {
          var favoriteBody = document.createElement("div");
          favoriteBody.classList.add("d-flex","rounded-4","bg-secondary-subtle","align-items-center","gap-2","p-3","my-2");

          var spanFavorite = document.createElement("span");
          spanFavorite.classList.add("badge","bg-warning","fs-5");
          spanFavorite.innerHTML = contactsList[i].name[0].toUpperCase();

          var spanFavoriteNumber = document.createElement("p");
          spanFavoriteNumber.classList.add("m-0");
          spanFavoriteNumber.innerHTML = contactsList[i].phone;

          favoriteBody.appendChild(spanFavorite);
          favoriteBody.appendChild(spanFavoriteNumber);
          favoriteCard.appendChild(favoriteBody);

          favoriteCounter++;
        }

        /* ===== SIDEBAR EMERGENCY ===== */
        if (contactsList[i].emergency) {
          var emergencyBody = document.createElement("div");
          emergencyBody.classList.add("d-flex","rounded-4","bg-secondary-subtle","align-items-center","gap-2","p-3","my-2");

          var spanEmergency = document.createElement("span");
          spanEmergency.classList.add("badge","bg-danger","fs-5");
          spanEmergency.innerHTML = contactsList[i].name[0].toUpperCase();

          var spanEmergencyNumber = document.createElement("p");
          spanEmergencyNumber.classList.add("m-0");
          spanEmergencyNumber.innerHTML = contactsList[i].phone;

          emergencyBody.appendChild(spanEmergency);
          emergencyBody.appendChild(spanEmergencyNumber);
          emergencyCard.appendChild(emergencyBody);

          emergencyCounter++;
        }
    }

    // Update UI counters
    if(myFavoriteCounter) myFavoriteCounter.innerHTML = favoriteCounter;
    if(myEmergencyCounter) myEmergencyCounter.innerHTML = emergencyCounter;
    if(total) total.innerHTML = contactsList.length;

    // Render to DOM
    container.innerHTML = cartoona;

    if(manageCounter) {
        manageCounter.innerHTML = `Manage and organize your ${contactsList.length} contacts`;
    }
}

/* ============================= */
/* ========= DELETE ============ */
/* ============================= */

function deleteContact(deletedIndex) {
    Swal.fire({
        title: "Are you sure you want to delete this contact?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            contactsList.splice(deletedIndex, 1);
            localStorage.setItem("contacts", JSON.stringify(contactsList));
            renderContacts();
        }
    });
}

/* ============================= */
/* ========= EDIT ============== */
/* ============================= */

function editContact(updatedIndex) {
    currentUpdate = updatedIndex;

    // فتح المودال أولاً
    lightBox.classList.remove("d-none");

    // ملئ الداتا في الـ Inputs
    fullName.value = contactsList[updatedIndex].name;
    phoneNumber.value = contactsList[updatedIndex].phone;
    email.value = contactsList[updatedIndex].email;
    address.value = contactsList[updatedIndex].address;
    groub.value = contactsList[updatedIndex].groub;
    notes.value = contactsList[updatedIndex].notes;
    
    // ضبط الشيك بوكس على حسب حالة الاسم الحالية
    emergencyCheck.checked = contactsList[updatedIndex].emergency || false;
    favoriteCheck.checked = contactsList[updatedIndex].favorite || false;
}

/* ============================= */
/* ========= TOGGLE ============ */
/* ============================= */

// Toggle Favorite / Emergency
document.addEventListener("click", function (e) {
    var action = e.target.dataset.action;
    if (!action) return;

    var card = e.target.closest(".contactCard");
    if (!card) return;

    var index = card.dataset.index;

    if (action === "favorite") {
        contactsList[index].favorite = !contactsList[index].favorite;
    }

    if (action === "emergency") {
        contactsList[index].emergency = !contactsList[index].emergency;
    }

    localStorage.setItem("contacts", JSON.stringify(contactsList));
    renderContacts();
});

/* ============================= */
/* ========= VALIDATION ======== */
/* ============================= */

var numRegex = /^01[0125][0-9]{8}$/;
var nameRegex = /^[A-Za-z\u0600-\u06FF]{3,}(?:\s[A-Za-z\u0600-\u06FF]+)*$/;
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Live validation
fullName.addEventListener("input", function () {
    if (nameRegex.test(fullName.value)) {
        fullName.classList.add("is-valid");
        fullName.classList.remove("is-invalid");
        if(nameError) nameError.classList.add("d-none");
    } else {
        fullName.classList.add("is-invalid");
        fullName.classList.remove("is-valid");
        if(nameError) nameError.classList.remove("d-none");
    }
});

phoneNumber.addEventListener("input", function () {
    if (numRegex.test(phoneNumber.value)) {
        phoneNumber.classList.add("is-valid");
        phoneNumber.classList.remove("is-invalid");
        if(numberError) numberError.classList.add("d-none");
    } else {
        phoneNumber.classList.add("is-invalid");
        phoneNumber.classList.remove("is-valid");
        if(numberError) numberError.classList.remove("d-none");
    }
});

email.addEventListener("input", function () {
    if (emailRegex.test(email.value)) {
        email.classList.add("is-valid");
        email.classList.remove("is-invalid");
        if(emailError) emailError.classList.add("d-none");
    } else {
        email.classList.add("is-invalid");
        email.classList.remove("is-valid");
        if(emailError) emailError.classList.remove("d-none");
    }
});

/* ============================= */
/* ========= SEARCH ============ */
/* ============================= */

function search() {
  var trim = document.querySelector(".search");
  cartoona = "";
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].name.toLowerCase().includes(trim.value.toLowerCase()) ||
      contactsList[i].phone.includes(trim) ||
      contactsList[i].email.toLowerCase().includes(trim)) {
      cartoona += `
      <div class="col-md-6">
        <div class="contactCard py-3" data-index="${i}">
          <div class="card contact-card border-0 shadow-sm rounded-4 p-3">
            
            <!-- HEADER -->
            <div class="d-flex align-items-center gap-3 mb-3">
              <span class="avatar-circle">
                ${contactsList[i].name.charAt(0).toUpperCase()}
              </span>

              <div>
                <h5 class="fw-bold mb-1">${contactsList[i].name}</h5>
                <small class="text-muted d-flex align-items-center gap-2">
                  <i class="fa-solid fa-phone"></i>
                  ${contactsList[i].phone}
                </small>
              </div>
            </div>

            <!-- BODY -->
            <div class="mb-3">
              <p class="mb-2 text-muted d-flex align-items-center gap-2">
                <i class="fa-solid fa-envelope"></i>
                ${contactsList[i].email}
              </p>

              <p class="mb-2 text-muted d-flex align-items-center gap-2">
                <i class="fa-solid fa-location-dot"></i>
                ${contactsList[i].address}
              </p>

              <div class="d-flex gap-2">
                <span class="badge bg-primary-subtle text-primary">
                  ${contactsList[i].groub}
                </span>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="d-flex justify-content-between align-items-center pt-3 border-top">
              <div class="d-flex">
                <a href="tel:${contactsList[i].phone}" class="icon-btn call">
                  <i class="fa-solid fa-phone"></i>
                </a>
                <a href="mailto:${contactsList[i].email}" class="icon-btn mail">
                  <i class="fa-solid fa-envelope"></i>
                </a>
              </div>

                <div class="d-flex">

                  <button type="button" class="btn p-1 icon-btn star" data-action="favorite">
                    <i class="fa-solid fa-star ${contactsList[i].favorite ? "text-warning" : ""}" data-action="favorite"></i>
                  </button>

                  <button type="button" class="btn p-1 icon-btn heart" data-action="emergency">
                    <i class="fa-solid fa-heart ${contactsList[i].emergency ? "text-danger" : ""}" data-action="emergency"></i>
                  </button>

                  <button type="button" class="btn p-1 icon-btn edit" onclick="editContact(${i})">
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button type="button" class="btn p-1 icon-btn delete" onclick="deleteContact(${i})">
                    <i class="fa-solid fa-trash"></i>
                  </button>

                </div>
            </div>

          </div>
        </div>
      </div>`

    }
    container.innerHTML = cartoona;
    clearForm();
  }
  if (trim.value == "") {
    addContact();
  }

}

