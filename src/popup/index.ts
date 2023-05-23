import { mount } from 'redom';

import transformSource from '../shared/transformers/source';
import transformArticle from '../shared/transformers/article';

import logger from '../shared/utils/logger';
import config from '../shared/utils/config';

import PopupDialog from '../shared/components/dialog/popup';
import SettingsView from '../shared/components/view/settings';

import { IDataItem } from '../shared/types';

(async function initPopupWindow() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    try {
      const url = new URL(tab.url);

      if (config.defaults.blacklistedDomains.includes(url.host))
        throw new Error('Blacklisted domain');

      const popupDialog = new PopupDialog(document.querySelector('#wrapper'), closeCallback);

      const response = await chrome.runtime.sendMessage({ type: "getData", href: url.href });

      if (!response || !response.data || response.data.length === 0)
        throw new Error('No data');

      const data: IDataItem[] = response.data
        .filter((item: any) => item.source.logo) // filter out sources that don't have a parser
        .map((item: any) => {
          return {
            source: transformSource(item.source),
            articles: item.articles.map((article: any) => transformArticle(article))
          }
        });

        popupDialog.update(data, response.meta.total_results);
    } catch {
      logger.warn('Falling back to settings view');
      mount(document.querySelector('#wrapper'), new SettingsView());
      //logger.error('No URL found');
      //popupDialog.close();
    }
  }

  function closeCallback() {
    logger.log('closeCallback');
    window.close();
  }
})();