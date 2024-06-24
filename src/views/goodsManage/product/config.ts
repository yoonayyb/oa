import { useConfigStore } from '@/store/modules/config';
import { getSpecsStr } from '@/utils/business/index';

const { unitOptions, dayOption } = useConfigStore();

const warehouseTypeOption = [
  { label: '产品', value: 10, },
  { label: '工厂', value: 20, },
  { label: '自提点', value: 30, },
];


export const userSchemaFn = () => {
  const headerSchema = [
    {
      field: 'name',
      label: '产品名称',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'name',
      label: '产品编号',
      component: 'Input',
      colProps: { span: 6 },
    },

  ];
  const columns = [
    // {
    //   title: '产品图',
    //   dataIndex: 'name',
    // },

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
      title: '产品注册号',
      dataIndex: 'approvalNumber',
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
      width: '65px'
    },
    // {
    //   title: '库存单位',
    //   dataIndex: 'stockUnit',
    //   width: '65px'
    // },
    {
      title: '成本价',
      dataIndex: 'price',
      width: '80px'
    },

    {
      title: '保质期(单位)',
      dataIndex: 'validPeriod',
      width: '100px',

      customRender: ({ record }) => {
        return `${record.validPeriod}（${dayOption.find((v) => v.value === record.validPeriodUnit)?.label}）`;
      },
    },

    // {
    //   title: '创建人',
    //   dataIndex: 'createdUsername',
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createdTime',
    // },


  ]

  const formSchema = [
    {
      field: 'name',
      label: '产品名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'no',
      label: '产品编号',
      component: 'Input',
      // required: true,
    },
    {
      field: 'type',
      label: '产品类型',
      component: 'Select',
      componentProps: {
        options: warehouseTypeOption,
      },
    },
    {
      field: 'area',
      label: '所属地区',
      component: 'Input',
    },
    {
      field: 'remark',
      label: '备注',
      component: 'InputTextArea',
    },


  ];
  const detailsFormSchema = [
    {
      field: 'productName',
      label: '产品名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'productNo',
      label: '产品编号',
      component: 'Input',
      required: true,
    },

    {
      field: 'categoryId',
      label: '产品分类',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'categoryName',
        valueField: 'id',
        api: async () => {
          const data = await window.http.post({
            url: '/erp-ware/category/list',
            data: {
              categoryModule: 10
            }
          });
          return data
        },
      },
      required: true,

    },
    {
      field: 'approvalNumber',
      label: '产品注册号',
      component: 'Input',
    },
    {
      field: 'pinyin',
      label: '拼音缩写',
      component: 'Input',
    },
    {
      field: 'barCode',
      label: '条形码',
      component: 'Input',
    },

    {
      field: 'dosageUnit',
      label: '规格单位',
      component: 'RadioGroup',
      defaultValue: 'g',
      componentProps: {
        options: [
          { label: 'g', value: 'g', },
          { label: 'ml', value: 'ml', },
        ],
      },
      required: true,

    },


    {
      field: 'supplierId',
      label: '供应商',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'name',
        valueField: 'id',
        // labelInValue: true,
        api: async () => {
          const data = await window.http.post({
            url: '/erp-ware/supplier/list',
          });
          return data
        },
      },
      required: true,

    },

    // {
    //   field: 'stockUnit',
    //   label: '库存单位',
    //   component: 'Select',
    //   componentProps: {
    //     options: unitOptions,
    //   },
    //   required: true,
    // },



    {
      field: 'price',
      label: '成本价',
      slot: 'price',
    },

    {
      field: 'manufacturerId',
      label: '生产商',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'name',
        valueField: 'id',
        // labelInValue: true,
        api: async () => {
          const data = await window.http.post({
            url: '/erp-ware/manufacturer/list',
          });
          return data
        },
      },
      required: true,

    },

    {
      field: 'packageSpecs',
      label: '包装规格',
      slot: 'packageSpecs',
      itemProps: {
        class: 'ant-form-item-cunstom'
      },
      rules: [{ required: true, message: '' }]
    },
    {
      field: 'packageQuantity',
      label: '包装规格数量',
    },
    {
      field: 'packageUnit',
      label: '包装规格单位',
    },


    {
      field: 'inventoryAlertQuantity',
      label: '库存预警数量',
      component: 'InputNumber',
    },




    {
      field: 'boxingQuantity',
      label: '装盒规格',
      slot: 'boxingQuantity',
      itemProps: {
        class: 'ant-form-item-cunstom'
      },
      rules: [{ required: true, message: '' }]

    },
    // {
    //   field: 'boxingQuantity',
    //   label: '装盒规格数量',
    // },
    {
      field: 'boxingUnit',
      label: '装盒规格单位',
    },
    {
      field: 'validPeriodUnit',
      label: '有效期单位',
      defaultValue: 'DAY'
    },
    {
      field: 'validPeriod',
      label: '有效期',
      slot: 'validPeriod',
      rules: [{ required: true, message: '' }],
      itemProps: {
        class: 'ant-form-item-cunstom'
      },
    },



    {
      field: 'packingQuantity',
      label: '装箱规格',
      slot: 'packingQuantity',
      itemProps: {
        class: 'ant-form-item-cunstom'
      },
      rules: [{ required: true, message: '' }]
    },
    // {
    //   field: 'packingQuantity',
    //   label: '装箱规格数量',
    // },
    {
      field: 'packingUnit',
      label: '装箱规格单位',
    },
    {
      field: 'status',
      label: '状态',
      component: 'RadioGroup',
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '启用', value: 0, },
          { label: '禁用', value: 1, },
        ],
      },
      required: true,
    },
    // {
    //   field: 'avatar',
    //   label: '产品图',
    //   component: 'Aupload',
    //   componentProps: {
    //     defaultImageList: [],
    //     onChange: (value) => {
    //       console.log('[ value ]-83', value)
    //     },
    //   },
    // },
  ];

  return {
    headerSchema,
    formSchema,
    columns,
    detailsFormSchema,
  };
};
