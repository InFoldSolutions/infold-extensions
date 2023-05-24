import { el, unmount } from 'redom';
//import retry from 'async-retry';

import { IDataItem, IPotentialLink } from '../types';
import config from '../utils/config';

import { isPostPage } from '../utils/helpers';
import logger from '../utils/logger';

import RedditDialog from './dialog/reddit';
import TwitterDialog from './dialog/twitter';

import Post from './view/post';
import transformSource from '../transformers/source';
import transformArticle from '../transformers/article';

import events from '../services/events';

export default class Link {

  status: string
  href: string
  providerType: string

  relatedCount: number

  active: boolean
  destroyed: boolean

  wrapper: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  el: HTMLElement
  countEl: HTMLElement
  textEl: HTMLElement

  dialog: RedditDialog | TwitterDialog
  post: Post

  data: IDataItem[]

  onClickHandler: EventListener

  constructor(providerType: string, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.providerType = providerType;
    this.article = potentialLInk.article;
    this.href = potentialLInk.href;
    this.wrapper = potentialLInk.wrapperNode;
    this.parent = this.wrapper; // Could be overwritten down the line

    this.setStatus('pending');
    this.onClickHandler = this.onClick.bind(this);
  }

  async getInfo(callback?: Function, index?: number) {
    logger.log('Link: getInfo');

    try {
      if (!this.href)
        throw new Error('No href');

      const data = await chrome.runtime.sendMessage({ type: "getInfo", href: this.href });

      if (this.destroyed)
        throw new Error('Destroyed');

      if (!data || !data.meta || data.meta.success === false)
        throw new Error('No data');

      if (config.defaults.failedStatus.includes(data.meta.status))
        throw new Error('Failed status');

      if (config.defaults.retryStatus.includes(data.meta.status))
        throw new Error('Re-try');

      if (data.meta.status !== 'analyzed' || data.meta.total_results === 0)
        throw new Error('No results');

      this.relatedCount = data.meta.total_results;
      this.setResults();
    } catch (error) {
      logger.log(`Failed to get info ${error.message}`);

      if (this.destroyed)
        return;

      this.setNoneResults();
    }

    if (callback)
      callback(this, index);
  }

  setStatus(status: string) { // TODO: Make this a ENUM
    logger.log('Link: setStatus');

    this.status = status;
  }

  async getData(maxArticleCount: number = config.api.maxArticleCount) {
    logger.log('Link: getData');

    const response = await chrome.runtime.sendMessage({ type: "getData", href: this.href, maxArticleCount });

    if (!response || !response.data || response.data.length === 0)
      throw new Error('No data');

    this.data = response.data
      .filter((item: any) => item.source.logo) // filter out sources that don't have a parser
      .map((item: any) => {
        return {
          source: transformSource(item.source),
          articles: item.articles.map((article: any) => transformArticle(article))
        }
      });
  }

  preparetBaseHTML() {
    logger.log('Link: preparetBaseHTML');

    const buttonContent: Array<HTMLElement> = [];
    const textContent: Array<HTMLElement> = [];

    let btnWrapperClass: string = (this.isDialog) ? 'SCDialog' : 'SCPost';

    if (!this.isTextVersion && !this.isTextCompactVersion) {
      buttonContent.push(el(`span.SCIconWrapper`, [
        el('span.SCiconBackground'),
        el(`i.fad.fa-lightbulb-on`)
      ]));
    }

    if (this.isTextCompactVersion)
      btnWrapperClass += '.TextCompact';

    this.countEl = el('span.SCcount', el('span.SCLoader'));
    textContent.push(this.countEl);

    if (!this.isIconVersion) {
      this.textEl = el('span.SCtext');
      textContent.push(this.textEl);
    }

    buttonContent.push(el(`span.SCTextWrapper`, textContent));

    this.el = el(`.SCbuttonWrapper.${this.providerType}.${btnWrapperClass}`, buttonContent);
    this.el.onclick = this.onClickHandler;
  }

