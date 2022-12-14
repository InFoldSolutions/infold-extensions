import * as path from 'path';

import { mount, el } from 'redom';

import BaseAgent from './base';

import Link, { IPotentialLink } from "../components/link";
import RedditDialog from '../components/dialog/reddit';

import logger from '../utils/logger';
import config from '../utils/config';

import { getParentByCls } from '../utils/helpers';

export default class RedditAgent extends BaseAgent {

  postObserver: MutationObserver
  pageObserver: MutationObserver
  contentObserver: MutationObserver

  providerType: string

  linkClasses: string[]
  wrapperClass: string
  buttonClasses: string[]
  textClasses: string[]

  contentBodyClass: string
  postWrapperID: string
  pageWrapperID: string

  pageWrapper: HTMLElement
  postWrapper: HTMLElement
  contentBody: HTMLElement

  // from link this reference (stupid I know)
  article: HTMLElement
  wrapper: HTMLElement
  agent: string

  dialog: RedditDialog

  constructor() {
    logger.log('RedditAgent: constructor');

    super();

    this.providerType = config.agents.reddit.providerType;
    this.linkClasses = config.agents.reddit.linkClasses;
    this.wrapperClass = config.agents.reddit.wrapperClass;
    this.buttonClasses = config.agents.reddit.buttonClasses;
    this.textClasses = config.agents.reddit.textClasses;

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

    this.contentBody = document.querySelector('.' + this.contentBodyClass);

    if (this.contentBody)
      this.startContentObserver();
  }

  onPageChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onPageChange');

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          console.log('onPageChange addedNone', addedNode);
        });
      });
    }
  }

  onPostChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onPostChange');

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          console.log('onPostChange addedNone', addedNode);
        });
      });
    }
  }

  stopContentObserver() {
    logger.log('RedditAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;
    this.contentBody = null;
  }

  startContentObserver() {
    logger.log('RedditAgent: startContentObserver');
    this.contentObserver = null;

    if (!this.contentBody)
      this.contentBody = document.querySelector('.' + this.contentBodyClass);

    this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
    this.contentObserver.observe(this.contentBody, {
      childList: true
    });

    super.onDomChange();
  }

  findLinks(records?: MutationRecord[]) {
    logger.log('RedditAgent: findLinks');

    let links: Link[] = [];
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

    const parent: ParentNode = link.node.parentNode.parentNode;
    const element: HTMLElement = el(`.${this.wrapperClass}`,
      el(`button.${this.buttonClasses.join('.')}`,
        [
          el(`span.pthKOcceozMuXLYrLlbL1`, el(`i.fal.fa-lightbulb`)),
          el(`span.${this.textClasses.join('.')}`, '86 Related')
        ]));

    const lastChild: Element = Array.from(
      parent.lastElementChild.lastElementChild.getElementsByClassName(this.wrapperClass)
    ).pop();

    link.preparetBaseHTML({
      element,
      onClick: this.onClick
    });

    mount(parent.lastElementChild.lastElementChild, link, lastChild.nextSibling);
  }

  onClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    // "this" is relative to the link..
    this.dialog = new RedditDialog(
      this.agent,
      this.article
    );
  }

  getPotentialLinksFromElement(element: HTMLElement) {
    logger.log('RedditAgent: getPotentialLinksFromElement');

    const potentials = Array.from(
      element.getElementsByClassName(this.linkClasses.join(' ')) // look for specific classes in given element
    );

    return potentials.filter((potential: HTMLAnchorElement) => {
      const url: URL = new URL(potential.href);
      const outBindLink = (potential.dataset['testid'] === 'outbound-link') && !url.host.includes('reddit');
      const extension: string = path.extname(url.pathname);

      return (outBindLink && (!extension || extension === '.html'));
    }).map((potentialElement: HTMLAnchorElement) => {
      const article = getParentByCls(potentialElement, 'scrollerItem');

      return {
        element: potentialElement,
        wrapperNode: element,
        article: article
      }
    });
  }
}