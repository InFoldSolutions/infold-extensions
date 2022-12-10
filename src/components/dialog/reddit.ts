import { el, svg, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Summary from '../summary';
import Slideshow from '../slideshow';
import config from '../../utils/config';

import Dialog from './dialog';

export default class RedditDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement

  itemSummary: Summary

  constructor(agent: string, parent: HTMLElement, article: HTMLElement, btnWrapper: HTMLElement) {
    super(agent, parent, article);

    logger.log('RedditDialog: constructor');

    this.dialogBody = el('.SCDialogBody', [
      el('.SCDialogContent', [
        this.itemSummary,
        new Slideshow(config.mock.relatedNews, 'Related News', 'fal.fa-newspaper', 'news'),
      ])
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
}