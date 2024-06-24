import request from '@/utils/request'

export const getShopping = (account, num) =>
  request.get('/shopping-cart/nums', {
    params: {
      account: account,
      limit: num
    }
  })
export const addShopping = (account, commodityid, number) =>
  request.get('/shopping-cart/save', {
    params: {
      account: account,
      commodityid: commodityid,
      number: number
    }
  })

export const delShopping = (id) =>
  request.get('/shopping-cart/delete', {
    params: {
      id: id
    }
  })

export const buyCommodity = (account, commodityid, number) =>
  request.get('/commodity/update', {
    params: {
      account: account,
      commodityid: commodityid,
      number: number
    }
  })
