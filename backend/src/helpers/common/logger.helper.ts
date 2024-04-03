import winston , { createLogger, format, transports , Logger } from 'winston'
import * as fs from 'fs'
import * as path from 'path'

const { combine, timestamp, label, printf } = format

class LoggerHelper {
    public logger: Logger; // Define the logger property

    constructor() {
        this.logger = winston.createLogger(); // Initialize the logger in the constructor
        this.initWinston()
    }

    public initWinston() {
        const logDir = 'logs'

        // Create the log directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir)
        }

        const myFormat = printf(({ level, message, timestamp, stack }: any) => {
            // Check if 'stack' is defined before accessing its properties
            if (stack && typeof stack === 'string') {
              let on :any = stack.split('\n')[1].slice(7).split('/').pop();
              let file = on.split(':')[0];
              let line = on.split(':')[1];
              let data = new Date(timestamp).toString().split(' GMT')[0];
          
              return `${level}: [${data}] Hello Fellow, there is a ${level} message on file:${file}  line ${line} ${message}`;
            } else {
              // Handle the case where 'stack' is undefined or not a string
              return `${level}: [${timestamp}] Error: 'stack' is undefined or not a string - ${message}`;
            }
          });
        

        this.logger = createLogger({
            level: 'info',
            format: combine(
                label({ label: 'right meow!' }),
                timestamp(),
                myFormat
            ),

            defaultMeta: { service: 'xrp-logs' },
            transports: [
                new transports.File({
                    filename: path.join(logDir, 'error.log'),
                    level: 'error',
                }),
                new transports.File({
                    filename: path.join(logDir, 'combined.log'),
                }),
            ],
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public createLog(level: 'error' | 'info', message: any, data: any = {}) {
        if (level === 'error') {
            this.logger.error({ level, message, data })
        } else {
            this.logger.info({ level, message, data: '' })
        }
    }
}

export default new LoggerHelper()
