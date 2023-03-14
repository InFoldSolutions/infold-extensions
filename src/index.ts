import 'bluebird-global'; // use bluebird as global Promise implementation

import RedditAgent from './agent/reddit';
import TwitterAgent from './agent/twitter';

import logger from './utils/logger';

class Application {
  agent: RedditAgent | TwitterAgent;

  constructor() {
    logger.log('Application: constructor');

    let ActiveAgent;

    const host = location.hostname;

    if (/^www.reddit\.com/.test(host)) {
      ActiveAgent = RedditAgent;
    }
    if (/^twitter\.com/.test(host)) {
      ActiveAgent = TwitterAgent;
    }
    
    if (ActiveAgent) {
      this.agent = new ActiveAgent();
      this.agent.start();
    }
  }
}

// init
new Application();