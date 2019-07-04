// import request from '@/utils/request'
import request from '@/utils/request-spoon'
export function login(data) {
  return request.post('/auth/v1/tokens', {
    workid: data.username,
    password: data.password
  })
}

export function getInfo(workid) {
  return request.get('auth/v1/users', {
    params: {
      'workid': workid
    }
  })
}

export function logout() {
  return request.delete('auth/v1/tokens')
}
