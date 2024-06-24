import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/user_center/menu_api/tree',
  saveMenuList = '/user_center/menu_api/save',

}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};
export const saveMenuList = (params) => {
  return defHttp.post<getMenuListResultModel>({ url: Api.saveMenuList, params });
};