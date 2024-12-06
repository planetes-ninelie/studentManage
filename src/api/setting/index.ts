import request from '@/utils/request'
import type {} from './type'
import { GET_INFO } from '@/utils/token'

enum API {
  ADD = '/recommendation/addRecommendation',
}

export const addRecommendation = (data: any) => {
  const createdBy = GET_INFO()
  const dto: Recommendation = {
    type: data.type,
    targetId: data.targetId,
    displayOrder: data.displayOrder,
    createdBy,
  }
  return request.post(API.ADD, dto)
}
