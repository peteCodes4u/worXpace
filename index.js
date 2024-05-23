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
            "update an employee",
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

const updateEmployeePrompt = [
    {
        type: "input",
        name: "employeeId",
        message: magenta("Please enter the employee's Id")
    },

    {
        type: "list",
        name: "employeeMod",
        message: magenta("Please select the data to be modified"),
        choices: [
            "employee first name",
            "employee last name",
            "employee role id",
            "employee manager id",
        ],
    },
]

const updateEmployeeFirstNamePrompt = [{
    type: "input",
    name: "employeeFirstName",
    message: magenta("Please enter the employee's first name")
}]

const updateEmployeeLastNamePrompt = [{
    type: "input",
    name: "employeeLastName",
    message: magenta("Please enter the employee's last name")
}]

const updateEmployeeManagerPrompt = [{
    type: "input",
    name: "employeeManagerId",
    message: magenta("Please enter the employee's manager's id")
}]

const updateEmployeeRolePrompt = [{
    type: "input",
    name: "employeeRoleId",
    message: magenta("Please enter the employee's role id")
}]

const updateRolePrompt = [
    {
        type: "input",
        name: "roleId",
        message: magenta("please enter the id for the role you wish to update")

    },
    {
        type: "list",
        name: "roleMod",
        message: magenta("Please select the data to be modified"),
        choices: [
            "role title",
            "role salary",
            "role department id",
        ],
    }
]

const updateRoleTitlePrompt = [{
    type: "input",
    name: "roleTitle",
    message: magenta("Please enter the desired title")
}]

const updateRoleSalaryPrompt = [{
    type: "input",
    name: "roleSalary",
    message: magenta("Please enter the salary for this role")
}]

