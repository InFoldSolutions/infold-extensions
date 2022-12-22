import { el, mount, unmount } from 'redom';

import Slideshow from '../slideshow';

import logger from '../../utils/logger';
import config from '../../utils/config';

export default class Post {

  el: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  linkElement: HTMLElement

  postBody: HTMLElement

  agent: string

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement) {
    logger.log('Post: constructor');

    this.btnWrapper = btnWrapper;
    this.agent = agent;
    this.article = article;
    this.linkElement = linkElement;

    this.postBody = el(`.SCPostBodyWrapper.${this.agent}`, [
      el('.SCPostBody',
        new Slideshow(
          config.mock.relatedNews,
          'Related News',
          'fal.fa-newspaper',
          'news'
        ))
    ]);
  
    mount(this.article, this.postBody);
  }

  close() {
    unmount(this.article, this.postBody);
  }
}