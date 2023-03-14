export interface IDataItem {
  source: ISource
  articles: Array<IArticle>
}

export interface ISourceGroup {
  dateGroup: IDateGroup,
  elements: Array<IDataItem>
  label?: string
  toDate?: number
}

export interface ISource {
  name: string
  url: string
  icon: string
  handle: string
  articles?: Array<IArticle>
}

export interface IArticle {
  body: string
  title?: string
  timestamp?: number
  link?: string
  score?: number
  keywords?: Array<IKeyword>
}

export interface IKeyword {
  icon: string
  word: string
}

export interface ISlide {
  body: string
  title?: string
  author?: string
  timestamp?: number
  icon?: string
  link?: string
  keywords?: Array<IKeyword>
}

export interface ISlideBody {
  title: string
  description: string
  timestamp: number
  link: string
  handle: string
  icon?: string
  score: number
  type?: string
  keywords?: Array<IKeyword>
}

export interface IDateGroup {
  listName: string
  toDate: number
  className: string
  label: string
}

export interface IPotentialLink {
  href: string,
  wrapperNode: HTMLElement,
  article: HTMLElement
}