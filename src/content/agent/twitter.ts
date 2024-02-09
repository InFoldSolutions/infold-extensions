import { mount } from 'redom';

import { IPotentialLink, ILinkElement } from '../../shared/types';

import Agent from './agent';
import Observer from '../observer';

import Link from "../../shared/components/link";

import logger from '../../shared/utils/logger';
import config from '../../shared/utils/config';
import { isPostPage, timeDelay } from '../../shared/utils/helpers';

export default class TwitterAgent extends Agent {

  contentObserver: Observer
  mainObserver: Observer

  constructor() {
    logger.log('TwitterAgent: constructor');
    super();

    this.providerType = config.agents.twitter.providerType;
  }

  async start() {
    logger.log('TwitterAgent: start');
    super.start();

    this.mainObserver = new Observer('main > div', document.body, this.mainBodyChange.bind(this));
    await this.mainObserver.start();

    logger.log('Main Observer started');
    this.mainBodyChange();
  }

  async stop() {
    logger.log('TwitterAgent: stop');

    this.mainObserver.disconnect();

    if (this.contentObserver)
      this.stopContentObserver();

    super.stop();
  }

  async mainBodyChange() {
    logger.log('TwitterAgent: mainBodyChange');

    if (this.contentObserver)
      this.stopContentObserver();

    this.contentObserver = new Observer(`div[data-testid="primaryColumn"]`, this.mainObserver.element, this.onDomChange.bind(this), true);
    await this.contentObserver.start();

    logger.log('Content Observer started');
    this.onDomChange();
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
    } else if (this.contentObserver.element) {
      logger.log('TwitterAgent: findLinks - default to this.contentObserver.element');
      potentialLinks = this.getPotentialLinksFromElement(this.contentObserver.element);
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

      const elements: ILinkElement[] = [];
      const cardLink: HTMLAnchorElement = article.querySelector('[data-testid="card.wrapper"] a[target="_blank"]');

      if (cardLink) {
        elements.push({
          href: cardLink.href,
          text: cardLink.innerText
        })
      } else {
        const notesLink: HTMLAnchorElement = article.querySelector('[data-testid="birdwatch-pivot"] a[target="_blank"]');

        if (notesLink) {
          elements.push({
            href: notesLink.href,
            text: notesLink.innerText
          })
        }
      }

      if (elements.length === 0) {
        const nestedElements = Array.from(article.querySelectorAll('[data-testid="tweetText"], [role="link"]'));
        let textLength: number = 0;

        if (nestedElements.length > 0) {
          for (let n = 0; n < nestedElements.length; n++) {
            const nestedElement: HTMLElement = nestedElements[n] as HTMLElement;
            const textLink: HTMLAnchorElement = nestedElement.querySelector('a[target="_blank"]');

            if (textLink) {
              elements.push({
                href: textLink.href,
                text: textLink.innerText
              });
            }

            if (elements.length === 0) {
              const nestedLinks: HTMLElement[] = Array.from(nestedElement.querySelectorAll('[dir="ltr"]'));

              textLength += nestedElement.textContent.length;

              if (nestedLinks.length > 0) {

                for (let i = 0; i < nestedLinks.length; i++) {
                  const nestedLink: HTMLElement = nestedLinks[i] as HTMLElement;
                  const firstChild: HTMLElement = nestedLink.firstChild as HTMLElement;

                  if (firstChild.textContent === 'http://' || firstChild.textContent === 'https://') {
                    const linkText: string = nestedLink.textContent;
                    elements.push({
                      href: linkText.replace('…', ''),
                      text: linkText.replace('…', '')
                    });
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

      if (elements.length === 0) {
        potentials.push({
          href: null,
          wrapperNode,
          article
        });
        continue;
      }

      for (let i = 0; i < elements.length; i++) {
        const item: ILinkElement = elements[i];

        // ts-ignore
        potentials.push({
          href: item.href,
          linkText: item.text,
          wrapperNode,
          article
        });

        break; // we only want to identify 1 link per article
      }
    }

    return potentials;
  }
}