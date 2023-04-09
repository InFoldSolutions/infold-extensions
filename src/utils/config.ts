const config = {
  'retryStatus': ['processing', 'analyzing'],
  'failedStatus': ['invalid', 'error'],
  'blacklistedDomains': ['twitter.com', 'reddit.com', 'youtube.com', 'www.youtube.com', 'imgur.com', 'redd.it', 'youtu.be', 'gfycat.com', 'i.redd.it', 'alb.reddit.com', 'preview.redd.it', 'help.twitter.com'],
  'minTextLenght': 100,
  'api': {
    'url': 'https://api.infold.ai/articles/related',
    'similarity': 0.70,
    'maxRelatedArticles': 18,
    'lookupConcurrency': 4,
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  'agents': {
    'reddit': {
      'providerType': 'reddit',
      'linkClasses': ['styled-outbound-link'],
      'contentClass': 'rpBJOHq2PR60pnwJlUyP0',
      'wrapperClass': '_3U_7i38RDPV5eBv7m4M-9J',
      'buttonClasses': ['redditrelated', '_10K5i7NW6qcm-UoCtpB3aK', 'YszYBnnIoNY8pZ6UwCivd', '_3yh2bniLq7bYr4BaiXowdO', '_1EWxiIupuIjiExPQeK4Kud', '_28vEaVlLWeas1CDiLuTCap'],
      'textClasses': ['_2-cXnP74241WI7fpcpfPmg', '_70940WUuFmpHbhKlj8EjZ']
    },
    'twitter': {
      'providerType': 'twitter',
      'linkClasses': ['r-1wtj0ep'],
      'contentClass': 'css-1dbjc4n',
      'rootID': 'react-root'
    }
  },
  'defaults': {
    'processedClass': 'SCprocessed',
    'notAllowedExtensions': ['.jpg', '.jpeg', '.png', '.gif', '.gifv', '.mp4', '.webm'],
  },
  'dategroups': [{
    'listName': 'last24hList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24,
    'className': 'last24',
    'label': '24h'
  }, {
    'listName': 'last48hList',
    'toDate': Date.now() - 1000 * 60 * 60 * 48,
    'className': 'last48',
    'label': '48h'
  }, {
    'listName': 'last72hList',
    'toDate': Date.now() - 1000 * 60 * 60 * 72,
    'className': 'last72',
    'label': '72h'
  }, {
    'listName': 'lastWeekList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24 * 7,
    'className': 'lastWeek',
    'label': '7d'
  }, {
    'listName': 'lastTwoWeekList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24 * 14,
    'className': 'lastTwoWeek',
    'label': '14d'
  }, {
    'listName': 'last30daysList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24 * 30,
    'className': 'last30days',
    'label': '30d'
  }, {
    'listName': 'last2MonthsList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24 * 60,
    'className': 'last2months',
    'label': '2mon'
  }, {
    'listName': 'last3MonthsList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24 * 91,
    'className': 'last3months',
    'label': '3mon'
  }, {
    'listName': 'last6MonthsList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24 * 183,
    'className': 'last6months',
    'label': '6mon'
  }, {
    'listName': 'lastYearList',
    'toDate': Date.now() - 1000 * 60 * 60 * 24 * 365,
    'className': 'lastYear',
    'label': '1year'
  }],

  // temp keyword blacklist
  // lowercase
  'keywordsBlacklist': ['berlin', 'indiana', 'paris', 'dmn', 'ocean waves', 't.s', 'new delhi', 'leopard', 'moon', 'united nations', 'albania', 'malta', 'britain', 'european state', 'indonesia', 'columbia', 'fox news', 'mich.', 'north korea', 'new york city', 'u.k.', 'south korea', 'boston', 'vegas', 'east river', 'milwaukee', 'fla.', 'soviet union', 'variety', 'italy', 'sky news', 'npr', 'New Delhi', 'u.n.', 'singapore', 'nbc', 'tesla', 'austin', 'fremont', 'london', 'google', 'germany', 'spa', 'japan', 'brazil', 'australia', 'netherlands', 'france', 'noordwijk', 'marinka', 'bds', 'bbc', 'associated press', 'nbc news', 'florida', 'politico', 'new york state', 'florida', 'north america', 'kremlin', 'alliance', 'rome', 'koco', 'un', 'eu', 'stockholm', 'estonia', 'brussels', 'mideast', 'hungary', 'sweden', 'middle east', 'jerusalem', 'pentagon', 'finland', 'd.c.', 'moscow', 'turkey', 'linkedin', 'saudi arabia', 'iran', 'beijing', 'nato', 'washington', 'pakista', 'india', 'canada', 'michigan', 'tenn.', 'new york', 'congress', 'trump', 'america', 'legislature', 'kan.', 'georgia', 'crow', 'facebook', 'capitol', 'knoxville', 'n.c.', 'raleigh', 'north carolina', 'tennessee', 'house', 'atlanta', 'cnn', 'manhattan', 'gop', 'reuters', 'memphis', 'white house', 'nashville', 'democratic', 'twitter', 'california', 'minnesota', 'europe', 'siberia', 'spain', 'peru', 'maine', 'colorado', 'university of sydney', 'africa', 'utc', 'princeton university', 'israel', 'washington university', 'england', 'earth', 'us', 'u.s.', 'russia', 'china', 'nasa', 'west', 'east', 'bard college', 'mars', 'iceland', 'veritas', 'texas', 'ukraine', 'uk', 'united kingdom', 'united states', 'united states of america'],
}

export default config;