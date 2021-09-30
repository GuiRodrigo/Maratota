const Modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },

    close() {
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("Dev.finances:transactions"))||
        []
    },
    set(transactions){
        localStorage.setItem("Dev.finances:transactions", JSON.stringify
        (transactions))
    }
}


const Transaction = {

     all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index,1)

        App.reload()
    },

    income() {
        let income = 0;
        Transaction.all.forEach(transactions => {
            if (transactions.amount > 0) {
                income += transactions.amount;
            }
        })
        return income;
    },

    expense() {
        let expense = 0;
        Transaction.all.forEach(transactions => {
            if (transactions.amount < 0) {
                expense += transactions.amount;
            }
        })
        return expense;
    },

    total() {
        return Transaction.income() + Transaction.expense()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        // tr.dataset.index = 
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = ` 
        <td class="description">${ transaction.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `
        

        return html
    },

    uptadeBalance() {
        document.getElementById("incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.income())
        document.getElementById("expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expense())
        document.getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total()
            )
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatAmount(value) {
        value = value * 100

        return Math.round(value)
    },

    formatDate(date) {
        const splittedate = date.split("-")
        return `${splittedate[2]}/${splittedate[1]}/${splittedate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#descripition'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField() {
        const { description, amount, date } = Form.getValues()

        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error('por favor, preencha todos os campos')
        }
    },

    formatValue() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },


    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateField()

            const transactions = Form.formatValue()

            Transaction.add(transactions)

            Form.clearFields()

            Modal.close()

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        Storage.set(Transaction.all)

        DOM.uptadeBalance()
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }

}

App.init()



