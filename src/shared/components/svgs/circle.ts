
/**
 * 
 * 
 * <svg class="_1g3Xfh9mljLHWv24M9A3Rw _2dn5Ncenn0BSD4tCSmxQhA GpWjjkZl5_kV4yZYWBaT2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
 * <circle cx="6" cy="6" r="4"></circle>
 * <path class="_3SlBAJb2MbUHwgBZFH8eL7 " fill-rule="evenodd" clip-rule="evenodd" 
 * d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 
 * 6ZM6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z">
 * </path>
 * </svg>
 */


import { svg } from 'redom';

import logger from '../../utils/logger';

export default class CircleIcon {
  el: SVGElement

  constructor() {
    logger.log('CircleIcon: constructor');

    this.el = svg(
      'svg',
      { viewBox: '0 0 12 12' },
      svg('g', 
      svg('circle', { cx: '6', cy: '6', r: '4' }),
      svg('path', {
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        d: 'M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z'
      })
      ),
    )
  }
}