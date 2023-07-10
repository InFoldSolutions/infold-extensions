import { el, mount, unmount } from 'redom';

import Slideshow from '../slideshow/slideshow';
import Groups from '../slideshow/groups';

import logger from '../../utils/logger';
import CloseIcon from '../svgs/closeIcon';

import { IDataItem } from '../../types';
import events from '../../services/events';

import SubmitView from './submit';

export default class Post {

  el: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  linkElement: HTMLElement
  closeBtn: HTMLElement

  postBody: HTMLElement
  postContent: HTMLElement

  submitView: SubmitView

  agent: string
  totalCount: number
  data: IDataItem[]

  closeCallback: Function

  openSubmitViewBind: EventListener
  openSlideshowViewBind: EventListener

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

    this.onEvents();

    mount(this.article, this.el);
  }

  onEvents() {
    logger.log('Dialog: onEvents');

    this.openSubmitViewBind = this.openSubmitView.bind(this);
    this.openSlideshowViewBind = this.openSlideshowView.bind(this);

    events.on('openSubmitView', this.openSubmitViewBind);
    events.on('openSlideshowView', this.openSlideshowViewBind); // default slideshow view, should probably be renamed
  }

  offEvents() {
    logger.log('Dialog: offEvents');

    events.off('openSubmitView', this.openSubmitViewBind);
    events.off('openSlideshowView', this.openSlideshowViewBind);
  }

  openSubmitView() {
    logger
      .log('Dialog: openSubmitView');

    if (this.postContent)
      unmount(this.postBody, this.postContent);

    this.postContent.innerHTML = '';

    this.submitView = new SubmitView();
    this.postContent = el('.SCPostContent', this.submitView);

    mount(this.postBody, this.postContent);
  }

  openSlideshowView(data?: IDataItem[], totalCount?: number) {
    logger.log('Post: openSlideshowView');

    this.postBody.innerHTML = '';

    // fallback to this.data
    data = data || this.data;
    totalCount = totalCount || this.totalCount;

    // reset in case new data was passed
    this.data = data;
    this.totalCount = totalCount;

    const groups = Groups.mapTimelineGroups(data);

    this.postContent = el('.SCPostContent', new Slideshow(groups, totalCount));

    mount(this.postBody, this.postContent);
  }

  close() {
    unmount(this.article, this.el);
    this.closeCallback();
  }
}