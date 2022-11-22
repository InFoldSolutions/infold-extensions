import logger from '../utils/logger';

export default class Link {

  status: string
  node: HTMLAnchorElement
  elWrapper: HTMLElement

  constructor(type: string, element: HTMLAnchorElement) {
    logger.log('Link: constructor');
    console.log('Link: constructor url', element.href);
    console.log('Link: constructor type', type);
    console.log('Link: constructor node', element);
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