
import logger from '../utils/logger';
import config from '../utils/config';

class Settings {

  storageKey: string = 'settings'

  synced: boolean = false

  supportedSettings: Array<String> = ['searchType', 'similarityScore', 'articleCount', 'apiUrl']

  localSettings: any = {}
  defaultSettings: any = {
    searchType: 'source', // similarity, source,
    similarityScore: config.api.similarity,
    articleCount: config.api.maxArticleCount,
    apiUrl: config.api.url
  }

  constructor() {
    logger.log('Settings: constructor');
  }

  async get(key: string): Promise<any> {
    logger.log('Settings: get');

    if (!this.supportedSettings.includes(key))
      return logger.warn(`Settings: get: ${key} is not supported`);

    if (!this.synced)
      await this.load();

    return this.localSettings[key];
  }

  async set(key: string, value: any): Promise<void> {
    logger.log('Settings: set');

    if (!this.supportedSettings.includes(key))
      return logger.warn(`Settings: set: ${key} is not supported`);

    if (!this.synced)
      await this.load();

    this.localSettings[key] = value;

    await chrome.storage.local.set({ [this.storageKey]: this.localSettings }).then(() => {
      logger.log(`${this.storageKey} key is set to ${this.localSettings}`);
    });

    this.synced = true;
  }

  async load(): Promise<any> {
    logger.log('Settings: load');

    const result = await chrome.storage.local.get(this.storageKey);

    if (result && result[this.storageKey])
      this.localSettings = result[this.storageKey];
    else
      this.localSettings = this.defaultSettings;

    this.synced = true;

    return this.localSettings;
  }
}

const settings = new Settings(); // singelton

export default settings;