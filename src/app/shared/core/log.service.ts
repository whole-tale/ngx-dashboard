import { forwardRef, Inject, Injectable } from '@angular/core';
// import { ConfigService } from '@ngx-config/core';

import { LocalConsoleService } from './local-console.service';
import { LogLevel } from './models/log-level';
import { RemoteConsoleService } from './remote-console.service';

@Injectable()
export class LogService {
  static readonly DEFAULT_LOG_LEVEL: LogLevel = LogLevel.Error;
  readonly level: LogLevel;

  constructor(
    // private readonly config: ConfigService,
    @Inject(forwardRef(() => LocalConsoleService)) readonly logger: LocalConsoleService,
    @Inject(forwardRef(() => RemoteConsoleService)) readonly relay: RemoteConsoleService
  ) {
    // TODO: Set this based on detected env?
    this.level = LogService.DEFAULT_LOG_LEVEL;
  }

  // debug (standard output)
  debug(msg: any, o?: any): void {
    if (this.level >= LogLevel.Debug) {
      // console.debug does not work on {N} apps... use `log`
      this.logger.log(msg, o);
      this.relay.log(msg, o);
    }
  }

  // error
  error(err: any, o?: any): void {
    if (this.level >= LogLevel.Error) {
      this.logger.error(err, o);
      this.relay.error(err, o);
    }
  }

  // warn
  warn(warning: any, o?: any): void {
    if (this.level >= LogLevel.Warn) {
      this.logger.warn(warning, o);
      this.relay.warn(warning, o);
    }
  }

  // info
  info(msg: any, o?: any): void {
    if (this.level >= LogLevel.Info) {
      this.logger.info(msg, o);
      this.relay.info(msg, o);
    }
  }
}
