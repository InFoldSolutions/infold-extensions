// Mock data --remove at some point..

const mockArticles = [{
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
}, {
  'title': 'Teenager canvassing for Warnock shot in Savannah ahead runoff',
  'body': 'Police say no indication shooting politically motivated as teen working for Democrat is treated for non-life threatening injuries',
  'link': 'guardian.in/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 60 * 78,
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
}, {
  'title': 'After Hawaii crash, NTSB calls for helicopters',
  'body': 'Federal officials investigating a helicopter crash in Hawaii helicopters that are commonly used by air tour operators,...',
  'link': 'apnews.in/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 60 * 1,
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
}, {
  'title': 'Flights across US disrupted by technical glitch',
  'body': 'US authorities have confirmed operations across the National Airspace System are affected.',
  'link': 'bbc.co.uk/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 60 * 72,
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
}, {
  'title': 'Ronaldo in Saudi Arabia: bigger off the pitch than on',
  'body': 'Shortly after the World Cup final in Qatar, the Middle East was back at the center of the football world as Saudi Arabian club Al-Nassr signed Cristiano Ronaldo. The deal is less about football and...',
  'link': 'dwnews.com/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 60 * 56,
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
}, {
  'title': 'Heats Dewayne Dedmon ejected from game after slapping massage gun onto court',
  'body': 'Miami Heat center Dewayne Dedmon was ejected from Tuesdays game against the Oklahoma City Thunder after he slapped a massage gun onto the court.',
  'link': 'foxnews.com/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 60 * 73,
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
}, {
  'title': 'Australia Set to Raise Rates as Tightening Cycle Approaches End',
  'body': 'Australia is set to raise interest rates as it closes in on the end of its tightening cycle, while nearby New Zealand...',
  'link': 'bloomberg.in/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 45,
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
}, {
  'title': 'Smithsonian exhibit explores how entertainment shaped',
  'body': '"Entertainment Nation/Nación del espectáculo," a new exhibition at the "Star Wars" and...',
  'link': 'cbsnews.in/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 60 * 72,
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
}, {
  'title': 'Americans think they’ll need $1.9 million to retire',
  'body': 'Your main retirement goal should focus on savings and not on age, according to financial expert Chris Hogan.',
  'link': 'bloomberg.in/3B6arKW',
  'timestamp': Date.now() - 1000 * 60 * 60 * 82,
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
}];

const config = {
  'api': 'https://api.infold.ai/articles/related',
  'retryStatus': ['processing', 'analyzing'],
  'failedStatus': ['invalid', 'error'],
  'blacklistedDomains': ['twitter.com', 'reddit.com', 'youtube.com', 'imgur.com', 'redd.it', 'youtu.be', 'gfycat.com'],
  'minTextLenght': 100,
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
  'mock': {
    'relatedSources': [{
      'source': {
        'name': 'BBC Breaking',
        'url': 'http://bbc.co.uk',
        'icon': 'https://pbs.twimg.com/profile_images/1150716997254209536/M7gkjsv5_400x400.jpg'
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'CNBC',
        'url': 'http://cnbc.com',
        'icon': 'https://pbs.twimg.com/profile_images/1583214318719475713/rP1UOXbz_400x400.jpg'
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'CBSNews',
        'url': 'http://CBSNews.com',
        'icon': 'https://pbs.twimg.com/profile_images/1617634745348661249/6YmPYpNd_400x400.jpg'
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'Bloomberg',
        'url': 'http://Bloomberg.com',
        'icon': 'https://pbs.twimg.com/profile_images/991818020233404416/alrBF_dr_400x400.jpg'
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'Fox News',
        'url': 'http://FoxNews.com',
        'icon': 'https://pbs.twimg.com/profile_images/1591278197844414464/O6Fp0hFB_400x400.jpg'
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'DW News',
        'url': 'http://DWNews.com',
        'icon': 'https://pbs.twimg.com/profile_images/900261211509489666/-1Fu5hU8_400x400.jpg'
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'AP News',
        'url': 'http://APNews.com',
        'icon': 'https://pbs.twimg.com/profile_images/576079042664738817/yT48F_Qq_400x400.jpeg'
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'Guardian',
        'url': 'http://Guardian.com',
        'icon': 'https://pbs.twimg.com/profile_images/1175141826870861825/K2qKoGla_400x400.png',
      },
      'articles': mockArticles
    }, {
      'source': {
        'name': 'Vox',
        'url': 'http://Vox.com',
        'icon': 'https://pbs.twimg.com/profile_images/807306191395241984/s8xmWAvU_400x400.jpg',
      },
      'articles': mockArticles
    }],
    'relatedSocialPosts': [{
      'body': 'Reddit post body that displays some stuff and talks about the original article in a new and profound way',
      'icon': 'reddit',
      'link': 'reddit.com/item',
      'author': 'r/worldnews',
      'timestamp': Date.now() - 1000 * 60 * 60 * 72,
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
    }, {
      'body': 'Twitter post body that displays some stuff and talks about the original article in a new and profound way',
      'icon': 'fab.fa-twitter',
      'link': 'twitter.com/item',
      'author': '@somedude',
      'timestamp': Date.now() - 1000 * 60 * 60 * 96,
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
    }]
  }
}

export default config;