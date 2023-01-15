import { el } from 'redom';

import { IArticle, IDateGroup, IDataItem, ISource, ISourceGroup } from '../../types';

import logger from '../../utils/logger';
import config from '../../utils/config';
import { findParentByCls, shuffleArray } from '../../utils/helpers';

import RightArrowIcon from '../svgs/rightArrowIcon';
import LeftArrowIcon from '../svgs/leftArrowIcon';
import StatsIcon from '../svgs/statsIcon';

export default class Groups {

  el: HTMLElement
  articleStats: HTMLElement
  articleNav: HTMLElement
  articleCount: HTMLElement
  currentArticleIndex: HTMLElement

  groupsNav: Array<HTMLElement>
  groups: Array<ISourceGroup>

  activeGroupIndex: number
  activeSourceIndex: number

  constructor(groups: Array<ISourceGroup>, onGroupSelect: Function, nextArticle: Function, prevArticle: Function) {
    logger.log('Sources: constructor');

    this.groups = groups;
    this.groupsNav = this.groups.map((sourceGroup: ISourceGroup, gindex: number): HTMLElement => {
      return el('ul', [
        el('span.SCDateGroup', sourceGroup.label),
        sourceGroup.elements.map((dataitem: IDataItem, dindex: number): HTMLElement => {
          return el('li', { 'data-sourceindex': dindex, 'data-groupindex': gindex },
            el('img', { src: dataitem.source.icon, title: dataitem.source.name, alt: dataitem.source.name }));
        })
      ])
    });

    this.articleCount = el('span.SCArticleCount');
    this.currentArticleIndex = el('span.SCCurrentArticleIndex');
    this.articleStats = el('.SCArticleStats', [
      el('span', 'Total'),
      '86',
      new StatsIcon()
    ])
    this.articleNav = el('.SCArticleInfo', [
        el('.SCArticleNav', [
          el('span.SCArrow.SCLeft', new LeftArrowIcon()),
          this.currentArticleIndex,
          el('span.SCSeperator', '/'),
          this.articleCount,
          el('span.SCArrow.SCRight', new RightArrowIcon())
        ]),
        this.articleStats
      ]
    );

    this.el = el(`.SCGroupsWrapper`, [
      this.groupsNav,
      this.articleNav
    ]);

    this.el.onclick = (evt: Event) => {
      evt.stopPropagation();

      const target: HTMLElement = evt.target as HTMLElement;
      const arrow = findParentByCls(target, 'SCArrow', 3);

      if (arrow) {
        const currentArticleIndex = parseInt(this.currentArticleIndex.textContent);
        if (arrow.classList.contains('SCLeft')) {
          console.log('Move left');
          this.currentArticleIndex.textContent = (currentArticleIndex - 1).toString();
          prevArticle();
          return;
        } if (arrow.classList.contains('SCRight')) {
          console.log('Move right');
          this.currentArticleIndex.textContent = (currentArticleIndex + 1).toString();
          nextArticle();
          return;
        }
      }

      const sourceIndex = parseInt(Groups.getItemIndex(target));
      const groupIndex = parseInt(Groups.getGroupIndex(target));

      if (Number.isNaN(sourceIndex) || Number.isNaN(groupIndex))
        return;

      this.updateActiveGroup(sourceIndex, groupIndex);

      // call callback
      onGroupSelect(sourceIndex, groupIndex);
    };

    this.updateActiveGroup(0, 0);
  }

  updateActiveGroup(sourceIndex: number, groupIndex: number) {

    if (this.activeSourceIndex === sourceIndex && this.activeGroupIndex === groupIndex)
      return;

    this.activeGroupIndex = groupIndex;
    this.activeSourceIndex = sourceIndex;

    const currentSourceGroup: ISourceGroup = this.groups[this.activeGroupIndex];
    const currentSource: IDataItem = currentSourceGroup.elements[this.activeSourceIndex];

    const articles: Array<IArticle> = currentSource.articles;

    this.currentArticleIndex.textContent = '1';
    this.articleCount.textContent = articles.length.toString();

    const currentActive = this.el.querySelector('li.active');

    if (currentActive)
      currentActive.classList.remove('active');

    const newActive = this.el.querySelector(`[data-sourceindex="${sourceIndex}"][data-groupindex="${groupIndex}"]`);

    if (newActive)
      newActive.classList.add('active');
  }

  static getItemIndex(target: HTMLElement) {
    return target.getAttribute('data-sourceindex') || target.parentElement.getAttribute('data-sourceindex')
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