import { el, unmount } from 'redom';
//import retry from 'async-retry';

import Agent from '../agent/agent';
import { IDataItem, IPotentialLink } from '../types';
import config from '../utils/config';

import { isPostPage } from '../utils/helpers';
import logger from '../utils/logger';

import RedditDialog from './dialog/reddit';
import TwitterDialog from './dialog/twitter';

import Post from './post';
import { transformSource } from '../transformers/source';
import transformArticle from '../transformers/article';

export default class Link {

  agent: Agent

  status: string
  href: string

  relatedCount: number

  active: boolean

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

  constructor(agent: Agent, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.agent = agent;
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
      const res = await fetch(`${config.api.url}/meta`, {
        method: 'POST',
        headers: config.api.headers,
        body: JSON.stringify({
          url: this.href,
          similarity: config.api.similarity,
        })
      });

      const data = await res.json();

      if (!data || !data.meta || data.meta.success === false)
        throw new Error('No data');

      if (config.failedStatus.includes(data.meta.status))
        throw new Error('Failed status');

      if (config.retryStatus.includes(data.meta.status))
        throw new Error('Re-try');

      if (data.meta.status !== 'analyzed' || data.meta.total_results === 0)
        throw new Error('No results');

      this.relatedCount = data.meta.total_results;

      this.setStatus('success');
      this.el.classList.add('SCHasResults');

      if (this.countEl)
        this.countEl.innerHTML = this.relatedCount.toString();

      if (this.textEl)
        this.textEl.innerHTML = 'Related';
    } catch (error) {
      logger.error('Error while fetching data');

      this.setStatus('error');
      this.countEl.innerHTML = '0';
      this.destroy();
    }

    if (callback)
      callback(this, index);
  }

  setStatus(status: string) { // TODO: Make this a ENUM
    logger.log('Link: setStatus');

    this.status = status;
  }

  async getData() {
    logger.log('Link: getData');

    const res = await fetch(`${config.api.url}?limit=${config.api.maxRelatedArticles}`, {
      method: 'POST',
      headers: config.api.headers,
      body: JSON.stringify({
        url: this.href,
        similarity: config.api.similarity,
      })
    });

    const response = await res.json();

    if (!response || !response.data || response.data.length === 0)
      throw new Error('No data');

    this.data = response.data
      .filter((item: any) => item.source.parser) // filter out sources that don't have a parser
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
        el(`i.far.fa-lightbulb-on`)
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

    this.el = el(`.SCbuttonWrapper.${this.agent.providerType}.${btnWrapperClass}`, buttonContent);
    this.el.onclick = this.onClickHandler;
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

    if (this.agent.providerType === 'twitter')
      this.article.style.flexWrap = 'wrap';

    if (this.post) {
      this.post.close();
      return;
    }

    this.post = new Post(
      this.agent.providerType,
      this.article,
      this.wrapper,
      this.el,
      this.closePost.bind(this)
    );

    this.toggleActiveState();

    try {
      await this.getData();
      this.post.update(this.data, this.relatedCount);
    } catch (error) {
      logger.error(`Error while fetching data ${error}`);
      this.post.close();
    }
  }

  async openDialog() {
    logger.log('Link: openDialog');

    this.agent.clearOpenDialogs();

    if (this.dialog) {
      this.dialog.close();
      return;
    }

    let Dialog;

    switch (this.agent.providerType) {
      case 'reddit':
        Dialog = RedditDialog;
        break;
      case 'twitter':
        Dialog = TwitterDialog;
        break;
    }

    this.dialog = new Dialog(
      this.agent.providerType,
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
      logger.error(`Error while fetching data ${error}`);
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

    this.el.removeEventListener('click', this.onClickHandler);
    unmount(this.parent, this.el);
  }

  get isDialog(): boolean {
    return !isPostPage() || isPostPage() && Number(this.article.getAttribute('tabindex')) !== -1;
  }

  get isIconVersion(): boolean {
    switch (this.agent.providerType) {
      case 'reddit':
        return this.isCompactVersion;
      case 'twitter':
        return this.isDialog;
    }
  }

  get isTextVersion(): boolean {
    let isTextOnly: boolean = false;

    switch (this.agent.providerType) {
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