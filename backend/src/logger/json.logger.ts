import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatLine(
    level: string,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    return JSON.stringify({
      level,
      message: this.serialize(message),
      optionalParams: optionalParams.map((p) => this.serialize(p)),
    });
  }

  private serialize(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value instanceof Error) {
      return value.stack ?? value.message;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatLine('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatLine('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatLine('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatLine('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatLine('verbose', message, optionalParams));
  }
}
