import { el, mount } from 'redom';

import logger from '../utils/logger';
import events from '../services/events';

export default class SubmitView {

  el: HTMLElement
  backBtn: HTMLElement

  constructor() {
    logger.log('SubmitView: constructor');
    
    this.backBtn = el('span.SCRelatedViewBtn', 'Back To Related');

    this.backBtn.onclick = () => {
      events.emit('updateDialog');
    }

    this.el = el('span.SCSubmitViewWrapper', this.backBtn);
  }
}