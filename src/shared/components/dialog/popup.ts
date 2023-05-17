import { el, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Dialog from './dialog';
import CloseIcon from '../svgs/closeIcon';

export default class PopupDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  closeBtn: HTMLElement

  linkElement: HTMLElement

  dialogStyle: Object

  closeCallback: Function

  constructor(wrapper: HTMLElement, closeCallback?: Function) {
    logger.log('PopupDialog: constructor');

    super();

    this.agent = 'popup';
    this.parent = wrapper;
    this.headlines = true;

    this.closeCallback = closeCallback;

    this.closeBtn = el('.SCDialogCloseWrapper', ['InFold', new CloseIcon]);
    this.closeBtn.onclick = () => {
      this.close();
    }

    this.dialogBody = el('.SCDialogBody', el('span.SCLoader'));
    this.el = el(`.SCDialogWrapper.${this.agent}`,
      [
        this.closeBtn,
        this.dialogBody
      ]);

    mount(this.parent, this.el);
  }

  close() {
    logger.log('PopupDialog: close');

    if (this.closeCallback)
      this.closeCallback();
  }
}