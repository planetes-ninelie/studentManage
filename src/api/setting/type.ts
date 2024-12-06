export interface Recommendation {
  id: number
  type: string
  targetId: number
  displayOrder: number
  createdBy?: number
  createdAt?: string
  updatedAt?: string
}
