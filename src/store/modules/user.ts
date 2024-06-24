import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, mobileLoginApi, getMainAndWarehouseInfo } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw, useRoute } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';
import { useConfigStoreWithOut } from '/@/store/modules/config';
import { getUserMenu } from '/@/api/sys/user';
import { LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant';
const configStore = useConfigStoreWithOut();

interface UserState {
  userInfo : Nullable<UserInfo>;
  token ?: string;
  roleList : RoleEnum[];
  sessionTimeout ?: boolean;
  lastUpdateTime : number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: () : UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state) : UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state) : string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state) : RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state) : boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state) : number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info : string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList : RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info : UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag : boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params : LoginParams & {
        goHome ?: boolean;
        mode ?: ErrorMessageMode;
      },
    ) : Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const { token } = await loginApi(loginParams, mode);
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: wxlogin
     */
    async wxlogin(params) {
      try {
        const { token } = params;
        this.setToken(token);
        return this.afterLoginAction(true);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: mobileLogin
     */
    async mobileLogin(
      params : LoginParams & {
        goHome ?: boolean;
        mode ?: ErrorMessageMode;
      },
    ) : Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const { token } = await mobileLoginApi(loginParams, mode);
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async afterLoginAction(goHome ?: boolean) : Promise<GetUserInfoModel | null> {

      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();
      getMainAndWarehouseInfo(userInfo)
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        const { menus } = await getUserMenu();
        const reg = (str, bias = '/') => {
          return bias + str.replace(/^\//, '');
        };
        let arr = []
        const filterChilren = (a) => {
          a.forEach(v => {
            arr.push(v.path || v.url)
            if (v.children?.length) {
              v.children.forEach(e => {
                arr.push(v.url + reg(e.url))
              })
              filterChilren(v.children)
            }
          })
        }
        filterChilren(menus)
        arr = Array.from(new Set(arr));

        console.log('arr: ', arr)

        let firstRoute = arr.find(v =>
          !['/login', '/', '/main-out', '/redirect', '/dashboard', '/share'].includes(v))


        const fullURL = window.location.href;
        // 使用正则表达式匹配查询参数 redirect 的值
        const regex = /[?&]redirect=([^&#]*)/i;
        const match = regex.exec(fullURL);
        const redirect = match ? decodeURIComponent(match[1]) : '';
        // 输出查询参数 redirect 的值
        if (arr.find(v => redirect == v)) {
          firstRoute = redirect
        }
        userInfo && (userInfo.homePath = firstRoute)
        this.setUserInfo(userInfo);

        goHome && (await router.replace(firstRoute || PageEnum.BASE_HOME));

      }
      return userInfo;
    },
    async getUserInfoAction() : Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.identify) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      // if (this.getToken) {
      //   try {
      //     await doLogout();
      //   } catch {
      //     
      //   }
      // }
      const companyId = configStore.getCurrentMainId;
      const warehouseId = configStore.getCurrentWarehouseId;
      const rememberMe = localStorage.getItem('rememberMe')
      const userformData = localStorage.getItem('userformData')
      localStorage.clear();
      location.reload();
      localStorage.setItem('companyId', companyId || '');
      localStorage.setItem('warehouseId', warehouseId || '');
      userformData && localStorage.setItem('userformData', userformData);
      localStorage.setItem('rememberMe', rememberMe);
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {

          await this.logout(true);

        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
