class Test {
    constructor(a, b){
        this.a = a;
        this.b = b;
    }

    getVars(){
        console.log(a);
        console.log(b);
        return this;
    }
}

var test = new Test();