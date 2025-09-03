import { App } from './app';

async function main(): Promise<void> {
  try {
    const port = parseInt(process.env['PORT'] || '3000', 10);
    const app = new App(port);

    const gracefulShutdown = (signal: string) => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    app.listen();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Application startup failed:', error);
  process.exit(1);
});
