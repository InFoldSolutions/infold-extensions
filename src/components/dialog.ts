import { el, svg, mount, unmount } from 'redom';

import logger from '../utils/logger';

import CloseIcon from './svgs/closeIcon';
import Summary from './summary';
import Slideshow from './slideshow';
import config from '../utils/config';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  closeBtn: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement

  itemSummary: Summary

  constructor(agent: string, parent: HTMLElement, article: HTMLElement, btnWrapper: HTMLElement) {
    logger.log('Dialog: constructor');

    this.parent = parent;

    let offsetTop: number = 0;

    const sectionElement: HTMLElement = document.querySelector('main section') as HTMLElement;

    // This is messed up
    // Need to account for offest top that the custom scroll mechanism has

    if (sectionElement) {
      offsetTop += sectionElement.offsetTop;
    }

    const sectionParentElement: HTMLElement = sectionElement.parentElement.parentElement;

    if (sectionParentElement) {
      offsetTop += sectionParentElement.offsetTop;
    }

    const sectionParentParentElement: HTMLElement = sectionElement.parentElement.parentElement.parentElement;

    if (sectionParentParentElement) {
      offsetTop += sectionParentParentElement.offsetTop;
    }

    const currentParent: HTMLElement = article.parentElement.parentElement.parentElement.parentElement as HTMLElement;
    const transform: string = currentParent.style.transform;
    const topPixels: number = parseInt(transform.split('(')[1].replace(')', '').replace('px', '')) + currentParent.clientHeight + offsetTop - (btnWrapper.clientHeight + 15);
    const leftPixels: number = (window.innerWidth / 2) - 290; // 505 is the width of the dialog

    this.dialogBody = el('.SCDialogBody', { style: { top: `${topPixels}px`, left: `${leftPixels}px` } }, [
      el('.SCDialogContent', [
        this.itemSummary,
        new Slideshow(config.mock.relatedNews, 'Related News', 'fal.fa-newspaper', 'news'),
      ])
    ]);

    this.dialogCloseWrapper = el('.SCDialogBGWrapper');
    this.dialogCloseWrapper.onclick = (evt: Event) => {
      evt.stopPropagation();

      const target = evt.target as HTMLElement;
      console.log('dialogCloseWrapper target', target)

      if (target.classList.contains('SCDialogBGWrapper'))
        this.close();
    };

    this.el = el(`.SCDialogWrapper.${agent}`,
      [
        this.dialogCloseWrapper,
        this.dialogBody
      ])

    mount(this.parent, this.el);
  }

  close() {
    logger.log('Dialog: close');

    unmount(this.parent, this.el);
  }
}