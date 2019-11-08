import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { LocalConsoleService } from './local-console.service';
import { Console } from './models/console';
import { LogLevel } from './models/log-level';

@Injectable()
export class RemoteConsoleService implements Console {
  constructor(private readonly http: Http, private readonly logger: LocalConsoleService) {}

  relayLogMessage(level: LogLevel, message: string, context: any): void {
    // TODO: Create an endpoint
    // TODO: Send HTTP request to log a remote message to the server
    return;

    // FIXME: this won't work with "ng serve"
    this.http.post('/log', { level, message, context }).subscribe(
      resp => {
        this.logger.debug(message, context);
      },
      err => {
        if (context) {
          context.originalMessage = message;
        }
        // TODO: Enable once /log endpoint has been added
        // this.logger.error(`Failed to relay a log message: ${err}`, context ? context : message);
      }
    );

    return;
  }

  // Log to Info by default if no level is provided
  log(m: any, c?: any): void {
    this.info(m, c);
  }

  debug(m: any, c?: any): void {
    this.relayLogMessage(LogLevel.Debug, m, c);
  }

  error(m: any, c?: any): void {
    this.relayLogMessage(LogLevel.Error, m, c);
  }

  warn(m: any, c?: any): void {
    this.relayLogMessage(LogLevel.Warn, m, c);
  }

  info(m: any, c?: any): void {
    this.relayLogMessage(LogLevel.Info, m, c);
  }
}
