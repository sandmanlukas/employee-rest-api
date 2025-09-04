import { v4 as uuidv4 } from 'uuid';
import {
  Employee,
  CreateEmployeeDto,
  DeleteEmployeeDto,
  PaginationDto,
} from '../types/employee';
import {
  DuplicateEmailError,
  EmployeeEmailNotFoundError,
  EmployeeNotFoundError,
  ValidationError,
} from '../types/errors';

export interface IEmployeeRepository {
  create(employeeData: CreateEmployeeDto): Promise<Employee>;
  delete(employeeData: DeleteEmployeeDto): Promise<Employee>;
  getEmployees(pagination: PaginationDto): Promise<Employee[]>;
  getTotalCount(): number;
  existsByEmail(email: string): Promise<boolean>;
}

export class InMemoryEmployeeRepository implements IEmployeeRepository {
  private employees: Map<string, Employee> = new Map();
  private emailIndex: Map<string, string> = new Map();

  async create(employeeData: CreateEmployeeDto): Promise<Employee> {
    if (await this.existsByEmail(employeeData.email)) {
      throw new DuplicateEmailError(employeeData.email);
    }

    const id = uuidv4();
    const now = new Date();

    const employee: Employee = {
      id,
      ...employeeData,
      createdAt: now,
      updatedAt: now,
    };

    this.employees.set(id, employee);
    this.emailIndex.set(employeeData.email, id);

    return employee;
  }

  async delete(employeeData: DeleteEmployeeDto): Promise<Employee> {
    if (!employeeData.email && !employeeData.id) {
      throw new ValidationError(
        'Email or id is required when deleting an employee'
      );
    }

    const employeeId =
      employeeData.id || this.emailIndex.get(employeeData.email!);

    if (!employeeId) {
      throw new EmployeeEmailNotFoundError(employeeData.email!);
    }

    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new EmployeeNotFoundError(employeeId);
    }

    this.employees.delete(employeeId);
    this.emailIndex.delete(employee.email);
    return employee;
  }

  async getEmployees(pagination: PaginationDto): Promise<Employee[]> {
    const allEmployees = Array.from(this.employees.values());

    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return allEmployees
      .slice(startIndex, endIndex)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.emailIndex.has(email);
  }

  clear(): void {
    this.employees.clear();
    this.emailIndex.clear();
  }

  getTotalCount(): number {
    return this.employees.size;
  }
}
