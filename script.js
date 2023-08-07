var totalAmount = 0;
var selectedCurrency = "USD";

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
}

function setCookie(name, value, days) {
  var expires = "";

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function loadProgress() {
  var savedTotal = getCookie("totalAmount");

  if (savedTotal) {
    totalAmount = parseFloat(savedTotal);
    document.getElementById("total").textContent = "Total: " + formatCurrency(totalAmount);
  }

  var savedCurrency = getCookie("selectedCurrency");
  if (savedCurrency) {
    selectedCurrency = savedCurrency;
    document.getElementById("currency-select").value = selectedCurrency;
  }

  var amountValues = document.getElementsByClassName("amount-value");
  for (var i = 0; i < amountValues.length; i++) {
    var amount = parseFloat(amountValues[i].textContent);
    amountValues[i].textContent = formatCurrency(amount);
  }

  document.getElementById("total").textContent = "Total: " + formatCurrency(totalAmount);
}

function saveProgress() {
  setCookie("totalAmount", totalAmount, 7);
}

function formatCurrency(amount) {
  var currencySymbol = getCurrencySymbol(selectedCurrency);
  return currencySymbol + amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " " + selectedCurrency;
}

function getCurrencySymbol(currencyCode) {
  switch (currencyCode) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "AUD":
      return "A$";
    case "MXN":
      return "$";
    default:
      return currencyCode;
  }
}

function agregarCantidad() {
  var amountInput = document.getElementById("amount");
  var descriptionInput = document.getElementById("description");
  var amount = parseFloat(amountInput.value);
  var description = descriptionInput.value.trim(); // Eliminar espacios en blanco al inicio y final del nombre

  if (isNaN(amount)) {
    alert("Por favor, ingrese una cantidad válida.");
    return;
  }

  totalAmount += amount;

  var cantidadLista = document.getElementById("cantidad-lista");
  var listItem = document.createElement("li");

  var amountSpan = document.createElement("span");
  amountSpan.textContent = formatCurrency(amount);

  if (description !== "") {
    var descriptionSpan = document.createElement("span");
    descriptionSpan.textContent = description;
    listItem.appendChild(descriptionSpan);
  }

  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", function () {
    totalAmount -= amount;
    document.getElementById("total").textContent = "Total: " + formatCurrency(totalAmount);
    listItem.remove();
    saveProgress();
  });

  listItem.appendChild(amountSpan);
  listItem.appendChild(deleteButton);
  cantidadLista.appendChild(listItem);

  document.getElementById("total").textContent = "Total: " + formatCurrency(totalAmount);

  saveProgress();
  amountInput.value = "";
  descriptionInput.value = "";
}

function changeCurrency() {
  var currencySelect = document.getElementById("currency-select");
  selectedCurrency = currencySelect.value;

  var amountValues = document.getElementsByClassName("amount-value");
  for (var i = 0; i < amountValues.length; i++) {
    var amount = parseFloat(amountValues[i].textContent);
    amountValues[i].textContent = formatCurrency(amount);
  }

  document.getElementById("total").textContent = "Total: " + formatCurrency(totalAmount);

  setCookie("selectedCurrency", selectedCurrency, 7);
}

function openConfigurations() {
  var modal = document.getElementById("config-modal");
  modal.style.display = "block";
}

function closeConfigurations() {
  var modal = document.getElementById("config-modal");
  modal.style.display = "none";
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    var amountInput = document.getElementById("amount");
    var descriptionInput = document.getElementById("description");

    // Verificar si el evento proviene de la caja de texto de cantidad o nombre
    if (event.target === amountInput || event.target === descriptionInput) {
      agregarCantidad();
    }
  }
}

window.addEventListener("load", function () {
  loadProgress();

  var amountInput = document.getElementById("amount");
  var descriptionInput = document.getElementById("description");
  amountInput.addEventListener("keydown", handleKeyPress);
  descriptionInput.addEventListener("keydown", handleKeyPress);
});
