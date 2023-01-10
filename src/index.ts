import BaseAgent from './agents/base';
import RedditAgent from './agents/reddit';
import TwitterAgent from './agents/twitter';
import logger from './utils/logger';

class Application {
  agent: BaseAgent

  constructor() {
    logger.log('Application: constructor');

    let Agent;

    const host = location.hostname;

    if (/^www.reddit\.com/.test(host)) {
      Agent = RedditAgent;
    }
    if (/^twitter\.com/.test(host)) {
      Agent = TwitterAgent;
    }
    
    if (Agent) {
      this.agent = new Agent();
      this.agent.start();
    }
  }
}

// init
new Application();