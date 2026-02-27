let entries = []
let editId = null

const tableBody = document.getElementById("tableBody")
const addBtn = document.getElementById("addBtn")

const dateInput = document.getElementById("dateInput")
const descInput = document.getElementById("descInput")
const creditInput = document.getElementById("creditInput")
const debitInput = document.getElementById("debitInput")

const totalCredit = document.getElementById("totalCredit")
const totalDebit = document.getElementById("totalDebit")
const totalAmount = document.getElementById("totalAmount")

/* ===== Mutual Disable Function ===== */
function setupMutualDisable(creditEl, debitEl) {
  const toggle = () => {
    const creditVal = Number(creditEl.value)
    const debitVal = Number(debitEl.value)

    debitEl.disabled = creditVal > 0
    creditEl.disabled = debitVal > 0
  }

  creditEl.addEventListener("input", toggle)
  debitEl.addEventListener("input", toggle)

  toggle() // initial check
}

setupMutualDisable(creditInput, debitInput)

/* ===== Add Entry ===== */
addBtn.addEventListener("click", () => {
  if (!dateInput.value || !descInput.value) return
  if (!creditInput.value && !debitInput.value) return

  const newEntry = {
    id: Date.now(),
    date: dateInput.value,
    description: descInput.value,
    credit: Number(creditInput.value) || 0,
    debit: Number(debitInput.value) || 0
  }

  entries.push(newEntry)
  saveData()
  clearInputs()
  renderTable()
})

/* ===== Render Table ===== */
function renderTable() {
  tableBody.innerHTML = ""

  entries.forEach((entry, index) => {
    if (editId === entry.id) {
      renderEditRow(entry, index)
    } else {
      renderDisplayRow(entry, index)
    }
  })

  calculateTotals()
}

/* ===== Normal Row ===== */
function renderDisplayRow(entry, index) {
  const row = document.createElement("tr")

  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${entry.date}</td>
    <td>${entry.description}</td>
    <td>${entry.credit}</td>
    <td>${entry.debit}</td>
    <td>
      <button class="btn btn-warning btn-sm editBtn">Edit</button>
      <button class="btn btn-danger btn-sm deleteBtn">Delete</button>
    </td>
  `

  tableBody.appendChild(row)

  row.querySelector(".editBtn").addEventListener("click", () => {
    editId = entry.id
    renderTable()
  })

  row.querySelector(".deleteBtn").addEventListener("click", () => {
    entries = entries.filter(e => e.id !== entry.id)
    saveData()
    renderTable()
  })
}

/* ===== Edit Row ===== */
function renderEditRow(entry, index) {
  const row = document.createElement("tr")

  row.innerHTML = `
    <td>${index + 1}</td>
    <td><input type="date" class="form-control dateEdit" value="${
      entry.date
    }"></td>
    <td><input type="text" class="form-control descEdit" value="${
      entry.description
    }"></td>
    <td><input type="number" class="form-control creditEdit" value="${
      entry.credit
    }"></td>
    <td><input type="number" class="form-control debitEdit" value="${
      entry.debit
    }"></td>
    <td>
      <button class="btn btn-success btn-sm saveBtn">Save</button>
      <button class="btn btn-secondary btn-sm cancelBtn">Cancel</button>
    </td>
  `

  tableBody.appendChild(row)

  const dateEdit = row.querySelector(".dateEdit")
  const descEdit = row.querySelector(".descEdit")
  const creditEdit = row.querySelector(".creditEdit")
  const debitEdit = row.querySelector(".debitEdit")

  setupMutualDisable(creditEdit, debitEdit)

  row.querySelector(".saveBtn").addEventListener("click", () => {
    if (!dateEdit.value || !descEdit.value) return
    if (!creditEdit.value && !debitEdit.value) return

    entry.date = dateEdit.value
    entry.description = descEdit.value
    entry.credit = Number(creditEdit.value) || 0
    entry.debit = Number(debitEdit.value) || 0

    editId = null
    saveData()
    renderTable()
  })

  row.querySelector(".cancelBtn").addEventListener("click", () => {
    editId = null
    renderTable()
  })
}

/* ===== Totals ===== */
function calculateTotals() {
  let creditSum = 0
  let debitSum = 0

  entries.forEach(e => {
    creditSum += e.credit
    debitSum += e.debit
  })

  totalCredit.textContent = creditSum.toString()
  totalDebit.textContent = debitSum.toString()
  totalAmount.textContent = (creditSum - debitSum).toString()
}

/* ===== Helpers ===== */
function clearInputs() {
  dateInput.value = ""
  descInput.value = ""
  creditInput.value = ""
  debitInput.value = ""
  creditInput.disabled = false
  debitInput.disabled = false
}

function saveData() {
  localStorage.setItem("entries", JSON.stringify(entries))
}

function loadData() {
  const data = localStorage.getItem("entries")
  if (data) entries = JSON.parse(data)
}

loadData()
renderTable()
