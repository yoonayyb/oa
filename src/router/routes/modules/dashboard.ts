import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard : AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/workbench',
  meta: {
    orderNo: 1,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.dashboard'),

  },
  children: [
    {
      path: 'workbench',
      name: 'Workbench',
      component: () => import('/@/views/dashboard/workbench/index.vue'),
      meta: {

        title: t('routes.dashboard.workbench'),
      },
    },
  ],
};

export default dashboard;