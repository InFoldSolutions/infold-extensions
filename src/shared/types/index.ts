export type IDataItem = {
  source: ISource
  articles: Array<IArticle>
  item: IArticle
}

export type ISourceGroup = {
  dateGroup: IDateGroup,
  elements: Array<IDataItem>
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
  keyPoints: Array<string>
  keywords: Array<IKeyword>
  sources: Array<ISource>
}

export type ISource = {
  name: string
  url?: string
  icon: string
  handle: string
  articles?: Array<IArticle>
}

export type IArticle = {
  body: string
  title?: string
  timestamp?: number
  link?: string
  score?: number
  keywords?: Array<IKeyword>
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
  keywords?: Array<IKeyword>
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
  keywords?: Array<IKeyword>
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