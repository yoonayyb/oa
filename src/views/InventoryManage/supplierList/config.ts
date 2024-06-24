export const userSchemaFn = (form, initForm, changeModal) => {
  const headerSchema = [
    {
      field: 'name',
      label: '供应商名称',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'no',
      label: '税务编码',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'contacts',
      label: '联系人',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
  const columns = [
    {
      title: '供应商名称',
      dataIndex: 'name',
    },
    {
      title: '税务编码',
      dataIndex: 'no',
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
    },
    {
      title: '联系人电话',
      dataIndex: 'contactInformation',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },

  ]

  const formSchema = [
    {
      field: 'name',
      label: '供应商名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'no',
      label: '税务编码',
      component: 'Input',
      // required: true,
    },
    {
      field: 'contacts',
      label: '联系人',
      component: 'Input',
    },
    {
      field: 'contactInformation',
      label: '联系电话',
      component: 'Input',
    },
    {
      field: 'remark',
      label: '备注',
      component: 'InputTextArea',
    },


  ];

  return {
    headerSchema,
    formSchema,
    columns,
  };
};
