// initialize inquirer
const inquirer = require("inquirer");

// require dotenv to manage env variables 
require("dotenv").config();

// configure connection to db with sequelize
const sequelize = require('./config/connection');

// terminal colors for messages
const colors = require('colors');
const green = colors.green;
const red = colors.red;
const yellow = colors.yellow;
const rainbow = colors.rainbow;
const magenta = colors.magenta;

// prompts
const startOptionsPrompt = [

    // list to select view
    {
        type: "rawlist",
        name: "startOptions",
        message: magenta("Please select an option"),
        choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee ",
            "update a role",
        ],
    }
];

// add department prompt
const addDeptPrompt = {
    type: "input",
    name: "deptName",
    message: magenta("Please enter the name of the department")
};

// add role prompt
const addRolePrompt = [
    // roleName
    {
        type: "input",
        name: "roleName",
        message: magenta("Please specify the name for the role")

    },

    // salary
    {
        type: "input",
        name: "salary",
        message: magenta("Please enter the salary for this role")
    },

    // department
    {
        type: "input",
        name: "dept",
        message: magenta("Please specify which department this role belongs to")
    }
];

// add employee prompt
const addEmployeePrompt = [
    // employee firstname
    {
        type: "input",
        name: "employeeFirstName",
        message: magenta("Please enter the employee's first name")
    },
    // employee last name
    {
        type: "input",
        name: "employeeLastName",
        message: magenta("Please enter the employee's last name")
    },
    // employee role
    {
        type: "input",
        name: "employeeRole",
        message: magenta("Please enter the employee's role")
    },
    // employee manager
    {
        type: "input",
        name: "employeeManager",
        message: magenta("Please enter the employee's manager")
    }
];


// initialize function
function init() {

    sequelize.sync()
        .then(() => {
            console.log(green(`Successfully connected to ` + yellow('worXpace_db')))

            console.log(green("Welcome to..."))
            // welcome ASCII art
            const figlet = require('figlet');

            figlet("worXpace", function (err, data) {
                if (err) {
                    console.log(red, "oops... something went wrong");
                    console.dir(err);
                    return;
                }
                console.log(rainbow(data));

                // helpful hint to quit application
                const helpfulHint = () => {
                    console.log(green(
                        `
                                       ...Business data manager`
                    ))
                    console.log(yellow(`
    🤓 Helpful hint - to quit this app anytime press ctrl + c 🤓`))
                }

                helpfulHint();

                // prompt for user input
                inquirer.prompt(startOptionsPrompt)
                    .then((answers) => {
                        switch (answers.startOptions) {
                            case "add a department":
                                inquirer.prompt(addDeptPrompt).then((departmentAnswer) => {
                                    console.log((green(`the department `) + yellow(`${departmentAnswer.deptName}`) + green(` has been successfully added to the database!`)))
                                });
                            // add department function needed (call function here)
                        }
                        switch (answers.startOptions) {
                            case "add a role":
                                inquirer.prompt(addRolePrompt).then((roleAnswer) => {
                                    console.log((green(`the role `) + yellow(`${roleAnswer.roleName}`) + green(` has been successfully added to the database!`)))
                                });
                            // add role function call to be added here
                        }
                        switch (answers.startOptions) {
                            case "add an employee":
                                inquirer.prompt(addEmployeePrompt).then((employeeAnswer) => {
                                    console.log((green(`the employee `) + yellow(`${employeeAnswer.employeeFirstName}` + " " + `${employeeAnswer.employeeLastName}`) + green(` has been successfully added to the database!`)))
                                });
                            // add employee function call to be added here
                        }
                    })
            });
        });
}

init();