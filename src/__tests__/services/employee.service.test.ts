import { EmployeeService } from '../../services/employee.service';
import { InMemoryEmployeeRepository } from '../../repositories/employee.repository';
import { CreateEmployeeDto } from '../../types/employee';
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
});
