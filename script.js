const balance = document.getElementById('balance');
const incomeBtn = document.getElementById('income-btn');
const expenseBtn = document.getElementById('expense-btn');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const errorMessage = document.getElementById('error-message');

let isIncome = true; // Flag to track whether the transaction is income or expense

incomeBtn.addEventListener('click', () => {
	isIncome = true;
	incomeBtn.classList.add('active');
	expenseBtn.classList.remove('active');
});

expenseBtn.addEventListener('click', () => {
	isIncome = false;
	expenseBtn.classList.add('active');
	incomeBtn.classList.remove('active');
});

const localStorageTransactions =
	JSON.parse(localStorage.getItem('transactions')) || [];

let transactions = localStorageTransactions;

function addTransaction(e) {
	e.preventDefault();

	const enteredText = text.value;
	const enteredAmount = +amount.value;

	if (
		enteredText.trim() === '' ||
		isNaN(enteredAmount) ||
		enteredAmount === 0
	) {
		errorMessage.textContent = 'Please enter a valid item and amount.';
	} else {
		errorMessage.textContent = '';

		const transaction = {
			id: generateID(),
			text: enteredText,
			amount: isIncome ? enteredAmount : -enteredAmount,
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

	item
		.querySelector('.delete-btn')
		.addEventListener('click', () => removeTransaction(transaction.id));
	list.appendChild(item);
}

list.addEventListener('click', (e) => {
	if (e.target.classList.contains('delete-btn')) {
		const itemId = e.target.parentElement.dataset.id;
		removeTransaction(itemId);
	}
});

function updateValues() {
	const amounts = transactions.map((transaction) => transaction.amount);
	const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
	const income = amounts
		.filter((item) => item > 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2);
	const expense = Math.abs(
		amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0)
	).toFixed(2);

	balance.innerText = `$${total}`;
	moneyPlus.innerText = `$${income}`;
	moneyMinus.innerText = `$${expense}`;
}

function removeTransaction(id) {
	transactions = transactions.filter((transaction) => transaction.id !== id);
	updateLocalStorage();
	init();
}

function updateLocalStorage() {
	localStorage.setItem('transactions', JSON.stringify(transactions));
}

const items = [
	'Budget',
	'Gas',
	'Electricity',
	'Groceries',
	'Internet',
	'Rent',
	'Water Bill',
	'Phone Bill',
	'Car Insurance',
	'Health Insurance',
	'Public Transport',
	'Eating Out',
	'Entertainment',
	'Clothing',
	'Gym Membership',
	'Education',
	'Medical Expenses',
	'Miscellaneous',
	'Salary',
	'Freelance Work',
	'Investment Income',
	'Rental Income',
	'Interest Income',
	'Gifts',
	'Grants',
	'Scholarships',
	'Allowance',
];


function init() {
	list.innerHTML = '';
	items.forEach((item) => {
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
