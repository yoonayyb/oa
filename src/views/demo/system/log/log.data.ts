import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';

export const columns : BasicColumn[] = [
  {
    title: '用户id',
    dataIndex: 'user_id',
    width: 160,
    align:'center',
  },
  {
    title: '用户姓名',
    dataIndex: 'user',
    width: 160,
    align:'center',
    customRender: ({ record }) => {
      // const status = record.request;
      // const color = status ? 'green' : 'red';
      // const text = status ? '启用' : '停用';
      const text = record?.user?.name || ''
      return text
    },
  },
  {
    title: 'ip',
    dataIndex: 'ip',
    width: 160,
    align:'center',
  },
  {
    title: '接口',
    dataIndex: 'path',
    width: 160,
    align:'center',
  },
  {
    title: '请求参数',
    dataIndex: 'request',
    width: 160,
    align:'center',
    customRender: ({ record }) => {
      
      // const status = record.request;
      // const color = status ? 'green' : 'red';
      // const text = status ? '启用' : '停用';
      const text =  JSON.stringify(record.request,null, 2) 
      
      return text
    },
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    align:'center',
    width: 160,
  },
  {
    title: '请求时间',
    dataIndex: 'created_at',
    align:'center',
    width: 160,
  },
  // {
  //   title: '最后登录时间',
  //   dataIndex: 'last_login_info',
  //   align:'center',
  //   width: 160,
  //   customRender: ({ record }) => {
  //     const text = record?.last_login_info?.created_at || ''
      
  //     return text
  //   },
  // },
];

export const searchFormSchema : FormSchema[] = [
  {
    field: 'user_id',
    label: '用户id',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'time',
    label: '时间',
    component: 'RangePicker',
    componentProps: {
      showTime:true
    },
    colProps: { span: 12 },
  },
];

export const formSchema : FormSchema[] = [
  {
    field: 'title',
    label: '部门名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parent_id',
    label: '上级部门',
    component: 'ApiTreeSelect',

    componentProps: {
      labelField: 'title',
      valueField: 'id',
      api: async () => {
        let data = await window.http.get({
          url: '/company_center/department_api/select',
          params: { company_id: localStorage.getItem('companyId') },
        });
        let treeData = [
          {
            title: '最顶级部门',
            id: 0,
          },
          ...data,
        ];
        return treeData;
      },
    },
    required: true,
  },
  {
    field: 'manager_ids',
    label: '设置主管',
    component: 'Select',
    ifShow: () => false,
  },


  {
    field: 'is_enable',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    required: true,
  },
  // {
  //   label: '备注',
  //   field: 'remark',
  //   component: 'InputTextArea',
  // },
];
