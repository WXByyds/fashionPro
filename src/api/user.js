import request from '@/utils/request'

export const userLogin = (fd) => request.post('/login', fd)

export const userRegister = (fd) =>
  request.get('/login/register', {
    params: {
      account: fd.account,
      type: fd.type,
      password: fd.password,
      Phonnumber: fd.Phonnumber,
      CAPTCHA: fd.CAPTCHA
    }
  })

export const userSendCode = (phone) =>
  request.get('/login/sendsms', {
    params: {
      Phonnumber: phone
    }
  })
