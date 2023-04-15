
/**
 * API Response
 
  Article
  {
    "title": "North Korea touts \"nuclear war deterrence\" with submarine cruise missile test amid U.S.-South Korea drills - CBS News",
    "url": "https://www.cbsnews.com/news/north-korea-nuclear-war-deterrence-submarine-cruise-missiles-test-us-south-korea/",
    "score": 0.9847196340560913,
    "timestamp": "2023-03-13 09:27:21.246450+00:00",
    "summary": "North Korea said in state media that its launches of two cruise missiles from a submarine off its east coast showed its resolve to respond with \"overwhelming powerful\" force to the intensifying military maneuvers by the \"the U.S. imperialists and the South Korean puppet forces.\" Seoul, South Korea — The South Korean and U.S. militaries launched their biggest joint military exercises in years Monday, as North Korea said it tested submarine-launched cruise missiles in an apparent protest of the drills it views as an invasion rehearsal. The North"s official Korean Central News Agency called the missiles \"strategic\" weapons and said their launches verified the operation posture of the country"s \"nuclear war deterrence.\""
    "keywords": [keyword]
  }

  Keywords
  {

    "keyword": "Samsung Galaxy",
    "type": "organization",
    "analyzed": [
      {
        "url": "https://en.wikipedia.org/wiki/Samsung_Galaxy",
        "title": "Samsung Galaxy",
        "source": "wikipedia.org"
      }
    ],
    "added_at": "2023-03-07T11:40:12.888844+00:00"
  }
 */

/**
 * Transformed Article
  {
    "title": "G-7 joins EU on $60-per-barrel price cap on Russian oil",
    "body": "The Group of Seven nations and Australia agreed Friday to adopt a reached unanimous agreement on the...",
    "link": "vox.in/3B6arKW",
    "timestamp": Date.now() - 1000 * 60 * 60 * 2,
    "keywords": [{
        "icon": "fab.fa-youtube",
        "word": "Charlie Bartolo"
    }, {
        "icon": "fab.fa-google",
        "word": "Kearne Solanke"
    }, {
        "icon": "fab.fa-wikipedia-w",
        "word": "London Crime"
    }]
  }
 */

import { IArticle } from "../types";

import config from "../utils/config";

import transformKeyword from "./keyword";

export default function transformArticle(data: any): IArticle {
  const { title, url, related, added_at, summary } = data;

  return {
    title,
    body: summary,
    link: url,
    score: related,
    timestamp: new Date(added_at).getTime(),
    keywords: data.keywords.filter(filterKeywords).map(transformKeyword)
  };
}

// We filter some obvious false positives
function filterKeywords(data: any) {
  if (config.keywordsBlacklist.includes(data.keyword.toLowerCase()))
    return false;

  if (data.type === "person") { // check for type person to have at least two full words
    const words = data.keyword.split(" ");

    if (words.length < 2)
      return false;
  }

  return true;
}