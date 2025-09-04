import { v4 as uuidv4 } from 'uuid';
import { Employee, CreateEmployeeDto } from '../types/employee';
import { DuplicateEmailError } from '../types/errors';

export interface IEmployeeRepository {
  create(employeeData: CreateEmployeeDto): Promise<Employee>;
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

  async existsByEmail(email: string): Promise<boolean> {
    return this.emailIndex.has(email);
  }

  clear(): void {
    this.employees.clear();
    this.emailIndex.clear();
  }

  getCount(): number {
    return this.employees.size;
  }
}
