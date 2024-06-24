import { h } from 'vue';
 export const searchTitle = ref('')

export const userSchemaFn = () => {
  const headerSchema = [
    // {
    //   field: 'system_address_id',
    //   component: 'ApiCascader',
    //   label: '所属地区',
    //   colProps: { span: 6 },
    //   slot: 'form-systemAddressId',



    // },
    {
      field: 'title',
      label: '',
      component: 'Input',
      componentProps:{
        placeholder:'搜索文件',
        oninput:(e)=>{
          console.log('e: ', e.target.value)
          searchTitle.value = e.target.value
        }
      },
      colProps: { span: 4 }
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
      title: '创建人',
      dataIndex: 'user',
      customRender: ({ record }) => {
        const creator = record.creator;

        const text = creator ? creator.name : '-';
        return text
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
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
