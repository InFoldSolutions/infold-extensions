
import { svg } from 'redom';

import logger from '../../../utils/logger';

export default class TipIcon {
  el: SVGElement

  constructor() {
    logger.log('TipIcon: constructor');

    this.el = svg(
      'svg',
      { viewBox: '0 0 24 24' },
      svg('g', [
        svg('path', { class: "cls-1", d: "M17.67,22.5H6.33A4.83,4.83,0,0,1,1.5,17.67h0a4.83,4.83,0,0,1,1.24-3.23l7.35-8.17h3.82l7.35,8.17a4.83,4.83,0,0,1,1.24,3.23h0A4.83,4.83,0,0,1,17.67,22.5Z" }),
        svg('path', { class: "cls-1", d: "M15.82,1.5l-.39,2A3.49,3.49,0,0,1,12,6.27h0A3.49,3.49,0,0,1,8.57,3.46l-.39-2Z" }),
        svg('line', { class: "cls-1", x1: "18.68", y1: "3.41", x2: "14.86", y2: "5.32" }),
        svg('line', { class: "cls-1", x1: "19.64", y1: "6.27", x2: "13.91", y2: "6.27" }),
        svg('path', { class: "cls-1", d: "M10.09,17.73h2.39a1.43,1.43,0,0,0,1.43-1.43h0a1.43,1.43,0,0,0-1.43-1.44h-1a1.43,1.43,0,0,1-1.43-1.43h0A1.43,1.43,0,0,1,11.52,12h2.39" }),
        svg('line', { class: "cls-1", x1: "12", y1: "11.05", x2: "12", y2: "12" }),
        svg('line', { class: "cls-1", x1: "12", y1: "17.73", x2: "12", y2: "18.68" })
      ]
    ))
  }
}