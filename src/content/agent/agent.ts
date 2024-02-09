import Link from "../../shared/components/link";

import config from "../../shared/utils/config";
import { isPostPage } from "../../shared/utils/helpers";
import logger from "../../shared/utils/logger";

export default class Agent {

  processing: boolean

  currentProcesses: Link[] = []
  pendingProcesses: Link[] = []

  activeLinks: Link[] = []

  providerType: string

  constructor() {
    logger.log('Agent: constructor');

    this.processing = false;
  }

  async start() {
    logger.log('Agent: start');
  }

  async stop() {
    logger.log('Agent: stop');

    this.clearActiveLinks();
  }

  async onDomChange(records?: MutationRecord[], delay?: boolean) {
    logger.log('Agent: onDomChange');

    let newItems: boolean = false;
    let links: Link[] = await this.findLinks(records, delay);

    for (let l = 0; l < links.length; l++) {
      const link = links[l];

      if (this.isNotDetectedLink(link)) {
        this.activeLinks.push(link);
        newItems = true;
      }
    }

    if (newItems)
      this.queueLinks();
  }

  isNotDetectedLink(link: Link) {
    logger.log('Agent: isNotActiveLink');
    return !this.activeLinks.find((activeItem: Link) => activeItem.article === link.article && activeItem.href === link.href)
  }

  queueLinks() {
    logger.log('Agent: queueLinks');

    const newPending = this.activeLinks.filter((link: Link) => link.status === 'pending');

    for (let i = 0; i < newPending.length; i++) {
      const link = newPending[i];

      link.setStatus('processing');

      if (this.pendingProcesses.length < 20)
        this.pendingProcesses.push(link);
      else
        this.pendingProcesses.unshift(link);
    }

    this.processLinks();
  }

  async processLinks() {
    logger.log('Agent: processLinks');

    if (this.pendingProcesses.length > 0 && this.currentProcesses.length < config.api.lookupConcurrency) {
      this.processing = true;

      const newProcessesCount = config.api.lookupConcurrency - this.currentProcesses.length;
      const addNewCount = newProcessesCount > this.pendingProcesses.length ? this.pendingProcesses.length : newProcessesCount;

      // feed new from pending
      for (let i = 0; i < addNewCount; i++) {
        const link = this.pendingProcesses[i];

        if (!link) {
          this.pendingProcesses.splice(i, 1);
          continue;
        }

        this.currentProcesses.push(link);
        this.pendingProcesses.splice(i, 1);

        this.appendLink(link);

        link.getInfo(this.processCallback.bind(this), i);
      }

      this.queueLinks();
    } else
      this.processing = false;
  }

  processCallback(link: Link, index: number) {
    logger.log('Agent: processCallback');

    this.currentProcesses.splice(index, 1);
    this.queueLinks();

    if (isPostPage()) {
      if (this.clickedLink?.href === link.href) {
        this.clickedLink.clicked = false;
        link.togglePostView();
      }
    }
  }

  clearActiveLinks() {
    logger.log('Agent: clearActiveLinks');

    this.pendingProcesses.forEach(this.destroyLink);
    this.pendingProcesses = this.pendingProcesses.filter((link: Link) => link.clicked);
    this.currentProcesses.forEach(this.destroyLink);
    this.currentProcesses = this.currentProcesses.filter((link: Link) => link.clicked);
    this.activeLinks.forEach(this.destroyLink);
    this.activeLinks = this.activeLinks.filter((link: Link) => link.clicked);

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

  destroyLink(link: Link) {
    logger.log('Agent: destroyLink');

    if (!link.clicked)
      link.destroy();
  }

  get clickedLink(): Link {
    let clicked: Link = this.activeLinks.find((link: Link) => link.clicked);

    if (!clicked)
      clicked = this.currentProcesses.find((link: Link) => link.clicked);
    if (!clicked)
      clicked = this.pendingProcesses.find((link: Link) => link.clicked);

    return clicked
  }
}