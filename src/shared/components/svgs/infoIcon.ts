
import { svg } from 'redom';

import logger from '../../utils/logger';

export default class InfoIcon {
  el: SVGElement

  constructor() {
    logger.log('InfoIcon: constructor');

    this.el = svg(
      'svg',
      { viewBox: '0 0 192 512', style: 'fill: currentColor; display: flex;' },
      [
        svg('defs',
          svg('style', '.fa-secondary{opacity:.4}')
        ),
        svg('g', [
          svg('path', {
            class: 'fa-secondary',
            d: 'M20 448h152a20 20 0 0 1 20 20v24a20 20 0 0 1-20 20H20a20 20 0 0 1-20-20v-24a20 20 0 0 1 20-20z'
          }),
          svg('path', {
            class: 'fa-primary',
            d: 'M96 128a64 64 0 1 0-64-64 64 64 0 0 0 64 64zm28 64H20a20 20 0 0 0-20 20v24a20 20 0 0 0 20 20h28v192h96V212a20 20 0 0 0-20-20z'
          })
        ])
      ]
    )
  }
}