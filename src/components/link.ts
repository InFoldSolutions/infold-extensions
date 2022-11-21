import logger from '../utils/logger';

export default class Link {

  status: string
  node: HTMLElement
  elWrapper: HTMLElement

  constructor(url: string, type: string, node: HTMLElement) {
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