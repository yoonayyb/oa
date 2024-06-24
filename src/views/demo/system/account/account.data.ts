import { getAllRoleList, isAccountExist } from '/@/api/demo/system';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
export const columns: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 120,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '手机',
    dataIndex: 'mobile',
    width: 120,
  },
  // {
  //   title: '邮箱',
  //   dataIndex: 'email',
  //   width: 120,
  // },
  {
    title: '账号权限',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: 180,
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
  {
    title: '最后登录时间',
    dataIndex: 'last_login_info',
    align:'center',
    width: 160,
    customRender: ({ record }) => {
      const text = record?.last_login_info?.created_at || ''
      
      return text
    },
  },
  // {
  //   title: '角色',
  //   dataIndex: 'role',
  //   width: 200,
  // },
  // {
  //   title: '备注',
  //   dataIndex: 'remark',
  // },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'mobile',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const accountFormSchema = [
  {
    field: 'id',
    label: '',
    defaultValue: 0,
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'Aupload',
    componentProps: {
      catgory: 'user',
      defaultImageList: [],
      onChange: (value) => {
        console.log('[ value ]-83', value)
      },
    },
  },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    required: true,
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',

  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
  },
  {
    field: 'mobile',
    label: '手机号',
    component: 'Input',

    rules: [
      {
        required: true,
        validator(_, value) {
          const phoneReg =
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
          if (phoneReg.test(value)) {
            return Promise.resolve();
          } else if (value) {
            //如果验证输入错误就清空
            return Promise.reject('请输入正确手机号');
          }
          return Promise.reject('请输入手机号');
        },
      },
    ],
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
  //   field: 'dept',
  //   label: '所属部门',
  //   component: 'TreeSelect',
  //   componentProps: {
  //     fieldNames: {
  //       label: 'deptName',
  //       key: 'id',
  //       value: 'id',
  //     },
  //     getPopupContainer: () => document.body,
  //   },
  //   required: true,
  // },

  // {
  //   label: '邮箱',
  //   field: 'email',
  //   component: 'Input',
  //   required: true,
  // },

  // {
  //   label: '备注',
  //   field: 'remark',
  //   component: 'InputTextArea',
  // },
];
export const permissionFormSchema = [
  {
    field: 'id',
    label: '',
    defaultValue: 0,
  },
  {
    label: '角色',
    field: 'user_role_ids',
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      api: getAllRoleList,
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },
];
