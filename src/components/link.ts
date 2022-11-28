import logger from '../utils/logger';

export interface ILink {
  status: string
  type: string
  node: HTMLAnchorElement
  wrapper: HTMLElement
  el: HTMLElement

  getInfo: () => void
  preparetBaseHTML: (element: HTMLElement) => void
  disableLoading: () => void
  setTag: (tag: string) => void
}

export interface IPotentialLink {
  element: HTMLAnchorElement,
  wrapperNode: HTMLElement
}

export default class Link implements ILink {
  status: string
  type: string
  node: HTMLAnchorElement
  wrapper: HTMLElement
  el: HTMLElement

  constructor(type: string, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.type = type;
    this.node = potentialLInk.element;
    this.wrapper = potentialLInk.wrapperNode;
    this.status = 'pending';
  }

  async getInfo() {
    logger.log('Link: getInfo');
    this.status = 'success';
  }

  preparetBaseHTML(element: HTMLElement) {
    logger.log('Link: preparetBaseHTML');
    this.el = element; //el('.SCWrapper', el('i.far.fa-spinner-third.fa-spin'));
  }

  disableLoading() {
    logger.log('Link: disableLoading');
  }

  setTag(tag: string) {
    logger.log('Link: setTag');
  }
}