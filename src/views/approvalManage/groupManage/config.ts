import { Tag } from 'ant-design-vue';
export const userSchemaFn = (form, initForm, fnObj) => {
  const headerSchema = [
    {
      field: 'title',
      label: '分组名称',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
  const columns = [
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 120,
    },
    {
      title: '分组名称',
      dataIndex: 'title',
      width: 120,
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
  ];
  return {
    headerSchema,
    columns,
  };
};
