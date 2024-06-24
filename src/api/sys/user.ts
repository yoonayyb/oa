import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();
enum Api {
  Login = '/user_center/auth_api/login_username',
  mobileLoginApi = '/user_center/auth_api/login_mobile',
  Logout = '/logout',
  GetUserInfo = '/user_center/user_api/info',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  GetUserMenu = '/user_center/menu_api/user_menu',
}

/**
 * @description: user login api
 */
export function mobileLoginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.mobileLoginApi,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}
export function getUserMenu() {
  return defHttp.get({ url: Api.GetUserMenu });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}


export const getCurrentInfo = (getKey, setKey, options) => {
  console.log('[ options ]-22', options)
  const invalidConditions = [null, undefined, ''];
  //上次登录存在本地的id
  let currentId = configStore[getKey];
  // 获取 options中第一个item
  let findVal = options.find((v) => v.id)?.id || '';
  // // 如果id为假值 则使用能找到的第一个item
  if (invalidConditions.includes(currentId)) {
    configStore[setKey](findVal);
  } else {
    //有id 而且能在账号的options里找到相关item 则直接选中该数据 否则渲染能找到的第一个item
    let { id: currCompanyVal } = options.find((v) => v.id == currentId) || {};
    configStore[setKey](currCompanyVal || findVal);
  }
};
export const getCurrentMainOption = async (user_id) => {
  const data = await window.http.get({
    url: '/company_center/company_api/my_company',
    params: { user_id },
  });
  configStore.setMainOptions(data);
  return data
};
export const getWarehouseOptions = async (user_id) => {
  const data = await window.http.post({
    url: '/erp-ware/warehouse/shipperWarehouseList',
  });
  configStore.setWarehouseOptions(data);
  return data
};


export const getMainAndWarehouseInfo = async (userInfo) => {
  // 设置主体信息
  const mainOptions = await getCurrentMainOption(userInfo.id)
  getCurrentInfo('getCurrentMainId', 'setCurrentMainId', mainOptions);

  //只有发货员和超管 有仓库
  const roles = ['IDENTIFY_SHIPPER', 'IDENTIFY_ADMIN'];
  const myRoles = userInfo?.roles?.some((v) => roles.includes(v.identify));
  if (myRoles) {
    // 设置仓库信息
    const warehouseOptions = await getWarehouseOptions(userInfo.id)
    getCurrentInfo('getCurrentWarehouseId', 'setCurrentWarehouseId', warehouseOptions);
  }
}