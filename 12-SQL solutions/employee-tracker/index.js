const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/query.js');
const figlet = require('figlet');

// menu for selecting application actions
menu = () => {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'choice',
				message: 'What would you like to do?',
				choices: [
					'View All Employees',
					'Add Employee',
					'Delete Employee',
					'Update Employee Role',
					'Update Employee Manager',
					'View Employees by Manager',
					'View Employess by Department',
					'View All Roles',
					'Add Role',
					'Delete Role',
					'View All Departments',
					'Add Department',
					'Delete Department',
					'View Utilized Budget of Department',
					'Exit Application',
					new inquirer.Separator(),
				],
			},
		])
		.then((response) => handleMenu(response))
		.catch((error) => console.log(error));
};

// handles response from menu and delivers questions based on response
handleMenu = (response) => {
	switch (response.choice) {
		// * READ employees
		case 'View All Employees':
			db.readEmployees()
				.then(([rows]) => {
					console.table(rows);
				})
				.then(() => {
					menu();
				});

			break;

		// * CREATE employee
		case 'Add Employee':
			db.readRoles()
				.then(([rows]) => {
					const roleChoices = rows.map(({ id, title }) => ({
						name: title,
						value: id,
					}));

					return roleChoices;
				})
				.then((roleChoices) => {
					db.readEmployees()
						.then(([rows]) => {
							const employeeChoices = rows.map(
								({ id, first_name, last_name }) => ({
									name: first_name + ' ' + last_name,
									value: id,
								})
							);
							return { roleChoices, employeeChoices };
						})
						.then(({ roleChoices, employeeChoices }) => {
							inquirer
								.prompt([
									{
										type: 'input',
										name: 'firstName',
										message:
											"What is the employee's first name?",
									},
									{
										type: 'input',
										name: 'lastName',
										message:
											"What is the employee's last name?",
									},
									{
										type: 'list',
										name: 'role',
										message: "What is the employee's role?",
										choices: roleChoices,
									},
									{
										type: 'list',
										name: 'manager',
										message:
											"Who is the employee's manager?",
										choices: employeeChoices,
									},
								])
								.then((response) => {
									db.createEmployee(
										response.firstName,
										response.lastName,
										response.role,
										response.manager
									);
									console.log(
										`successfully added ${response.firstName} ${response.lastName}`
									);
								})
								.then(() => menu());
						});
				});

			break;

		// * DELETE employee
		case 'Delete Employee':
			db.readEmployees()
				.then(([rows]) => {
					const employeeChoices = rows.map(
						({ id, first_name, last_name }) => ({
							name: first_name + ' ' + last_name,
							value: id,
						})
					);

					return employeeChoices;
				})
				.then((employeeChoices) => {
					inquirer
						.prompt([
							{
								type: 'list',
								name: 'employee',
								message:
									'Which employee would you like to delete?',
								choices: employeeChoices,
							},
						])
						.then((response) => {
							db.deleteRole(response.employee);
							console.log(`successfully deleted role`);
						})
						.then(() => menu());
				});
			break;

		// * UPDATE employee role
		case 'Update Employee Role':
			db.readRoles()
				.then(([rows]) => {
					const roleChoices = rows.map(({ id, title }) => ({
						name: title,
						value: id,
					}));

					return roleChoices;
				})
				.then((roleChoices) => {
					db.readEmployees()
						.then(([rows]) => {
							const employeeChoices = rows.map(
								({ id, first_name, last_name }) => ({
									name: first_name + ' ' + last_name,
									value: id,
								})
							);
							return { roleChoices, employeeChoices };
						})
						.then(({ roleChoices, employeeChoices }) => {
							inquirer
								.prompt([
									{
										type: 'list',
										name: 'employee',
										message: 'Select an employee to update',
										choices: employeeChoices,
									},
									{
										type: 'list',
										name: 'role',
										message: 'Select a role',
										choices: roleChoices,
									},
								])
								.then((response) => {
									db.updateEmployeeRole(
										response.role,
										response.employee
									);
									console.log(`successfully updated role!`);
								})
								.then(() => menu());
						});
				});
			break;

		// * UPDATE employee manager
		case 'Update Employee Manager':
			db.readEmployees()
				.then(([rows]) => {
					const employeeChoices = rows.map(
						({ id, first_name, last_name }) => ({
							name: first_name + ' ' + last_name,
							value: id,
						})
					);
					return employeeChoices;
				})
				.then((employeeChoices) => {
					inquirer
						.prompt([
							{
								type: 'list',
								name: 'employee',
								message: 'Select an employee to update',
								choices: employeeChoices,
							},
							{
								type: 'list',
								name: 'manager',
								message: 'Select a manager',
								choices: employeeChoices,
							},
						])
						.then((response) => {
							db.updateEmployeeManager(
								response.employee,
								response.manager
							);
							console.log(`successfully updated manager!`);
						})
						.then(() => menu());
				});
			break;

		// * READ employess by manager
		case 'View Employees by Manager':
			db.readEmployeesByManager()
				.then(([rows]) => {
					console.table(rows);
				})
				.then(() => {
					menu();
				});
			break;

		// * READ employess by department
		case 'View Employess by Department':
			db.readEmployeesByDepartment()
				.then(([rows]) => {
					console.table(rows);
				})
				.then(() => {
					menu();
				});
			break;

		// * READ roles
		case 'View All Roles':
			db.readRoles()
				.then(([rows]) => {
					console.table(rows);
				})
				.then(() => {
					menu();
				});

			break;

		// * CREATE role
		case 'Add Role':
			db.readDepartments()
				.then(([rows]) => {
					const departmentChoices = rows.map(({ id, name }) => ({
						name: name,
						value: id,
					}));

					return departmentChoices;
				})
				.then((departmentChoices) => {
					inquirer
						.prompt([
							{
								type: 'input',
								name: 'role',
								message: 'What is the name of the role?',
								validate: (role) => {
									return role === ''
										? 'Please enter a valid name'
										: true;
								},
							},
							{
								type: 'number',
								name: 'salary',
								message: 'What is the salary of this role?',
							},
							{
								type: 'list',
								name: 'department',
								message:
									'What department does the role belong to?',
								choices: departmentChoices,
							},
						])
						.then((response) => {
							db.createRole(
								response.role,
								response.salary,
								response.department
							);
							console.log(`successfully added ${response.role}`);
						})
						.then(() => menu());
				});

			break;

		// * DELETE role
		case 'Delete Role':
			db.readRoles()
				.then(([rows]) => {
					const roleChoices = rows.map(({ id, title }) => ({
						name: title,
						value: id,
					}));

					return roleChoices;
				})
				.then((roleChoices) => {
					inquirer
						.prompt([
							{
								type: 'list',
								name: 'role',
								message: 'Which role would you like to delete?',
								choices: roleChoices,
							},
						])
						.then((response) => {
							db.deleteRole(response.role);
							console.log(`successfully deleted role`);
						})
						.then(() => menu());
				});
			break;

		// * READ departments
		case 'View All Departments':
			db.readDepartments()
				.then(([rows]) => {
					console.table(rows);
				})
				.then(() => {
					menu();
				});

			break;

		// * CREATE department
		case 'Add Department':
			inquirer
				.prompt({
					type: 'input',
					name: 'name',
					message: 'What is the name of the department?',
					validate: (name) => {
						return name === '' ? 'Please enter a name' : true;
					},
				})
				.then((response) => {
					db.createDepartment(response.name);
					console.log(`${response.name} successfully added!`);
				})
				.then(() => menu());

			break;

		// * DELETE department
		case 'Delete Department':
			db.readDepartments()
				.then(([rows]) => {
					const departmentChoices = rows.map(({ id, name }) => ({
						name: name,
						value: id,
					}));

					return departmentChoices;
				})
				.then((departmentChoices) => {
					inquirer
						.prompt([
							{
								type: 'list',
								name: 'department',
								message:
									'Which department would you like to delete?',
								choices: departmentChoices,
							},
						])
						.then((response) => {
							db.deleteDepartment(response.department);
							console.log(`successfully deleted department`);
						})
						.then(() => menu());
				});
			break;

		// * READ utilized budget
		case 'View Utilized Budget of Department':
			db.readDepartments()
				.then(([rows]) => {
					const departmentChoices = rows.map(({ id, name }) => ({
						name: name,
						value: id,
					}));

					return departmentChoices;
				})
				.then((departmentChoices) => {
					inquirer
						.prompt([
							{
								type: 'list',
								name: 'department',
								message:
									'Which department would you like to see?',
								choices: departmentChoices,
							},
						])
						.then((response) => {
							db.readTotalUtilizedBudget(response.department)
								.then(([rows]) => {
									console.table(rows);
								})
								.then(() => {
									menu();
								});
						});
				});
			break;

		// * exit app
		case 'Exit Application':
			console.log('Thank you for using Employee Tracker!');
			process.exit(0);

		default:
			console.log('error!');
			break;
	}
};

figlet('Employee Tracker', function (err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(data);
	menu();
});
