import * as path from 'path';

import { mount } from 'redom';

import BaseAgent from './base';

import Link, { IPotentialLink } from "../components/link";

import logger from '../utils/logger';
import config from '../utils/config';

import { findParentByAttribute, findParentByCls } from '../utils/helpers';
import { isPostPage } from '../utils/reddit';

export default class RedditAgent extends BaseAgent {

  postObserver: MutationObserver
  pageObserver: MutationObserver
  contentWrapperObserver: MutationObserver
  contentObserver: MutationObserver

  providerType: string
  contentBodyClass: string
  contentWrapperClass: string
  outboundLinkClass: string
  postWrapperID: string
  pageWrapperID: string

  pageWrapper: HTMLElement
  postWrapper: HTMLElement
  contentBody: HTMLElement

  constructor() {
    logger.log('RedditAgent: constructor');

    super();

    this.providerType = config.agents.reddit.providerType;

    this.outboundLinkClass = 'styled-outbound-link';
    this.contentWrapperClass = '_1OVBBWLtHoSPfGCRaPzpTf';
    this.contentBodyClass = config.agents.reddit.contentClass;
    this.postWrapperID = 'SHORTCUT_FOCUSABLE_DIV';
    this.pageWrapperID = 'AppRouter-main-content';
  }

  start() {
    logger.log('RedditAgent: start');

    super.start();

    this.pageWrapper = document.getElementById(this.pageWrapperID);

    this.pageObserver = new MutationObserver(this.onPageChange.bind(this));
    this.pageObserver.observe(this.pageWrapper, {
      childList: true
    });

    this.postWrapper = document.getElementById(this.postWrapperID);

    this.postObserver = new MutationObserver(this.onPostChange.bind(this));
    this.postObserver.observe(this.postWrapper, {
      childList: true
    });

    const contentWrapper: HTMLElement = document.querySelector(`.${this.contentWrapperClass}`);

    if (contentWrapper)
      this.startContentWrapperObserver(contentWrapper);

    const contentBody: HTMLElement = document.querySelector(`.${this.contentBodyClass}`);

    if (contentBody)
      this.startContentObserver(contentBody);
  }

  onPageChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onPageChange');

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {

          let contentBody: HTMLElement;

          const contentWrapper: HTMLElement = addedNode.querySelector(`.${this.contentWrapperClass}`);

          if (contentWrapper) {
            contentBody = addedNode.querySelector(`.${this.contentBodyClass}`);
          }

          if (contentWrapper) {
            this.startContentWrapperObserver(contentWrapper);
          }

          if (contentBody) {
            this.startContentObserver(contentBody);
          }
        });
      });
    }
  }

  onPostChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onPostChange');

    /*records.forEach((record: MutationRecord) => {
      record.addedNodes.forEach((addedNode: Element) => {
        console.log('onPostChange addedNode', addedNode);
      })
    });*/

    if (isPostPage()) {
      super.onDomChange(records, true);
    } /*else {
      const contentWrapper: HTMLElement = this.pageWrapper.querySelector('.' + this.contentWrapperClass);
      this.startContentWrapperObserver(contentWrapper);
    }*/
  }

  startContentWrapperObserver(contentWrapper: HTMLElement) {
    logger.log('RedditAgent: startContentWrapperObserver');

    if (this.contentWrapperObserver)
      this.stopContentWrapperObserver();

    this.contentWrapperObserver = new MutationObserver(this.contentWrapperChange.bind(this))
    this.contentWrapperObserver.observe(contentWrapper, {
      childList: true
    });
  }

  stopContentWrapperObserver() {
    logger.log('RedditAgent: stopContentWrapperObserver');

    this.contentWrapperObserver.disconnect();
    this.contentWrapperObserver = null;
  }

  contentWrapperChange(records: MutationRecord[]) {
    logger.log('RedditAgent: contentWrapperChange');

    records.forEach((record: MutationRecord) => {
      record.addedNodes.forEach((addedNode: Element) => {
        let contentBody: HTMLElement;

        if (addedNode.classList.contains(this.contentBodyClass)) {
          contentBody = addedNode as HTMLElement;
        } else {
          contentBody = addedNode.querySelector(`.${this.contentBodyClass}`);
        }

        if (contentBody) {
          this.startContentObserver(contentBody);
        }
      });
    });
  }

  stopContentObserver() {
    logger.log('RedditAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;
    this.contentBody = null;
  }

  startContentObserver(contentBody: HTMLElement) {
    logger.log('RedditAgent: startContentObserver');

    if (this.contentObserver)
      this.stopContentObserver();

    this.contentBody = contentBody;
    this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
    this.contentObserver.observe(this.contentBody, {
      childList: true
    });

    super.onDomChange();
  }

  async findLinks(records?: MutationRecord[], delay?: boolean) {
    logger.log('RedditAgent: findLinks');

    if (delay || !records)
      await this.delayInitialLinkCheck();

    const links: Link[] = [];

    let potentialLinks: IPotentialLink[] = [];

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          potentialLinks = potentialLinks.concat(
            this.getPotentialLinksFromElement(addedNode as HTMLElement)
          );
        });
      });
    } else if (this.contentBody) {
      potentialLinks = this.getPotentialLinksFromElement(this.contentBody);
    }

    potentialLinks.forEach((potentialLink: IPotentialLink) => {
      links.push(new Link(
        this.providerType,
        potentialLink
      ));
    });

    return links;
  }

  appendLink(link: Link) {
    logger.log('RedditAgent: appendLink');

    link.preparetBaseHTML();

    // mounting can differ based on agent
    mount(link.wrapper, link, link.wrapper.firstElementChild.nextElementSibling);
  }

  getPotentialLinksFromElement(element: HTMLElement) {
    logger.log('RedditAgent: getPotentialLinksFromElement');

    const potentials = Array.from(
      element.getElementsByClassName('styled-outbound-link')
    );

    return potentials.filter((potential: HTMLAnchorElement) => {
      const url: URL = new URL(potential.href);
      const extension: string = path.extname(url.pathname);
      const isProcessed = potential.classList.contains(config.defaults.processedClass);

      return (!isProcessed && !url.host.includes('reddit') && (!extension || extension === '.html'));
    }).map((potential: HTMLAnchorElement) => {
      const article: HTMLElement = findParentByAttribute(potential, 'data-testid', 'post-container');
      const wrapperNode: HTMLElement = article.querySelector('._3-miAEojrCvx_4FQ8x3P-s');

      potential.classList.add(config.defaults.processedClass);

      return {
        element: potential,
        wrapperNode,
        article
      }
    });
  }

  delayInitialLinkCheck() {
    logger.log('RedditAgent: delayInitialLinkCheck');
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}