const updateRoleDepartmentPrompt = [{
    type: "input",
    name: "roleDepartmentId",
    message: magenta("Please enter the department Id for this role")
}]

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
        if(result.rowCount === 0){
            console.log(red('💀 No Data has been modified, please ensure you have provided a valid value that corresponds to an existing record 💀'));
        } else {
            console.table(result.rows);
        }
        promptUser();
    } catch (error) {
        console.error(red(`💀 Error - Query Failed to execute 💀`, error));
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
                    break;
                case "add a role":
                    inquirer.prompt(addRolePrompt).then((roleAnswer) => {
                        const sqlStatement = `INSERT INTO role (title, salary, department_id) VALUES ('${roleAnswer.roleName}', '${roleAnswer.salary}', '${roleAnswer.deptId}')`;
                        executeSql(sqlStatement);
                        console.log((green(`the role `) + yellow(`${roleAnswer.roleName}`) + green(` has been successfully added to the database!`)));
                    });
                    break;
                case "add an employee":
                    inquirer.prompt(addEmployeePrompt).then((employeeAnswer) => {
                        const sqlStatement = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employeeAnswer.employeeFirstName}', '${employeeAnswer.employeeLastName}', '${employeeAnswer.employeeRoleId}', '${employeeAnswer.employeeManagerId}')`;
                        executeSql(sqlStatement);
                        console.log((green(`the employee `) + yellow(`${employeeAnswer.employeeFirstName}` + " " + `${employeeAnswer.employeeLastName}`) + green(` has been successfully added to the database!`)));
                    });
                    break;
                case "view all departments":
                    executeSql('SELECT * FROM department;');
                    break;
                case "view all roles":
                    executeSql('SELECT * FROM role;');
                    break;
                case "view all employees":
                    executeSql('SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name, r.salary, r.id AS role_id, d.id AS department_id FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;');
                    break;
                case "update an employee":
                    inquirer.prompt(updateEmployeePrompt)
                        .then((updateEmployeeAnswer) => {
                            let sqlStatement;
                            switch (updateEmployeeAnswer.employeeMod) {
                                case 'employee first name':
                                    inquirer.prompt(updateEmployeeFirstNamePrompt).then((updateEmployeeFirstNameAnswer) => {
                                        sqlStatement = `UPDATE employee SET first_name = '${updateEmployeeFirstNameAnswer.employeeFirstName}' WHERE id = ${updateEmployeeAnswer.employeeId}`;
                                        executeSql(sqlStatement);
                                        console.log(green(`A request to update the employee's first name to ` + yellow(`${updateEmployeeFirstNameAnswer.employeeFirstName}`) + green(` has been initiated`)));
                                    });
                                    break;
                                case 'employee last name':
                                    inquirer.prompt(updateEmployeeLastNamePrompt).then((updateEmployeeLastNameAnswer) => {
                                        sqlStatement = `UPDATE employee SET last_name = '${updateEmployeeLastNameAnswer.employeeLastName}' WHERE id = ${updateEmployeeAnswer.employeeId}`;
                                        executeSql(sqlStatement);
                                        console.log(green(`A request to update the employee's last name to ` + yellow(`${updateEmployeeLastNameAnswer.employeeLastName}`) + green(` has been initiated`) ));
                                    });
                                    break;
                                case 'employee role id':
                                    inquirer.prompt(updateEmployeeRolePrompt).then((updateEmployeeRoleAnswer) => {
                                        sqlStatement = `UPDATE employee SET role_id = '${updateEmployeeRoleAnswer.employeeRoleId}' WHERE id = ${updateEmployeeAnswer.employeeId}`;
                                        executeSql(sqlStatement);
                                        console.log(green(`A request to update the employee's role to ` + yellow(`${updateEmployeeRoleAnswer.employeeRoleId}`) + green(` has been initiated`) ));
                                    });
                                    break;
                                case 'employee manager id':
                                    inquirer.prompt(updateEmployeeManagerPrompt).then((updateEmployeeManagerAnswer) => {
                                        sqlStatement = `UPDATE employee SET manager_id = '${updateEmployeeManagerAnswer.employeeManagerId}' WHERE id = ${updateEmployeeAnswer.employeeId}`;
                                        executeSql(sqlStatement);
                                        console.log(green(`A request to update the employee's manager id to ` + yellow(`${updateEmployeeManagerAnswer.employeeManagerId}`) + green(` has been initiated`)));
                                    });
                                    break;
                            }
                        });
                    break;
                case "update a role":
                    inquirer.prompt(updateRolePrompt)
                    .then((updateRoleAnswer) => {
                        let sqlStatement;
                        switch (updateRoleAnswer.roleMod) {
                            case 'role title':
                                inquirer.prompt(updateRoleTitlePrompt)
                                .then((updateRoleTitleAnswer) => {
                                    sqlStatement = `UPDATE role SET title = '${updateRoleTitleAnswer.roleTitle}' WHERE id = '${updateRoleAnswer.roleId}';`
                                    executeSql(sqlStatement);
                                    console.log(green(`A request to update the role's title to ` + yellow(`${updateRoleTitleAnswer.roleTitle}`) + green(` has been initiated`) ));
                                })
                                break;
                            case 'role salary':
                                inquirer.prompt(updateRoleSalaryPrompt)
                                .then((updateRoleSalaryAnswer) => {
                                    sqlStatement = `UPDATE role SET salary = '${updateRoleSalaryAnswer.roleSalary}' WHERE id = '${updateRoleAnswer.roleId}';`
                                    executeSql(sqlStatement);
                                    console.log(green(`A request to update the role's salary to` + yellow(`${updateRoleSalaryAnswer.roleSalary}`)  + green(` has been initiated`)));
                                })
                                break;
                            case 'role department id':
                                inquirer.prompt(updateRoleDepartmentPrompt)
                                .then((updateRoleDepartmentAnswer) =>{
                                    sqlStatement = `UPDATE role SET department_id = ${updateRoleDepartmentAnswer.roleDepartmentId} WHERE id = '${updateRoleAnswer.roleId}';`
                                    executeSql(sqlStatement);
                                    console.log(green(`A request to update the role's department id to` + yellow(`${updateRoleDepartmentAnswer.roleDepartmentId}`) + green(` has been initiated`)));
                                })
                                break;
                        }
                    });
                    break;
            }
        });
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