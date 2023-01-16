import { el, mount, unmount } from 'redom';

import Slideshow from './slideshow/slideshow';

import logger from '../utils/logger';
import config from '../utils/config';
import CloseIcon from './svgs/closeIcon';

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
    this.postBody = el(`.SCPostBodyWrapper.${this.agent}`,
        el('.SCPostBody', [
          this.closeBtn,
          new Slideshow(config.mock.relatedSources, 'Related News')
        ])
      );
    
    this.closeBtn.onclick = () => {
      this.close();
    }

    mount(this.article, this.postBody);
  }

  close() {
    unmount(this.article, this.postBody);
    this.closeCallback();
  }
}