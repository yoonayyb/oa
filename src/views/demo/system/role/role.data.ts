import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/demo/system';
import { useMessage } from '/@/hooks/web/useMessage';



// export const searchInput = ref();

export const columns : BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    customFilterDropdown: true,
    width: 200,
    onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          // searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '标识',
    dataIndex: 'identify',
    width: 100,
  },
  {
    title: '是否启用',
    dataIndex: 'is_enable',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.is_enable === 1,
        loading: record.pendingStatus,
        onChange(checked : boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          setRoleStatus(record.id, newStatus)
            .then(() => {
              record.is_enable = newStatus;
              createMessage.success(`已成功修改角色状态`);
            })
            .catch(() => {
              createMessage.error('修改角色状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: 180,
  },
];

export const searchFormSchema : FormSchema[] = [
  // {
  //   field: 'roleNme',
  //   label: '角色名称',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  // {
  //   field: 'is_enable',
  //   label: '状态',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: 1 },
  //       { label: '停用', value: 0 },
  //     ],
  //   },
  //   colProps: { span: 6 },
  // },
];

export const formSchema = [
  {
    field: 'id',
  },
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',

  },
  {
    field: 'identify',
    label: '角色标识',
    labelWidth: 66,
    helpDiy: ['重要!非管理人员请勿修改!'],
    component: 'Input',
  },
  {
    field: 'is_enable',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    required: true,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
];
export const formSchemay = [
  {
    field: 'id',
  },
  {
    label: ' ',
    field: 'menus',
    slot: 'menu',
    component: 'Input',
  },
];
