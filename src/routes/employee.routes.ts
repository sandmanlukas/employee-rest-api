import { Router, Request, Response } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

export function createEmployeeRoutes(
  employeeController: EmployeeController
): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    await employeeController.createEmployee(req, res);
  });
  router.delete('/', async (req: Request, res: Response) => {
    await employeeController.deleteEmployee(req, res);
  });

  return router;
}
