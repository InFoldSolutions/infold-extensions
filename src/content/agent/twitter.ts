import { mount } from 'redom';

import { IPotentialLink } from '../../shared/types';

import Agent from './agent';

import Link from "../../shared/components/link";

import logger from '../../shared/utils/logger';
import config from '../../shared/utils/config';
import { timeDelay } from '../../shared/utils/helpers';

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
    } else 
      logger.warn('TwitterAgent: onBodyChange - mainBody not found');
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
        this.providerType,
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
      mount(link.wrapper, link);
  }

  getPotentialLinksFromElement(addedNode: Element): IPotentialLink[] {
    logger.log('TwitterAgent: getPotentialLinksFromElement');

    const potentials: IPotentialLink[] = [];
    const articles: NodeListOf<HTMLElement> = addedNode.querySelectorAll('article[data-testid="tweet"]');

    for (let a = 0; a < articles.length; a++) {
      const article: HTMLElement = articles[a];

      if (article.classList.contains(config.defaults.processedClass))
        continue;

      const elements: string[] = [];
      const cardLink: HTMLAnchorElement = article.querySelector('[data-testid="card.wrapper"] a[target="_blank"]');

      if (cardLink)
        elements.push(cardLink.href)
      else {
        const notesLink: HTMLAnchorElement = article.querySelector('[data-testid="birdwatch-pivot"] a[target="_blank"]');

        if (notesLink)
          elements.push(notesLink.href)
      }

      if (elements.length === 0) {
        const nestedElements = Array.from(article.querySelectorAll('[data-testid="tweetText"]'));
        let textLength: number = 0;

        if (nestedElements.length > 0) {
          for (let n = 0; n < nestedElements.length; n++) {
            const nestedElement: HTMLElement = nestedElements[n] as HTMLElement;
            const textLink: HTMLAnchorElement = nestedElement.querySelector('a[target="_blank"]');

            if (textLink)
              elements.push(textLink.href);

            if (elements.length === 0) {
              const nestedLinks: HTMLElement[] = Array.from(nestedElement.querySelectorAll('[dir="ltr"]'));

              textLength += nestedElement.textContent.length;

              if (nestedLinks.length > 0) {

                for (let i = 0; i < nestedLinks.length; i++) {
                  const nestedLink: HTMLElement = nestedLinks[i] as HTMLElement;
                  const firstChild: HTMLElement = nestedLink.firstChild as HTMLElement;

                  if (firstChild.textContent === 'http://' || firstChild.textContent === 'https://') {
                    const linkText: string = nestedLink.textContent;
                    elements.push(linkText.replace('…', ''));
                    break;
                  }
                }
              }
            }
          }
        }
      }

      article.classList.add(config.defaults.processedClass);

      const wrapperNode: HTMLElement = article.querySelector('div[role="group"]');

      if (!wrapperNode)
        continue;

      if (wrapperNode.querySelector('.SCDialog'))
        continue;

      if (elements.length === 0) 
        continue;

      for (let i = 0; i < elements.length; i++) {
        const href: string = elements[i];

        if (!/http|https/.test(href)) 
          continue;

        const url: URL = new URL(href);

        if (config.defaults.blacklistedDomains.includes(url.host)) 
          continue;
          
        potentials.push({
          href,
          wrapperNode,
          article
        });

        break; // we only want to identify 1 link per article
      }
    }

    return potentials;
  }
}