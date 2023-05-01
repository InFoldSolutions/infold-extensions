import { el, mount, unmount } from 'redom';

import Slideshow from './slideshow/slideshow';
import Groups from './slideshow/groups';

import logger from '../utils/logger';
import CloseIcon from './svgs/closeIcon';

import { IDataItem } from '../types';

export default class Post {

  el: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  linkElement: HTMLElement
  closeBtn: HTMLElement
  postBody: HTMLElement

  agent: string

  closeCallback: Function

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement, closeCallback: Function) {
    logger.log('Post: constructor');

    this.closeCallback = closeCallback;
    this.btnWrapper = btnWrapper;
    this.agent = agent;
    this.article = article;
    this.linkElement = linkElement;

    this.closeBtn = el('.SCPostCloseWrapper', new CloseIcon);
    this.postBody = el('.SCPostBody', el('span.SCLoader'));

    this.el = el(`.SCPostBodyWrapper.${this.agent}`, [
      this.closeBtn,
      this.postBody
    ]);

    this.closeBtn.onclick = () => {
      this.close();
    }

    mount(this.article, this.el);
  }

  update(data?: IDataItem[], totalCount?: number) {
    logger.log('Post: update');

    this.postBody.innerHTML = '';

    const groups = Groups.mapToSourceGroups(data);
    mount(this.postBody, new Slideshow(groups, totalCount));
  }

  close() {
    unmount(this.article, this.el);
    this.closeCallback();
  }
}