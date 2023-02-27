import { mount } from 'redom';

import { IPotentialLink } from '../types';

import Agent from './agent';

import Link from "../components/link";

import logger from '../utils/logger';
import config from '../utils/config';
import { timeDelay } from '../utils/helpers';

export default class TwitterAgent extends Agent {

  bodyObserver: MutationObserver
  contentObserver: MutationObserver
  mainObserver: MutationObserver

  contentBody: HTMLElement
  listBody: Element
  mainBody: Element
  rootBody: HTMLElement
  rootID: string

  contentInterval: NodeJS.Timeout

  constructor() {
    logger.log('TwitterAgent: constructor');

    super();

    this.providerType = config.agents.twitter.providerType;
    this.rootID = config.agents.twitter.rootID;
  }

  start() {
    logger.log('TwitterAgent: start');

    super.start();

    this.contentObserver = null;
    this.bodyObserver = null;

    this.rootBody = document.getElementById(this.rootID);

    this.bodyObserver = new MutationObserver(this.onBodyChange.bind(this));
    this.bodyObserver.observe(this.rootBody, {
      childList: true,
      subtree: true
    });
  }

  onBodyChange() {
    logger.log('TwitterAgent: onBodyChange');

    // We need to locate main > div for simple child observering
    this.mainBody = this.rootBody.querySelector(`main > div`);

    if (this.mainBody) {
      this.bodyObserver.disconnect();
      this.startMainObserver();
    }
  }

  startMainObserver() {
    logger.log('TwitterAgent: startMainObserver');

    this.mainObserver = new MutationObserver(this.mainBodyChange.bind(this))
    this.mainObserver.observe(this.mainBody, {
      childList: true
    });
  }

  mainBodyChange() {
    logger.log('TwitterAgent: mainBodyChange');

    if (this.contentInterval)
      clearInterval(this.contentInterval);

    if (this.contentObserver)
      this.stopContentObserver();

    this.contentInterval = setInterval(() => {
      this.startContentObserver();

      if (this.contentObserver)
        clearInterval(this.contentInterval);
    }, 1000);
  }

  startContentObserver() {
    logger.log('TwitterAgent: startContentObserver');

    this.listBody = document.querySelector(`div[data-testid="primaryColumn"]`);

    if (!this.listBody)
      return;

    this.onDomChange();

    this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
    this.contentObserver.observe(this.listBody, {
      childList: true,
      subtree: true
    });
  }

  stopContentObserver() {
    logger.log('TwitterAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;

    this.clearActiveLinks();
  }

  async findLinks(records?: MutationRecord[], delay?: boolean) {
    logger.log('TwitterAgent: findLinks');

    if (delay || !records)
      await timeDelay(500);

    let links: Link[] = [];
    let potentialLinks: IPotentialLink[] = [];

    if (records) { // check newly added nodes for potential links
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          if (addedNode.querySelector && typeof addedNode.querySelector === 'function' && !addedNode.classList.contains('SCbuttonWrapper'))  // all addedNodes are object as type, but can also come in as string, hacky this is..
            potentialLinks = potentialLinks.concat(this.getPotentialLinksFromElement(addedNode));
        });
      })
    } else if (this.listBody) { // default to listBody
      logger.log('TwitterAgent: findLinks - default to listBody');
      potentialLinks = this.getPotentialLinksFromElement(this.listBody);
    }

    potentialLinks.forEach((potentialLink: IPotentialLink) => {
      links.push(new Link(
        this,
        potentialLink
      ));
    });

    return links;
  }

  appendLink(link: Link) {
    logger.log('TwitterAgent: appendLink');

    link.preparetBaseHTML();

    if (link.isDialog)
      mount(link.wrapper, link, link.wrapper.lastElementChild);
    else
      mount(link.wrapper.firstChild, link);
  }

  getPotentialLinksFromElement(addedNode: Element): IPotentialLink[] {
    logger.log('TwitterAgent: getPotentialLinksFromElement');

    const potentials: IPotentialLink[] = [];
    const articles: NodeListOf<HTMLElement> = addedNode.querySelectorAll('article[data-testid="tweet"]');

    for (let a = 0; a < articles.length; a++) {
      const article: HTMLElement = articles[a];
      const elements: string[] = Array.from(article.querySelectorAll('a[target="_blank"]'))
        .map((item: HTMLAnchorElement) => item.href);

      const nestedElements = Array.from(article.querySelectorAll('[data-testid="tweetText"]'));

      if (nestedElements.length > 1) {
        for (let n = 0; n < nestedElements.length; n++) {
          const nestedElement: HTMLElement = nestedElements[n] as HTMLElement;
          const nestedLink: HTMLElement = nestedElement.querySelector('[dir="ltr"]');

          if (nestedLink) {
            const firstChild: HTMLElement = nestedLink.firstChild as HTMLElement;

            if (firstChild.textContent === 'http://' || firstChild.textContent === 'https://') {
              elements.push(nestedLink.textContent)
            }
          }
        }
      }

      for (let i = 0; i < elements.length; i++) {
        const href: string = elements[i];
        const url: URL = new URL(href);
        const linksToTwitter: Boolean = url.host.includes('twitter.com');

        if (linksToTwitter)
          continue;

        const wrapperNode: HTMLElement = article.querySelector('div[role="group"]');

        if (!wrapperNode)
          continue;

        if (wrapperNode.querySelector('.SCDialog'))
          continue;

        potentials.push({
          href,
          wrapperNode,
          article
        });

        article.classList.add(config.defaults.processedClass);

        break; // we only want to identify 1 link per article
      }
    }

    return potentials;
  }
}