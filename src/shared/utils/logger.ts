
const debug: boolean = true;

class Logger {

  log(msg: string): void {
    if (debug) {
      console.log(msg);
    }
  }

  error(msg: string): void {
    // report / handle error
    if (debug) {
      console.error(msg);
    }
  }

  warn(msg: string): void {
    if (debug) {
      console.warn(msg);
    }
  }
}

const logger = new Logger(); // --singelton
export default logger;