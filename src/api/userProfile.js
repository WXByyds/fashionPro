import request from '@/utils/request'

export const insertUserInfo = (user) => request.post('/users/save', user)

export const selectUserInfo = (account, page, size) =>
  request.get('/users/Page', {
    params: {
      account: account,
      pageNO: page,
      pageSize: size
    }
  })

export const updateUserInfo = (user) => request.post('/users/update', user)

export const deleteUserInfo = (account) =>
  request.post('/users/delete/' + account)

export const getTotal = (account) =>
  request.get('/users/num', {
    params: {
      account: account
    }
  })

export const getImageUrl = () => request.get('/users/img')

export const selectLikeUserInfo = (account) =>
  request.get('/users/selectlike', {
    params: {
      account: account
    }
  })

export const deleteAll = (fd) => request.post('/users/deletes', fd)
