import transformSource from '../shared/transformers/source';
import transformArticle from '../shared/transformers/article';

import logger from '../shared/utils/logger';
import config from '../shared/utils/config';
import { setBadgeText, setBadgeColor } from '../shared/utils/helpers';

import PopupDialog from '../shared/components/view/dialog/popup';

import { IDataItem } from '../shared/types';
import events from '../shared/services/events';

(async function initPopupWindow() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const popupDialog = new PopupDialog(document.querySelector('#wrapper'), closeCallback);

  if (tab?.url) {
    try {
      const url = new URL(tab.url);

      if (config.defaults.blacklistedDomains.includes(url.hostname.replace('www.', '')))
        throw new Error('Blacklisted domain');
      if (!url.pathname || url.pathname === '/')
        throw new Error('No path');

      const response = await chrome.runtime.sendMessage({ type: "getRelated", href: url.href });

      if (!response || !response.data || response.data.length === 0) {
        popupDialog.meta = response.meta; // nasty
        throw new Error('No data');
      }

      const data: IDataItem[] = response.data
        .filter((item: any) => item.source.logo) // filter out sources that don't have a parser
        .map((item: any) => {
          return {
            source: transformSource(item.source),
            articles: item.articles.map((article: any) => transformArticle(article))
          }
        });

      // Update badge info
      setBadgeColor(tab.id, '#1d9bf0', '#FFFFFF')
      setBadgeText(tab.id, String(response.meta.total_results))

      popupDialog.openSlideshowView(data, response.meta);
    } catch(err) {
      console.error(err);
      logger.log('Falling back to settings view');
      events.emit('openSettingsView');
    }
  } else
    events.emit('openSettingsView');

  function closeCallback() {
    logger.log('closeCallback');
    window.close();
  }
})();