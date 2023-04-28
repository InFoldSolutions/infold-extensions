import { el, mount } from 'redom';

import logger from '../../utils/logger';
import TipIcon from './svgs/tipIcon';

export default class Tip {

  el: HTMLElement

  onClickBind: EventListener

  constructor(publisherName: string, tipValue: number) {
    logger.log('Tip: constructor');
    
    this.el = el('span.SCTipWrapper', { 
      title: `Tip $${tipValue}.00 to ${publisherName}` 
    }, [
      new TipIcon(), 
      el('span.SCTipIconText', `$${tipValue}.00`)
    ]);

    this.onClickBind = this.onClick.bind(this);
    this.el.addEventListener('click', this.onClick.bind(this));
  }

  onClick() {
    this.el.innerHTML = '';
    mount(this.el, el('span.SCTipIconText', 'Thanks!'))
    this.el.removeEventListener('click', this.onClickBind);
    this.el.setAttribute('class', 'SCTipWrapper SCTipWrapper--thanks')
  }
}