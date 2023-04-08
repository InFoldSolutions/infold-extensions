export type IDataItem = {
  source: ISource
  articles: Array<IArticle>
}

export type ISourceGroup = {
  dateGroup: IDateGroup,
  elements: Array<IDataItem>
  label?: string
  toDate?: number
}

export type ISource = {
  name: string
  url: string
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
  href: string,
  wrapperNode: HTMLElement,
  article: HTMLElement
}