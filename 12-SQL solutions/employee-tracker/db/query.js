const db = require('./connection.js');

class Query {
	constructor(db) {
		this.db = db;
	}

	createDepartment(department) {
		this.db
			.promise()
			.query('INSERT INTO department(name) VALUES (?)', department)
			.catch((err) => console.log(err));
	}

	createRole(role, salary, department) {
		this.db
			.promise()
			.query(
				'INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)',
				[role, salary, department]
			)
			.catch((err) => console.log(err));
	}

	createEmployee(firstName, lastName, roleId, ManagerId) {
		this.db
			.promise()
			.query(
				'INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
				[firstName, lastName, roleId, ManagerId]
			)
			.catch((err) => console.log(err));
	}

	readDepartments() {
		return this.db
			.promise()
			.query('SELECT id, name FROM department ORDER BY id');
	}

	readRoles() {
		return this.db
			.promise()
			.query(
				'SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id=department.id ORDER BY role.id'
			);
	}

	readEmployees() {
		return this.db
			.promise()
			.query(
				"SELECT a.id, a.first_name, a.last_name, role.title, department.name, CONCAT(b.first_name, ' ', b.last_name) AS manager FROM employee a JOIN role ON a.role_id=role.id JOIN department ON department.id=role.department_id LEFT JOIN employee b ON a.manager_id = b.id"
			);
	}

	readEmployeesByManager() {
		return this.db
			.promise()
			.query(
				"SELECT CONCAT(a.first_name, ' ', a.last_name) AS employee, CONCAT(b.first_name, ' ', b.last_name) AS manager FROM employee a JOIN employee b  ON a.manager_id=b.id ORDER BY b.id"
			);
	}

	readEmployeesByDepartment() {
		return this.db
			.promise()
			.query(
				"SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee, department.name AS department FROM employee JOIN role ON employee.role_id=role.id  JOIN department ON role.department_id=department.id ORDER BY department.id"
			);
	}

	readTotalUtilizedBudget(department) {
		return this.db
			.promise()
			.query(
				'SELECT SUM(role.salary) AS `total utilized budget`, department.name AS department FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id WHERE department.id=? GROUP BY department.id',
				[department]
			)
			.catch((err) => console.log(err));
	}

	updateEmployeeRole(roleId, id) {
		this.db
			.promise()
			.query('UPDATE employee SET role_id=? WHERE id=?', [roleId, id])
			.catch((err) => console.log(err));
	}

	updateEmployeeManager(id, managerId) {
		this.db
			.promise()
			.query('UPDATE employee SET manager_id=? WHERE id=?', [
				managerId,
				id,
			])
			.catch((err) => console.log(err));
	}

	deleteDepartment(department) {
		this.db
			.promise()
			.query('DELETE FROM department WHERE id = ?', [department])
			.catch((err) => console.log(err));
	}

	deleteRole(role) {
		this.db
			.promise()
			.query('DELETE FROM role WHERE id = ?', [role])
			.catch((err) => console.log(err));
	}

	deleteEmployee(employee) {
		this.db
			.promise()
			.query('DELETE FROM employee WHERE id = ?', [employee])
			.catch((err) => console.log(err));
	}
}

module.exports = new Query(db);
