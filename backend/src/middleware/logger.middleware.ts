import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

const getTime = () => new Date().toISOString();

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  const method = chalk.blue(req.method);
  const url = chalk.cyan(req.originalUrl);
  const timestamp = getTime();

  console.log(`${chalk.gray(`[${timestamp}]`)} ${chalk.green('→')} ${method} ${url},`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log(`${chalk.gray('  └─ Body:')} ${chalk.white(JSON.stringify(req.body, null, 2))},`);
  }

  const originalSend = res.send.bind(res);
  res.send = (body: any): Response => {
    const status = res.statusCode;

    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

    let color = chalk.white;
    let icon = '';
    let label = '';

    if (status < 300) {
      color = chalk.green;
      icon = '✅';
      label = 'SUCCESS';
    } else if (status < 400) {
      color = chalk.yellow;
      icon = '⚠️ ';
      label = 'REDIRECT';
    } else if (status < 500) {
      color = chalk.red;
      icon = '❌';
      label = 'CLIENT ERROR';
    } else {
      color = chalk.bgRed.white;
      icon = '💥';
      label = 'SERVER ERROR';
    }

    console.log(
      `${chalk.gray(`[${getTime()}]`)} ${icon} ${method} ${url} ${color(status.toString())} ${chalk.magenta(duration + 'ms')} - ${label}`,
    );

    const responsePreview = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
    const preview =
      responsePreview.length > 1000 ? responsePreview.slice(0, 1000) + '...' : responsePreview;
    console.log(chalk.gray('  └─ Response:'), chalk.white(preview));

    return originalSend(body);
  };

  next();
};
