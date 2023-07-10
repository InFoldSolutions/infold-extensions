import { el, mount } from 'redom';

import { IArticle, IDateGroup, IDataItem, ISource, ISourceGroup } from '../../types';

import logger from '../../utils/logger';
import config from '../../utils/config';
import { findParentByCls, shuffleArray } from '../../utils/helpers';

import RightArrowIcon from '../svgs/rightArrowIcon';
import LeftArrowIcon from '../svgs/leftArrowIcon';
import StatsIcon from '../svgs/statsIcon';
import events from '../../services/events';

export default class Groups {

  el: HTMLElement
  articleStats: HTMLElement
  articleNav: HTMLElement
  articleCount: HTMLElement
  articleIndex: HTMLElement
  groupsNav: HTMLElement
  addNewBtn: HTMLElement

  groups: Array<ISourceGroup>

  activeGroupIndex: number
  activeSourceIndex: number
  activeArticleIndex: number

  onGroupSelect: Function
  onArticleNav: Function

  constructor(groups: Array<ISourceGroup>, onGroupSelect: Function, onArticleNav: Function, totalCount: number) {
    logger.log('Sources: constructor');

    this.onGroupSelect = onGroupSelect;
    this.onArticleNav = onArticleNav;

    this.addNewBtn = el(`.SCAddNewBtn`, [el('span', el('i.fad.fa-plus-circle')), el('span.SCAddNewBtnText', 'Add')], { title: 'Add new source' });

    this.groups = groups;
    this.groupsNav = el(`.SCGroupsNavWrapper`, [this.groups.map((sourceGroup: ISourceGroup, gindex: number): HTMLElement => {
      return el('ul', [
        el('span.SCDateGroup', sourceGroup.label),
        sourceGroup.elements.map((dataitem: IDataItem, dindex: number): HTMLElement => {
          return el('li', { 'data-sourceindex': dindex, 'data-groupindex': gindex },
            el('img', { src: dataitem.source.icon, title: dataitem.source.name, alt: dataitem.source.name }));
        })
      ])
    }), this.addNewBtn]);

    this.articleCount = el('span.SCArticleCount');
    this.articleIndex = el('span.SCCurrentArticleIndex');
    this.articleStats = el('.SCArticleStats', [
      el('span', 'Total'),
      totalCount.toString(),
      new StatsIcon()
    ]);

    this.el = el(`.SCGroupsWrapper`, this.groupsNav);
    this.el.onclick = (evt: Event) => {
      evt.stopPropagation();

      const target: HTMLElement = evt.target as HTMLElement;
      const addNew: HTMLElement = findParentByCls(target, 'SCAddNewBtn', 3);

      if (addNew) {
        events.emit('openSubmitView');
        return;
      }

      const arrow: HTMLElement = findParentByCls(target, 'SCArrow', 3);

      if (arrow) {
        if (arrow.classList.contains('SCLeft')) {

          if (this.activeArticleIndex === 0)
            return;

          this.activeArticleIndex--;
        } if (arrow.classList.contains('SCRight')) {

          if (this.activeArticleIndex + 1 === parseInt(this.articleCount.textContent))
            return;

          this.activeArticleIndex++;
        }

        this.updateActiveArticle();
        return;
      }

      const sourceIndex = parseInt(Groups.getItemIndex(target));
      const groupIndex = parseInt(Groups.getGroupIndex(target));

      if (Number.isNaN(sourceIndex) || Number.isNaN(groupIndex))
        return;

      this.updateActiveGroup(sourceIndex, groupIndex);

      // call callback
      this.onGroupSelect(sourceIndex, groupIndex);
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

    this.articleCount.textContent = articles.length.toString();

    const currentActive = this.el.querySelector('li.active');

    if (currentActive)
      currentActive.classList.remove('active');

    const newActive = this.el.querySelector(`[data-sourceindex="${sourceIndex}"][data-groupindex="${groupIndex}"]`);

    if (newActive)
      newActive.classList.add('active');

    // Reset on group set
    this.activeArticleIndex = 0;
    this.articleIndex.textContent = (this.activeArticleIndex + 1).toString();
  }

  updateActiveArticle() {
    this.articleIndex.textContent = (this.activeArticleIndex + 1).toString();
    this.onArticleNav(this.activeArticleIndex);
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

  static mapTimelineGroups(dataitems: Array<IDataItem>): Array<ISourceGroup> {
    const groups: Map<string, ISourceGroup> = new Map(); // IDateGroup and/or ISourceGroups (could be time or type based 24h/Social/etc.);

    dataitems.forEach((dataitem: IDataItem) => {
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