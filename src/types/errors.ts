export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class EmployeeNotFoundError extends AppError {
  constructor(id: string) {
    super(`Employee with id ${id} not found`, 404);
  }
}

export class DuplicateEmailError extends AppError {
  constructor(email: string) {
    super(`Employee with email ${email} already exists`, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class InvalidOperationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
