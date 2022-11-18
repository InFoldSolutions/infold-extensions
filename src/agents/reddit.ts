import BaseAgent from './base';
import logger from '../utils/logger';

export default class RedditAgent extends BaseAgent {
	constructor() {
    super();
		logger.log('RedditAgent: constructor');
  }
}