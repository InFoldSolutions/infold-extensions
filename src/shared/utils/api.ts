import logger from "./logger";
import config from './config';

import settings from "../services/settings";

export async function getInfo(href: string, sendResponse: Function) {
  try {
    const url = await settings.get('apiUrl');
    const similarity = await settings.get('similarityScore');

    const info = await fetch(`${url}/meta`, {
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

export async function getData(href: string, sendResponse: Function, maxRelatedArticles: number = config.api.maxArticleCount) {
  try {
    const url = await settings.get('apiUrl');
    const similarity = await settings.get('similarityScore');
    const search = await settings.get('searchType');
    const maxArticleCount = await settings.get('articleCount');

    const info = await fetch(`${url}?limit=${maxArticleCount}`, {
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