// initialize inquirer
const inquirer = require("inquirer");

// require dotenv to manage env variables 
require("dotenv").config();

// import pg package for postgres SQL queries
const { Client } = require('pg');

// require file system
const fs = require('fs');

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
        name: "deptId",
        message: magenta("Please specify the ID of department this role belongs to (must be an integer)")
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
        name: "employeeRoleId",
        message: magenta("Please enter the employee's role id")
    },
    // employee manager
    {
        type: "input",
        name: "employeeManagerId",
        message: magenta("Please enter the employee's manager id")
    }
];



// execute sql statement function 
const executeSql = async function (sqlStatement) {

    const client = new Client({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT
    });
    try {
        await client.connect();
        
        const result = await client.query(sqlStatement);

        console.log(green(`Successfully connected to ` + yellow('worXpace_db')));
        console.table(result.rows);
        promptUser();
    } catch (error) {
        console.error(red(`Error - Query Failed to execute`, error));
    } finally {
        await client.end();
    }
}



// prompt user
function promptUser() {
    inquirer.prompt(startOptionsPrompt)
        .then((answers) => {
            switch (answers.startOptions) {
                case "add a department":
                    inquirer.prompt(addDeptPrompt).then((departmentAnswer) => {
                        const sqlStatement = `INSERT INTO department (name) VALUES ('${departmentAnswer.deptName}')`
                        executeSql(sqlStatement);
                        console.log((green(`the department `) + yellow(`${departmentAnswer.deptName}`) + green(` has been successfully added to the database!`)));
                    });

            }
            switch (answers.startOptions) {
                case "add a role":
                    inquirer.prompt(addRolePrompt).then((roleAnswer) => {
                        const sqlStatement = `INSERT INTO role (title, salary, department_id) VALUES ('${roleAnswer.roleName}', '${roleAnswer.salary}', '${roleAnswer.deptId}')`;
                        executeSql(sqlStatement);
                        console.log((green(`the role `) + yellow(`${roleAnswer.roleName}`) + green(` has been successfully added to the database!`)));
                    });
            }
            switch (answers.startOptions) {
                case "add an employee":
                    inquirer.prompt(addEmployeePrompt).then((employeeAnswer) => {
                        const sqlStatement = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employeeAnswer.employeeFirstName}', '${employeeAnswer.employeeLastName}', '${employeeAnswer.employeeRoleId}', '${employeeAnswer.employeeManagerId}')`;
                        executeSql(sqlStatement);
                        console.log((green(`the employee `) + yellow(`${employeeAnswer.employeeFirstName}` + " " + `${employeeAnswer.employeeLastName}`) + green(` has been successfully added to the database!`)));                        
                    });
            }
            switch (answers.startOptions) {
                case "view all departments":
                    executeSql('Select * from department;');
            }
            switch (answers.startOptions) {
                case "view all roles":
                    executeSql('Select * from role');
            }
            switch (answers.startOptions) {
                case "view all employees":
                    executeSql('select * from employee');
            }
        })
}

// initialize function
function init() {

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
            console.log(yellow(`🤓 Helpful hint - to quit this app anytime press ctrl + c 🤓`))
        }

        helpfulHint();
        promptUser();

    });

}

init();