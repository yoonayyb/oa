
import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();
const transferWhereaboutsOption = configStore.transferWhereaboutsOption;
import { popupScrollSelect } from '/@/views/order/customsList/index.js';
const [state] = popupScrollSelect('/basic_center/dictionary_api/select', { type: 'logistics' })

const getWarehouseName = (id, warehouseList) => {
  return warehouseList.find(v => v.id === id)?.name
}
export const userSchemaFn = ({ warehouseList, isFirstLoaded }) => {
  const headerSchema = [
    {
      field: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: transferWhereaboutsOption,
      },
      colProps: { span: 6 },

    },

  ];
  const columns = [
    {
      title: '转出仓',
      dataIndex: 'outWarehouseId',
      width: '110px',
      customRender: ({ record }) => {
        return getWarehouseName(record.outWarehouseId, warehouseList.value)
      },
    },

    {
      title: '转入仓',
      dataIndex: 'inWarehouseId',
      width: '110px',
      customRender: ({ record }) => {
        return getWarehouseName(record.inWarehouseId, warehouseList.value)
      },
    },
    {
      title: '转仓产品',
      dataIndex: 'list',

    },
    {
      title: '申请人',
      dataIndex: 'applyUserIdName',
      width: '80px',
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      width: '110px'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '90px'

      // customRender: ({ record }) => {

      //   return transferWhereaboutsOption.find((v) => v.value === record.status)?.label;
      // },
    },
    {
      title: '审批人',
      dataIndex: 'approvalUserIdName',
      width: '80px',
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      width: '110px'
    },
    {
      title: '拣货人',
      dataIndex: 'pickingUserIdName',
      width: '80px',
    },
    {
      title: '拣货时间',
      dataIndex: 'pickingTime',
      width: '110px'
    },
    {
      title: '出仓人',
      dataIndex: 'outWarehouseUserIdName',
      width: '80px',
    },
    {
      title: '出仓时间',
      dataIndex: 'outWarehouseTime',
      width: '110px'
    },
    {
      title: '签收人',
      dataIndex: 'signInUserIdName',
      width: '80px',
    },
    {
      title: '签收时间',
      dataIndex: 'signIdTime',
      width: '110px'
    },

    {
      title: '检查人',
      dataIndex: 'inWarehouseUserIdName',
      width: '80px',
    },
    {
      title: '检查时间',
      dataIndex: 'inWarehouseTime',
      width: '110px'
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
  const warehouseOutSchema = [
    {
      field: 'shipmentType',
      label: ' ',
      slot: 'btn',
    },
    {
      field: 'logistics',
      label: '物流公司',
      component: 'Select',
      componentProps: ({ formModel }) => {
        return {

          allowClear: true,
          showSearch: true,
          fieldNames: { label: 'key', value: 'value' },
          options: state.options.value,
          onPopupScroll: state.scroll,
          onSearch: async (val) => {
            await state.fetchUser(val, { key: val, type: 'logistics' })
          },
          onChange: async (val) => {
            await state.change(val);
          },
          onDropdownVisibleChange: async (open) => {
            if (open) {
              if (!isFirstLoaded.value || state.options.value.length === 0) {
                isFirstLoaded.value = true;
                await state.requireApi({ type: 'logistics' });
              }
            }
          },
        }
      },
      required: true,
    },
    {
      field: 'locationName',
      label: '快递单号',
      component: 'Input',
      required: true,
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
        // options: configStore.getWarehouseOptions || []
      },
      required: true,
    },
  ];
  return {
    headerSchema,
    columns,
    headerDetailSchema,
    formDetailSchema,
    warehouseOutSchema,
    detailColumns,
  };
};
