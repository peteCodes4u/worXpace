INSERT INTO department(name)
VALUES ('Executive Department'),
       ('Finance Department'),
       ('Legal Department'),
       ('Engineering Department'),
       ('Quality Assurance'),
       ('Human Resources');

INSERT INTO role(title, salary, department_id)
VALUES ('CEO', 300000, 1),
       ('CFO', 250000, 2),
       ('Associate paralegal', 75000, 3),
       ('VP Engineering', 150000, 4),
       ('Engineering Manager', 100000, 4),
       ('Architect', 95000, 4),
       ('Senior Developer', 90000, 4),
       ('Junior Developer', 85000, 4),
       ('QA Manager', 80000, 5),
       ('T3 Escalation Engineer', 75000, 5),
       ('Automation Engineer', 70000, 5),
       ('QA Tester', 55000, 5),
       ('HR Manager', 50000, 6),
       ('HR Associate', 45000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Glenn', 'Seaborg', 1, null),
       ('Pyotr', 'Tchaikovsky', 2, 1),
       ('Harvey', 'Birdman', 3, 2),
       ('Joeseph', 'Shmosef', 14, 5),
       ('Jaques', 'Trapp', 13, 1),
       ('Som', 'Guy', 12,  9),
       ('Alan', 'Turing', 4, 1),
       ('Rosaline', 'Franklin', 5, 7),
       ('Morgan', 'Watson', 6, 7),
       ('Peter', 'Smith', 8, 8),
       ('Thomas', 'Erak', 7, 8),
       ('Elizabeth', 'Cotten', 9, 7),
       ('Max', 'Fleisher', 10, 7),
       ('Chris', 'Milic', 11, 12);
