import Link from "../components/link";

import logger from "../utils/logger";

export default class Agent {

  processing: boolean
  
  currentProcess: Link
  activeLinks: Link[] = []

  constructor() {
    logger.log('Agent: constructor');
    this.processing = false;
  }

  start() {
    logger.log('Agent: start');

    /*if (typeof chrome !== 'undefined') { // detect chrome (is global)
      chrome.runtime.onMessage.addListener(this.onExtensionMessage.bind(this));
    }*/
  }

  async onDomChange(records?: MutationRecord[], delay?: boolean) {
    logger.log('Agent: onDomChange');

    let newItems: boolean = false;
    let links: Link[] = await this.findLinks(records, delay);

    if (links.length > 0) {
      this.activeLinks = this.activeLinks.concat(links);
      newItems = true;
    }

    if (this.processing === false && newItems)
      this.processLinks();
  }

  async processLinks() {
    logger.log('Agent: processLinks');

    this.processing = true;
    this.currentProcess = this.activeLinks.find((link: Link) => link.status === 'pending');

    if (this.currentProcess !== undefined) {
      this.appendLink(this.currentProcess);

      try {
        await this.currentProcess.getInfo();
        this.processLinks();
      } catch (error) {
        logger.error(`There was a problem while fetching the link data ${this.currentProcess}, error ${error}`);

        this.currentProcess.disableLoading();
        this.processLinks();
      }
    } else
      this.processing = false;
  }

  async findLinks(records: MutationRecord[], delay: boolean): Promise<Link[]> {
    logger.log('Agent: findLinks');

    // Must be overwritten by child
    // Needs an abstract interface

    return [];
  }

  appendLink(link: Link) {
    logger.log('Agent: appendLink');

    // Must be overwritten by child
    // Needs an abstract interface
  }
}