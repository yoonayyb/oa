import { Tag } from 'ant-design-vue';
export const userSchemaFn = (form, initForm, fnObj) => {
  const headerSchema = [
    {
      field: 'title',
      label: '表单名称',
      component: 'Input',
    },
    {
      field: 'form_template_group_id',
      label: '所在分组',
      component: 'ApiSelect',
      bind: {
        allowClear: true,
        labelField: 'title',
        valueField: 'id',
        api: async () => {
          let data = await window.http.get({

            url: '/work_center/form_group_api/select',
            params: {
              is_all: 1,
            },
          });
          console.log('data: ', data)
          return data
        },
      },
    },
  ];
  const btnSchema = [
    {
      component: 'Button',
      text: '查询',
      bind: {
        type: 'primary',
        onClick: (e) => {
          fnObj.getTableList();
        },
      },
    },
    {
      component: 'Button',
      text: '新增',
      bind: {
        type: 'primary',
        onClick: () => {
          fnObj.changeModal(true, 'add');
          localStorage.removeItem('queryId')
        },
      },
    },
  ];
  const columns = [
    {
      title: '表单名称',
      dataIndex: 'title',
      width: 120,
    },
    {
      title: '表单图标',
      dataIndex: 'icon',
      width: 120,
    },
    {
      title: '所在分组',
      dataIndex: 'form_template_group_id',
      width: 120,
      customRender: ({ record }) => {
        return record.groups.map(v => v.title).join(',')
      },
    },
    {
      title: '表单说明',
      dataIndex: 'describe',
      width: 120,
    },
    {
      title: '适用主体',
      dataIndex: 'company_form_templat',
      width: 120,
      customRender: ({ record }) => {
        return record.company_form_template.map(v => v.title).join(',')
      },
    },
    {
      title: '是否启用',
      dataIndex: 'is_enable',
      width: 120,
      customRender: ({ record }) => {
        const color = record.is_enable ? 'green' : 'red';
        const text = record.is_enable ? '启用' : '停用';
        return h(Tag, { color: color }, () => text);
      },
    },
    {
      title: '创建人',
      dataIndex: 'created_userName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 120,
    },
    {
      title: '更新人',
      dataIndex: 'updated_userName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      width: 120,
    },
  ];
  return {
    headerSchema,
    btnSchema,
    columns,
  };
};
