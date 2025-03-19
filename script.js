// Elemente aus dem DOM abrufen
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.getElementById("submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// Bearbeitungsoptionen
let editElement;
let editFlag = false;
let editID = "";

// Event Listener für das Formular
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);

// Funktion zum Hinzufügen eines Elements
function addItem(e) {
  e.preventDefault();
  const value = grocery.value.trim();
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    const element = document.createElement("article");
    element.classList.add("grocery-item");
    element.setAttribute("data-id", id);
    element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

    // Event-Listener für Bearbeiten und Löschen hinzufügen
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => editItem(id, value, element));

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteItem(id, element));

    list.appendChild(element);
    displayAlert("Artikel zur Liste hinzugefügt", "success");
    container.classList.add("show-container");

    // In Local Storage speichern
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Artikel aktualisiert", "success");

    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Bitte einen Artikel eingeben", "danger");
  }
}

// Funktion zum Anzeigen von Alerts
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Funktion zum Löschen aller Elemente
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }

  container.classList.remove("show-container");
  displayAlert("Liste geleert", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// Funktion zum Bearbeiten eines Elements
function editItem(id, value, element) {
  grocery.value = value;
  editElement = element.querySelector(".title");
  editFlag = true;
  editID = id;
  submitBtn.textContent = "Bearbeiten";
}

// Funktion zum Löschen eines Elements
function deleteItem(id, element) {
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Artikel gelöscht", "danger");
  removeFromLocalStorage(id);
  setBackToDefault();
}
