import { el, unmount, mount } from 'redom';

import logger from '../../utils/logger';
import config from '../../utils/config';

import events from '../../services/events';

import Slideshow from '../slideshow/slideshow';
import Groups from '../slideshow/groups';

import TopHeadlines from '../headlines';
import SubmitView from '../view/submit';
import SettingsView from '../view/settings';

import { IDataItem, ISourceGroup } from '../../types';
import Topic from '../view/topic';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  titleText?: HTMLElement
  titleIcon?: HTMLElement
  linkElement: HTMLElement

  title?: HTMLElement
  dialogBody: HTMLElement
  dialogContent: HTMLElement

  slideshow: Slideshow

  headlines: boolean
  agent: string
  totalCount: number

  closeCallback: Function

  data: IDataItem[]
  meta: any

  openSubmitViewBind: EventListener
  openSettingsViewBind: EventListener
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
    this.openSettingsViewBind = this.openSettingsView.bind(this);
    this.updateBind = this.update.bind(this);

    events.on('openSubmitView', this.openSubmitViewBind);
    events.on('openSettingsView', this.openSettingsViewBind);
    events.on('updateDialog', this.updateBind); // default slideshow view, should probably be renamed
  }

  offEvents() {
    logger.log('Dialog: offEvents');

    events.off('openSubmitView', this.openSubmitViewBind);
    events.off('openSettingsView', this.openSettingsViewBind);
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

    this.updateTitle('Submit Article', 'fa-arrow-alt-circle-right');

    this.dialogContent = el('.SCDialogContent', new SubmitView());

    mount(this.dialogBody, this.dialogContent);
  }

  openSettingsView() {
    logger
      .log('Dialog: openSettingsView');

    if (this.dialogContent)
      unmount(this.dialogBody, this.dialogContent);

    this.dialogBody.innerHTML = '';

    this.updateTitle('Site Status', 'fa-arrow-alt-circle-right');

    this.dialogContent = el('.SCDialogContent', new SettingsView(this.meta));

    mount(this.dialogBody, this.dialogContent);
  }

  openTopicView() {
    logger
      .log('Dialog: openTopicView');

    if (this.dialogContent)
      unmount(this.dialogBody, this.dialogContent);

    this.dialogBody.innerHTML = '';

    this.updateTitle('Topic', 'fa-arrow-alt-circle-right');

    this.dialogContent = el('.SCDialogContent', new Topic(config.mockData.topic));

    mount(this.dialogBody, this.dialogContent);
  }

  update(data?: IDataItem[], meta?: any) {
    logger
      .log('Dialog: update');

    let totalCount: number = meta?.total_results || 0;

    if (this.dialogContent)
      unmount(this.dialogBody, this.dialogContent);

    this.dialogBody.innerHTML = '';

    // fallback to this
    meta = meta || this.meta;
    data = data || this.data;
    totalCount = totalCount || this.totalCount;

    // reset in case new data was passed
    this.meta = meta;
    this.data = data;
    this.totalCount = totalCount;

    this.updateTitle('Related Articles', 'fa-stream');

    const groups: ISourceGroup[] = Groups.mapToSourceGroups(data);

    this.slideshow = new Slideshow(groups, totalCount);

    if (this.headlines) 
      this.dialogContent = el('.SCDialogContent', [this.slideshow, new TopHeadlines(groups)])
    else 
      this.dialogContent = el('.SCDialogContent', this.slideshow);

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

  updateTitle(text: string, icon: string) {
    logger.log('Dialog: updateTitleText');

    if (this.titleText)
      this.titleText.innerText = text;

    if (icon === 'fa-stream' && this.data && this.data.length > 0) {
      if (this.titleIcon) {
        this.titleIcon.classList.remove('fa-arrow-alt-circle-right');
        this.titleIcon.classList.add(icon);
      }
    } else if (icon === 'fa-arrow-alt-circle-right' && this.data && this.data.length > 0) {
      if (this.titleIcon) {
        this.titleIcon.classList.remove('fa-stream');
        this.titleIcon.classList.add(icon);
      }
    } else if (this.titleIcon) {
      this.titleIcon.remove();
    }
  }
}