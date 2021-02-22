const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    ITEM: Symbol("item"),
    SIZE:   Symbol("size"),
    TOPPINGS:   Symbol("toppings"),
    DRINKS:  Symbol("drinks"),
    EXTRAS:  Symbol("extras"),
    PAYMENT: Symbol("payment")
});

const Items = [
    {
        ITEM: "pizza",
        SIZE:   "small, medium, large",
        TOPPINGS:   "cheese, onion, garlic, tomato",
        ITEMPRICE: "15.0",
        TOPPINGPRICE: "5.0"
    },
    {
        ITEM: "sandwich",
        SIZE:   "small, medium, large",
        TOPPINGS:   "cheese, mayo",
        PRICE:"7.0",
        TOPPINGPRICE: "3.0"
    },
    {
        ITEM: "chicken",
        SIZE:   "small, meduim, large",
        TOPPINGS:   "wings, drumsticks, cheese, ribs",
        PRICE: "17.0",
        TOPPINGPRICE: "3.0"
    },
];

const Drinks = [
    {
        ITEM: "coke",
        ITEMPRICE: "9.0",
    },
    {
        ITEM: "pepsi",
        ITEMPRICE: "12.0",
    },
    {
        ITEM: "sprite",
        ITEMPRICE: "7.0",
    },
];

const Extras = [
    {
        ITEM: "fries",
        ITEMPRICE: "2.0",
    },
    {
        ITEM: "rings",
        ITEMPRICE: "3.0",
    },
];

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber,sUrl);
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
                this.totalPrice += parseFloat(Items.filter(e => e.ITEM.toLowerCase().includes(this.sItem)).map(s =>s.ITEMPRICE));
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
                this.totalPrice += parseFloat(Items.filter(e => e.TOPPINGS.toLowerCase().includes(this.sToppings)).map(s =>s.TOPPINGPRICE));
                aReturn.push(`Would you like drinks? ${Drinks.map(e => e.ITEM).join(", ")}`);
                break;
            case OrderState.DRINKS:
                this.stateCur = OrderState.EXTRAS;
                if(sInput.toLowerCase() != "no"){
                    this.sDrinks = sInput;
                    this.totalPrice += parseFloat(Drinks.filter(e => e.ITEM.toLowerCase().includes(this.sDrinks)).map(s =>s.ITEMPRICE));
                }
                aReturn.push(`Would you like extras? ${Extras.map(e => e.ITEM).join(", ")}`);
                break;
            case OrderState.EXTRAS:
                this.stateCur = OrderState.PAYMENT;
                if(sInput.toLowerCase() != "no"){
                    this.sExtras = sInput;
                    this.totalPrice += parseFloat(Extras.filter(e => e.ITEM.toLowerCase().includes(this.sExtras)).map(s =>s.ITEMPRICE));
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
                if(this.sDrinks){
                    aReturn.push(`and ${this.sDrinks} for drinks`);
                }
                if(this.sExtras){
                    aReturn.push(`and ${this.sExtras} for extras`);
                }
                aReturn.push(`Total Cost is $${this.totalPrice}`);
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`<a href="${this.sUrl}/payment/${this.sNumber}/" style="color:#FF0000;" target="_blank" >Payment Link</a>`);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                let address = [].concat.apply([], Object.values(sInput.purchase_units[0].shipping.address));
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${address} on ${d.toTimeString()}`);
                this.isDone(true);
                break;
        }
        return aReturn;
    }
    renderForm(){
        // your client id should be kept private
        const sClientID = process.env.SB_CLIENT_ID || 'AeX8Mv-9BOaQQM-Cv06BMLqZDG0F0btEjreLySUtvPOuFpn6SYtYenqIEo_p1qsQ58AlRgmnJV4v8dbm'
        return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your order of $${this.totalPrice}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.totalPrice}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

    }
}