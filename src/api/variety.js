import request from '@/utils/request'

export const insertVarietyInfo = (fd) => request.post('/variety/save', fd)

export const selectVarietyInfo = (account, page, size) =>
  request.get('/variety/Page', {
    params: {
      account: account,
      pageNO: page,
      pageSize: size
    }
  })

export const updateVarietyInfo = (fd) => request.post('/variety/change', fd)

export const deleteVarietyInfo = (account) =>
  request.post('/variety/delete/' + account)

export const getTotal = (account) =>
  request.get('/variety/num', {
    params: {
      account: account
    }
  })

export const selectLikeVarietyInfo = (account) =>
  request.get('/variety/selectlike/' + account)

export const deleteAll = (fd) => request.post('/variety/deletes', fd)

export const getVariety = (id) => request.post('/variety/select/' + id)
