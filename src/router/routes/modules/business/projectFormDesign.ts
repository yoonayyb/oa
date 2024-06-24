import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const permission: AppRouteModule = {
  path: '/project-formDesign',
  name: 'Project-formDesign',
  component: LAYOUT,
  meta: {
    hideMenu: true,
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '项目表单设计',
  },
  children: [
    {
      path: 'formDesign',
      name: 'formDesign',
      meta: {
        title: '项目表单设计器',
      },
      component: () => import('/@/views/project-formDesign/index.vue'),
    },
  ],
};

export default permission;
