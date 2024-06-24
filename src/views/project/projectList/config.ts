
import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();
export const userSchemaFn = (form, initForm, addMasterProject, getTableList) => {
  const headerSchema = [
    {
      field: 'title',
      label: '项目名称',
      component: 'Input',
      bind: {},
    },
    // {
    //   field: 'company_id',
    //   label: '适用主体',
    //   component: 'Select',
    //   required: true,
    //   bind: {
    //     fieldNames: { label: 'title', value: 'id', },
    //     options: configStore.getMainOptions || []
    //   },
    // },
    // {
    //   field: 'created_user',
    //   label: '创建人',
    //   component: 'Input',
    // },
    // {
    //   field: 'created_at',
    //   label: '创建时间',
    //   component: 'DatePicker',
    //   bind: {
    //     format: 'YYYY-MM-DD',
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
    // {
    //   field: 'ddd',
    //   label: '待办事项',
    //   component: 'Select',
    // },
  ];


  const btnSchema = [
    {
      field: 'add',
      label: '',
      component: 'Button',
      bind: {
        type: 'primary',
        onClick: () => {
          getTableList()
        },
      },
      text: '查询',
    },
    {
      field: 'add',
      label: '',
      component: 'Button',
      bind: {
        type: 'primary',
        onClick: () => {
          addMasterProject()
        },
      },
      text: '新增',
    },
  ];

  const formSchema = [
    {
      field: 'title',
      label: '项目名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'company_id',
      label: '适用主体',
      component: 'Select',
      required: true,
      bind: {
        fieldNames: { label: 'title', value: 'id', },
        options: configStore.getMainOptions || []
      },
    },
    {
      field: 'describe',
      label: '项目描述',
      component: 'InputTextArea',
    },
  ];
  return {
    headerSchema,
    btnSchema,
    formSchema,
  };
};
