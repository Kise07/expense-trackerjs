const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const errorMessage = document.getElementById('error-message');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions')) || [];

let transactions = localStorageTransactions;

function addTransaction(e) {
  e.preventDefault();

  const enteredText = text.value;
  const enteredAmount = +amount.value;

  if (enteredText.trim() === '' || isNaN(enteredAmount) || enteredAmount === 0) {
    errorMessage.textContent = 'Please enter a valid item and amount.';
  } else {
    errorMessage.textContent = '';

    const transaction = {
      id: generateID(),
      text: enteredText,
      amount: enteredAmount,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

function generateID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn">x</button>
  `;

  item.querySelector('.delete-btn').addEventListener('click', () => removeTransaction(transaction.id));
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = Math.abs(amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0)).toFixed(2);

  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

const items = ['Gas', 'Electric', 'Grocery', 'Internet'];

function init() {
  list.innerHTML = '';
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    text.appendChild(option);
  });
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
