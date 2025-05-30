const figlet = require("figlet");

figlet('Kesa', (err, data)=> {
    if(err) {
        console.log("something went wrong...");
        console.dir(err);
        return;
        
    }
    console.log(data);
})