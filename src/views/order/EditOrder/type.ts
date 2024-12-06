//定义用户表行类型
export interface UsersRow {
  id: number
  type: string
  targetId: number
  displayOrder: number
  createdBy?: number
  createdAt?: string
  updatedAt?: string
}
