export type IDataItem = {
  source: ISource
  articles: IArticle[]
  item: IArticle
}

export type ISourceGroup = {
  dateGroup: IDateGroup,
  elements: IDataItem[]
  label?: string
  toDate?: number
}

export type IHeadline = {
  title: string
  timestamp: number
  link: string
  sourceName: string
  handle?: string
  score: number
  groupLabel: string
}

export type ITopicMeta = {
  version: string
}

export type ITopic = {
  meta?: ITopicMeta
  title: string
  slug: string
  summary?: string
  shortSummary?: string
  firstSeen: number
  keyPoints: string[]
  keywords: IKeyword[]
  sources: ISource[]
}

export type ISource = {
  name: string
  url?: string
  icon: string
  handle: string
  articles?: IArticle[]
}

export type IArticle = {
  body: string
  title?: string
  author?: string
  handle?: string
  timestamp?: number
  link?: string
  score?: number
  keywords?: IKeyword[]
}

export type IKeyword = {
  icon: string
  word: string
  url: string
}

export type ISlide = {
  body: string
  title?: string
  author?: string
  timestamp?: number
  icon?: string
  link?: string
  keywords?: IKeyword[]
}

export type ISlideBody = {
  title: string
  description: string
  timestamp: number
  link: string
  handle: string
  sourceName: string
  icon?: string
  score: number
  type?: string
  keywords?: IKeyword[]
}

export type IDateGroup = {
  listName: string
  toDate: number
  className: string
  label: string
}

export type IPotentialLink = {
  href?: string,
  linkText?: string,
  wrapperNode: HTMLElement,
  article: HTMLElement
}

export type ILinkElement = {
  href: string,
  text?: string
}