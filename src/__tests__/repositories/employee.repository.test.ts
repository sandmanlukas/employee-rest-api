import { InMemoryEmployeeRepository } from '../../repositories/employee.repository';
import { CreateEmployeeDto } from '../../types/employee';
import { DuplicateEmailError } from '../../types/errors';

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
});
