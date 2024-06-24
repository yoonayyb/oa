import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { getSpecsStr } from '@/utils/business/index';
import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();

const warehouseTypeOption = [
  {
    label: '仓库',
    value: 10,
  },
  {
    label: '工厂',
    value: 20,
  },
  {
    label: '自提点',
    value: 30,
  },
];
const dateUnit = {
  DAY: '天',
  MONTH: '月',
  YEAR: '年',
}

export const userSchemaFn = () => {
  const headerSchema = [
    {
      field: 'bracketNo',
      label: '托架号',
      component: 'Input',
      colProps: { span: 6 },
    },
    // {
    //   field: 'warehouseId',
    //   label: '所属仓库',
    //   component: 'Select',
    //   componentProps: {
    //     fieldNames: { label: 'name', value: 'id' },
    //     optionFilterProp: 'name',
    //     showSearch: true,
    //     options: configStore.getWarehouseOptions || []
    //   },
    //   colProps: { span: 6 },

    //   required: true,
    // },
    {
      field: 'locationId',
      label: '所属库位',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'locationName',
        valueField: 'id',
        // labelInValue: true,
        api: async () => {
          const data = await window.http.post({
            url: '/erp-ware/locationManage/list',
          });
          return data
        },
      },
      colProps: { span: 6 },
    },
    {
      field: 'status',
      label: '启用状态',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '启用',
            value: 0,
          },
          {
            label: '停用',
            value: 1,
          },
        ],
      },
      colProps: { span: 6 },
    },


  ];
  const columns = [
    {
      title: '托架号',
      dataIndex: 'bracketNo',
    },
    // {
    //   title: '所属仓库',
    //   dataIndex: 'warehouseName',
    // },
    {
      title: '所属库位',
      dataIndex: 'locationName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'is_enable',
      width: 80,
      customRender: ({ record }) => {
        const status = record.status === 0;
        const color = status ? 'green' : 'red';
        const text = status ? '启用' : '停用';
        return h(Tag, { color: color }, () => text);
      },
    },
    {
      title: '创建人',
      dataIndex: 'createdUsername',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },

  ]
  const bracketContentColumns = [
    {
      title: '产品编号',
      dataIndex: 'productNo',
      width: '65px'

    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '产品批次号',
      dataIndex: 'batchNumber',
      width: '120px'

    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecs',
      customRender: ({ record }) => {
        return getSpecsStr(record, 'package')
      },
    },
    {
      title: '装盒规格',
      dataIndex: 'boxingQuantity',
      customRender: ({ record }) => {
        return getSpecsStr(record, 'boxing')
      },
    },
    {
      title: '装箱规格',
      dataIndex: 'packingQuantity',
      customRender: ({ record }) => {
        return getSpecsStr(record, 'packing')
      },
    },
    {
      title: '规格单位',
      dataIndex: 'dosageUnit',
      width: '100px'
    },
    {
      title: '库存数量',
      dataIndex: 'remainAmount',
    },
    {
      title: '生产日期',
      dataIndex: 'produceDate',
    },
    {
      title: '保质期',
      dataIndex: 'validPeriod',
      customRender: ({ record }) => {
        return record.validPeriod + dateUnit[record.validPeriodUnit]
      },
    },
    {
      title: '失效日期',
      dataIndex: 'expirationDate',
    },
  ]

  const formSchema = [
    {
      field: 'bracketNo',
      label: '托架号',
      component: 'Input',
      required: true,
    },
    {
      field: 'locationObj',
      label: '所属库位',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'locationName',
        valueField: 'id',
        labelInValue: true,
        api: async () => {
          const data = await window.http.post({
            url: '/erp-ware/locationManage/list',
          });
          return data
        },
      },
      required: true,
    },
    {
      field: 'status',
      label: '状态',
      component: 'RadioButtonGroup',
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '启用', value: 0 },
          { label: '停用', value: 1 },
        ],
      },
      required: true,
    },
    {
      field: 'remark',
      label: '备注',
      component: 'InputTextArea',
    },


  ];
  const bracketContentFormSchema = [{
    field: 'system_address_id',
    label: '',
    colProps: { span: 23 },
    slot: 'form-title',
  },]
  return {
    headerSchema,
    formSchema,
    columns,
    bracketContentFormSchema,
    bracketContentColumns,
  };
};
