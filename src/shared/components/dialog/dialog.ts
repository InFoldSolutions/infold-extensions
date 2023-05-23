import { el, unmount, mount } from 'redom';

import logger from '../../utils/logger';

import events from '../../services/events';

import Slideshow from '../slideshow/slideshow';
import Groups from '../slideshow/groups';

import TopHeadlines from '../headlines';
import SubmitView from '../view/submit';

import { IDataItem, ISourceGroup } from '../../types';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  linkElement: HTMLElement

  dialogBody: HTMLElement
  dialogContent: HTMLElement

  submitView: SubmitView
  slideshow: Slideshow
  topHeadlines: TopHeadlines

  headlines: boolean
  agent: string
  totalCount: number

  closeCallback: Function

  data: IDataItem[]

  openSubmitViewBind: EventListener
  updateBind: EventListener

  constructor(agent?: string, article?: HTMLElement, btnWrapper?: HTMLElement, linkElement?: HTMLElement, closeCallback?: Function) {
    logger.log('Dialog: constructor');

    if (closeCallback)
      this.closeCallback = closeCallback;
    if (linkElement)
      this.linkElement = linkElement;

    this.btnWrapper = btnWrapper;
    this.agent = agent;
    this.article = article;

    // Start listening for events
    this.onEvents();
  }

  onEvents() {
    logger.log('Dialog: onEvents');

    this.openSubmitViewBind = this.openSubmitView.bind(this);
    this.updateBind = this.update.bind(this);

    events.on('openSubmitView', this.openSubmitViewBind);
    events.on('updateDialog', this.updateBind); // default slideshow view, should probably be renamed
  }

  offEvents() {
    logger.log('Dialog: offEvents');

    events.off('openSubmitView', this.openSubmitViewBind);
    events.off('updateDialog', this.updateBind);
  }

  open() {
    logger
      .log('Dialog: open')
  }

  openSubmitView() {
    logger
      .log('Dialog: openSubmitView');

    if (this.dialogContent)
      unmount(this.dialogBody, this.dialogContent);

    this.dialogBody.innerHTML = '';

    this.submitView = new SubmitView();
    
    this.dialogContent = el('.SCDialogContent', this.submitView);

    mount(this.dialogBody, this.dialogContent);
  }

  update(data?: IDataItem[], totalCount?: number) {
    logger
      .log('Dialog: update');

    if (this.dialogContent)
      unmount(this.dialogBody, this.dialogContent);

    this.dialogBody.innerHTML = '';

    // fallback to this.data
    data = data || this.data;
    totalCount = totalCount || this.totalCount;

    // reset in case new data was passed
    this.data = data;
    this.totalCount = totalCount;

    const groups: ISourceGroup[] = Groups.mapToSourceGroups(data);

    this.slideshow = new Slideshow(groups, totalCount);

    if (this.headlines) {
      this.topHeadlines = new TopHeadlines(groups);
      this.dialogContent = el('.SCDialogContent', [this.slideshow, this.topHeadlines])
    } else {
      this.dialogContent = el('.SCDialogContent', this.slideshow);
    }

    mount(this.dialogBody, this.dialogContent);
  }

  close() {
    logger.log('Dialog: close');

    this.offEvents();

    if (this.closeCallback)
      this.closeCallback();

    unmount(this.parent, this.el);

    if (this.slideshow)
      this.slideshow.destroy();
  }
}