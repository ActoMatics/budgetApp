let budgetController = (() => {

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, desc, val) {
            let newItem;
            // create new ID
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else
                ID = 0;
            // create new item base on 'inc' or 'exp' type
            if (type === 'exp')
                newItem = new Expense(ID, desc, val)
            else if (type === 'inc')
                newItem = new Income(ID, desc, val)

            // push it into our data structure                 
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },

        testing: () => {
            console.log(data);
        }
    }

})();



let UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: () => {
            return {
                // will be either income or expense
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: (obj, type) => {
            let html,
                newHtml,
                element;
            // create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if (type == 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
            }

            // replace the placeholder text with the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: () => {
            let fields,
                fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            // convert the list that is received to an array
            fieldsArray = Array.prototype.slice.call(fields);

            // loop over the array to clear all inputs
            fieldsArray.forEach(currValue => {
                currValue.value = "";
            });

            // returns the focus to the fields
            fieldsArray[0].focus();
        },

        getDOMStrings: () => {
            return DOMStrings;
        }
    }
})();


// Global app controller
let controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = () => {
        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };


    let updateBudget = () => {
        // calculate the budget 

        // return budget

        // display the budget on the UI
    }

    let ctrlAddItem = () => {
        let input,
            newItem;

        //  get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add the new item to the UI 
            UICtrl.addListItem(newItem, input.type)

            // clear the fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();
        } else {
            alert('Can\'t insert empty value/less than 0 value')
        }



    }


    return {
        init: () => {
            setupEventListeners();
        }
    };


})(budgetController, UIController);


controller.init();