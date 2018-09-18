export default (() => {

    const Expense = function (id, description, value) {
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


    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    const calculateTotal = (type) => {
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
            let newItem, ID;
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

            //Example  id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3

            // returns the current id 
            ids = data.allItems[type].map(currentId => {
                return currentId.id
            });
            // locate the correct id's index
            index = ids.indexOf(id);
            // id the id exists we remove it from the data structure id 

            if (index !== -1)
                data.allItems[type].splice(index, 1);
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