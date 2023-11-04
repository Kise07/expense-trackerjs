const balance = document.getElementById('balance'); // Selecting the balance element from the DOM
const incomeBtn = document.getElementById('income-btn'); // Selecting the income button from the DOM
const expenseBtn = document.getElementById('expense-btn'); // Selecting the expense button from the DOM
const moneyPlus = document.getElementById('money-plus'); // Selecting the income display element from the DOM
const moneyMinus = document.getElementById('money-minus'); // Selecting the expense display element from the DOM
const list = document.getElementById('list'); // Selecting the transaction list element from the DOM
const form = document.getElementById('form'); // Selecting the form element from the DOM
const text = document.getElementById('text'); // Selecting the transaction description input element from the DOM
const amount = document.getElementById('amount'); // Selecting the transaction amount input element from the DOM
const errorMessage = document.getElementById('error-message'); // Selecting the error message element from the DOM

let isIncome = true; // Flag to track whether the transaction is income or expense

// Event listener for income button click
incomeBtn.addEventListener('click', () => {
	isIncome = true;
	incomeBtn.classList.add('active'); // Adding active class to the income button
	expenseBtn.classList.remove('active'); // Removing active class from the expense button
});

// Event listener for expense button click
expenseBtn.addEventListener('click', () => {
	isIncome = false;
	expenseBtn.classList.add('active'); // Adding active class to the expense button
	incomeBtn.classList.remove('active'); // Removing active class from the income button
});

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions')) || []; // Retrieving transactions from local storage or initializing an empty array if not present

let transactions = localStorageTransactions; // Storing transactions in the variable

// Function to handle adding a new transaction
function addTransaction(e) {
	e.preventDefault();

	const enteredText = text.value; // Getting the entered transaction description
	const enteredAmount = +amount.value; // Getting the entered transaction amount and converting it to a number

	// Validation for valid input
	if (
		enteredText.trim() === '' ||
		isNaN(enteredAmount) ||
		enteredAmount === 0
	) {
		errorMessage.textContent = 'Please enter a valid item and amount.'; // Displaying an error message for invalid input
	} else {
		errorMessage.textContent = ''; // Clearing the error message

		const transaction = {
			id: generateID(), // Generating a unique transaction ID
			text: enteredText, // Storing the transaction description
			amount: isIncome ? enteredAmount : -enteredAmount, // Storing the transaction amount with proper sign based on income or expense
		};

		transactions.push(transaction); // Adding the transaction to the transactions array

		addTransactionDOM(transaction); // Adding the transaction to the DOM
		updateValues(); // Updating the balance and summary values
		updateLocalStorage(); // Updating transactions in local storage

		text.value = ''; // Clearing the transaction description input
		amount.value = ''; // Clearing the transaction amount input
	}
}

// Function to generate a unique transaction ID
function generateID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to add a transaction to the DOM
function addTransactionDOM(transaction) {
	const sign = transaction.amount < 0 ? '-' : '+'; // Determining the sign (income or expense)
	const item = document.createElement('li'); // Creating a new list item element
	item.classList.add(transaction.amount < 0 ? 'minus' : 'plus'); // Adding appropriate class based on income or expense
	item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn">x</button>
  `;

	item
		.querySelector('.delete-btn')
		.addEventListener('click', () => removeTransaction(transaction.id)); // Adding event listener to delete button

	list.appendChild(item); // Appending the item to the transaction list in the DOM
}

// Event listener for click on transaction list
list.addEventListener('click', (e) => {
	if (e.target.classList.contains('delete-btn')) {
		const itemId = e.target.parentElement.dataset.id; // Getting the ID of the clicked transaction
		removeTransaction(itemId); // Removing the transaction from the transactions array and updating the DOM
	}
});

// Function to update balance and summary values
function updateValues() {
	const amounts = transactions.map((transaction) => transaction.amount); // Extracting transaction amounts
	const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2); // Calculating total balance
	const income = amounts.filter((item) => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2); // Calculating total income
	const expense = Math.abs(amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0)).toFixed(2); // Calculating total expense

	balance.innerText = `$${total}`; // Updating total balance in the DOM
	moneyPlus.innerText = `$${income}`; // Updating total income in the DOM
	moneyMinus.innerText = `$${expense}`; // Updating total expense in the DOM
}

// Function to remove a transaction by ID
function removeTransaction(id) {
	transactions = transactions.filter((transaction) => transaction.id !== id); // Filtering out the transaction with the specified ID
	updateLocalStorage(); // Updating transactions in local storage
	init(); // Re-initializing the application to update the DOM
}

// Function to update transactions in local storage
function updateLocalStorage() {
	localStorage.setItem('transactions', JSON.stringify(transactions)); // Converting transactions to JSON and storing in local storage
}

// List of available transaction items
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

// Function to initialize the application
function init() {
	list.innerHTML = ''; // Clearing the transaction list in the DOM
	items.forEach((item) => {
		const option = document.createElement('option'); // Creating an option element for the dropdown
		option.value = item; // Setting the option value
		option.textContent = item; // Setting the option text content
		text.appendChild(option); // Appending the option to the dropdown
	});
	transactions.forEach(addTransactionDOM); // Adding each transaction to the DOM
	updateValues(); // Updating balance and summary values
}

init(); // Initializing the application when the script is first loaded

form.addEventListener('submit', addTransaction); // Adding event listener for form submission to add a new transaction
