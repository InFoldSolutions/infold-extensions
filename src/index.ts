import BaseAgent from './agents/base';
import RedditAgent from './agents/reddit';
import logger from './utils/logger';

class Application {
  agent: BaseAgent

  constructor() {
    logger.log('Application: constructor');

    this.initAgent();
  }

  initAgent() {
    logger.log('Application: initAgent');

    const host = location.hostname;
    let Agent;

    if (/^www.reddit\.com/.test(host)) {
      Agent = RedditAgent;
    }

    if (Agent) {
      this.agent = new Agent();
      this.agent.start();
    }
  }
}

const app = new Application();