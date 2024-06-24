import { defineStore } from 'pinia';
import { store } from '/@/store';
import { getLocalMainOptions, setLocalMainOptions, getWarehouseOptions, setWarehouseOptions } from '/@/utils/auth';
import { LOCAL_MAIN_OPTIONS, LOCAL_WAREHOUSE_OPTIONS } from '/@/enums/cacheEnum';
export const useConfigStore = defineStore('config', {
  state: () => ({
    inventoryStatusOption,
    whereaboutsOption,
    transferWhereaboutsOption,
    transferWhereaboutsBtnOption,
    operationTypeOption,
    dayOption,
    unitOptions,
    staffTypeOption,
    staffStatusOption,
    currentMainId: '',
    currentMainLabel: '',
    formDesignId: 0,
    mainOptions: [],
    currentWarehouseId: '',
    warehouseOptions: [],
  }),
  getters: {
    getCurrentMainId(state) {
      return state.currentMainId || localStorage.getItem('companyId')
    },
    getMainOptions(state) {
      return state.mainOptions.length > 0 ? state.mainOptions : getLocalMainOptions<string>(LOCAL_MAIN_OPTIONS);
    },
    getCurrentWarehouseId(state) {
      return state.currentWarehouseId || localStorage.getItem('warehouseId')
    },
    getWarehouseOptions(state) {
      return state.warehouseOptions.length > 0 ? state.warehouseOptions : getWarehouseOptions<string>(LOCAL_WAREHOUSE_OPTIONS);
    },
  },
  actions: {
    setCurrentMainId(id): void {
      this.currentMainId = id;
      localStorage.setItem('companyId', id);
    },
    setCurrentMainLabel(name): void {
      this.currentMainLabel = name;
      localStorage.setItem('companyName', name);
    },
    setMainOptions(options) {
      this.mainOptions = options;
      setLocalMainOptions(LOCAL_MAIN_OPTIONS, options)
    },
    setCurrentWarehouseId(id): void {
      this.currentWarehouseId = id;
      console.log('[ id ]-46', id)
      localStorage.setItem('warehouseId', id);
    },
    setWarehouseOptions(options) {
      this.warehouseOptions = options;
      setWarehouseOptions(LOCAL_WAREHOUSE_OPTIONS, options)
    },
  }
})
// Need to be used outside the setup
export function useConfigStoreWithOut() {
  return useConfigStore(store);
}



const staffTypeOption = [
  {
    label: '无类型',
    value: 0,
  },
  {
    label: '全职',
    value: 1,
  },
  {
    label: '兼职',
    value: 2,
  },
  {
    label: '实习',
    value: 3,
  },
  {
    label: '劳务派遣',
    value: 4,
  },
  {
    label: '退休返聘',
    value: 5,
  },
  {
    label: '劳务外包',
    value: 6,
  },
]
const staffStatusOption = [
  {
    label: '试用',
    value: 0,
  },
  {
    label: '正式',
    value: 1,
  },
]


const unitOptions = [
  { label: '盒', value: '盒' },
  { label: '罐', value: '罐' },
  { label: '瓶', value: '瓶' },
  { label: '袋', value: '袋' },
  { label: '包', value: '包' },
  { label: '箱', value: '箱' },
  { label: '桶', value: '桶' },
  { label: '件', value: '件' },
  { label: '板', value: '板' },
  { label: '块', value: '块' },
  { label: '片', value: '片' },
  { label: '条', value: '条' },
  { label: '支', value: '支' },
  { label: '剂', value: '剂' },
]

const dayOption = [
  { label: '天', value: 'DAY' },
  { label: '月', value: 'MONTH' },
  { label: '年', value: 'YEAR' },
];
//托架状态
const inventoryStatusOption = [

  {
    value: 1,
    label: '可用',
  },
  // {
  //   value: 0,
  //   label: '待检',
  // },
  {
    value: -1,
    label: '冻结',
  },
  // {
  //   value: -2,
  //   label: '退货',
  // },


];
const whereaboutsOption = [
  // {
  //   value: 10,
  //   label: '换货',
  // },
  // {
  //   value: 20,
  //   label: '转仓',
  // },
  // {
  //   value: 30,
  //   label: '销毁',
  // },
  {
    value: 0,
    label: '换货',
  }, {
    value: 1,
    label: '移库',
  },
  {
    value: 2,
    label: '转仓',
  },
  {
    value: 3,
    label: '销毁',
  },
  {
    value: -1,
    label: '售卖',
  },
  {
    value: -2,
    label: '过期',
  },
  {
    value: -3,
    label: '生产',
  },
  {
    value: -4,
    label: '退货',
  },

  {
    value: 100,
    label: '其他',
  },

];
const transferWhereaboutsOption = [
  {
    value: -1,
    label: '已驳回',
  },
  {
    value: 0,
    label: '申请中',
  },
  {
    value: 1,
    label: '已同意',
  },
  {
    value: 2,
    label: '已拣货',
  },
  {
    value: 3,
    label: '已出仓',
  },
  {
    value: 4,
    label: '已出仓',
  },
  {
    value: 5,
    label: '已签收',
  },
  {
    value: 6,
    label: '已检查',
  },
];
const transferWhereaboutsBtnOption = [
  {
    value: -1,
    label: '申请',
  },
  {
    value: 0,
    label: '审核',
  },
  {
    value: 1,
    label: '拣货',
  },
  {
    value: 2,
    label: '出仓',
  },
  {
    value: 3,
    label: '签收',
  },
  {
    value: 4,
    label: '签收',
  },
  {
    value: 5,
    label: '检查',
  },
  // {
  //   value: 5,
  //   label: '已检查',
  // },
];


const operationTypeOption = [
  {
    value: 10,
    label: '入库',
  },
  {
    value: 20,
    label: '出库',
  },
  {
    value: 30,
    label: '移库',
  },
  {
    value: 40,
    label: '盘点',
  },
  {
    value: 50,
    label: '拆包',
  },
];