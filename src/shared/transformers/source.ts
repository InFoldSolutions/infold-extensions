/**
 * 
 * Input
 * 
 * source: {
    "id": "sources/467",
    "key": "467",
    "rev": "_frr2lHK---",
    "name": "CBS News",
    "domains": [
      "cbsnews.com"
    ],
    "logo": "https://pbs.twimg.com/profile_images/1617634745348661249/6YmPYpNd_400x400.jpg",
    "social": [
      {
        "name": "Twitter",
        "handle": "@CBSNews"
      }
    ],
    "parser": "parsers.news.cbs.CBSAPI",
    "is_analyzed": true,
    "analyzed_at": "2023-03-13T14:56:00.146168+00:00"
    },
 */

/**
 * 
 * Expected
 * 
 * source: {
      "name": "BBC Breaking",
      "url": "http://bbc.co.uk",
      "icon": "https://pbs.twimg.com/profile_images/1150716997254209536/M7gkjsv5_400x400.jpg"
    }
 * 
 * */

import { ISource } from "../types/index";
import transformArticle from "./article";

export default function transformSource(data: any, articles?: any): ISource {
  const { name, url, logo, social } = data;

  return {
    name,
    url,
    icon: logo,
    articles: (articles) ? articles.map((article: any) => transformArticle(article)) : [],
    handle: (social && social.length > 0) ? social[0].handle : name
  };
}
