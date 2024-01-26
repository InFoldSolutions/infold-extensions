/*
 * 
 * Input
 * 
{
  "meta": {
      "success": true,
      "total_results": 2138
  },
  "topic": {
      "title": "Ukrainian forces advanced over one kilometre on Bakhmut front in past 24 hours | Ukrainska Pravda",
      "outline": [
          "Source: Serhii Cherevatyi, spokesman for the Eastern Group of Forces of the Armed Forces of Ukraine, on air during the national 24/7 newscast",
          " ",
          "Quote: \"The defence forces continue to keep the momentum there [on the Bakhmut front – ed.",
          "Earlier:  On the morning of 7 July, the General Staff reported that the Ukrainian forces have had partial success, consolidating their positions in the area of Klishchiivka on the Bakhmut front, with heavy fighting underway.",
          "Serhii Cherevatyi, PHOTO BY MILITARNYI",
          "The Armed Forces of Ukraine have advanced on the Bakhmut front by more than a kilometre in the past 24 hours."
      ],
      "keywords": [],
      "sources": [
          {
              "meta": {
                  "best_match": 0.892,
                  "newest_article": "2023-07-07T10:55:35.391289+00:00"
              },
              "source": {
                  "name": "Reuters",
                  "domains": [
                      "reuters.com"
                  ],
                  "logo": "https://pbs.twimg.com/profile_images/1194751949821939712/3VBu4_Sa_400x400.jpg",
                  "social": [
                      {
                          "name": "Twitter",
                          "handle": "@Reuters"
                      }
                  ]
              },
              "articles": [
                  {
                      "title": "Ukraine says it is advancing near eastern city of Bakhmut | Reuters",
                      "summary": "KYIV, July 7 (Reuters) - Ukraine said on Friday its troops had advanced by more than a kilometre near the eastern city of Bakhmut in the past day of fighting against Russian forces. Ukrainian military analysts have said that securing Klishchiivka would help Ukraine take back Bakhmut, which was captured by Russian forces in May after months of fighting. The comments were the latest by Kyiv signalling that the counteroffensive it launched in early June is gradually making progress although Russian accounts of fighting in the Bakhmut sector differ from Ukraine's.",
                      "language": "en",
                      "url": "https://www.reuters.com/world/europe/ukraine-reports-new-advances-near-eastern-city-bakhmut-2023-07-07/",
                      "social": [],
                      "keywords": [
                          {
                              "keyword": "Moscow",
                              "type": "location",
                              "analyzed": [
                                  {
                                      "url": "https://en.wikipedia.org/wiki/Moscow",
                                      "title": "Moscow",
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "RIA news agency",
                              "type": "organization",
                              "analyzed": [
                                  {
                                      "url": null,
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "Russia",
                              "type": "location",
                              "analyzed": [
                                  {
                                      "url": "https://en.wikipedia.org/wiki/Russia",
                                      "title": "Russia",
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "Klishchiivka",
                              "type": "location",
                              "analyzed": [
                                  {
                                      "url": null,
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "Oleksander Syrskyi",
                              "type": "person",
                              "analyzed": [
                                  {
                                      "url": null,
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "Serhiy Cherevatyi",
                              "type": "person",
                              "analyzed": [
                                  {
                                      "url": null,
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "Bakhmut",
                              "type": "location",
                              "analyzed": [
                                  {
                                      "url": "https://en.wikipedia.org/wiki/Bakhmut",
                                      "title": "Bakhmut",
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "Ukraine",
                              "type": "location",
                              "analyzed": [
                                  {
                                      "url": "https://en.wikipedia.org/wiki/Ukraine",
                                      "title": "Ukraine",
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "Reuters",
                              "type": "organization",
                              "analyzed": [
                                  {
                                      "url": "https://en.wikipedia.org/wiki/Reuters",
                                      "title": "Reuters",
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": "https://www.investopedia.com/terms/r/reuters.asp",
                                      "title": "Reuters Definition",
                                      "source": "investopedia.com"
                                  }
                              ]
                          },
                          {
                              "keyword": "KYIV",
                              "type": "organization",
                              "analyzed": [
                                  {
                                      "url": null,
                                      "source": "wikipedia.org"
                                  },
                                  {
                                      "url": null,
                                      "source": "investopedia.com"
                                  }
                              ]
                          }
                      ],
                      "added_at": "2023-07-07T10:55:35.391289+00:00",
                      "related": 0.892
                  }
              ]
          }
      ],
      "added_at": "2023-07-07T09:42:32.093757+00:00"
  }
}*/

/**
 * 
 * Expected
 * 
  {
    meta?: ITopicMeta
    title: string
    summary?: string
    shortSummary?: string
    firstSeen: number
    keyPoints: Array<string>
    keywords: Array<IKeyword>
    sources: Array<ISource>
  }
*/

import { ITopic } from "../types/index";

import transformKeyword from "./keyword";
import transformSource from "./source";

export default function transformTopic(data: any): ITopic {
    const { title, slug, outline, keywords, sources, added_at } = data;
    const transformedData: ITopic = {
        title,
        slug,
        keyPoints: outline.map((point: string) => point.replace(/(?:\r\n|\r|\n|\*)/g, '').trim()).filter((point: string) => point && point !== ""),
        keywords: keywords?.data.map((keyword: any) => transformKeyword(keyword)) || [],
        sources: sources.map((source: any) => transformSource(source.source, source.articles)),
        firstSeen: new Date(added_at).getTime()
    };

    return transformedData;
}