  setResults() {
    logger.log('Link: setResults');

    this.setStatus('success');
    this.el.classList.add('SCHasResults');

    if (this.countEl)
      this.countEl.innerHTML = this.relatedCount.toString();

    if (this.textEl)
      this.textEl.innerHTML = 'Related';

    /*const iconWrapper = this.el.querySelector('.SCIconWrapper');

    if (iconWrapper) {
      //iconWrapper.querySelector('i').classList.remove('fa-lightbulb-on');
      //iconWrapper.querySelector('i').classList.add('fa-lightbulb');
    }*/
  }

  setNoneResults() {
    logger.log('Link: setNoneResults');

    this.setStatus('none');
    this.el.classList.add('SCNoResults');

    const textWrapper = this.el.querySelector('.SCTextWrapper');

    if (textWrapper)
      unmount(textWrapper, this.countEl);

    const iconWrapper = this.el.querySelector('.SCIconWrapper');

    if (iconWrapper) {
      iconWrapper.querySelector('i').classList.remove('fa-lightbulb-on');
      iconWrapper.querySelector('i').classList.add('fa-lightbulb-slash');
    }
  }

  onClick(evt: MouseEvent) {
    logger.log('Link: onClick');

    evt.preventDefault();
    evt.stopPropagation();

    if (this.isDialog)
      this.openDialog();
    else
      this.togglePostView();
  }

  async togglePostView() {
    logger.log('Link: togglePostView');

    if (this.providerType === 'twitter')
      this.article.style.flexWrap = 'wrap';

    if (this.post) {
      this.post.close();
      return;
    }

    this.post = new Post(
      this.providerType,
      this.article,
      this.wrapper,
      this.el,
      this.closePost.bind(this)
    );

    this.toggleActiveState();

    try {
      await this.getData(20);
      this.post.update(this.data, this.relatedCount);
    } catch (error) {
      logger.error(`Failed to update post view ${error}`);
      this.post.close();
    }
  }

  async openDialog() {
    logger.log('Link: openDialog');

    events.emit('clearOpenDialogs');

    if (this.dialog) {
      this.dialog.close();
      return;
    }

    let Dialog;

    switch (this.providerType) {
      case 'reddit':
        Dialog = RedditDialog;
        break;
      case 'twitter':
        Dialog = TwitterDialog;
        break;
    }

    this.dialog = new Dialog(
      this.providerType,
      this.article,
      this.wrapper,
      this.el,
      this.closeDialog.bind(this)
    );

    this.toggleActiveState();

    try {
      await this.getData();
      this.dialog.update(this.data, this.relatedCount);
    } catch (error) {
      logger.warn(`Failed to update dialog ${error}`);

      if (this.dialog)
        this.dialog.close();
    }
  }

  closePost() {
    logger.log('Link: closePost');
    this.post = null;

    this.toggleActiveState();
  }

  closeDialog() {
    logger.log('Link: closeDialog');
    this.dialog = null;

    this.toggleActiveState();
  }

  toggleActiveState() {
    logger.log('toggleActiveState');

    if (this.active) {
      this.active = false;
      this.el.classList.remove('active');
    } else {
      this.active = true;
      this.el.classList.add('active');
    }
  }

  disableLoading() {
    logger.log('Link: disableLoading');
  }

  destroy() {
    logger.log('Link: destroy');

    this.destroyed = true;
    this.article.classList.remove(config.defaults.processedClass);

    if (this.dialog) {
      this.dialog.close();
    }

    if (this.post) {
      this.post.close();
    }

    if (this.el) {
      this.el.removeEventListener('click', this.onClickHandler);
      unmount(this.parent, this.el);
    }
  }

  get isDialog(): boolean {
    return !isPostPage() || isPostPage() && Number(this.article.getAttribute('tabindex')) !== -1;
  }

  get isIconVersion(): boolean {
    switch (this.providerType) {
      case 'reddit':
        return this.isCompactVersion;
      case 'twitter':
        return this.isDialog;
    }
  }

  get isTextVersion(): boolean {
    let isTextOnly: boolean = false;

    switch (this.providerType) {
      case 'twitter':
        return !this.isDialog;
    }

    return isTextOnly;
  }

  get isCompactVersion(): boolean {
    return this.wrapper.classList.contains('_3jwri54NGT-SRatPIZYiMo');
  }

  get isTextCompactVersion(): boolean {
    return this.wrapper.classList.contains('_2IpBiHtzKzIxk2fKI4UOv1');
  }
}