
import { svg } from 'redom';

import logger from '../../../utils/logger';

export default class InvestopediaIcon {
  el: SVGElement

  constructor() {
    logger.log('InvestopediaIcon: constructor');

    this.el = svg(
      'svg',
      { viewBox: '0 0 150 150' },
      [
        svg('defs',
          svg('style', '.cls-1{fill:none;}.cls-2{fill:#333a56;}.cls-3{fill:#f54e00;')
        ),
        svg('path', {
          d: 'M0,0H150V150H0Z',
          class: 'cls-1',
          transform: 'translate(0 0)'
        }),
        svg('path', {
          d: 'M78.29,102.75,82.5,62.16,71.24,54.89,13.55,90.25A63.85,63.85,0,1,1,138.74,65.84Z',
          class: 'cls-2',
          transform: 'translate(0 0)'
        }),
        svg('path', {
          d: 'M138.87,83.12a63.86,63.86,0,0,1-120,21.19h0L66.15,75.39l-4.34,40.53,11.73,8Z',
          class: 'cls-2',
          transform: 'translate(0 0)'
        }),
        svg('circle', { class: 'cls-3', cx: "78.77", cy: "40.26", r: "9.01" })
      ]
    )
  }
}