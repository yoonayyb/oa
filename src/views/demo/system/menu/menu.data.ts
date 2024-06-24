import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import Icon from '@/components/Icon/Icon.vue';

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'title',
    width: 200,
    align: 'left',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '页面路径',
    dataIndex: 'url',
    width: 180,
  },
  {
    title: '类型',
    dataIndex: 'menu_type',
    width: 100,
    customRender: ({ record }) => {
      const typeObj = {
        0: { text: '菜单', color: 'green' },
        1: { text: '功能', color: 'red' },
        2: { text: '页面', color: 'orange' }
      }
      return h(Tag, { color: typeObj[record.menu_type].color }, () => typeObj[record.menu_type].text);
    },
  },
  {
    title: '后台接口',
    dataIndex: 'api',
    width: 180,
  },
  {
    title: '组件（权限）',
    dataIndex: 'identify',
    width: 180,
  },
  {
    title: '排序',
    dataIndex: 'order_by',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'is_enable',
    width: 80,
    customRender: ({ record }) => {
      const status = record.is_enable;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
];

const isDir = (type: Number) => type === 0;
const isMenu = (type: Number) => type === 0;
const isButton = (type: Number) => type === 1;

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'title',
  //   label: '菜单名称',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  // {
  //   field: 'is_enable',
  //   label: '是否启用',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: 0 },
  //       { label: '停用', value: 1 },
  //     ],
  //   },
  //   colProps: { span: 6 },
  // },
];
export const emitFn = (value) => {
  console.log(value);
};
export const formSchema = [
  {
    field: 'id',
    label: '',
    defaultValue: 0,
  },
  {
    field: 'menu_type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        // 0菜单 1功能  2页面
        { label: '菜单', value: 0 },
        { label: '按钮', value: 1 },
        { label: '页面', value: 2 },
      ],
      onChange: (value) => {
        emitFn(value);
      },
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'title',
    label: '名称',
    component: 'Input',
    required: true,
  },

  {
    field: 'parent_id',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },

  {
    field: 'order_by',
    label: '排序',
    component: 'InputNumber',
    // required: true,
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    // required: true,
    ifShow: ({ values }) => isMenu(values.menu_type),
  },

  {
    field: 'url',
    label: '页面路径',
    component: 'Input',

    ifShow: ({ values }) => !isButton(values.menu_type),
  },
  {
    field: 'api',
    label: '后台接口',
    component: 'Input',
  },
  {
    field: 'identify',
    label: '组件(权限)',
    component: 'Input',
  },
  {
    field: 'is_enable',
    label: '是否启用',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  // {
  //   field: 'isExt',
  //   label: '是否外链',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '否', value: '0' },
  //       { label: '是', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => !isButton(values.type),
  // },

  // {
  //   field: 'keepalive',
  //   label: '是否缓存',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '否', value: '0' },
  //       { label: '是', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => isMenu(values.type),
  // },

  // {
  //   field: 'show',
  //   label: '是否显示',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '是', value: '0' },
  //       { label: '否', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => !isButton(values.type),
  // },
];
