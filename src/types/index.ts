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

export interface ISummaryBody {
  title: string
  description: string
  timestamp: number
  link: string
  handle: string
  icon?: string
  type?: string
  keywords?: Array<IKeyword>
}

export interface IDateGroup {
  listName: string
  toDate: number
  className: string
  label: string
}