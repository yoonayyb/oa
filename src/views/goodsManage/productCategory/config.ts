export const userSchemaFn = (form, initForm, changeModal) => {
  const headerSchema = [
    {
      field: 'categoryName',
      label: '分类名称',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '创建人',
      dataIndex: 'createdUsername',
    },
  ]

  const formSchema = [
    {
      field: 'categoryName',
      label: '分类名称',
      component: 'Input',
      required: true,
    },
    // {
    //   field: 'categoryModule',
    //   label: '分类类型',
    //   component: 'RadioGroup',
    //   defaultValue: 10,
    //   componentProps: {
    //     options: [
    //       { label: '产品', value: 10 },
    //       { label: '物料', value: 20 },
    //     ],
    //   },
    //   required: true,
    // },
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
