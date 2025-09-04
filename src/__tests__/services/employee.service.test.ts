import { EmployeeService } from '../../services/employee.service';
import { InMemoryEmployeeRepository } from '../../repositories/employee.repository';
import { CreateEmployeeDto, DeleteEmployeeDto, Employee } from '../../types/employee';
import { ValidationError } from '../../types/errors';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: InMemoryEmployeeRepository;

  beforeEach(() => {
    repository = new InMemoryEmployeeRepository();
    service = new EmployeeService(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  describe('createEmployee', () => {
    it('should create employee successfully with valid data', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const employee = await service.createEmployee(employeeData);

      expect(employee).toBeDefined();
      expect(employee.firstName).toBe('John');
      expect(employee.lastName).toBe('Doe');
      expect(employee.email).toBe('john.doe@example.com');
    });

    it('should trim whitespace from input data', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  john.doe@example.com  ',
      };

      const employee = await service.createEmployee(employeeData);

      expect(employee.firstName).toBe('John');
      expect(employee.lastName).toBe('Doe');
      expect(employee.email).toBe('john.doe@example.com');
    });

    it('should convert email to lowercase', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'JOHN.DOE@EXAMPLE.COM',
      };

      const employee = await service.createEmployee(employeeData);

      expect(employee.email).toBe('john.doe@example.com');
    });

    it('should throw ValidationError for missing firstName', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: '',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      await expect(service.createEmployee(employeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for missing lastName', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: '',
        email: 'john.doe@example.com',
      };

      await expect(service.createEmployee(employeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for missing email', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: '',
      };

      await expect(service.createEmployee(employeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for whitespace-only firstName', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: '   ',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      await expect(service.createEmployee(employeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid email format', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      await expect(service.createEmployee(employeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for email without domain', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@',
      };

      await expect(service.createEmployee(employeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for email without @ symbol', async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe.example.com',
      };

      await expect(service.createEmployee(employeeData)).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteEmployee', () => {
    let employee: Employee;

    beforeEach(async () => {
      const employeeData: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      employee = await service.createEmployee(employeeData);
    });

    it('should delete employee successfully with valid data', async () => {
      const deletedEmployee = await service.deleteEmployee({ email: employee.email });

      expect(deletedEmployee).toBeDefined();
      expect(deletedEmployee.id).toBe(employee.id);
      expect(deletedEmployee.firstName).toBe(employee.firstName);
      expect(deletedEmployee.lastName).toBe(employee.lastName);
      expect(deletedEmployee.email).toBe(employee.email);
    });

    it('should trim whitespace from input data', async () => {
      const deleteEmployeeData: DeleteEmployeeDto = {
        email: ` ${employee.email} `,
        id: ` ${employee.id} `
      };

      const deletedEmployee = await service.deleteEmployee(deleteEmployeeData);

      expect(deletedEmployee).toBeDefined();
      expect(deletedEmployee.id).toBe(employee.id);
      expect(deletedEmployee.email).toBe(employee.email);
    });

    it('should convert email to lowercase', async () => {
      const deleteEmployeeData: DeleteEmployeeDto = {
        email: 'JOHN.DOE@EXAMPLE.COM',
      };

      const deletedEmployee = await service.deleteEmployee(deleteEmployeeData);

      expect(deletedEmployee).toBeDefined();
      expect(deletedEmployee.email).toBe('john.doe@example.com');

    });

    it('should throw ValidationError if missing email and id', async () => {
      const deleteEmployeeData: DeleteEmployeeDto = {};

      await expect(service.deleteEmployee(deleteEmployeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid email format', async () => {
      const deleteEmployeeData: DeleteEmployeeDto = {
        email: 'invalid-email',
      };

      await expect(service.deleteEmployee(deleteEmployeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for email without domain', async () => {
      const deleteEmployeeData: DeleteEmployeeDto = {
        id: employee.id,
        email: 'john@',
      };

      await expect(service.deleteEmployee(deleteEmployeeData)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for email without @ symbol', async () => {
      const deleteEmployeeData: DeleteEmployeeDto = {
        id: employee.id,
        email: 'john.doe.example.com',
      };

      await expect(service.deleteEmployee(deleteEmployeeData)).rejects.toThrow(ValidationError);
    });
  });

  describe('getEmployees', () => {
    it('should throw ValidationError if pagination limit is less than 1', async () => {
      await expect(service.getEmployees({ page: 1, limit: -1 })).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if pagination limit is greater than 100', async () => {
      await expect(service.getEmployees({ page: 1, limit: 101 })).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if pagination page is less than 1', async () => {
      await expect(service.getEmployees({ page: 0, limit: 10 })).rejects.toThrow(ValidationError);
    });

    it('returns the correct employees with pagination', async () => {

      const employee1Data: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const employee2Data: CreateEmployeeDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
      };

      await service.createEmployee(employee1Data);
      await service.createEmployee(employee2Data);

      const employeesResponse = await service.getEmployees({ page: 1, limit: 10 });
      expect(employeesResponse).toBeDefined();
      const employees = employeesResponse.data;
      expect(employees.length).toBe(2);
      expect(employees[0].firstName).toBe(employee1Data.firstName);
      expect(employees[0].lastName).toBe(employee1Data.lastName);
      expect(employees[0].email).toBe(employee1Data.email);
      expect(employees[1].firstName).toBe(employee2Data.firstName);
      expect(employees[1].lastName).toBe(employee2Data.lastName);
      expect(employees[1].email).toBe(employee2Data.email);
      expect(employeesResponse.pagination.page).toBe(1);
      expect(employeesResponse.pagination.limit).toBe(10);
      expect(employeesResponse.pagination.total).toBe(2);
      expect(employeesResponse.pagination.totalPages).toBe(1);
      expect(employeesResponse.pagination.hasNext).toBe(false);
      expect(employeesResponse.pagination.hasPrev).toBe(false);
    });
  });
});