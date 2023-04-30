
import { svg } from 'redom';

import logger from '../../utils/logger';

export default class CloseIcon {
  el: SVGElement

  constructor() {
    logger.log('CloseIcon: constructor');

    this.el = svg(
      'svg',
      { viewBox: '0 0 24 24' },
      svg('g', svg('path', {
        d: 'M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z'
      })),
    )
  }
}