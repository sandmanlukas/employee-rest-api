import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import {
  Employee,
  CreateEmployeeDto,
  ApiResponse,
  DeleteEmployeeDto,
  PaginationDto,
} from '../types/employee';
import { AppError, ValidationError } from '../types/errors';

export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeData: CreateEmployeeDto = req.body;
      const employee = await this.employeeService.createEmployee(employeeData);

      const response: ApiResponse<Employee> = {
        success: true,
        data: employee,
        message: `Employee created successfully: ${employee.firstName} ${employee.lastName}`,
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const deleteEmployeeData: DeleteEmployeeDto = req.body;
      const employee =
        await this.employeeService.deleteEmployee(deleteEmployeeData);

      const response: ApiResponse<Employee> = {
        success: true,
        data: employee,
        message: `Employee deleted successfully: ${employee.firstName} ${employee.lastName}`,
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getEmployees(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = req.query['page'] as string;
      const limitParam = req.query['limit'] as string;

      let pagination: PaginationDto;

      if (pageParam && limitParam) {
        const page = parseInt(pageParam, 10);
        const limit = parseInt(limitParam, 10);

        if (isNaN(page) || isNaN(limit)) {
          throw new ValidationError('Page and limit must be valid numbers');
        }

        pagination = { page, limit };
      } else {
        pagination = { page: 1, limit: 10 };
      }

      const result = await this.employeeService.getEmployees(pagination);

      const response = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Employees fetched successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    console.error('Error in EmployeeController:', error);

    if (error instanceof AppError) {
      const response: ApiResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(error.statusCode).json(response);
      return;
    }

    if (error instanceof ValidationError) {
      const response: ApiResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
    };
    res.status(500).json(response);
  }
}
