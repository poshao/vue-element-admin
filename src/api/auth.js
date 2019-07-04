import client from '@/utils/request-spoon'
// import config from '../config'
import { Base64 } from 'js-base64'
/** ******************************************************
 * 用户类API
 *******************************************************/

/**
 * 新用户注册
 */
export const register = ({
  workid,
  password
}) => {
  return client.post('auth/v1/users', {
    'workid': workid,
    'password': password
  })
}

/**
 * 用户登录
 */
export const login = ({
  workid,
  password
}) => {
  return client.post('auth/v1/tokens', {
    'workid': workid,
    'password': password
  })
}

/**
 * 注销
 */
export const logout = (token) => {
  return client.delete('auth/v1/tokens')
}

/**
 * 更新SocketId
 */
export const updateSocketId = (socketid) => {
  return client.patch('auth/v1/tokens', {
    'socketid': socketid
  })
}

/**
 * 获取用户的SocketID
 */
export const getSocketId = (workid) => {
  return client.get('auth/v1/tokens', {
    params: {
      'workid': workid
    }
  })
}

/**
 * 获取用户信息
 * @param {*} workid
 */
export const getUserInfo = (workid) => {
  return client.get('auth/v1/users', {
    params: {
      'workid': workid
    }
  })
}

/**
 * 获取用户头像路径
 * @param {*} workid
 */
export const getUserAvator = (workid) => {
  return process.env.VUE_APP_IS_API + '/auth/v1/resources?workid=' + workid + '&t=' + Date.now()
}

/**
 * 更新用户信息
 * @param {*} workid
 * @param {*} info
 */
export const updateUserInfo = (info) => {
  return client.patch('auth/v1/users', {
    'info': info
  })
}
/**
 * 更新用户信息(受控)
 * @param {*} workid
 * @param {*} info
 */
export const updateUserLimitInfo = (workid, info) => {
  return client.patch('auth/v1/users', {
    'workid': workid,
    'info': info
  })
}

/**
 * 上传头像
 * @param {*} file
 */
export const uploadAvator = (file) => {
  var params = new FormData()
  params.append('file', file, file.name)
  return client.post('auth/v1/resources', params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
 * 生成认证字符串
 * @param {*} workid
 * @param {*} token
 */
export const getAuthorizationString = (workid, token) => {
  return 'spoon ' + btoa('id=' + workid + '&token=' + token)
}

/**
 * 修改密码
 * @param {*} oldpassword
 * @param {*} newpassword
 */
export const changePassword = (oldpassword, newpassword) => {
  return client.patch('auth/v1/users', {
    info: {
      'password': {
        'oldpassword': oldpassword,
        'newpassword': newpassword
      }
    }
  })
}

/**
 *
 * @param {*} workid
 * @param {*} password
 */
export const resetPassword = (workid, password) => {
  return client.patch('auth/v1/users', {
    'workid': workid,
    'password': password
  })
}
/**
 * 获取用户列表
 */
export const listUsers = (option) => {
  return client.get('auth/v1/users', {
    params: {
      option: Base64.encode(JSON.stringify(option))
    }
  })
}

/**
 * 关联用户分组
 *
 * @param {string} workid 工号
 * @param {string} groupname 分组名称
 * @param {boolean} assign  设定/取消
 */
export const linkUserGroup = ({
  workid,
  groupname,
  assign
}) => {
  var data = {
    'workid': workid,
    'groupname': groupname
  }
  if (assign) {
    return client.put('auth/v1/users', data)
  } else {
    return client.delete('auth/v1/users', {
      params: data
    })
  }
}

/**
 * 关联用户角色
 *
 * @param {string} workid 工号
 * @param {string} rolename 角色名称
 * @param {boolean} assign  设定/取消
 */
export const linkUserRole = ({
  workid,
  rolename,
  assign
}) => {
  var data = {
    'workid': workid,
    'rolename': rolename
  }
  if (assign) {
    return client.put('auth/v1/users', data)
  } else {
    return client.delete('auth/v1/users', {
      params: data
    })
  }
}

/**
 * 列举角色下所有用户
 * @param {string} rolename
 */
export const listUserByRole = (rolename) => {
  return client.get('auth/v1/users', {
    params: {
      'rolename': rolename
    }
  })
}

/**
 * 列举分组下所有用户
 */
export const listUsersByGroup = (groupname) => {
  return client.get('auth/v1/users', {
    params: {
      'groupname': groupname
    }
  })
}

/** ******************************************************
 * 角色类API
 *******************************************************/

/**
 * 获取所有角色
 */
export const listRoles = () => {
  return client.get('auth/v1/roles')
}

/**
 * 获取用户角色
 */
export const listRolesByUser = (workid) => {
  return client.get('auth/v1/roles', {
    params: {
      'workid': workid
    }
  })
}

/**
 * 获取权限相关的角色
 */
export const listRolesByPermission = (permissionname) => {
  return client.get('auth/v1/permissions', {
    'permissionname': permissionname
  })
}

/**
 * 新建角色
 */
export const createRole = ({
  role,
  desc
}) => {
  return client.post('auth/v1/roles', {
    'rolename': role,
    'description': desc
  })
}

/**
 * 更新角色
 */
export const updateRole = ({
  id,
  info
}) => {
  return client.patch('auth/v1/roles', {
    'roleid': id,
    'info': info
  })
}

/**
 * 关联角色权限
 *
 * @param {string} role 角色名称
 * @param {string} permission 权限名称
 * @param {boolean} assign  设定/取消
 */
export const linkRolePermission = ({
  role,
  permission,
  assign
}) => {
  var data = {
    'rolename': role,
    'permissionname': permission
  }
  if (assign) {
    return client.put('auth/v1/roles', data)
  } else {
    return client.delete('auth/v1/roles', {
      params: data
    })
  }
}

/** ******************************************************
 * 权限类API
 *******************************************************/

/**
 * 获取所有权限
 */
export const listPermissions = () => {
  return client.get('auth/v1/permissions')
}

/**
 * 获取角色相关权限
 */
export const listPermissionsByRole = (rolename) => {
  return client.get('auth/v1/permissions', {
    params: {
      'rolename': rolename
    }
  })
}

/**
 * 新建权限
 */
export const createPermission = ({
  permission,
  desc
}) => {
  return client.post('auth/v1/permissions', {
    'permission': permission,
    'description': desc
  })
}

/**
 * 更新权限
 */
export const updatePermission = ({
  id,
  info
}) => {
  return client.patch('auth/v1/permissions', {
    'permissionid': id,
    'info': info
  })
}

/** ******************************************************
 * 分组类API
 *******************************************************/

/**
 * 获取所有分组
 */
export const listGroups = () => {
  return client.get('auth/v1/groups')
}

/**
 * 获取用户分组
 * @param {string} workid 工号
 */
export const listGroupsByUser = (workid) => {
  return client.get('auth/v1/groups', {
    params: {
      'workid': workid
    }
  })
}

/**
 * 新建分组
 */
export const createGroup = ({
  group,
  desc,
  role
}) => {
  return client.post('auth/v1/groups', {
    'groupname': group,
    'description': desc,
    'rolename': role
  })
}

/**
 * 更新分组
 */
export const updateGroup = ({
  groupname,
  info
}) => {
  return client.patch('auth/v1/groups', {
    'groupname': groupname,
    'info': info
  })
}
