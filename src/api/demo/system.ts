import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AccountList = '/user_center/user_api/index',
  IsAccountExist = '/system/accountExist',
  DeptList = '/company_center/department_api/tree',
  saveUserList = '/user_center/user_api/save',
  saveMeUserList = '/user_center/user_api/update',
  saveUserRole = '/user_center/user_role_api/save',
  getUserRole = '/user_center/user_role_api/index',
  setRoleStatus = '/user_center/role_api/save',
  MenuList = '/user_center/menu_api/tree',
  getRoleInfo = "/user_center/role_menu_api/all",
  RolePageList = '/user_center/role_api/all',
  GetAllRoleList = '/user_center/role_api/all',
  addRoleInfo = "/user_center/role_menu_api/save",
  saveRoleInfo = "/user_center/role_api/save",
  delRole = "/user_center/role_api/del",
  log = "/basic_center/operation_log_api/list"
}

export const getAccountList = (params : AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params ?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });
export const getLogtList = (params ?: DeptListItem) =>
    defHttp.get<DeptListGetResultModel>({ url: Api.log, params });

export const getMenuList = (params ?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const getRoleListByPage = (params ?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params ?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

export const setRoleStatus = (id : number, is_enable : number) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, is_enable } });

export const isAccountExist = (account : string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });
export const saveUserList = (params) =>
  defHttp.post({ url: Api.saveUserList, params }, { errorMessageMode: 'none' });
export const saveMeUserList = (params) =>
  defHttp.post({ url: Api.saveMeUserList, params }, { errorMessageMode: 'none' });
export const getRoleInfo = (params) =>
  defHttp.get({ url: Api.getRoleInfo, params }, { errorMessageMode: 'none' });
export const addRoleInfo = (params) =>
  defHttp.post({ url: Api.addRoleInfo, params }, { errorMessageMode: 'none' });
export const saveRoleInfo = (params) =>
  defHttp.post({ url: Api.saveRoleInfo, params }, { errorMessageMode: 'none', });
export const delRole = (params) =>
  defHttp.post({ url: Api.delRole, params }, { errorMessageMode: 'none' });
export const saveUserRole = (params) =>
  defHttp.post({ url: Api.saveUserRole, params }, { errorMessageMode: 'none', successMessageMode: 'message' });
export const getUserRole = (params) =>
  defHttp.post({ url: Api.getUserRole, params }, { errorMessageMode: 'none' });
