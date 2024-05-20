// terminal colors for messages
const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';


// welcome ASCII art
const figlet = require('figlet');

figlet("worXspace", function(err, data){
    if (err){
        console.log(red, "oops... something went wrong");
        console.dir(err);
        return;
    }
    console.log(green, data);
});

// initialize function
function init() {

    // helpful hint to quit application
    const helpfulHint = () => {
        console.log(yellow, "🤓 Helpful hint - to quit this app anytime press ctrl + c 🤓")
    }

    helpfulHint();

}

init();