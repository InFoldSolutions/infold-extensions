import Link from "../components/link";

import config from "../utils/config";
import logger from "../utils/logger";

export default class Agent {

  processing: boolean

  currentProcesses: Link[]
  activeLinks: Link[] = []

  providerType: string

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

    for (let l = 0; l < links.length; l++) {
      const link = links[l];

      if (!this.activeLinks.find((activeItem: Link) => activeItem.article === link.article && activeItem.href === link.href)) {
        this.appendLink(link);
        this.activeLinks.push(link);
        newItems = true;
      }
    }

    if (this.processing === false && newItems)
      this.processLinks();
  }

  async processLinks() {
    logger.log('Agent: processLinks');

    this.processing = true;
    this.currentProcesses = this.activeLinks.filter((link: Link) => link.status === 'pending');

    if (this.currentProcesses.length !== 0) {
      await Promise.map(this.currentProcesses, async (link: Link) => {
        try {
          await link.getInfo();
        } catch (error) {
          logger.error(`There was a problem while fetching the link data ${link.href}, error ${error}`);
        }
      }, { concurrency: config.api.lookupConcurrency });

      this.processLinks();
    } else
      this.processing = false;
  }

  clearActiveLinks() {
    logger.log('Agent: clearActiveLinks');

    this.activeLinks = [];
    this.processing = false;
  }

  clearOpenDialogs() {
    logger.log('Agent: clearOpenDialogs');

    this.activeLinks.filter((link: Link) => link.dialog)
      .forEach((link: Link) => {
        link.dialog.close();
      });
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