import logger from '../shared/utils/logger';
import { timeDelay } from '../shared/utils/helpers';

export default class Observer {

  observer: MutationObserver

  element: HTMLElement
  parent: HTMLElement

  selector: string

  subtree: boolean
  attributes: boolean
  childList: boolean
  
  listening: boolean

  cancel: boolean
  retries: number

  callback: MutationCallback

  constructor(
    selector: string | HTMLElement,
    parent: HTMLElement = document.body,
    callback: MutationCallback,
    subtree: boolean = false,
    attributes: boolean = false,
    childList: boolean = true
  ) {
    logger.log('Observer: constructor');

    if (typeof selector === 'string')
      this.selector = selector;
    else
      this.element = selector;

    this.parent = parent;
    this.subtree = subtree;
    this.attributes = attributes;
    this.childList = childList;
    this.listening = false;
    this.retries = 0;

    this.callback = callback;
  }

  async start(retry?: boolean): Promise<void> {
    logger.log('Observer: start');

    if (retry)
      this.retries++;

    if (this.retries > 5)
      return;

    this.element = this.element || this.parent.querySelector(this.selector);

    if (!this.element) {
      await timeDelay(500);

      if (!this.cancel)
        return this.start(true);
      else
        return;
    }

    this.observer = new MutationObserver(this.callback);
    this.observer.observe(this.element, {
      childList: this.childList,
      subtree: this.subtree,
      attributes: this.attributes
    });

    this.listening = true;
  }

  disconnect() {
    logger.log('Observer: disconnect');

    this.listening = false;
    this.cancel = true;

    if (this.observer)
      this.observer.disconnect();
  }
}