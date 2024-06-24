import { h } from 'vue';
import { Tag } from 'ant-design-vue';
const getAreaRecord = async (params) => {
  let data = await window.http.get({
    url: '/basic_center/address_api/list',
    params: { ...params },
  });
  return data;
};
export const userSchemaFn = (addressLabel) => {
  const headerSchema = [
    {
      field: 'system_address_id',
      component: 'ApiCascader',
      label: '所属地区',
      colProps: { span: 6 },
      slot: 'form-systemAddressId',



    },
    {
      field: 'type',
      label: '发货类型',
      component: 'Select',
      colProps: { span: 6 },
      componentProps: {
        options: [{
          label: '零售发货',
          value: 0
        }, {
          label: '大批发货',
          value: 1
        }]
      }
    }
  ];
  const columns = [
    {
      title: '地区',
      dataIndex: 'address_info',
    },
    {
      title: '发货类型',
      dataIndex: 'type',
      customRender: ({ record }) => {
        const status = record.type;

        const text = status ? '大批发货' : '零售发货';
        return text
      },
    },
    {
      title: '发货人',
      dataIndex: 'name',
    },
    {
      title: '是否启用',
      dataIndex: 'createdUsername',
      customRender: ({ record }) => {
        const status = record.is_enable;
        const color = status ? 'green' : 'red';
        const text = status ? '启用' : '停用';
        return h(Tag, { color: color }, () => text);
      },
    },

  ]

  const formSchema = [
    {
      field: 'system_address_id',
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
          return false
        },
      },
      required: true,

    },
    {
      field: 'warehouse_id',
      label: '发货人',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'name',
        valueField: 'id',
        api: async (params) => {
          let data = await window.http.post({
            url: '/erp-ware/warehouse/list',
            data: { ...params },
          });
          return data;
        },
      },
      required: true,
    },
    {
      field: 'type',
      label: '发货类型',
      component: 'RadioGroup',
      defaultValue: 0,
      componentProps: {
        options: [{
          label: '零售发货',
          value: 0
        }, {
          label: '大批发货',
          value: 1
        }]
      }
    }


  ];
  const formSchema2 = [

    {
      field: 'type0',
      label: '零售发货',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'name',
        valueField: 'id',
        api: async (params) => {
          let data = await window.http.post({
            url: '/erp-ware/warehouse/list',
            data: { ...params },
          });
          return data;
        },
      },

    },
    {
      field: 'type1',
      label: '大批发货',
      component: 'ApiSelect',
      componentProps: {
        labelField: 'name',
        valueField: 'id',
        api: async (params) => {
          let data = await window.http.post({
            url: '/erp-ware/warehouse/list',
            data: { ...params },
          });
          return data;
        },
      },

    },


  ];
  return {
    headerSchema,
    formSchema,
    formSchema2,
    columns,
  };
};
