const config = {
  'api': {
    'url': 'https://api.infold.ai/articles/related',
    'similarity': 0.81,
    'maxArticleCount': 15,
    'lookupConcurrency': 6,
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  'defaults': {
    'processedClass': 'SCprocessed',
    'notAllowedExtensions': ['.jpg', '.jpeg', '.png', '.gif', '.gifv', '.mp4', '.webm'],
    'retryStatus': ['processing', 'analyzing'],
    'failedStatus': ['invalid', 'error'],
    'blacklistedDomains': ['facebook.com', 'google.com', 'twitter.com', 'reddit.com', 'youtube.com', 'imgur.com', 'redd.it', 'youtu.be', 'gfycat.com', 'i.redd.it', 'alb.reddit.com', 'preview.redd.it', 'help.twitter.com'],
    'supportedProtocols': ['http:', 'https:'],
    'minTextLenght': 100,
    'maxTopHeadlines': 4,
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
      'providerType': 'twitter'
    }
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
  'keywordsBlacklist': ['left', 'right', 'the associated press', 'defense', 'business insider', 'breaking news', 'the washington post', 'the united states', 'ont.', '” orr', 'sun', 'ky.', 'abc', 'r-fla.', 'this week', 'del.', 'ap', 'cbs', 'north', 'south', 'east', 'fl', 'west', 'u.s', 'juice', 'n.y.', 'cbs', 'msnbc', 'guardian', 'ocu', 'state', 'hill', 'insider', 'berlin', 'mass', 'americas', 'moody', 'asia', 'berlin', 'indiana', 'paris', 'dmn', 'ocean waves', 't.s', 'new delhi', 'leopard', 'moon', 'united nations', 'albania', 'malta', 'britain', 'european state', 'indonesia', 'columbia', 'fox news', 'mich.', 'north korea', 'new york city', 'u.k.', 'south korea', 'boston', 'vegas', 'east river', 'milwaukee', 'fla.', 'soviet union', 'variety', 'italy', 'sky news', 'npr', 'New Delhi', 'u.n.', 'singapore', 'nbc', 'tesla', 'austin', 'fremont', 'london', 'google', 'germany', 'spa', 'japan', 'brazil', 'australia', 'netherlands', 'france', 'noordwijk', 'marinka', 'bds', 'bbc', 'associated press', 'nbc news', 'florida', 'politico', 'new york state', 'florida', 'north america', 'kremlin', 'alliance', 'rome', 'koco', 'un', 'eu', 'stockholm', 'estonia', 'brussels', 'mideast', 'hungary', 'sweden', 'middle east', 'jerusalem', 'pentagon', 'finland', 'd.c.', 'moscow', 'turkey', 'linkedin', 'saudi arabia', 'iran', 'beijing', 'nato', 'washington', 'pakista', 'india', 'canada', 'michigan', 'tenn.', 'new york', 'congress', 'trump', 'america', 'legislature', 'kan.', 'georgia', 'crow', 'facebook', 'capitol', 'knoxville', 'n.c.', 'raleigh', 'north carolina', 'tennessee', 'house', 'atlanta', 'cnn', 'manhattan', 'gop', 'reuters', 'memphis', 'white house', 'nashville', 'democratic', 'twitter', 'california', 'minnesota', 'europe', 'siberia', 'spain', 'peru', 'maine', 'colorado', 'university of sydney', 'africa', 'utc', 'princeton university', 'israel', 'washington university', 'england', 'earth', 'us', 'u.s.', 'russia', 'china', 'nasa', 'west', 'east', 'bard college', 'mars', 'iceland', 'veritas', 'texas', 'ukraine', 'uk', 'united kingdom', 'united states', 'united states of america'],

  // temp source whitelist
  // lowercase
  'sourcesBackgroundWhiteList': ["huffpost.com", "hbr.org", "hir.harvard.edu", "thehackernews.com", "globalnews.ca", "gizmodo.com", "theguardian.com", "gamesindustry.biz", "futurism.com", "france24.com", "forbes.com", "foxnews.com", "factcheck.org", "euobserver.com", "espn.com", "euronews.com", "entrepreneur.com", "engadget.com", "electrek.co", "euractiv.com", "economist.com", "doomberg.substack.com", "deadline.com", "decrypt.co", "dev.to", "deadspin.com", "dw.com", "discovermagazine.com", "dexerto.com", "democracynow.org", "theatlantic.com", "dailykos.com", "dailywire.com", "dawn.com", "cointelegraph.com", "coindesk.com", "cnn.com", "edition.cnn.com", "cnet.com", "cnbc.com", "cleantechnica.com", "cfr.org", "cbsnews.com", "cbc.ca", "cbcnews.ca", "caranddriver.com", "bjpenn.com", "bloomberg.com", "businessinsider.com", "markets.businessinsider.com", "breitbart.com", "bloodyelbow.com", "bloody-disgusting.com", "bbc.com", "bbc.co.uk", "aljazeera.com", "axios.com", "autoblog.com", "autonews.com", "atlasobscura.com", "apnews.com", "abcnews.go.com", "arstechnica.com", "allaboutcircuits.com", "zerohedge.com", "washingtonpost.com", "worksinprogress.substack.com", "watcher.guru", "wired.com", "qz.com", "vox.com", "variety.com", "unherd.com", "truthout.org", "time.com", "thehill.com", "thenation.com", "theintercept.com", "thedailybeast.com", "theathletic.com", "theverge.com", "thestreet.com", "theregister.com", "thepostmillennial.com", "thefp.com", "thedodo.com", "theconversation.com", "theblock.co", "theage.com.au", "telegraph.co.uk", "talkingpointsmemo.com", "talksport.com", "techcrunch.com", "statnews.com", "smithsonianmag.com", "snopes.com", "si.com", "slate.com", "slashdot.org", "news.sky.com", "sciencenews.org", "science.org", "sciencealert.com", "scientificamerican.com", "space.com", "spaceflightnow.com", "sherdog.com", "salon.com", "rollingstone.com", "rferl.org", "reuters.com", "reason.com", "racket.news", "quantamagazine.org", "propublica.org", "pnas.org", "planetary.org", "psypost.org", "physicstoday.scitation.org", "psychologytoday.com", "petkeen.com", "popsci.com", "poynter.org", "politifact.com", "politico.eu", "politico.com", "phys.org", "petapixel.com", "pcworld.com", "pbs.org", "observer.com", "ox.ac.uk", "usatoday.com", "eu.usatoday.com", "nytimes.com", "npr.org", "nasaspaceflight.com", "newyorker.com", "newsweek.com", "newscientist.com", "nypost.com", "nbcnews.com", "nationalgeographic.com", "nasa.gov", "nature.com", "motortrend.com", "motherjones.com", "mmafighting.com", "mmajunkie.usatoday.com", "mymodernmet.com", "medium.com", "medicalxpress.com", "mashable.com", "marketwatch.com", "macrumors.com", "kotaku.com", "jalopnik.com", "jacobin.com", "lifehacker.com", "latimes.com", "lawliberty.org", "independent.co.uk", "investopedia.com", "infoq.com", "inc.com", "hollywoodreporter.com", "history.com", "tass.com"]
}

export default config;