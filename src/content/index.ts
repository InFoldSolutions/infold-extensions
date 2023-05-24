import RedditAgent from './agent/reddit';
import TwitterAgent from './agent/twitter';

import logger from '../shared/utils/logger';

import settings from '../shared/services/settings';

class Application {
  agent: RedditAgent | TwitterAgent;

  listening: boolean = false;

  constructor() {
    logger.log('Application: constructor');

    this.onEvents();
    this.startAgent();
  }

  async startAgent() {
    logger.log('Application: startAgent');

    let ActiveAgent;

    const host = location.hostname;

    if (/^www.reddit\.com/.test(host)) {
      const redditSetting = await settings.get('redditAgent');

      if (!redditSetting)
        return logger.log('Reddit agent is disabled');

      ActiveAgent = RedditAgent;
    }
    if (/^twitter\.com/.test(host)) {
      const twitterSetting = await settings.get('twitterAgent');

      if (!twitterSetting)
        return logger.log('Twitter agent is disabled');

      ActiveAgent = TwitterAgent;
    }
    
    if (ActiveAgent) {
      this.agent = new ActiveAgent();
      this.agent.start();
    }
  }

  stopAgent() {
    logger.log('Application: stopAgent');

    if (this.agent) {
      this.agent.stop();
      this.agent = null;
    }
  }

  onEvents() {
    logger.log('Application: onEvents');

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        settings.synced = false;

        if (request.type) {
          switch (request.type) {
            case 'stopAgent':
              this.stopAgent();
              break;
            case 'startAgent':
              this.startAgent();
              break;
            default:
              logger.warn(`Unknown message type ${request.type}`);
              break;
          }
        }
      }
    )

    this.listening = true;
  }

}

// init
new Application();