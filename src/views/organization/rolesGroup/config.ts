import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'title',
  },

  {
    title: '状态',
    dataIndex: 'is_enable',
    customRender: ({ record }) => {
      const status = record.is_enable;
      const color = status ? 'green' : 'red';
      const text = status ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'is_enable',
    label: '状态',
    component: 'Select',

    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    colProps: { span: 6 },

  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '角色名称',
    component: 'Input',
    required: true,
  },
  // {
  //   field: 'orderNo',
  //   label: '排序',
  //   component: 'InputNumber',
  //   required: true,
  // },
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
