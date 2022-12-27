
const debug = false;

class Logger {

  log(msg: string) {
    if (debug) {
      console.log(msg);
    }
  }

  error(msg: string) {
    // report / handle error
    if (debug) {
      console.error(msg);
    }
  }

  warn(msg: string) {
    if (debug) {
      console.warn(msg);
    }
  }
}

const logger = new Logger();

export default logger;