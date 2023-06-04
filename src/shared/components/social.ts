import { el } from 'redom';

import logger from '../utils/logger';

export default class Şocial {

  el: HTMLElement

  constructor() {
    logger.log('Şocial: constructor');
    
    this.el = el('.SCSocialWrapper', [
      el('a.SCSubmitViewSocialLink', { href: 'https://infold.ai', target: '_blank' }, [
        el('span', 'Website')
      ]),
      el('a.SCSubmitViewSocialLink', { href: 'https://twitter.com/infoldai', target: '_blank' }, [
        el('span', 'Twitter')
      ]),
      el('a.SCSubmitViewSocialLink', { href: '#', target: '_blank' }, [
        el('span', 'Privacy')
      ]),
      el('a.SCSubmitViewSocialLink.SCActive', { href: 'https://patreon.com/infold', target: '_blank' }, [
        el('span', 'Patreon')
      ])
    ]);
  }
}