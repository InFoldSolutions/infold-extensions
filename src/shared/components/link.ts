import * as path from 'path';
import { el, unmount } from 'redom';

import { IArticle, ISource, IPotentialLink, ITopic, IDataItem } from '../types';
import config from '../utils/config';

import { isPostPage } from '../utils/helpers';
import logger from '../utils/logger';

import RedditDialog from './view/dialog/reddit';
import TwitterDialog from './view/dialog/twitter';

import Post from './view/post';
import transformSource from '../transformers/source';
import transformArticle from '../transformers/article';
import transformTopic from '../transformers/topic';

import LoaderIcon from './svgs/loaderIcon';

import InfoIconRegular from './svgs/infoIconRegular';
import InfoIcon from './svgs/infoIcon';
import settings from '../services/settings';

export default class Link {

  status: string
  href: string
  linkText: string
  providerType: string

  relatedCount: number

  active: boolean
  clicked: boolean
  destroyed: boolean

  wrapper: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  el: HTMLElement
  countEl: HTMLElement
  textEl: HTMLElement

  dialog: RedditDialog | TwitterDialog
  post: Post

  topic: ITopic
  item: IArticle
  data: IDataItem
  sources: ISource[]

  meta: any

  onClickHandler: EventListener

  constructor(providerType: string, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.providerType = providerType;
    this.article = potentialLInk.article;
    this.href = potentialLInk.href;
    this.linkText = potentialLInk.linkText;
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

      if (!this.isValidURL(this.href))
        throw new Error('URL not valid')

      const data = await chrome.runtime.sendMessage({ type: "getInfo", href: this.href });

      if (this.destroyed)
        throw new Error('Destroyed');

      if (data?.meta?.success === false)
        throw new Error('No data');

      if (!data.item?.url || !this.isValidURL(data.item.url))
        throw new Error('URL not valid')

      this.meta = data.meta;

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

  isValidURL(href: string) {
    logger.log('Link: isValidURL');

    const url: URL = new URL(href)
    const host = url.host.replace('www.', '');
    const extension: string = path.extname(url.pathname);

    let linkText = this.linkText.replace('www.', '')
    linkText = linkText.replace('https://', '')
    linkText = linkText.replace('http://', '')

    if (!config.defaults.supportedProtocols.includes(url.protocol))
      return false
    if (config.defaults.notAllowedExtensions.includes(extension))
      return false
    if (config.defaults.blacklistedDomains.includes(host) || config.defaults.blacklistedDomains.includes(linkText))
      return false
    if (!url.pathname || url.pathname === '/')
      return false

    return true
  }

  setStatus(status: string) { // TODO: Make this a ENUM
    logger.log('Link: setStatus');

    this.status = status;
  }

  async getRelated(maxArticleCount: number = config.api.maxArticleCount) {
    logger.log('Link: getRelated');

    const response = await chrome.runtime.sendMessage({ type: "getRelated", href: this.href, maxArticleCount });

    if (!response || !response.data || response.data.length === 0)
      throw new Error('No data');

    this.meta = response.meta;
    this.item = transformArticle(response.item);
    this.sources = response.data
      .filter((item: any) => item.source.logo) // filter out sources that don't have a parser
      .map((item: any) => {
        return {
          ...transformSource(item.source),
          articles: item.articles.map((article: any) => transformArticle(article))
        }
      });
  }

  async getTopic() {
    logger.log('Link: getTopic');

    const response = await chrome.runtime.sendMessage({ type: "getTopic", href: this.href });

    this.meta = response?.meta;
    this.topic = response?.topic ? transformTopic(response.topic) : null;
  }

  preparetBaseHTML() {
    logger.log('Link: preparetBaseHTML');

    const buttonContent: Array<HTMLElement> = [];
    const textContent: Array<HTMLElement> = [];

    let btnWrapperClass: string = (this.isDialog) ? 'SCDialog' : 'SCDialog.SCPost';

    buttonContent.push(el(`span.SCIconWrapper`, [
      el('span.SCiconBackground'),
      new InfoIcon(this.providerType)
    ]));

    if (!this.isIconVersion) {
      this.textEl = el('span.SCtext');
      textContent.push(this.textEl);

      buttonContent.push(el(`span.SCTextWrapper`, textContent));
    }

    this.el = el(`.SCbuttonWrapper.${this.providerType}.${btnWrapperClass}`, buttonContent);
    this.el.onclick = this.onClickHandler;
  }

  setResults() {
    logger.log('Link: setResults');

    this.setStatus('success');
    this.el.classList.add('SCHasResults');

    if (this.providerType === 'reddit') {
      this.el.classList.remove('text-neutral-content-weak', 'opacity-50');
      this.el.classList.add('text-secondary', 'opacity-100');
    }

    if (this.countEl)
      this.countEl.innerHTML = this.relatedCount.toString();

    if (this.textEl)
      this.textEl.innerHTML = 'Related';
  }

  setNoneResults() {
    logger.log('Link: setNoneResults');

    this.setStatus('none');

    if (this.el) {
      this.el.classList.add('SCNoResults');

      if (this.countEl)
        this.countEl.innerHTML = ''
    }
  }

  onClick(evt: MouseEvent) {
    logger.log('Link: onClick');

    evt.preventDefault();
    evt.stopPropagation();

    if (!this.isValidURL(this.href))
      return

    if (this.isDialog) {
      const linkElement = this.article.querySelector('a[target="_self"]') as HTMLAnchorElement;

      this.clicked = true;

      if (linkElement)
        linkElement.click();
      else
        this.article.click();
    }
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
      const topicLookup = await settings.get('topicLookup');
      logger.log(`Link: topicLookup ${topicLookup}`);

      if (topicLookup) {
        await this.getTopic();

        if (this.topic)
          this.post.openTopicView(this.topic);
      }

      if (!topicLookup || !this.topic) {
        await this.getRelated();

        if (this.item)
          this.post.openArticleView(this.item, this.sources);
      }
    } catch (error) {
      logger.error(`Failed openArticleView in post ${error}`);
      this.post.close();
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

    this.data = null;
    this.relatedCount = 0;
    this.meta = null;
  }

  get isDialog(): boolean {
    return !isPostPage() || (isPostPage() && Number(this.article.getAttribute('tabindex')) !== -1 && this.providerType === 'twitter');
  }

  get isIconVersion(): boolean {
    switch (this.providerType) {
      case 'reddit':
        return true;
      case 'twitter':
        return true;
    }
  }

  get isTextVersion(): boolean {
    let isTextOnly: boolean = false;

    switch (this.providerType) {
      case 'twitter':
        return false;
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