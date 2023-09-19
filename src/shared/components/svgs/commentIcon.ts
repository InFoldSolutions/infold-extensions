
import { svg } from 'redom';

import logger from '../../utils/logger';

export default class CommentIcon {
  el: SVGElement

  constructor() {
    logger.log('CommentIcon: constructor');

    this.el = svg(
      'svg',
      { viewBox: '0 0 16 16' },
      svg('path', {
        d: 'M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z',
        fill: 'currentColor'
      })
    )
  }
}