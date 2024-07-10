
export type LoggerLevel = 'debug' | 'warn' | 'error'

// todo: allow for overwrite via import.meta.env.VITE_LOGGER_LEVEL
// Can't use import.meta with current jest setup.
const LOGGER_LEVEL: LoggerLevel = 'warn'

export class LoggerClass {
	debug (...args: any[]) {
		if (LOGGER_LEVEL === 'debug') {
			console.debug(...args)
		}
	}

	warn (...args: any[]) {
		if (LOGGER_LEVEL === 'debug' || LOGGER_LEVEL === 'warn') {
			console.warn(...args)
		}
	}

	error (...args: any[]) {
		if (LOGGER_LEVEL === 'debug' || LOGGER_LEVEL === 'warn' || LOGGER_LEVEL === 'error') {
			console.error(...args)
		}
	}
}


export const Logger = new LoggerClass();
