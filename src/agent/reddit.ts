import * as path from 'path';
import { mount } from 'redom';

import { IPotentialLink } from '../types';

import Agent from './agent';

import Link from "../components/link";

import logger from '../utils/logger';
import config from '../utils/config';

import { findParentByAttribute, timeDelay } from '../utils/helpers';
import { isPostPage } from '../utils/helpers';

export default class RedditAgent extends Agent {

  bodyObserver: MutationObserver
  pageObserver: MutationObserver
  contentWrapperObserver: MutationObserver
  contentObserver: MutationObserver

  providerType: string

  contentBodyClass: string
  contentWrapperClass: string
  outboundLinkClass: string
  postWrapperClass: string
  groupWrapperClass: string

  bodyWrapperID: string
  pageWrapperID: string

  pageWrapper: HTMLElement
  bodyWrapper: HTMLElement
  contentBody: HTMLElement
  postBody: HTMLElement

  constructor() {
    logger.log('RedditAgent: constructor');

    super();

    this.providerType = config.agents.reddit.providerType;

    this.outboundLinkClass = 'styled-outbound-link';
    this.contentWrapperClass = '_1OVBBWLtHoSPfGCRaPzpTf';
    this.contentBodyClass = config.agents.reddit.contentClass;
    this.bodyWrapperID = 'SHORTCUT_FOCUSABLE_DIV';
    this.pageWrapperID = 'AppRouter-main-content';
    this.postWrapperClass = 'uI_hDmU5GSiudtABRz_37';
    this.groupWrapperClass = '_3-miAEojrCvx_4FQ8x3P-s';
  }

  start() {
    logger.log('RedditAgent: start');

    super.start();

    this.pageWrapper = document.getElementById(this.pageWrapperID);

    this.pageObserver = new MutationObserver(this.onPageChange.bind(this));
    this.pageObserver.observe(this.pageWrapper, {
      childList: true
    });

    this.bodyWrapper = document.getElementById(this.bodyWrapperID);

    this.bodyObserver = new MutationObserver(this.onBodyChange.bind(this));
    this.bodyObserver.observe(this.bodyWrapper, {
      childList: true
    });

    const contentWrapper: HTMLElement = document.querySelector(`.${this.contentWrapperClass}`);

    if (contentWrapper)
      this.startContentWrapperObserver(contentWrapper);

    const contentBody: HTMLElement = document.querySelector(`.${this.contentBodyClass}`);

    if (contentBody) {
      this.startContentObserver(contentBody);
      return;
    }

    const postBody: HTMLElement = document.querySelector(`.${this.postWrapperClass}`);

    if (postBody) {
      this.postBody = postBody;
      this.onDomChange();
    }
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

  onBodyChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onBodyChange');

    if (isPostPage()) {
      super.onDomChange(records, true);
    }
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
      await timeDelay(500);

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
    } else if (this.postBody) {
      potentialLinks = this.getPotentialLinksFromElement(this.postBody);
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
      const wrapperNode: HTMLElement = article.querySelector(`.${this.groupWrapperClass}`);

      potential.classList.add(config.defaults.processedClass);

      return {
        element: potential,
        wrapperNode,
        article
      }
    });
  }
}