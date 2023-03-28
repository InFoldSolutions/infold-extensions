
/**
 * 
 * Input
 *      {
          "title": "North Korea touts \"nuclear war deterrence\" with submarine cruise missile test amid U.S.-South Korea drills - CBS News",
          "url": "https://www.cbsnews.com/news/north-korea-nuclear-war-deterrence-submarine-cruise-missiles-test-us-south-korea/",
          "score": 0.9847196340560913,
          "timestamp": "2023-03-13 09:27:21.246450+00:00",
          "summary": "North Korea said in state media that its launches of two cruise missiles from a submarine off its east coast showed its resolve to respond with \"overwhelming powerful\" force to the intensifying military maneuvers by the \"the U.S. imperialists and the South Korean puppet forces.\" Seoul, South Korea — The South Korean and U.S. militaries launched their biggest joint military exercises in years Monday, as North Korea said it tested submarine-launched cruise missiles in an apparent protest of the drills it views as an invasion rehearsal. The North's official Korean Central News Agency called the missiles \"strategic\" weapons and said their launches verified the operation posture of the country's \"nuclear war deterrence.\""
        }
 */

/**
 * Expected
 * {
    'title': 'G-7 joins EU on $60-per-barrel price cap on Russian oil',
    'body': 'The Group of Seven nations and Australia agreed Friday to adopt a reached unanimous agreement on the...',
    'link': 'vox.in/3B6arKW',
    'timestamp': Date.now() - 1000 * 60 * 60 * 2,
    'keywords': [{
        'icon': 'fab.fa-youtube',
        'word': 'Charlie Bartolo'
    }, {
        'icon': 'fab.fa-google',
        'word': 'Kearne Solanke'
    }, {
        'icon': 'fab.fa-wikipedia-w',
        'word': 'London Crime'
    }]
    }
 */

let keywords = [{
  'icon': 'fab.fa-wikipedia-w',
  'word': 'Silicon Valley Bank',
  'url': 'https://en.wikipedia.org/wiki/Silicon_Valley_Bank'
}, {
  'icon': 'investopedia',
  'word': 'Contemporaneous Reserves',
  'url': 'https://www.investopedia.com/terms/contemporaneous-reserves.asp'
}];

let  keywords2 = [{
  'icon': 'investopedia',
  'word': 'Federal Reserve Bank',
  'url': 'https://www.investopedia.com/terms/f/federalreservebank.asp'
}, {
  'icon': 'fab.fa-wikipedia-w',
  'word': 'Silvergate Bank',
  'url': 'https://en.wikipedia.org/wiki/Silvergate_Bank'
}, {
  'icon': 'investopedia',
  'word': 'Distributed Ledger',
  'url': 'https://www.investopedia.com/terms/d/distributed-ledgers.asp'
}];

import { IArticle } from '../types';

export default function transformArticle(data: any): IArticle {
  const { title, url, score, timestamp, summary } = data;
  const x = (Math.floor(Math.random() * 2) == 0);

  return {
    title,
    body: summary,
    link: url,
    score,
    timestamp: new Date(timestamp).getTime(),
    keywords: (x) ? keywords2 : keywords
  };
}