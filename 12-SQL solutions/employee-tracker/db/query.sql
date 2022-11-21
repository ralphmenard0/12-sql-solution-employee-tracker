-- READ all departments

SELECT id, name FROM department
ORDER BY id

-- READ all roles

SELECT role.id, role.title, department.name, role.salary
FROM role
INNER JOIN department 
ON role.department_id=department.id
ORDER BY role.id

-- READ all employees
SELECT 
		a.id, 
		a.first_name, 
		a.last_name, 
		role.title, 
		department.name,
		CONCAT(b.first_name, ' ', b.last_name) AS manager
FROM 	employee a
JOIN 	role
ON 		a.role_id=role.id
JOIN	department
ON 		department.id=role.department_id
LEFT JOIN    employee b
ON      a.manager_id = b.id

-- CREATE department
-- prompt to enter name of department, department added to db
INSERT INTO department(name)
VALUES
	('text')

-- CREATE role
-- prompt enter name, salary and department for role, role added to db
INSERT INTO role(title, salary, department_id)
VALUES
	('text', 1, 1)

-- CREATE employee
-- prompt enter first name, last name, role, manager, employee added to db
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
	('first', 'last', 1, NULL)

-- UPDATE employee role
-- prompt select employeee to update and their new role, info updated in db
UPDATE employee SET role_id=1 WHERE id=1

-- UPDATE employee manager
UPDATE employee SET manager_id=1 WHERE id=5

-- READ employees by manager
SELECT CONCAT(a.first_name, ' ', a.last_name) AS employee, CONCAT(b.first_name, ' ', b.last_name) AS manager
FROM employee a
JOIN employee b 
ON a.manager_id=b.id
ORDER BY b.id

-- READ employees by department
SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee, department.name AS department
FROM employee
JOIN role
ON employee.role_id=role.id 
JOIN department
ON role.department_id=department.id 
ORDER BY department.id

-- DELETE department 
DELETE FROM department WHERE id = ?

-- DELETE role 
DELETE FROM role WHERE id = ?

-- DELETE employee 
DELETE FROM employee WHERE id = ?

-- view total utilized budget by department
SELECT SUM(role.salary) AS `total utilized budget`, department.name AS department
FROM employee
JOIN role
ON employee.role_id=role.id 
JOIN department
ON role.department_id=department.id 
WHERE department.id=?
GROUP BY department.id
