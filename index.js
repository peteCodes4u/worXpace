// initialize inquirer
const inquirer = require("inquirer");

// require dotenv to manage env variables 
require("dotenv").config();

// import pg package for postgres SQL queries
const { Client } = require('pg');

// terminal colors for messages
const colors = require('colors');
const green = colors.green;
const red = colors.red;
const yellow = colors.yellow;
const rainbow = colors.rainbow;
const magenta = colors.magenta;

// prompts for user menu
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
            "Remove item from Database",
            "View expense by department",
            "View employees by department/manager",
            "QUIT"
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

// prompt for updating an employee
const updateEmployeePrompt = [
    // retrieve employee by employeeId
    {
        type: "input",
        name: "employeeId",
        message: magenta("Please enter the employee's Id")
    },

    // specify what data to modify
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

// propmt to get first name value for update
const updateEmployeeFirstNamePrompt = [{
    type: "input",
    name: "employeeFirstName",
    message: magenta("Please enter the employee's first name")
}]

// propmt to get last name value for update
const updateEmployeeLastNamePrompt = [{
    type: "input",
    name: "employeeLastName",
    message: magenta("Please enter the employee's last name")
}]

// propmt to update manager id
const updateEmployeeManagerPrompt = [{
    type: "input",
    name: "employeeManagerId",
    message: magenta("Please enter the employee's manager's id")
}]

// prompt to update employee role
const updateEmployeeRolePrompt = [{
    type: "input",
    name: "employeeRoleId",
    message: magenta("Please enter the employee's role id")
}]

// prompt to update role data
const updateRolePrompt = [
    // prompt user to specify role id for modification
    {
        type: "input",
        name: "roleId",
        message: magenta("please enter the id for the role you wish to update")

    },
    // provide user selections for data to modify
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

// prompt for updating role title
const updateRoleTitlePrompt = [{
    type: "input",
    name: "roleTitle",
    message: magenta("Please enter the desired title")
}]

// prompt for updating role salary
const updateRoleSalaryPrompt = [{
    type: "input",
    name: "roleSalary",
    message: magenta("Please enter the salary for this role")
}]

// prompt for updating role department
const updateRoleDepartmentPrompt = [{
    type: "input",
    name: "roleDepartmentId",
    message: magenta("Please enter the department Id")
}]

// prompt for eliminating records from the database
const removeFromDatabasePrompt = [
    {
        // data to eliminate
        type: "list",
        name: "removeList",
        message: magenta("Please select the data you wish to eliminate from the database"),
        choices: [
            "delete a department",
            "delete a role",
            "delete an employee"
        ]
    }
]

// generic prompt for department id where applicable
const updateDepartmentPrompt = [{
    type: "input",
    name: "departmentId",
    message: magenta("Please enter the department id")
}]

// prompt for deleting role by id
const deleteRolePrompt = [{
    type: "input",
    name: "roleId",
    message: magenta("please enter the role id")
}]

// prompt for deleting employee by id
const deleteEmployeePrompt = [{
    type: "input",
    name: "employeeId",
    message: magenta("please enter the employee id")
}]

// prompt for retrieving employee data by manager/department
const viewEmployeebyPrompt = [
    {
        type: "list",
        name: "viewBy",
        message: magenta("please select an option"),
        choices: [
            "view employees by manager id",
            "view employees by department id"
        ]
    }
]

// function to execute sql statemtns
const executeSql = async function (sqlStatement) {

    // establish client for connection to db via .env variables
    const client = new Client({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT
    });
    try {
        // connect client to database
        await client.connect();

        // execute sql statement
        const result = await client.query(sqlStatement);

        // error handling for situations that affect 0 rows  
        if (result.rowCount === 0) {
            console.log(red('💀 hmmmm... no records identified, please ensure you have provided a valid value that corresponds to an existing record 💀'));
        } else {
            // render query results in the terminal
            console.table(result.rows);
            console.log(green('request has executed successfully'))
        }

        // envoke prompt user after query execution
        promptUser();
    } catch (error) {
        console.error(red(`💀 Error - Query Failed to execute 💀`, error));
    } finally {
        await client.end();
    }
}

// prompt user function with switch cases for handling application workflow
function promptUser() {
    // main menu prompt
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
                    executeSql(`
                    SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, r.salary, d.name AS department_name, concat(m.first_name, ' ', m.last_name) as manager, r.id AS role_id, d.id AS department_id 
                    FROM employee e 
                    JOIN role r ON e.role_id = r.id 
                    JOIN department d ON r.department_id = d.id
                    LEFT JOIN employee m ON e.manager_id = m.id;`);
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
                                        console.log(green(`A request to update the employee's last name to ` + yellow(`${updateEmployeeLastNameAnswer.employeeLastName}`) + green(` has been initiated`)));
                                    });
                                    break;
                                case 'employee role id':
                                    inquirer.prompt(updateEmployeeRolePrompt).then((updateEmployeeRoleAnswer) => {
                                        sqlStatement = `UPDATE employee SET role_id = '${updateEmployeeRoleAnswer.employeeRoleId}' WHERE id = ${updateEmployeeAnswer.employeeId}`;
                                        executeSql(sqlStatement);
                                        console.log(green(`A request to update the employee's role to ` + yellow(`${updateEmployeeRoleAnswer.employeeRoleId}`) + green(` has been initiated`)));
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
                                            console.log(green(`A request to update the role's title to ` + yellow(`${updateRoleTitleAnswer.roleTitle}`) + green(` has been initiated`)));
                                        })
                                    break;
                                case 'role salary':
                                    inquirer.prompt(updateRoleSalaryPrompt)
                                        .then((updateRoleSalaryAnswer) => {
                                            sqlStatement = `UPDATE role SET salary = '${updateRoleSalaryAnswer.roleSalary}' WHERE id = '${updateRoleAnswer.roleId}';`
                                            executeSql(sqlStatement);
                                            console.log(green(`A request to update the role's salary to` + yellow(`${updateRoleSalaryAnswer.roleSalary}`) + green(` has been initiated`)));
                                        })
                                    break;
                                case 'role department id':
                                    inquirer.prompt(updateRoleDepartmentPrompt)
                                        .then((updateRoleDepartmentAnswer) => {
                                            sqlStatement = `UPDATE role SET department_id = ${updateRoleDepartmentAnswer.roleDepartmentId} WHERE id = '${updateRoleAnswer.roleId}';`
                                            executeSql(sqlStatement);
                                            console.log(green(`A request to update the role's department id to` + yellow(`${updateRoleDepartmentAnswer.roleDepartmentId}`) + green(` has been initiated`)));
                                        })
                                    break;
                            }
                        });
                    break;
                case "Remove item from Database":
                    inquirer.prompt(removeFromDatabasePrompt)
                        .then((removeFromDatabaseAnswer) => {
                            let sqlStatement;
                            switch (removeFromDatabaseAnswer.removeList) {
                                case "delete a department":
                                    inquirer.prompt(updateDepartmentPrompt)
                                        .then((updateDepartmentAnswer) => {
                                            sqlStatement = `DELETE from department where id = '${updateDepartmentAnswer.departmentId}';`
                                            executeSql(sqlStatement);
                                            console.log(green(`A DELETE request for department with id ` + red(`${updateDepartmentAnswer.departmentId}` + green(` has been initiated`))));
                                        })
                                    break;
                                case "delete a role":
                                    inquirer.prompt(deleteRolePrompt)
                                        .then((deleteRoleAnswer) => {
                                            sqlStatement = `DELETE from role where id = '${deleteRoleAnswer.roleId}';`
                                            executeSql(sqlStatement);
                                            console.log(green(`A DELETE request for department with id ` + red(`${deleteRoleAnswer.roleId}` + green(` has been initiated`))));
                                        })
                                    break;
                                case "delete an employee":
                                    inquirer.prompt(deleteEmployeePrompt)
                                        .then((deleteEmployeeAnswer) => {
                                            sqlStatement = `DELETE from employee where id = '${deleteEmployeeAnswer.employeeId}';`
                                            executeSql(sqlStatement);
                                            console.log(green(`A DELETE request for employee with id ` + red(`${deleteEmployeeAnswer.employeeId}` + green(` has been inititated`))))
                                        })
                                    break;
                            }
                        });
                    break;
                case "View expense by department":
                    inquirer.prompt(updateDepartmentPrompt)
                        .then((updateDepartmentAnswer) => {
                            sqlStatement = `SELECT d.name AS department_name, SUM(r.salary) AS total_salary FROM role r JOIN department d ON r.department_id = d.id WHERE r.department_id = ${updateDepartmentAnswer.departmentId} GROUP BY d.name;`
                            executeSql(sqlStatement);
                            console.log(green(`Retrieving combined salaries for employes in department id ` + yellow(updateDepartmentAnswer.departmentId)))
                        })
                    break;
                case "View employees by department/manager":
                    inquirer.prompt(viewEmployeebyPrompt)
                        .then((viewEmployeeByAnswer) => {
                            let sqlStatement;
                            switch (viewEmployeeByAnswer.viewBy) {
                                case 'view employees by manager id':
                                    inquirer.prompt(updateEmployeeManagerPrompt)
                                        .then((updateEmployeeAnswer) => {
                                            sqlStatement = `SELECT * FROM employee WHERE manager_id = ${updateEmployeeAnswer.employeeManagerId}`
                                            executeSql(sqlStatement);
                                            console.log(green(`Retrieving employees by manager Id ` + yellow(`updateEmployeeAnswer.employeeManagerId`)));
                                        })
                                    break;
                                case "view employees by department id":
                                    inquirer.prompt(updateDepartmentPrompt)
                                        .then((answer) => {
                                            sqlStatement = `SELECT e.first_name, e.last_name, r.title AS role_title, r.salary, d.name AS department_name, concat(m.first_name, ' ', m.last_name) as manager    
                                                FROM employee e 
                                                JOIN role r ON e.role_id = r.id 
                                                JOIN department d ON r.department_id = d.id                 
                                                LEFT JOIN employee m ON e.manager_id = m.id
                                                WHERE d.id = ${answer.departmentId} ;`
                                            executeSql(sqlStatement);
                                            console.log(green(`Retrieving employee by department id ` + yellow(answer.departmentId)));
                                        })
                                    break;
                            }
                        })

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