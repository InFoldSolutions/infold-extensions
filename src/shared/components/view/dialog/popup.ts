import { el, mount } from 'redom';

import logger from '../../../utils/logger';

import events from '../../../services/events';

import Dialog from './dialog';

export default class PopupDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  title: HTMLElement
  titleText: HTMLElement
  titleIcon: HTMLElement
  linkElement: HTMLElement

  dialogStyle: Object

  closeCallback: Function

  constructor(wrapper: HTMLElement, closeCallback?: Function) {
    logger.log('PopupDialog: constructor');

    super(null, null, null, null, closeCallback);

    this.agent = 'popup';
    this.parent = wrapper;
    this.headlines = true;

    this.titleText = el('span.SCTitleText', 'Related Articles');
    this.titleIcon = el('i.fad.fa-stream');

    this.closeCallback = closeCallback;

    this.title = el('.SCSettingsViewTitle', [this.titleText, this.titleIcon]);
    this.title.onclick = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains('fa-stream'))
        events.emit('openSettingsView');
      else if (target.classList.contains('fa-arrow-alt-circle-right'))
        events.emit('openSlideshowView', this.data, this.meta);
    }

    this.dialogBody = el('.SCDialogBody', el('span.SCLoader'));
    this.el = el(`.SCDialogWrapper.${this.agent}`,
      [
        this.title,
        this.dialogBody
      ]);

    mount(this.parent, this.el);
  }

  close() {
    logger.log('PopupDialog: close');

    super.close();
  }
}