import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();

const locationTypeOption = [
  {
    label: '存放库位',
    value: 10,
  },
  {
    label: '生产车间',
    value: 20,
  },
  {
    label: '质检库位',
    value: 30,
  },
];

export const userSchemaFn = () => {
  const headerSchema = [
    {
      field: 'locationName',
      label: '库位名称',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'locationType',
      label: '库位类型',
      component: 'Select',
      componentProps: {
        options: locationTypeOption,
      },
      colProps: { span: 6 },
    },
    {
      field: 'contacts',
      label: '联系人',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
  const columns = [
    {
      title: '库位名称',
      dataIndex: 'locationName',
    },
    {
      title: '库位类型',
      dataIndex: 'locationType',
      customRender: ({ record }) => {
        return locationTypeOption.find((v) => v.value === record.locationType)?.label;
      },
    },
    {
      title: '库位描述',
      dataIndex: 'locationDescription',
    },
    // {
    //   title: '托架容量',
    //   dataIndex: 'storageCapacity',
    // },
    {
      title: '托架数量',
      dataIndex: 'bracketQuantity',
    },

  ]


  const headerDetailSchema = [
    {
      field: 'locationName',
      label: '库位名称',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'locationType',
      label: '库位类型',
      component: 'Select',
      componentProps: {
        options: locationTypeOption,
      },
      colProps: { span: 6 },
    },
    {
      field: 'contacts',
      label: '联系人',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
  const detailColumns = [
    {
      title: '库位名称',
      dataIndex: 'locationName',
    },
    {
      title: '库位类型',
      dataIndex: 'locationType',
      customRender: ({ record }) => {
        return locationTypeOption.find((v) => v.value === record.locationType)?.label;
      },
    },
    {
      title: '库位描述',
      dataIndex: 'locationDescription',
    },
    {
      title: '托架容量',
      dataIndex: 'storageCapacity',
    },
    {
      title: '托架数量',
      dataIndex: 'bracketQuantity',
    },
  ]

  const formDetailSchema = [
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
      required: true,
    },
    {
      field: 'locationName',
      label: '库位名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'locationType',
      label: '库位类型',
      component: 'Select',
      componentProps: {
        options: locationTypeOption,
      },
      required: true,
    },


    // {
    //   field: 'storageCapacity',
    //   label: '库位容量',
    //   component: 'Input',
    //   required: true,
    // },
    // {
    //   field: 'bracketQuantity',
    //   label: '托架数量',
    //   component: 'Input',
    //   required: true,
    // },
    {
      field: 'locationDescription',
      label: '库位描述',
      component: 'InputTextArea',
    },


  ];
  return {
    headerSchema,
    columns,
    headerDetailSchema,
    formDetailSchema,
    detailColumns,
  };
};
