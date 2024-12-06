//定义用户表行类型
export interface UsersRow {
  userId: number
  businessId: number
  totalAmount: number
  paymentStatus: string
  deliveryAddress: string
  deliveryFee: number
  remarks: string
}
