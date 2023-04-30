
import { svg } from 'redom';

import logger from '../../utils/logger';

export default class StatsIcon {
  el: SVGElement

  constructor() {
    logger.log('StatsIcon: constructor');

    this.el = svg(
      'svg',
      { viewBox: '0 0 24 24' },
      svg('g', svg('path', {
        d: 'M20,2H4A2,2,0,0,0,2,4V20a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V4A2,2,0,0,0,20,2ZM9,17a1,1,0,0,1-2,0V15a1,1,0,0,1,2,0Zm4,0a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Zm4,0a1,1,0,0,1-2,0V7a1,1,0,0,1,2,0Z'
      }))
    )
  }
}