import { el } from 'redom';
import retry from 'async-retry';

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

  active: boolean

  wrapper: HTMLElement
  article: HTMLElement
  el: HTMLElement
  countEl: HTMLElement
  textEl: HTMLElement

  dialog: RedditDialog | TwitterDialog
  post: Post

  data: IDataItem[]

  constructor(agent: Agent, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.agent = agent;
    this.article = potentialLInk.article;
    this.href = potentialLInk.href;
    this.wrapper = potentialLInk.wrapperNode;
    this.status = 'pending';
  }

  async getInfo() {
    logger.log('Link: getInfo');

    this.status = 'processing';

    try {
      const response = await retry(
        async () => {
          // if anything throws, we retry
          const res = await fetch(`${config.api.url}?limit=${config.api.maxRelatedArticles}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              url: this.href,
              similarity: config.api.similarity,
            })
          });

          const data = await res.json();

          if (!data || !data.meta || data.meta.success === false)
            return;

          if (config.failedStatus.includes(data.meta.status))
            return;

          if (config.retryStatus.includes(data.meta.status))
            throw new Error('Re-try');

          if (data.meta.status === 'analyzed' && data.meta.total_results > 0)
            return data;

          return;
        },
        {
          retries: 5,
          maxTimeout: 2000,
          randomize: false
        }
      );

      if (response) {
        const relatedCount: number = response.meta.total_results;

        this.data = response.data.map((item: any) => {
          return {
            source: transformSource(item.source),
            articles: item.articles.map((article: any) => transformArticle(article))
          }
        });

        this.status = 'success';
        this.el.classList.add('SCHasResults');

        if (this.countEl)
          this.countEl.innerHTML = relatedCount.toString();

        if (this.textEl)
          this.textEl.innerHTML = 'Related';
      } else 
        throw new Error('No response');
    } catch (error) {
      logger.error('Error while fetching data');
      this.status = 'error';
      this.countEl.innerHTML = '0';
    }
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
    this.el.setAttribute('title', this.href);
    this.el.onclick = this.onClick.bind(this);
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

  togglePostView() {
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
      this.closePost.bind(this),
      this.data
    );

    this.toggleActiveState();
  }

  openDialog() {
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
      this.closeDialog.bind(this),
      this.data
    );

    this.toggleActiveState();
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