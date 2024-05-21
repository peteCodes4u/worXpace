INSERT INTO department(name)
VALUES ('Finance Department'),
       ('Legal Department'),
       ('Engineering Department'),
       ('Quality Assurance'),
       ('Human Resources');

INSERT INTO role(title, salary, department_id)
VALUES ('CFO', 250000, 1),
       ('Associate paralegal', 65000, 2),
       ('VP Engineering', 150000, 3),
       ('Engineering Manager', 100000, 3),
       ('Architect', 95000, 3),
       ('Senior Developer', 90000, 3),
       ('Junior Developer', 85000, 3),
       ('QA Manager', 80000, 4),
       ('T3 Escalation Engineer', 75000, 4),
       ('Automation Engineer', 70000, 4),
       ('QA Tester', 55000, 4),
       ('HR Manager', 50000, 5),
       ('HR Associate', 45000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Peter', 'Smith', 7, 001),
       ('Joeseph', 'Shmosef', 13, 002),
       ('Jaques', 'Trapp', 12, 003),
       ('Som', 'Guy', 11,  001),
       ('Alan', 'Turing', 4, 001),
       ('Rosaline', 'Franklin', 5, 001),
       ('Morgan', 'Watson', 3, 001);
