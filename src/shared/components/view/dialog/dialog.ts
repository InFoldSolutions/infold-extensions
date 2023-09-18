import { el, unmount, mount } from 'redom';

import logger from '../../../utils/logger';

import events from '../../../services/events';

import Slideshow from '../../slideshow/slideshow';
import Groups from '../../slideshow/groups';

import TopHeadlines from '../../headlines';
import SubmitView from '../submit';
import SettingsView from '../settings';

import { IDataItem, ISourceGroup, ITopic } from '../../../types';
import Topic from '../topic';

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
  openSlideshowViewBind: EventListener

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
    this.openSlideshowViewBind = this.openSlideshowView.bind(this);

    events.on('openSubmitView', this.openSubmitViewBind);
    events.on('openSettingsView', this.openSettingsViewBind);
    events.on('openSlideshowView', this.openSlideshowViewBind); // default slideshow view, should probably be renamed
  }

  offEvents() {
    logger.log('Dialog: offEvents');

    events.off('openSubmitView', this.openSubmitViewBind);
    events.off('openSettingsView', this.openSettingsViewBind);
    events.off('openSlideshowView', this.openSlideshowViewBind);
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

  openTopicView(topic: ITopic) {
    logger
      .log('Dialog: openTopicView');

    if (this.dialogContent)
      unmount(this.dialogBody, this.dialogContent);

    this.dialogBody.innerHTML = '';

    this.updateTitle('Topic', 'fa-arrow-alt-circle-right');

    this.dialogContent = el('.SCDialogContent', new Topic(topic));

    mount(this.dialogBody, this.dialogContent);
  }

  openSlideshowView(data?: IDataItem[], meta?: any) {
    logger
      .log('Dialog: openSlideshowView');

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

    const groups: ISourceGroup[] = Groups.mapTimelineGroups(data);

    this.slideshow = new Slideshow(groups, totalCount);

    if (this.headlines)
      this.dialogContent = el('.SCDialogContent', [this.slideshow, new TopHeadlines(groups)])
    else
      this.dialogContent = el('.SCDialogContent', this.slideshow);

    mount(this.dialogBody, this.dialogContent);
  }

  setLoadingUI(msg?: string) {
    const loader = [el('div.SCLoader')]

    /*if (msg)
      loader.push(el('div.SCLoaderText', msg));*/

    this.dialogBody = el('.SCDialogBody', el('.SCLoaderWrapper', loader));
  }

  setLoadingMsg(msg: string) {
    const loaderText = this.dialogBody.querySelector('.SCLoaderText')

    if (this.dialogBody && loaderText)
      loaderText.innerHTML = msg;
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