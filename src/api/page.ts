export interface ResponseData {
  code: number
  message: string
}

export interface pageData<T> extends ResponseData {
  data: {
    records: T[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    countId: null | number
    maxLimit: null | number
    searchCount: boolean
    pages: number
  }
}
