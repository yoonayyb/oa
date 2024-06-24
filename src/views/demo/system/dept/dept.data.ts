import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns : BasicColumn[] = [
  {
    title: '部门名称',
    dataIndex: 'title',
    width: 160,
    align: 'left',
  },
  {
    title: '成员数',
    dataIndex: 'num',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'is_enable',
    width: 80,
    customRender: ({ record }) => {
      const status = record.is_enable;
      const color = status ? 'green' : 'red';
      const text = status ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
];

export const searchFormSchema : FormSchema[] = [
  {
    field: 'deptName',
    label: '部门名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 6 },
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
