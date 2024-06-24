import request from '@/utils/request'

export const insertOrderInfo = (fd) => request.post('/userorder/save', fd)

export const selectOrderInfo = (account, page, size) =>
  request.get('/userorder/Page', {
    params: {
      account: account,
      pageNO: page,
      pageSize: size
    }
  })

export const updateOrderInfo = (fd) => request.post('/userorder/change', fd)

export const deleteOrderInfo = (account) =>
  request.post('/userorder/delete/' + account)

export const getTotal = (account) =>
  request.get('/userorder/num', {
    params: {
      account: account
    }
  })

export const selectLikeOrderInfo = (account) =>
  request.get('/userorder/selectlike', {
    params: {
      account: account
    }
  })

export const deleteAll = (fd) => request.post('/userorder/deletes', fd)
