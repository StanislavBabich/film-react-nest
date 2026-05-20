import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  /** TSKV values are strings; tab and newline break the format. */
  private escapeValue(raw: string): string {
    return raw.replace(/[\t\n\r]/g, ' ');
  }

  private toFieldString(value: unknown): string {
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

  private formatLine(
    level: string,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const fields: string[] = [
      `level=${this.escapeValue(this.toFieldString(level))}`,
      `message=${this.escapeValue(this.toFieldString(message))}`,
    ];
    optionalParams.forEach((param, index) => {
      fields.push(`p${index}=${this.escapeValue(this.toFieldString(param))}`);
    });
    return `${fields.join('\t')}\n`;
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(this.formatLine('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    process.stderr.write(this.formatLine('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    process.stderr.write(this.formatLine('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(this.formatLine('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(this.formatLine('verbose', message, optionalParams));
  }
}
