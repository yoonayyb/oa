
import { getSpecsStr } from '@/utils/business/index';
import { useConfigStoreWithOut } from '/@/store/modules/config';
import { isNumber } from '/@/utils/is';
const configStore = useConfigStoreWithOut();

const warehouseOptions = [{ name: '全部库存', id: 0 }, { name: '全部库存清单', id: -1 }, ...configStore.getWarehouseOptions || []]
const customCellFN = (record, index, type) => {
  const { rowSpan, rowSpan2 } = record;
  // type === 1 就是产品内容的合并
  if (isNumber(rowSpan) && type === 1) {
    // console.log('[ rowSpan ]-10', index, rowSpan, rowSpan2)
    return { rowSpan };
  }
  // type === 2 就是移出库位内容的合并
  if (isNumber(rowSpan2) && type === 2) {
    // console.log('[ rowSpan2 ]-20', index, rowSpan, rowSpan2)
    return { rowSpan: rowSpan2 };
  }
}
export const userSchemaFn = (getOption) => {
  const headerSchema = [
    {
      field: 'warehouseId',
      label: '仓库',
      component: 'Select',
      componentProps: {
        fieldNames: { label: 'name', value: 'id' },
        optionFilterProp: 'name',
        defaultValue: -1,
        showSearch: true,
        allowClear: false,
        options: warehouseOptions
      },
      colProps: { span: 6 },
    },
    {
      field: 'locationId',
      label: '库位',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'locationName',
        valueField: 'id',
        optionFilterProp: 'locationName',
        showSearch: true,
        onHandleFetch: (visible) => {
          getOption('locationId', visible)
        }
      },
      colProps: { span: 6 },
    },
    {
      field: 'productId',
      label: '产品',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'productName',
        valueField: 'id',
        optionFilterProp: 'productName',
        showSearch: true,
        immediate: false,
        api: async () => {
          const data = await window.http.post({
            url: '/erp-ware/product/list',
            data: {}
          });
          return data
        },
      },
      colProps: { span: 6 },
    },
  ];

  const columns = [
    {
      title: '产品编号',
      dataIndex: 'productNo',
      width: 110

    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 100

    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecs',
      width: 80,
      customRender: ({ record }) => {
        return getSpecsStr(record, 'package')
      },
    },
    {
      title: '装盒单位',
      dataIndex: 'boxingUnit',
      width: 60
    },
    {
      title: '规格单位',
      dataIndex: 'dosageUnit',
      width: 60
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      width: 100

    },
    {
      title: '库位',
      dataIndex: 'locationName',
      width: 100,
      // defaultHidden: true,
      // customCell: (...arg) => {

      // }
    },
    {
      title: '托架',
      dataIndex: 'bracketNo',
      width: 100,
      // defaultHidden: true,
      // customCell: (...arg) => {

      // }
    },

    {
      title: '总库存',
      dataIndex: 'remainAmount',
      width: 70
    },
    {
      title: '可用库存',
      dataIndex: 'remainAmountAvailable',
      width: 70
    },
    // {
    //   title: '待检库存',
    //   dataIndex: 'remainAmountInspected',
    //   width: 70
    // },
    {
      title: '冻结库存',
      dataIndex: 'remainAmountFreeze',
      width: 70
    },

    {
      title: '退货库存',
      dataIndex: 'remainAmountReturn',
      width: 70
    },
    {
      title: '180天预警',
      dataIndex: 'expired180',
      width: 80
    },
    {
      title: '90天预警',
      dataIndex: 'expired90',
      width: 80
    },

  ]

  const formSchema = [
    {
      field: 'batchNumber',
      label: '批次号',
      component: 'Input',
      required: true,
    },
    {
      field: 'locationId',
      label: '库位',
      component: 'ApiSelect',
      defaultValue: 10,
      required: true,
      componentProps: {
        options: [
          { label: '产品', value: 10 },
          { label: '物料', value: 20 },
        ],
      },
    },
    {
      field: 'remainAmount',
      label: '入库数量',
      component: 'Input',
      required: true,
    },
    {
      field: 'inventoryType',
      label: '库存类型',
      component: 'Select',
      defaultValue: 10,
      required: true,
      componentProps: {
        options: [
          { label: '产品', value: 10 },
          { label: '物料', value: 20 },
        ],
      },
    },
    {
      field: 'produceDate',
      label: '生产日期',
      component: 'DatePicker',
      defaultValue: 10,
      required: true,
      componentProps: {
        style: {
          width: '100%'
        },
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },

    {
      field: 'warehouseId',
      label: '仓库',
      component: 'Select',
      defaultValue: 10,
      required: true,
      componentProps: {
        options: [
          { label: '产品', value: 10 },
          { label: '物料', value: 20 },
        ],
      },
    },
  ];
  // 子页面头部  入库 出库 移库通用
  const subpagesHeaderSchema = [
    {
      field: 'warehouseId',
      label: '所属仓库',
      component: 'Select',
      componentProps: {
        fieldNames: { label: 'name', value: 'id' },
        optionFilterProp: 'name',
        showSearch: true,
        options: configStore.getWarehouseOptions || []
      },
      colProps: { span: 6 },
      required: true,
    },
    // {
    //   field: 'picList',
    //   label: '入库清单',
    //   component: 'Aupload',
    //   colProps: { span: 6 },
    // },

  ];
  // 入库
  const inboundColumns = [
    {
      title: '产品',
      dataIndex: 'productId',
      width: '120px'
    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecs',
      width: '80px',

    },
    {
      title: '装盒规格',
      dataIndex: 'boxingSpecs',
      width: '80px'
    },
    {
      title: '装箱规格',
      dataIndex: 'packingSpecs',
      width: '80px'
    },
    // {
    //   title: '入库总数',
    //   dataIndex: 'num',
    //   width: '75px',
    //   defaultHidden: true,
    // },
    {
      title: '厂家参数',
      children: [
        {
          title: '厂家批号',
          dataIndex: 'manuBatchNumber',
          width: '120px'
        },
        {
          title: '生产日期',
          dataIndex: 'produceDate',
          width: '110px'

        },
        {
          title: '保质期',
          dataIndex: 'shelfLife',
          width: '80px'

        },
        {
          title: '失效日期',
          dataIndex: 'expirationDate',
          width: '110px'

        },

      ]

    },

    {
      title: '公司参数',
      children: [
        {
          title: '公司批号',
          dataIndex: 'batchNumber',
          width: '120px'

        },
        {
          title: '库位',
          dataIndex: 'locationObj',
          width: '120px'
        },
        {
          title: '托架号',
          dataIndex: 'bracketObj',
          width: '120px'
        },
        {
          title: '入库数量',
          dataIndex: 'amount',
          width: '100px'

        },
        // {
        //   title: '数量',
        //   dataIndex: 'oldAmount',
        // },
      ]

    },


    {
      title: '状态',
      dataIndex: 'inventoryStatus',
      width: '80px',
    },
    {
      title: '图片',
      dataIndex: 'Aupload',
      width: '100px',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '100px',
    },
  ]
  // 移库
  const transferStockColumns = [
    {
      title: '产品',
      dataIndex: 'productId',
      width: '120px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecs',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },

    },
    {
      title: '装盒规格',
      dataIndex: 'boxingSpecs',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '装箱规格',
      dataIndex: 'packingSpecs',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '需移总数',
      dataIndex: 'num',
      width: '75px',
      defaultHidden: true,
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '移出库位',
      children: [
        {
          title: '库位',
          dataIndex: 'locationIdOutObj',
          width: '120px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
        },
        {
          title: '托架号',
          dataIndex: 'bracketIdOutObj',
          width: '110px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },

        },
        {
          title: '批次号',
          dataIndex: 'batchNumberObj',
          width: '110px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },


        },
        {
          title: '移库前库存',
          dataIndex: 'sourceBeforeStock',
          width: '75px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
        },
        {
          title: '移库总数',
          dataIndex: 'allAmount',
          width: '75px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
        },
        {
          title: '移库后库存',
          dataIndex: 'sourceAfterStock',
          width: '75px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
        },

      ]

    },

    {
      title: '移入库位',
      children: [

        {
          title: '库位',
          dataIndex: 'locationIdInObj',
          width: '120px'
        },
        {
          title: '托架号',
          dataIndex: 'bracketIdInObj',
          width: '120px'
        },
        {
          title: '移库前库存',
          dataIndex: 'destinationBeforeStock',
          width: '75px'
        },
        {
          title: '移库数量',
          dataIndex: 'amount',
          width: '75px'
        },
        {
          title: '移库后库存',
          dataIndex: 'destinationAfterStock',
          width: '75px'
        },

      ]

    },
    {
      title: '状态',
      dataIndex: 'inventoryStatus',
      width: '80px',
    },
    {
      title: '图片',
      dataIndex: 'Aupload',
      width: '80px',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '80px',
    },
    // {
    //   width: 100,
    //   title: '操作',
    //   dataIndex: 'action',
    //   customCell: (record, index) => {
    //     return customCellFN(record, index)

    //   }
    // },
  ]

  // 出库
  const outboundColumns = [
    {
      title: '产品',
      dataIndex: 'productId',
      width: '120px'
    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecs',
      width: '80px',

    },
    {
      title: '装盒规格',
      dataIndex: 'boxingSpecs',
      width: '80px'
    },
    {
      title: '装箱规格',
      dataIndex: 'packingSpecs',
      width: '80px'
    },
    // {
    //   title: '出库总数',
    //   dataIndex: 'num',
    //   width: '75px',
    //   defaultHidden: true,
    // },
    {
      title: '库位',
      dataIndex: 'locationObj',
      width: '120px'
    },
    {
      title: '托架号',
      dataIndex: 'bracketObj',
      width: '130px'
    },
    {
      title: '公司批号',
      dataIndex: 'batchNumber',
      width: '130px'
    },
    {
      title: '生产日期',
      dataIndex: 'produceDate',
      width: '110px'

    },
    {
      title: '保质期',
      dataIndex: 'shelfLife',
      width: '80px'

    },
    {
      title: '失效日期',
      dataIndex: 'expirationDate',
      width: '110px'

    },

    // {
    //   title: '进货价',
    //   dataIndex: 'price',
    //   width: '110px'
    // },


    {
      title: '出库前库存',
      dataIndex: 'destinationBeforeStock',
      width: '75px'
    },
    {
      title: '出库数量',
      dataIndex: 'amount',
      width: '75px'
    },
    {
      title: '出库后库存',
      dataIndex: 'destinationAfterStock',
      width: '75px'
    },

    {
      title: '出库类型',
      dataIndex: 'whereabouts',
      width: '75px'
    },

    {
      title: '图片',
      dataIndex: 'Aupload',
      width: '100px',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '100px',
    },
  ]

  const outboundHeaderSchema = [
    {
      field: 'warehouseId',
      label: '所属仓库',
      component: 'Select',
      componentProps: {
        fieldNames: { label: 'name', value: 'id' },
        optionFilterProp: 'name',
        showSearch: true,
        options: configStore.getWarehouseOptions || []
      },
      colProps: { span: 6 },
      required: true,

    },
    // {
    //   field: 'locationId',
    //   label: '库位',
    //   component: 'Select',
    //   componentProps: {
    //     fieldNames: { label: 'locationName', value: 'id' },
    //     optionFilterProp: 'locationName',
    //     showSearch: true,
    //     options: []
    //   },
    //   colProps: { span: 6 },
    //   required: true,

    // },

  ];
  return {
    columns,
    formSchema,
    headerSchema,
    subpagesHeaderSchema,
    outboundHeaderSchema,
    inboundColumns,
    outboundColumns,
    transferStockColumns,
  };
};
