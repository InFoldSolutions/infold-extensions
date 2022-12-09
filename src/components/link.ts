import { el } from 'redom';

import logger from '../utils/logger';

export interface IPotentialLink {
  element: HTMLAnchorElement,
  wrapperNode: HTMLElement,
  article: HTMLElement
}

export interface IBaseHTMLPayload {
  element?: HTMLElement,
  onClick: (this: GlobalEventHandlers, evt: MouseEvent) => any
}

export default class Link {

  status: string
  agent: string

  node: HTMLAnchorElement
  wrapper: HTMLElement
  article: HTMLElement
  el: HTMLElement

  constructor(agent: string, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.agent = agent;
    this.article = potentialLInk.article;
    this.node = potentialLInk.element;
    this.wrapper = potentialLInk.wrapperNode;
    this.status = 'pending';
  }

  async getInfo() {
    logger.log('Link: getInfo');
    this.status = 'success';
  }

  preparetBaseHTML(payload: IBaseHTMLPayload) {
    logger.log('Link: preparetBaseHTML');

    if (payload.element)
      this.el = payload.element;
    else {
      this.el = el(`.SCbuttonWrapper`, [
        el(`span.SCiconWrapper`, [
          el('span.SCiconBackground'),
          el(`i.fal.fa-lightbulb`)
        ]),
        el(`span.SCtextWrapper`, '86')
      ]);
    }

    this.el.onclick = payload.onClick.bind(this);
  }

  disableLoading() {
    logger.log('Link: disableLoading');
  }

  setTag(tag: string) {
    logger.log('Link: setTag');
  }
}