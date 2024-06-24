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
    // {
    //   field: 'system_address_id',
    //   component: 'ApiCascader',
    //   label: '所属地区',
    //   colProps: { span: 6 },
    //   slot: 'form-systemAddressId',



    // },
    {
      field: 'files',
      label: '',
      component: 'Input',
      componentProps:{
        placeholder:'搜索文件',
      },
      colProps: { span: 6 }
    }
  ];
  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      width:'500px',
      align:'left'
    },
    {
      title: '大小',
      dataIndex: 'size',
      customRender: ({ record }) => {
        const file = record.file;
        
        return file ? file.size/ 1000 + 'kb' : '...';
      },
    },

  ]

  const formSchema = [
    {
      field: 'title',
      component: 'Input',
      label: '文件名',
      componentProps: {
       
      },
      required: true,
    },
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
