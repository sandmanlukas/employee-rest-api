import { Employee, CreateEmployeeDto } from '../types/employee';
import { IEmployeeRepository } from '../repositories/employee.repository';
import { ValidationError } from '../types/errors';

export class EmployeeService {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async createEmployee(employeeData: CreateEmployeeDto): Promise<Employee> {
    this.validateCreateEmployeeData(employeeData);
    return this.employeeRepository.create(employeeData);
  }

  async employeeExistsByEmail(email: string): Promise<boolean> {
    return this.employeeRepository.existsByEmail(email);
  }

  private validateCreateEmployeeData(data: CreateEmployeeDto): void {
    if (!data.firstName || data.firstName.trim().length === 0) {
      throw new ValidationError('First name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      throw new ValidationError('Last name is required');
    }

    if (!data.email || data.email.trim().length === 0) {
      throw new ValidationError('Email is required');
    }

    data.firstName = data.firstName.trim();
    data.lastName = data.lastName.trim();
    data.email = data.email.trim().toLowerCase();

    if (!this.isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex: RegExp =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

    if (
      email.includes('..') ||
      email.includes('@@') ||
      email.endsWith('.') ||
      email.startsWith('@')
    ) {
      return false;
    }

    const atIndex = email.indexOf('@');
    if (atIndex === -1 || !email.substring(atIndex + 1).includes('.')) {
      return false;
    }

    return emailRegex.test(email);
  }
}
