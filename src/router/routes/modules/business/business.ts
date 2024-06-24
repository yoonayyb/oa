import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
const business : AppRouteModule[] = [
  {
    path: '/project',
    name: 'Project',
    component: LAYOUT,
    redirect: '/project/projectList',
    meta: {
      orderNo: 1,
      icon: 'ion:build-outline',
      title: '项目管理',
    },
    children: [
      {
        path: 'projectList',
        name: 'projectList',
        meta: {
          title: '项目列表',
        },
        component: () => import('/@/views/project/projectList/index.vue'),
      },
      {
        path: 'approveList',
        name: 'approveList',
        meta: {
          hideMenu: true,
          title: '审批列表',
        },
        component: () => import('/@/views/project/approveList/index.vue'),
      },
    ],
  },

  //订单管理
  {
    path: '/order',
    name: 'Order',
    component: LAYOUT,
    redirect: '/order/orderList',
    meta: {
      orderNo: 1,
      icon: 'lets-icons:order',
      title: '订单管理',
    },
    children: [
      {
        path: 'orderList',
        name: 'OrderList',
        meta: {
          title: '订单中心',
        },
        component: () => import('/@/views/order/orderList/index.vue'),
      },
      {
        path: 'customsList',
        name: 'CustomsList',
        meta: {
          title: '报单中心',
        },
        component: () => import('/@/views/order/customsList/index.vue'),
      },
    ],
  },
  //发货管理
  {
    path: '/sendoutgoodsManage',
    name: 'SendoutgoodsManage',
    component: LAYOUT,
    redirect: '/sendoutgoodsManage/retail',
    meta: {
      orderNo: 1,
      icon: 'iconamoon:delivery-bold',
      title: '发货管理',
    },
    children: [
      {
        path: 'retail',
        name: 'Retail',
        meta: {
          title: '零售发货',
        },
        component: () => import('/@/views/sendoutgoodsManage/retail/index.vue'),
      },
      {
        path: 'batch',
        name: 'Batch',
        meta: {
          title: '批量发货',
        },
        component: () => import('/@/views/sendoutgoodsManage/batch/index.vue'),
      },
    ],
  },

  //货品管理
  {
    path: '/goodsManage',
    name: 'goodsManage',
    component: LAYOUT,
    redirect: '/goodsManage/retail',
    meta: {
      orderNo: 1,
      icon: 'ep:goods-filled',
      title: '货品管理',
    },
    children: [
      {
        path: 'goods',
        name: 'Goods',
        meta: {
          title: '商品管理',
        },
        component: () => import('/@/views/goodsManage/goods/index.vue'),
      },
      {
        path: 'product',
        name: 'Product',
        meta: {
          title: '代号册',
          orderNo: 1,
        },
        component: LAYOUT,
        redirect: '/goodsManage/material',
        children: [
          {
            path: 'material',
            name: 'Material',
            meta: {
              title: '物料列表',
            },
            component: () => import('/@/views/goodsManage/material/index.vue'),
          },
        ],
      },
    ],
  },
  // 库存管理
  {
    path: '/inventoryManage',
    name: 'InventoryManage',
    component: LAYOUT,
    redirect: '/inventoryManage/inventoryList',
    meta: {
      orderNo: 1,
      icon: 'material-symbols:warehouse-outline',
      title: '库存管理',
    },
    children: [
      {
        path: 'inventoryList',
        name: 'InventoryList',
        meta: {
          title: '库存列表',
        },
        component: () => import('/@/views/InventoryManage/inventoryList/index.vue'),
      },
      {
        path: 'outbound',
        name: 'Outbound',
        meta: {
          title: '出库',
          currentActiveMenu: '/inventoryManage/inventoryList',
          hideMenu: true,
        },
        component: () => import('/@/views/InventoryManage/inventoryList/outbound.vue'),
      },
      {
        path: 'transferStock',
        name: 'TransferStock',
        meta: {
          title: '移库',
          currentActiveMenu: '/inventoryManage/inventoryList',
          hideMenu: true,
        },
        component: () => import('/@/views/InventoryManage/inventoryList/transferStock.vue'),
      },
      {
        path: 'supplierList',
        name: 'SupplierList',
        meta: {
          title: '供应商列表',
        },
        component: () => import('/@/views/InventoryManage/supplierList/index.vue'),
      },
      {
        path: 'manufacturerList',
        name: 'ManufacturerList',
        meta: {
          title: '生产商列表',
        },
        component: () => import('/@/views/InventoryManage/manufacturerList/index.vue'),
      },
      {
        path: 'warehouseList',
        name: 'WarehouseList',
        meta: {
          title: '仓库列表',
        },
        component: () => import('/@/views/InventoryManage/warehouseList/index.vue'),
      },
      {
        path: 'locationList',
        name: 'LocationList',
        meta: {
          title: '库位列表',
        },
        component: () => import('/@/views/InventoryManage/locationList/index.vue'),
      },
      {
        path: 'locatTransferStockRecord',
        name: 'LocatTransferStockRecord',
        meta: {
          title: '库位-移库记录',
          currentActiveMenu: '/inventoryManage/locationList',
          hideMenu: true,
        },
        component: () =>
          import('/@/views/InventoryManage/locationList/locatTransferStockRecord.vue'),
      },
      {
        path: 'bracketList',
        name: 'BracketList',
        meta: {
          title: '托架列表',
        },
        component: () => import('/@/views/InventoryManage/bracketList/index.vue'),
      },

      {
        path: 'bracketContent',
        name: 'BracketContent',
        meta: {
          title: '托架内容',
          currentActiveMenu: '/inventoryManage/bracketList',
          hideMenu: true,
        },
        component: () => import('/@/views/InventoryManage/bracketList/bracketContent.vue'),
      },
      {
        path: 'bracketTransRecord',
        name: 'BracketTransRecord',
        meta: {
          title: '托架移库记录',
          currentActiveMenu: '/inventoryManage/bracketList',
          hideMenu: true,
        },
        component: () => import('/@/views/InventoryManage/bracketList/bracketTransRecord.vue'),
      },
    ],
  },
  //组织管理
  {
    path: '/organization',
    name: 'Organization',
    component: LAYOUT,
    redirect: '/organization/retail',
    meta: {
      orderNo: 1,
      icon: 'clarity:organization-solid',
      title: '组织管理',
    },
    children: [
      {
        path: 'main',
        name: 'Main',
        meta: {
          title: '主体列表',
        },
        component: () => import('/@/views/organization/main/index.vue'),
      },
      {
        path: 'address',
        name: 'Address',
        meta: {
          title: '通讯录列表'
        },
        component: () => import('/@/views/organization/address/index.vue'),
      },
      {
        path: 'member',
        name: 'Member',
        meta: {
          title: '成员列表'
        },
        component: () => import('/@/views/organization/member/index.vue'),
      },

    ],
  },

];

export default business;
