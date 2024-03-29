const config = {
  'host': 'https://www.infold.com',
  'api': {
    'url': 'https://api.infold.ai',
    'similarity': 0.8,
    'maxArticleCount': 15,
    'lookupConcurrency': 7,
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  'ws': {
    'chat': 'wss://api.infold.ai',
    'path': 'chat/foldy'
  },
  'defaults': {
    'processedClass': 'SCprocessed',
    'notAllowedExtensions': ['.jpg', '.jpeg', '.png', '.gif', '.gifv', '.mp4', '.webm'],
    'retryStatus': ['processing', 'analyzing'],
    'failedStatus': ['invalid', 'error'],
    'blacklistedDomains': ['open.spotify.com', 'spotify.com', 'github.com', 'infold.ai', 'facebook.com', 'twitch.com', 'google.com', 'twitter.com', 'mozilla.org', 'instagram.com', 'reddit.com', 'youtube.com', 'imgur.com', 'redd.it', 'youtu.be', 'gfycat.com', 'i.redd.it', 'alb.reddit.com', 'preview.redd.it', 'help.twitter.com'],
    'supportedProtocols': ['http:', 'https:'],
    'minTextLenght': 100,
    'maxTopHeadlines': 3,
    'installRedirectUrl': 'https://infold.ai/welcome.html',
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
  'sourcesBackgroundWhiteList': ['militarytimes.com', 'twistedsifter.com', 'dailycaller.com', 'britannica.com', 'nautil.us', 'thecollegefix.com', 'inews.co.uk', 'livescience.com', 'theepochtimes.com', 'roaring.earth', 'nationalpost.com', 'dailysceptic.org', 'marineinsight.com', 'postguam.com', 'snexplores.org', 'sciencedirect.com', 'news.cornell.edu', 'travelandleisure.com', 'justthenews.com', 'chicago.suntimes.com', 'bleacherreport.com', 'neurosciencenews.com', 'rusi.org', 'defensenews.com', 'smh.com.au', 'journals.plos.org', 'bleepingcomputer.com', 'ecu.edu.au', 'commondreams.org', 'thepostmillennial.com', 'dailydot.com', 'prnewswire.com', 'arabnews.com', '38north.org', 'vulture.com', 'natgeokids.com', 'discussingfilm.net', 'medrxiv.org', 'stratechery.com', 'medcitynews.com', 'switzerlandtimes.ch', 'theswisstimes.ch', 'seekingalpha.com', 'thetimes.co.uk', 'msnbc.com', 'c-span.org', 'mediamatters.org', 'foreignaffairs.com', 'finance.yahoo.com', 'ibtimes.com', 'sentientmedia.org', 'bikeradar.com', 'cyclingweekly.com', 'cyclingnews.com', 'aa.com.tr', 'thenextweb.com', 'billboard.com', 'editorial.rottentomatoes.com', 'hackaday.com', 'macworld.com', 'aibreakfast.beehiiv.com', 'technologyreview.com', 'media.mit.edu', 'readwrite.com', 'laughingsquid.com', 'techradar.com', 'appleinsider.com', 'bgr.com', 'androidpolice.com', 'xda-developers.com', 'venturebeat.com', 'bostonglobe.com', 'thelancet.com', 'smh.com.au', 'abc.net.au', 'popularmechanics.com', 'washingtontimes.com', 'physicsworld.com', 'pubs.aip.org', 'physics.aps.org', 'ign.com', 'aeaweb.org', 'securityweek.com', 'infosecurity-magazine.com', 'scmagazine.com', 'dissentmagazine.org', 'informationweek.com', 'sipri.org', 'indiewire.com', 'frontiersin.org', 'blockworks.co', 'pravda.com.ua', 'japannews.yomiuri.co.jp', 'yle.fi', 'economictimes.indiatimes.com', 'techrepublic.com', 'cio.com', 'fangoria.com', 'horrorsociety.com', 'itv.com', 'rottentomatoes.com', 'ew.com', 'eonline.com', 'bruegel.org', 'english.news.cn', 'comicbook.com', 'people.com', 'mmaweekly.com', 'theparliamentmagazine.eu', 'luxtimes.lu', 'express.co.uk', 'dailymail.co.uk', 'dailymail.com', 'mirror.co.uk', 'thesun.co.uk', 'channel4.com', 'tmz.com', 'ctvnews.ca', 'thedefensepost.com', 'barrons.com', 'ign.com', 'tabletmag.com', 'voanews.com', 'petapixel.com', 'scientificamerican.com', 'autonews.com', 'unherd.com', 'theregister.com', 'talkingpointsmemo.com', 'sherdog.com', 'poynter.org', 'psychologytoday.com', 'inc.com', 'latimes.com', 'newsweek.com', 'thestreet.com', 'history.com', 'phys.org', 'medicalxpress.com', 'thehill.com', 'washingtonpost.com', 'pnas.org', 'bloomberg.com', 'theathletic.com', 'nationalgeographic.com', 'theblock.co', 'reuters.com', 'usatoday.com', 'eu.usatoday.com', 'hbr.org', 'asia.nikkei.com', 'darkreading.com', 'kyivindependent.com', 'knowablemagazine.org', 'channelnewsasia.com', 'jpost.com', 'japantimes.co.jp', 'newrepublic.com', 'themoscowtimes.com', 'bleedingcool.com', 'vanityfair.com', 'tass.com', 'thediplomat.com', 'cjr.org', 'foreignpolicy.com', 'oilprice.com', 'rferl.org', 'observer.com', 'euobserver.com', 'lifehacker.com', 'worksinprogress.co', 'smithsonianmag.com', 'statnews.com', 'psypost.org', 'deadline.com', 'npr.org', 'hollywoodreporter.com', 'entrepreneur.com', 'pbs.org', 'theage.com.au', 'newyorker.com', 'huffpost.com', 'marketwatch.com', 'nasa.gov', 'space.com', 'truthout.org', 'dailykos.com', 'thedailybeast.com', 'jacobin.com', 'forbes.com', 'mashable.com', 'time.com', 'hir.harvard.edu', 'ox.ac.uk', 'euractiv.com', 'macrumors.com', 'variety.com', 'telegraph.co.uk', 'si.com', 'spaceflightnow.com', 'nasaspaceflight.com', 'theintercept.com', 'vox.com', 'autoblog.com', 'watcher.guru', 'bloodyelbow.com', 'dailywire.com', 'propublica.org', 'planetary.org', 'racket.news', 'motherjones.com', 'aljazeera.com', 'popsci.com', 'espn.com', 'decrypt.co', 'atlasobscura.com', 'kotaku.com', 'snopes.com', 'globalnews.ca', 'bjpenn.com', 'mmafighting.com', 'mmajunkie.usatoday.com', 'cointelegraph.com', 'coindesk.com', 'talksport.com', 'wired.com', 'qz.com', 'gizmodo.com', 'deadspin.com', 'nature.com', 'theconversation.com', 'dev.to', 'petkeen.com', 'politifact.com', 'thedodo.com', 'politico.com', 'politico.eu', 'science.org', 'newscientist.com', 'sciencealert.com', 'cnbc.com', 'salon.com', 'thefp.com', 'dawn.com', 'apnews.com', 'techcrunch.com', 'thehackernews.com', 'euronews.com', 'quantamagazine.org', 'pcworld.com', 'rollingstone.com', 'gamesindustry.biz', 'discovermagazine.com', 'nypost.com', 'engadget.com', 'lawliberty.org', 'democracynow.org', 'dexerto.com', 'mymodernmet.com', 'bloody-disgusting.com', 'reason.com', 'infoq.com', 'news.sky.com', 'theverge.com', 'allaboutcircuits.com', 'futurism.com', 'cleantechnica.com', 'electrek.co', 'slashdot.org', 'slate.com', 'zerohedge.com', 'cnet.com', 'france24.com', 'foxnews.com', 'factcheck.org', 'economist.com', 'doomberg.substack.com', 'dw.com', 'theatlantic.com', 'cnn.com', 'edition.cnn.com', 'cfr.org', 'cbsnews.com', 'cbc.ca', 'cbcnews.ca', 'caranddriver.com', 'businessinsider.com', 'markets.businessinsider.com', 'breitbart.com', 'bbc.com', 'bbc.co.uk', 'axios.com', 'abcnews.go.com', 'arstechnica.com', 'thenation.com', 'sciencenews.org', 'physicstoday.scitation.org', 'nytimes.com', 'nbcnews.com', 'motortrend.com', 'medium.com', 'jalopnik.com', 'investopedia.com']
}

export default config;