import logger from './logger';
import config from './config';

import settings from '../services/settings';

export async function getInfo(href: string, sendResponse: Function) {
  logger.log('API: getInfo');

  try {
    const url: string = await settings.get('apiUrl');
    const similarity: number = await settings.get('similarityScore');

    const info = await fetch(`${url}/articles/related/meta`, {
      method: 'POST',
      headers: config.api.headers,
      body: JSON.stringify({
        url: href,
        similarity
      })
    });

    if (!info.ok)
      throw new Error('Request failed');

    const data = await info.json();

    if (sendResponse)
      sendResponse(data);
    else
      return data;
  } catch (error) {
    logger.warn(error);

    if (sendResponse)
      sendResponse({ meta: { success: false } });
  }
}

export async function getRelated(href: string, sendResponse: Function, maxRelatedArticles: number) {
  logger.log('API: getRelated');

  try {
    const url = await settings.get('apiUrl');
    const similarity = await settings.get('similarityScore');
    const search = await settings.get('searchType');
    const maxArticleCount = maxRelatedArticles || await settings.get('articleCount');

    const info = await fetch(`${url}/articles/related?limit=${maxArticleCount}`, {
      method: 'POST',
      headers: config.api.headers,
      body: JSON.stringify({
        url: href,
        similarity,
        search
      })
    });

    if (!info.ok)
      throw new Error('Request failed');

    const data = await info.json();

    if (sendResponse)
      sendResponse(data);
    else
      return data;
  } catch (error) {
    logger.warn(error);

    if (sendResponse)
      sendResponse({ meta: { success: false } });
  }
}

export async function getTopic(href: string, sendResponse: Function) {
  logger.log('API: getTopic');
  
  try {
    const url = await settings.get('apiUrl');
    const info = await fetch(`${url}/topics/related`, {
      method: 'POST',
      headers: config.api.headers,
      body: JSON.stringify({
        url: href
      })
    });

    if (!info.ok)
      throw new Error('Request failed');

    const data = await info.json();

    if (sendResponse)
      sendResponse(data);
    else
      return data;
  } catch (error) {
    logger.warn(error);

    if (sendResponse)
      sendResponse({ meta: { success: false } });
  }
}