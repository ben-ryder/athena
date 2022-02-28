import { pino, Logger as PinoLogger } from 'pino';

export class Logger {
  private _logger: PinoLogger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      }
    }
  })

  async logError(error: any) {
    this._logger.error(error);
  }

  async logInformation(information: any) {
    this._logger.info(information);
  }
}
