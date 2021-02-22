module.exports = class Order{
    constructor(sNumber, sUrl){
        this.bDone = false;
        this.sNumber = sNumber;
        this.sUrl = sUrl;
    }
    isDone(bDone){
        if(bDone){
            this.bDone = bDone;
        }
        return this.bDone;
    }
}