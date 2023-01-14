import { el } from 'redom';

import { IArticle, IDateGroup, IDataItem, ISourceGroup } from '../../types';

import logger from '../../utils/logger';
import config from '../../utils/config';
import { shuffleArray } from '../../utils/helpers';

export default class Groups {

  el: HTMLElement
  groupsHTML: Array<HTMLElement>

  constructor(groups: Array<ISourceGroup>) {
    logger.log('Sources: constructor');

    this.groupsHTML = groups.map((sourceGroup: ISourceGroup, gindex: number): HTMLElement => {
      return el('ul', [
        el('span.SCDateGroup', sourceGroup.label),
        sourceGroup.elements.map((dataitem: IDataItem, dindex: number): HTMLElement => {
          return el('li', { 'data-itemindex': dindex, 'data-groupindex': gindex },
            el('img', { src: dataitem.source.icon, title: dataitem.source.name, alt: dataitem.source.name }));
        })
      ])
    });

    this.el = el(`.SCGroupsWrapper`, this.groupsHTML);
    this.el.onclick = (evt: Event) => {
      evt.stopPropagation();

      const target: HTMLElement = evt.target as HTMLElement;
      const itemIndex = Groups.getItemIndex(target);
      const groupIndex = Groups.getGroupIndex(target);
    };
  }
  
  static getItemIndex(target: HTMLElement) {
    return target.getAttribute('data-itemindex') || target.parentElement.getAttribute('data-itemindex')
  }
  
  static getGroupIndex(target: HTMLElement) {
    return target.getAttribute('data-groupindex') || target.parentElement.getAttribute('data-groupindex');
  }

  static getDateGroupForArticle(article: IArticle): IDateGroup {
    return config.dategroups.find(group => article.timestamp >= group.toDate);
  }

  static mapToSourceGroups(dataitems: Array<IDataItem>): Array<ISourceGroup> {
    const groups: Map<string, ISourceGroup> = new Map(); // IDateGroup and/or ISourceGroups (could be time or type based 24h/Social/etc.);

    dataitems.forEach((dataitem: IDataItem) => {

      dataitem.articles = shuffleArray(dataitem.articles); // shuffles arrays TEMP!
      const currentDateGroup: IDateGroup = Groups.getDateGroupForArticle(dataitem.articles[0]);

      let group = groups.get(currentDateGroup.label);

      if (!group) {
        groups.set(currentDateGroup.label, {
          dateGroup: currentDateGroup,
          elements: []
        });

        group = groups.get(currentDateGroup.label);
      }

      group.elements.push(dataitem);
    });

    const arrayTransform: Array<ISourceGroup> = [];

    for (let key of groups.keys()) {
      const group: ISourceGroup = groups.get(key);
      arrayTransform.push({
        ...group,
        toDate: group.dateGroup.toDate,
        label: key
      });
    }

    return arrayTransform.sort((a: any, b: any) => {
      return b.toDate - a.toDate;
    });
  }
}