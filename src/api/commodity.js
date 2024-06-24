import request from '@/utils/request'

export const insertCommodityInfo = (fd) => request.post('/commodity/save', fd)

export const selectCommodityInfo = (account, page, size) =>
  request.get('/commodity/Page', {
    params: {
      account: account,
      pageNO: page,
      pageSize: size
    }
  })

export const updateCommodityInfo = (fd) => request.post('/commodity/change', fd)

export const deleteCommodityInfo = (account) =>
  request.post('/commodity/delete/' + account)

export const getTotal = (account) =>
  request.get('/commodity/num', {
    params: {
      account: account
    }
  })

export const selectLikeCommodityInfo = (account, page, size) =>
  request.get('/commodity/Page2', {
    params: {
      account: account,
      pageNO: page,
      pageSize: size
    }
  })

export const deleteAll = (fd) => request.post('/commodity/deletes', fd)

export const getCommodity = (num, commodity) =>
  request.get('/commodity/nums', {
    params: {
      limit: num,
      commodity: commodity
    }
  })

export const getGoods = (id) => request.post('/commodity/select/' + id)
