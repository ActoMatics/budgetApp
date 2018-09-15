
let budgetController = (() => {

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentages = -1;
        ;
    }

    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0)
            this.percentage = Math.round((this.value / totalInc) * 100);
        else
            this.percentage = -1;
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = (type) => {
        // create new item base on 'inc' or 'exp' type
        let sum = 0;

        data.allItems[type].map(curr => {
            sum += curr.value;
        });

        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: (type, desc, val) => {
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
        },

        deleteItem: (type, id) => {
            let ids,
                index;
            // returns the current id 
            ids = data.allItems[type].map(currentId => {
                console.log(currentId.id, id);
                return currentId.id
            });
            // locate the correct id's index
            index = ids.indexOf(id);
            // id the id exists we remove it from the data structure id 

            console.log(index, id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
                console.log('deletedd!', index);
            }

        },

        calculateBudget: () => {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget income/expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income spent
            if (data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1
        },


        calculatePercentages: () => {
            data.allItems.exp.forEach(curr => curr.calcPercentage(data.totals.inc));
        },


        getPercentages: () => {
            let allPercentages = data.allItems.exp.map(curr => curr.getPercentage());
            return allPercentages;
        },


        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    }

})();



let UIController = (() => {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if (type == 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
            }

            // replace the placeholder text with the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: (selectorId) => {
            // you can't simply delete an element in HTML, you have to move up to remove the child,you can only delete a child
            let el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
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

        displayBudget: (obj) => {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0)
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            else
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
        },

        displayPercentages: (percentages) => {
            let fields;

            fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            // forLoop for nodesLists
            let nodeListForEach = (list, callback) => {
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i)
                };
            }

            nodeListForEach(fields, (curr, index) => {
                if (percentages[index] > 0)
                    curr.textContent = percentages[index] + '%';
                else
                    curr.textContent = '---';

            });

        },

        getDOMStrings: () => {
            return DOMStrings;
        }
    }
})();


// Global app controller
let controller = ((budgetCtrl, UICtrl) => {

    let setupEventListeners = () => {
        let DOM = UICtrl.getDOMStrings();
        // set event handler for adding items
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        // set event handler for removing items - also called - event delegation. to let the events bubble up to all the containers.
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };


    let updateBudget = () => {
        // calculate the budget 
        budgetCtrl.calculateBudget();
        // return budget
        let budget = budgetCtrl.getBudget();
        // display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = () => {
        // calculate percentages
        budgetCtrl.calculatePercentages();
        // read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();
        //update the ui with the new percentages
        UICtrl.displayPercentages(percentages);
    };


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

            //calculate and update Percentages
            updatePercentages();
        } else {
            alert('Can\'t insert empty value/less than 0 value')
        }
    };

    let ctrlDeleteItem = (event) => {
        /**
         * @name HTML_traversing
         * Move through", used to "find" (or select) HTML elements based on their relation to other elements
         * event.target - returns the the html node in the dom [console.log(event.target);]
         * If we want to move up we can user event.parentNode [console.log(event.target.parentNode);]
         * we can use the parent node all the way up to the top of the required node by chaining it.
         * It can be used to fetch different elements such as the elements id =  console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
         */
        let itemId,
            splitId,
            type,
            id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        // since this is the only place in the dom with id we will use it accordingly

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = splitId[1];

            // delete the item from the data structure
            budgetCtrl.deleteItem(type, id);

            //delete the item from the ui
            UICtrl.deleteListItem(itemId);

            // update and show the new budget
            updateBudget();

            //calculate and update Percentages
            updatePercentages();
        }
    };


    return {
        init: () => {
            // display the budget on the UI
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };


})(budgetController, UIController);


controller.init();