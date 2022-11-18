import logger from '../utils/logger';

export default class Link {

  status: string
  
  constructor() {
    logger.log('Link: constructor');
  }

  async getInfo() {
    logger.log('Link: getInfo');
  }

  preparetBaseHTML() {
    logger.log('Link: preparetBaseHTML');
  }

  disableLoading() {
    logger.log('Link: disableLoading');
  }

  setTag(tag: string) {
    logger.log('Link: setTag');
  }
}