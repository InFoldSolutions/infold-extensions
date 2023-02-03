import { el, mount } from 'redom';

import logger from '../../utils/logger';

import Slideshow from '../slideshow/slideshow';
import config from '../../utils/config';

import Dialog from './dialog';
import CloseIcon from '../svgs/closeIcon';
import { findChildByText, findParentByAttribute } from '../../utils/helpers';

export default class TwitterDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement
  mainElement: HTMLElement
  sectionElement: HTMLElement
  closeBtn: HTMLElement

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement, closeCallback: Function) {
    logger.log('TwitterDialog: constructor');

    super(agent, article, btnWrapper, linkElement);

    this.mainElement = document.querySelector('main');
    this.sectionElement = this.mainElement.querySelector('section');
    this.parent = findParentByAttribute(article, 'data-testid', 'cellInnerDiv')
    this.parent.style.zIndex = '9999';

    this.closeBtn = el('.SCDialogCloseWrapper', new CloseIcon);
    this.closeBtn.onclick = () => {
      this.close();
    }

    this.dialogBody = el('.SCDialogBody', [ // { style: { top: `${this.offsetTop}px`, left: `${this.offsetLeft}px` } },
      el('.SCDialogContent', new Slideshow(config.mock.relatedSources))
    ]);

    this.dialogCloseWrapper = el('.SCDialogBGWrapper');
    this.dialogCloseWrapper.onclick = (evt: Event) => {
      evt.stopPropagation();

      const target: HTMLElement = evt.target as HTMLElement;

      if (target.classList.contains('SCDialogBGWrapper')) {
        closeCallback();
        this.close();
      }
    };

    this.el = el(`.SCDialogWrapper.${agent}`, { style: { bottom: `-${this.offsetTop}px` } },
      [
        this.closeBtn,
        this.dialogBody
      ])

    mount(this.parent, this.el);
  }

  get offsetTop(): number {
    let offsetTop: number = 204;

    // compensate for "Show this thread" btn
    const showThreadElement: HTMLElement = findChildByText(this.article, 'span', 'Show this thread');

    if (showThreadElement) {
      const showThreadParentElement: HTMLElement = showThreadElement.parentElement.parentElement;

      if (showThreadParentElement && (showThreadParentElement.classList.contains('r-1777fci') || showThreadParentElement.classList.contains('r-1iusvr4'))) {
        offsetTop -= (showThreadParentElement.clientHeight + 2); // 2 accounts for margin
      }
    }

    // compensate for "Promoted" btn
    const promotedElement: HTMLElement = findChildByText(this.article, 'span', 'Promoted');

    if (promotedElement) {
      const promotedParentElement: HTMLElement = promotedElement.parentElement.parentElement.parentElement;

      if (promotedParentElement) {
        offsetTop -= (promotedParentElement.clientHeight + 12); // 12 accounts for margin
      }
    }

    return offsetTop;
  }
}