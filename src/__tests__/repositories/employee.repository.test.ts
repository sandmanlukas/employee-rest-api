import { InMemoryEmployeeRepository } from '../../repositories/employee.repository';
import { CreateEmployeeDto, DeleteEmployeeDto, Employee, PaginationDto } from '../../types/employee';
import { DuplicateEmailError, EmployeeEmailNotFoundError, EmployeeNotFoundError } from '../../types/errors';

describe('InMemoryEmployeeRepository', () => {
    let repository: InMemoryEmployeeRepository;

    beforeEach(() => {
        repository = new InMemoryEmployeeRepository();
    });

    afterEach(() => {
        repository.clear();
    });

    describe('create', () => {
        it('should create a new employee successfully', async () => {
            const employeeData: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };

            const employee = await repository.create(employeeData);

            expect(employee).toBeDefined();
            expect(employee.id).toBeDefined();
            expect(employee.firstName).toBe(employeeData.firstName);
            expect(employee.lastName).toBe(employeeData.lastName);
            expect(employee.email).toBe(employeeData.email);
            expect(employee.createdAt).toBeInstanceOf(Date);
            expect(employee.updatedAt).toBeInstanceOf(Date);
        });

        it('should throw DuplicateEmailError when creating employee with existing email', async () => {
            const employeeData: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };

            await repository.create(employeeData);

            await expect(repository.create(employeeData)).rejects.toThrow(DuplicateEmailError);
        });

        it('should allow multiple employees with same name but different emails', async () => {
            const employee1: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };

            const employee2: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe2@example.com',
            };

            const created1 = await repository.create(employee1);
            const created2 = await repository.create(employee2);

            expect(created1.id).not.toBe(created2.id);
            expect(created1.firstName).toBe(created2.firstName);
            expect(created1.lastName).toBe(created2.lastName);
            expect(created1.email).not.toBe(created2.email);
        });
    });

    describe('delete', () => {
        let employee: Employee;

        beforeEach(async () => {
            const employeeData: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'delete.john.doe@example.com',
            };
            employee = await repository.create(employeeData);
        });

        it('should delete an employee successfully', async () => {
            const deleteEmployeeData: DeleteEmployeeDto = {
                email: 'delete.john.doe@example.com',
            };

            const deletedEmployee = await repository.delete(deleteEmployeeData);

            expect(deletedEmployee).toBeDefined();
            expect(deletedEmployee.id).toBe(employee.id);
            expect(deletedEmployee.firstName).toBe(employee.firstName);
            expect(deletedEmployee.lastName).toBe(employee.lastName);
            expect(deletedEmployee.email).toBe(employee.email);
        });

        it('should delete an employee successfully with id', async () => {

            const deletedEmployee = await repository.delete({ id: employee.id });

            expect(deletedEmployee).toBeDefined();
            expect(deletedEmployee.id).toBe(employee.id);
            expect(deletedEmployee.firstName).toBe(employee.firstName);
            expect(deletedEmployee.lastName).toBe(employee.lastName);
            expect(deletedEmployee.email).toBe(employee.email);
        });

        it('should throw EmployeeNotFoundError when deleting an employee with invalid id', async () => {
            await expect(repository.delete({ id: 'invalid-id' })).rejects.toThrow(EmployeeNotFoundError);
        });
        it('should throw EmployeeEmailNotFoundError when deleting an employee with invalid email', async () => {
            await expect(repository.delete({ email: 'invalid-email' })).rejects.toThrow(EmployeeEmailNotFoundError);
        });
    });

    describe('getEmployees', () => {

        let pagination: PaginationDto = { page: 1, limit: 10 };
        it('should return empty array when no employees are present', async () => {
            const employees = await repository.getEmployees(pagination);
            expect(employees).toBeDefined();
            expect(employees.length).toBe(0);
        });

        it('should return all employees', async () => {
            const employee1Data: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'get.john.doe@example.com',
            };

            const employee2Data: CreateEmployeeDto = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'get.jane.doe@example.com',
            };
            await repository.create(employee1Data);
            await repository.create(employee2Data);



            const employees = await repository.getEmployees(pagination);
            expect(employees).toBeDefined();
            expect(employees.length).toBe(2);
            expect(employees[0].firstName).toBe(employee1Data.firstName);
            expect(employees[0].lastName).toBe(employee1Data.lastName);
            expect(employees[0].email).toBe(employee1Data.email);
            expect(employees[1].firstName).toBe(employee2Data.firstName);
            expect(employees[1].lastName).toBe(employee2Data.lastName);
            expect(employees[1].email).toBe(employee2Data.email);
        });

        it('should return the correct employees with pagination', async () => {
            pagination = { page: 2, limit: 1 };
            const employee1Data: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'get.john.doe@example.com',
            };

            const employee2Data: CreateEmployeeDto = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'get.jane.doe@example.com',
            };

            await repository.create(employee1Data);
            await repository.create(employee2Data);

            const employees = await repository.getEmployees(pagination);
            expect(employees).toBeDefined();
            expect(employees.length).toBe(1);
            expect(employees[0].firstName).toBe(employee2Data.firstName);
            expect(employees[0].lastName).toBe(employee2Data.lastName);
            expect(employees[0].email).toBe(employee2Data.email);
        });

        it('should return the correct number of employees', async () => {
            pagination = { page: 1, limit: 2 };
            const employee1Data: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'get.john.doe@example.com',
            };

            const employee2Data: CreateEmployeeDto = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'get.jane.doe@example.com',
            };

            const employee3Data: CreateEmployeeDto = {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'get.sam.smith@example.com',
            };

            await repository.create(employee1Data);
            await repository.create(employee2Data);
            await repository.create(employee3Data);

            const employees = await repository.getEmployees(pagination);
            expect(employees).toBeDefined();
            expect(employees.length).toBe(2);
            expect(employees[0].firstName).toBe(employee1Data.firstName);
            expect(employees[0].lastName).toBe(employee1Data.lastName);
            expect(employees[0].email).toBe(employee1Data.email);
            expect(employees[1].firstName).toBe(employee2Data.firstName);
            expect(employees[1].lastName).toBe(employee2Data.lastName);
            expect(employees[1].email).toBe(employee2Data.email);
        });

        it('should return the correct employees after deletion', async () => {
            const employee1Data: CreateEmployeeDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'get.john.doe@example.com',
            };

            const employee2Data: CreateEmployeeDto = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'get.jane.doe@example.com',
            };
            await repository.create(employee1Data);
            await repository.create(employee2Data);

            await repository.delete({ email: employee1Data.email });

            const employees = await repository.getEmployees(pagination);
            expect(employees).toBeDefined();
            expect(employees.length).toBe(1);
            expect(employees[0].firstName).toBe(employee2Data.firstName);
            expect(employees[0].lastName).toBe(employee2Data.lastName);
            expect(employees[0].email).toBe(employee2Data.email);
        });
    });
});
