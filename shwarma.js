const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    ITEM: Symbol("item"),
    SIZE:   Symbol("size"),
    TOPPINGS:   Symbol("toppings"),
    DRINKS:  Symbol("drinks"),
    EXTRAS:  Symbol("extras")
});

const Items = [
    {
        ITEM: "pizza",
        SIZE:   "small, meduim, large",
        TOPPINGS:   "cheese, onion, garlic, tomato",
        ITEMPRICE: "15",
        TOPPINGPRICE: "5"
    },
    {
        ITEM: "sandwich",
        SIZE:   "small, meduim, large",
        TOPPINGS:   "cheese, mayo",
        PRICE:"7",
        TOPPINGPRICE: "3"
    },
    {
        ITEM: "chicken",
        SIZE:   "small, meduim, large",
        TOPPINGS:   "wings, drumsticks, cheese, ribs",
        PRICE: "17",
        TOPPINGPRICE: "3"
    },
];

const Drinks = [
    {
        ITEM: "coke",
        ITEMPRICE: "9",
    },
    {
        ITEM: "pepsi",
        ITEMPRICE: "12",
    },
    {
        ITEM: "sprite",
        ITEMPRICE: "7",
    },
];

const Extras = [
    {
        ITEM: "fries",
        ITEMPRICE: "2",
    },
    {
        ITEM: "rings",
        ITEMPRICE: "3",
    },
];

module.exports = class ShwarmaOrder extends Order{
    constructor(){
        super();
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.sExtras = "";
        this.sItem = "";
        this.totalPrice = 0;
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.ITEM;
                aReturn.push("Welcome to Bhumik's Shawarma.");
                aReturn.push(`What item would you like in your order? ${Items.map(e => e.ITEM).join(", ")}`);
                break;
            case OrderState.ITEM:
                this.stateCur = OrderState.SIZE;
                this.sItem = sInput;
                this.totalPrice += parseInt(Items.filter(e => e.ITEM.toLowerCase().includes(this.sItem)).map(s =>s.ITEMPRICE));
                aReturn.push(`What size of ${this.sItem} would you like? ${Items.filter(e => e.ITEM.toLowerCase().includes(this.sItem)).map(s =>s.SIZE)}`);
                break;
            case OrderState.SIZE:
                this.stateCur = OrderState.TOPPINGS
                this.sSize = sInput;
                aReturn.push(`What toppings would you like for ${this.sItem}? ${Items.filter(e => e.ITEM.toLowerCase().includes(this.sItem)).map(s =>s.TOPPINGS)}`);
                break;
            case OrderState.TOPPINGS:
                this.stateCur = OrderState.DRINKS
                this.sToppings = sInput;
                this.totalPrice += parseInt(Items.filter(e => e.TOPPINGS.toLowerCase().includes(this.sToppings)).map(s =>s.TOPPINGPRICE));
                aReturn.push(`Would you like drinks? ${Drinks.map(e => e.ITEM).join(", ")}`);
                break;
            case OrderState.DRINKS:
                this.stateCur = OrderState.EXTRAS;
                if(sInput.toLowerCase() != "no"){
                    this.sDrinks = sInput;
                    this.totalPrice += parseInt(Drinks.filter(e => e.ITEM.toLowerCase().includes(this.sDrinks)).map(s =>s.ITEMPRICE));
                }
                aReturn.push(`Would you like extras? ${Extras.map(e => e.ITEM).join(", ")}`);
                break;
            case OrderState.EXTRAS:
                this.isDone(true);
                if(sInput.toLowerCase() != "no"){
                    this.sExtras = sInput;
                    this.totalPrice += parseInt(Extras.filter(e => e.ITEM.toLowerCase().includes(this.sExtras)).map(s =>s.ITEMPRICE));
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
                if(this.sDrinks){
                    aReturn.push(`and ${this.sDrinks} for drinks`);
                }
                if(this.sExtras){
                    aReturn.push(`and ${this.sExtras} for extras`);
                }
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Please pick it up at ${d.toTimeString()}`);
                aReturn.push(`Total Cost is $${this.totalPrice}`);
        }
        return aReturn;
    }
}