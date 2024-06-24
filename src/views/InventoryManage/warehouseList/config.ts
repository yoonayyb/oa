
import { message } from 'ant-design-vue';

import { popupScrollSelect } from '/@/views/order/customsList/index.js';
import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();
const getAreaRecord = async (params) => {
  let data = await window.http.get({
    url: '/basic_center/address_api/list',
    params: { ...params },
  });
  return data;
};

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
const [state] = popupScrollSelect('/company_center/staff_api/select');
export const userSchemaFn = (addressLabel, isFirstLoaded, isChangeFirstLoaded) => {

  const headerSchema = [
    {
      field: 'name',
      label: '仓库名称',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'no',
      label: '仓库编号',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'type',
      label: '仓库类型',
      component: 'Select',
      componentProps: {
        options: warehouseTypeOption,
      },
      colProps: { span: 6 },
    },

  ];
  const columns = [
    {
      title: '仓库名称',
      dataIndex: 'name',
    },
    {
      title: '仓库编号',
      dataIndex: 'no',
    },
    {
      title: '仓库类型',
      dataIndex: 'type',
      customRender: ({ record }) => {
        return warehouseTypeOption.find((v) => v.value === record.type)?.label;
      },
    },
    {
      title: '仓库地址',
      dataIndex: 'area',
    },

    {
      title: '备注',
      dataIndex: 'remark',
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
  const formSchema = [
    // {
    //   field: 'companyId',
    //   label: '适用主体',
    //   component: 'Select',
    //   required: true,
    //   componentProps: {
    //     fieldNames: { label: 'title', value: 'id', },
    //     options: configStore.getMainOptions || []
    //   },
    // },
    {
      field: 'name',
      label: '仓库名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'no',
      label: '仓库编号',
      component: 'Input',
      required: true,
    },
    {
      field: 'type',
      label: '仓库类型',
      component: 'Select',
      componentProps: {
        options: warehouseTypeOption,
      },
      required: true,
    },


    {
      field: 'areaCode',
      component: 'ApiCascader',
      label: '所属地区',
      componentProps: {
        api: getAreaRecord,
        apiParamKey: 'pid',
        labelField: 'name',
        valueField: 'id',
        initFetchParams: {
          parent_id: 0,
        },
        isLeaf: (record) => {
          return !(record.level < 2);
        },
        onChange: (valArr, ...arg) => {
          let str = arg?.map(v => v.label)
          if (str.length) {
            addressLabel.value = str?.join('-')
          }
        },
      },
      required: true,

    },
    {
      field: 'listId',
      label: '发货人列表',
      component: 'Select',
      componentProps: ({ formModel }) => {

        return {
          allowClear: true,
          showSearch: true,
          mode: 'multiple',
          optionFilterProp: 'name',
          fieldNames: { label: 'name', value: 'id' },
          options: state.options.value,
          onPopupScroll: state.scroll,
          onSearch: state.fetchUser,
          onChange: async (val) => {
            //首次change 并且有值就是 打开编辑框时   /复现已选
            if (!isChangeFirstLoaded.value && formModel.listId) {
              isChangeFirstLoaded.value = true;
              await state.requireApi({ company_user_ids: formModel.listId.join(','), company_id: localStorage.getItem('companyId') });
            }
            await state.change(val);
            if (val.length > 50) {
              message.error('限制最大不能超过五十人');
              // // 限制多选数量不能超过 max
              formModel.listId = val.slice(0, 50)

            }
          },
          onDropdownVisibleChange: async (open) => {
            if (open) {
              // console.log('[ localStorage.getItem('companyId')]-188', formModel.companyId)
              if (!isFirstLoaded.value || state.options.value.length === 0) {
                isFirstLoaded.value = true;
                await state.requireApi({ company_id: localStorage.getItem('companyId') });
              }

              // 切换主体时 每次展开都要重置页码 以及重新请求列表  
              // state.initParams()

            }
          },
        }
      },
      required: true,
    },
    {
      field: 'remark',
      label: '备注',
      component: 'InputTextArea',
    },



  ];

  return {
    headerSchema,
    formSchema,
    columns,
  };
};
