class ConsoleHelper {
    public COLORS = {
      Reset: '\x1b[0m',
      Bright: '\x1b[1m',
      Dim: '\x1b[2m',
      Underscore: '\x1b[4m',
      Blink: '\x1b[5m',
      Reverse: '\x1b[7m',
      Hidden: '\x1b[8m',
  
      FgBlack: '\x1b[30m',
      FgRed: '\x1b[31m',
      FgGreen: '\x1b[32m',
      FgYellow: '\x1b[33m',
      FgBlue: '\x1b[38;2;139;255;234m', // Updated FgBlue color to 8BFFEA
      FgMagenta: '\x1b[35m',
      FgCyan: '\x1b[36m',
      FgWhite: '\x1b[37m',
  
      BgBlack: '\x1b[40m',
      BgRed: '\x1b[41m',
      BgGreen: '\x1b[42m',
      BgYellow: '\x1b[43m',
      BgBlue: '\x1b[44m',
      BgMagenta: '\x1b[45m',
      BgCyan: '\x1b[46m',
      BgWhite: '\x1b[47m',
    }
  
    error(message: string) {
      console.log(`${this.COLORS.FgRed}${message}${this.COLORS.Reset}`)
    }
  
    info(message: string) {
      console.log(`${this.COLORS.FgBlue}${message}${this.COLORS.Reset}`)
    }
  
    warning(message: string) {
      console.warn(`${this.COLORS.FgYellow}${message}${this.COLORS.Reset}`)
    }
  
    success(message: string) {
      console.log(`${this.COLORS.FgGreen}${message}${this.COLORS.Reset}`)
    }
  
    transaction(message: string, hash: string) {
      console.log(
        `${this.COLORS.FgGreen}${message}${this.COLORS.Reset} :: ${this.COLORS.FgBlue}${hash}${this.COLORS.Reset}`
      )
    }
  
    obj(message: string, obj: unknown) {
      // Define color codes for different parts of the output
      const messageColor = this.COLORS.FgGreen
      const objColor = this.COLORS.FgCyan // You can change this to any color you prefer
      const resetColor = this.COLORS.Reset
      console.log(
        `${messageColor}${message}${resetColor} ${objColor}${JSON.stringify(
          obj
        )}${resetColor}`
      )
    }
  
    catchError(message: string, error: unknown) {
      // Define color codes for different parts of the output
      // const messageColor = this.COLORS.FgGreen // You can change this to any color you prefer
      // const errorColor = this.COLORS.FgRed // You can change this to any color you prefer
      // const resetColor = this.COLORS.Reset
      // console.log(
      //   `${messageColor}${message}${resetColor} ${errorColor}::${resetColor} ${errorColor}${JSON.stringify(
      //     error
      //   )}${resetColor}`
      // )
  
      const timestamp = new Date().toISOString();
      this.error(`[ERROR] ${timestamp} - ${message}`);
      if (error instanceof Error) {
        this.error(error.stack ?? error.message);
      } else if (typeof error === 'string') {
        this.error(error);
      } else {
        this.error(JSON.stringify(error, null, 2));
      }
  
  
    }
  
  
    customColor(message: string, colorCode: string) {
      console.log(`${colorCode}${message}${this.COLORS.Reset}`)
    }
  
    animateMessage(message: string, interval: number = 100) {
      const colors = Object.values(this.COLORS)
      let currentIndex = 0
  
      const intervalId = setInterval(() => {
        if (currentIndex >= colors.length) {
          process.stdout.write('\x1b[2K\r') // Clear the line
          currentIndex = 0
        }
  
        const color = colors[currentIndex]
        process.stdout.write(`${color}${message}${this.COLORS.Reset}\r`)
        currentIndex++
      }, interval)
  
      // Stop the animation after 5 seconds (5000 milliseconds)
      setTimeout(() => {
        clearInterval(intervalId)
        process.stdout.write('\x1b[2K\r') // Clear the line
      }, 5000)
    }
  }
  
  export default new ConsoleHelper()