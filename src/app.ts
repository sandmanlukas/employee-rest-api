import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppError } from './types/errors';

export class App {
  public app: express.Application;
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());

    this.app.use(cors({
      origin: process.env['ALLOWED_ORIGINS']?.split(',') || '*',
      credentials: true,
    }));


    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    this.app.use((_req, _res, next) => {
      console.log(`${new Date().toISOString()} - ${_req.method} ${_req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });


    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Global error handler:', error);

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error instanceof SyntaxError && 'body' in error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON format',
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
