import { el, svg, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Slideshow from '../slideshow';
import config from '../../utils/config';

import Dialog from './dialog';

export default class TwitterDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement
  mainElement: HTMLElement
  sectionElement: HTMLElement

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement) {
    super(agent, article, btnWrapper);

    logger.log('TwitterDialog: constructor');

    this.mainElement = document.querySelector('main');
    this.sectionElement = this.mainElement.querySelector('section');
    this.parent = document.getElementById('layers');

    // This is messed up
    // Need to account for offest top that the custom scroll mechanism has

    this.dialogBody = el('.SCDialogBody', { style: { top: `${this.offsetTop}px`, left: `${this.offsetLeft}px` } }, [
      el('.SCDialogContent', new Slideshow(config.mock.relatedNews, 'Related News', 'fal.fa-newspaper', 'news'))
    ]);

    this.dialogCloseWrapper = el('.SCDialogBGWrapper');
    this.dialogCloseWrapper.onclick = (evt: Event) => {
      evt.stopPropagation();

      const target: HTMLElement = evt.target as HTMLElement;

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

  get offsetLeft(): number {
    let offsetLeft: number = 0;

    // calculate offset left
    if (this.mainElement) {
      offsetLeft += this.mainElement.offsetLeft;
    }

    const btnWrapperParentElement: HTMLElement = this.btnWrapper.parentElement.parentElement.parentElement;

    if (btnWrapperParentElement) {
      offsetLeft += btnWrapperParentElement.offsetLeft + 15; // 15 accounts for the margin value, needs refactor
    }

    return offsetLeft
  }

  get offsetTop(): number {
    let offsetTop: number = 0;

    // calculate offset top
    if (this.sectionElement) {
      offsetTop += this.sectionElement.offsetTop;
    }

    const sectionParentElement: HTMLElement = this.sectionElement.parentElement.parentElement;

    if (sectionParentElement) {
      offsetTop += sectionParentElement.offsetTop;
    }

    const sectionParentParentElement: HTMLElement = this.sectionElement.parentElement.parentElement.parentElement;

    if (sectionParentParentElement) {
      offsetTop += sectionParentParentElement.offsetTop;
    }

    const showThreadXPathResult: XPathResult = 
      document.evaluate(".//span[contains(., 'Show this thread')]", 
      this.article, 
      null, 
      XPathResult.FIRST_ORDERED_NODE_TYPE, 
      null
    );

    if (showThreadXPathResult.singleNodeValue) {
      const showThreadElement: HTMLElement = showThreadXPathResult.singleNodeValue.parentElement;

      if (showThreadElement) {
        offsetTop -= (showThreadElement.parentElement.clientHeight + 2); // 2 accounts for margin
      }
    }

    // this is nasty, needs refactor
    const currentParent: HTMLElement = this.article.parentElement.parentElement.parentElement.parentElement as HTMLElement;
    const transform: string = currentParent.style.transform;

    const topPixels: number =
      parseInt(transform.split('(')[1].replace(')', '').replace('px', '')) + // painfull style attribute parsing
      currentParent.clientHeight +
      offsetTop -
      (this.btnWrapper.clientHeight + 15); // 15 accounts for the btnWrapper margin value, needs refactor

    return topPixels;
  }

  close() {
    logger.log('Dialog: close');

    unmount(this.parent, this.el);
  }
}