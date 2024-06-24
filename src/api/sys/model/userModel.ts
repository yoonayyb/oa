/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  token?: string;
}

export interface RoleInfo {
  roleName: string;
  identify: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  name: string;
  id: string;
  is_enable: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  // 第一个有权限的路由地址
  homePath?: string;
}
