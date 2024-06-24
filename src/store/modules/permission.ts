import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { warn } from '/@/utils/log';
import projectSetting from '/@/settings/projectSetting';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE, DASHBOARD } from '/@/router/routes/basic';


import { filter } from '/@/utils/helper/treeHelper';

import { getMenuList } from '/@/api/sys/menu';
import { getPermCode } from '/@/api/sys/user';
import { getUserMenu } from '/@/api/sys/user';

import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';
import { cloneDeep } from 'lodash-es';
import { LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant';
interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList : string[] | number[];
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute : boolean;
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime : number;
  // Backstage menu list
  // 后台菜单列表
  backMenuList : Menu[];
  // 菜单列表
  frontMenuList : Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: () : PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    // menu List
    // 菜单列表
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(state) : string[] | number[] {
      return state.permCodeList;
    },
    getBackMenuList(state) : Menu[] {
      return state.backMenuList;
    },
    getFrontMenuList(state) : Menu[] {
      return state.frontMenuList;
    },
    getLastBuildMenuTime(state) : number {
      return state.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(state) : boolean {
      return state.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList : string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list : Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list : Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added : boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState() : void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode() {
      const codeList = await getPermCode();
      this.setPermCodeList(codeList);
    },

    // 构建路由
    async buildRoutesAction() : Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();

      let routes : AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList) || [];
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

      // 路由过滤器 在 函数filter 作为回调传入遍历使用
      const routeFilter = (route : AppRouteRecordRaw) => {
        const { meta } = route;
        // const userInfo = userStore.getUserInfo
        // console.log('userInfo', userInfo)
        // 抽出角色
        const { roles } = meta || {};
        if (!roles) return true;
        // 进行角色权限判断
        return roleList.some((role) => roles.includes(role));
      };
      const dynamicImport = (
        dynamicViewsModules : Record<string, () => Promise<unknown>>,
        component : string,
      ) => {
        const keys = Object.keys(dynamicViewsModules);
        const matchKeys = keys.filter((key) => {
          const k = key.replace('../../views', '');
          const startFlag = component.startsWith('/');
          const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
          const startIndex = startFlag ? 0 : 1;
          const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
          return k.substring(startIndex, lastIndex) === component;
        });
        if (matchKeys?.length === 1) {
          const matchKey = matchKeys[0];
          return dynamicViewsModules[matchKey];
        } else if (matchKeys?.length > 1) {
          warn(
            'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
          );
          return;
        } else {
          warn(
            '在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!',
          );
          return EXCEPTION_COMPONENT;
        }
      };
      const routeRemoveIgnoreFilter = (route : AppRouteRecordRaw) => {
        const { meta } = route;
        // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
        const { ignoreRoute } = meta || {};
        // arr.filter 返回 true 表示该元素通过测试
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes : AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath : string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;

        function patcher(routes : AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route : AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }

        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      switch (permissionMode) {
        // 角色权限
        case PermissionModeEnum.ROLE:
          // 对非一级路由进行过滤
          routes = filter(asyncRoutes, routeFilter);

          // 对一级路由根据角色权限过滤
          routes = routes.filter(routeFilter);
          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes);
          break;

        // 路由映射， 默认进入该case
        case PermissionModeEnum.ROUTE_MAPPING:
          //在这里请求当前角色的菜单权限 替换asyncRoutes
          const { menus } = await getUserMenu();
          const reg = (str, bias = '/') => {
            return bias + str.replace(/^\//, '');
          };
          const modules = import.meta.glob('../../views/**/*.{vue,tsx}');
          let orderNo = 1;
          //权限标识
          const btnPermision = [] as any;
          //添加斜杠
          const addSlash = (str) => str.includes('/') ? str : '/' + str;
          // 过滤出按钮权限
          const filterChild = (children) => {
            return children.filter(child => {
              if (child.menu_type === 1) {
                btnPermision.push(child.identify);
                return false; // 从子元素数组中过滤掉 menu_type 为 1 的元素
              }
              return true; // 保留 menu_type 不为 1 的元素
            })
          };

          // 提取重复逻辑的函数
          const processMenuChild = (child, parent ?, currentActiveMenu = '') => {
            orderNo++;
            child.path = child.parent_id ? reg(child.url, '') : reg(child.url);
            child.name = reg(child.path).charAt(0).toUpperCase() + reg(child.path).slice(1);
            child.meta = {
              icon: child.icon,
              title: child.title,
              orderNo,
            };

            if (!parent) {
              //没有parent就是第一层的菜单的列表
              child.component = LAYOUT;
              if (child.children.length) {
                child.redirect = reg(child.url) + reg(child.children[0].url);
                flatmapArr(child.children, child);
              }
            } else {
              child.children = filterChild(child.children);
              // menu_type 菜单类型 0 菜单 1 功能 2 页面
              if (child.menu_type === 0) {
                child.component = dynamicImport(modules, child.identify as string);
                //如果当前页面还有child 就证明需要高亮当前菜单 需要在这里拼接完成
                currentActiveMenu = addSlash(parent.url) + addSlash(child.url);
                child.children.length && flatmapArr(child.children, child, currentActiveMenu);
              } else if (child.menu_type === 2) {
                //2 只是页面  不展示在菜单中
                child.meta = {
                  hideMenu: true,
                  title: child.title,
                  currentActiveMenu,//指向高亮的菜单选项
                };
                child.path = child.url;
                child.component = dynamicImport(modules, child.identify as string);
              }
            }
          };
          //递归处理菜单数组
          const flatmapArr = (menus, parent ?, currentActiveMenu ?) => {
            menus.forEach((child, i) => {
              processMenuChild(child, parent, currentActiveMenu);
            });
          };

          flatmapArr(menus, null);
          this.setPermCodeList(btnPermision);
          console.log('btnPermision: ', btnPermision)
          //这个notfound页面一定要放在开头 DASHBOARD是固定的首页
          routes = [PAGE_NOT_FOUND_ROUTE, DASHBOARD, ...menus];
          console.log('routes1111111111: ', routes)

          // 将路由转换成菜单
          const menuList = transformRouteToMenu(routes, true);
          // 移除掉 ignoreRoute: true 的路由 非一级路由
          routes = filter(routes, routeRemoveIgnoreFilter);
          // 移除掉 ignoreRoute: true 的路由 一级路由；
          routes = routes.filter(routeRemoveIgnoreFilter);
          // 对菜单进行排序
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
          });
          // console.log('menuList', menuList)
          // 设置菜单列表
          this.setFrontMenuList(menuList);

          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes);
          console.log('routes: ', routes)
          break;

        //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
        //  如果确定不需要做后台动态权限，请在下方注释整个判断
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage();

          createMessage.loading({
            content: t('sys.app.menuLoading'),
            duration: 1,
          });

          // !Simulate to obtain permission codes from the background,
          // 模拟从后台获取权限码，
          // this function may only need to be executed once, and the actual project can be put at the right time by itself
          // 这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
          let routeList : AppRouteRecordRaw[] = [];
          try {
            await this.changePermissionCode();
            routeList = (await getMenuList()) as AppRouteRecordRaw[];
          } catch (error) {
            console.error(error);
          }

          // Dynamically introduce components
          // 动态引入组件
          routeList = transformObjToRoute(routeList);

          //  Background routing to menu structure
          //  后台路由到菜单结构
          const backMenuList = transformRouteToMenu(routeList);
          this.setBackMenuList(backMenuList);

          // remove meta.ignoreRoute item
          // 删除 meta.ignoreRoute 项
          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList);
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
          break;
      }

      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
