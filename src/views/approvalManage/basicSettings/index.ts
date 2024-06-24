import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();

export const formSchema = [
  {
    field: 'id',
    defaultValue: 0,
  },
  {
    field: 'icon',
    label: '表单图标',
    required: true,
    component: 'IconPicker',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'title',
    label: '表单名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'form_template_group_id',
    label: '所在分组',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      labelField: 'title',
      valueField: 'id',
      api: async () => {
        let data = await window.http.get({
          url: '/work_center/form_group_api/select',
          params: {
            is_all: 1,
          },
        });
        return data
      },
    },
  },
  {
    field: 'describe',
    label: '表单说明',
    component: 'InputTextArea',
    componentProps: {
      type: 'textarea',
      rows: 3,
      maxlength: 300,
    },
  },
  {
    field: 'company_ids',
    label: '适用主体',
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      multiple: true,
      fieldNames: { label: 'title', value: 'id', },
      options: configStore.getMainOptions || []
    },
  },
  {
    field: 'form_type',
    label: '模板类型',
    component: 'Select',
    required: true,
    defaultValue: null,
    dynamicDisabled: ({values}) => {
      console.log('values: ', values.id)
      
      return Boolean(values.id)
    },
    componentProps: {
      disabled:true,
      options: [
        {
          label:'普通模板',
          value:0
        },
        {
          label:'转仓模板',
          value:1
        },
      ]
    },
  },
  // {
  //   field: 'is_enable',
  //   label: '是否启用',
  //   component: 'RadioButtonGroup',
  //   defaultValue: 0,
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: 1 },
  //       { label: '禁用', value: 0 },
  //     ],
  //   },
  // },
];
