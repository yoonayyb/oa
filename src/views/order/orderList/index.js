const userFormData = (formData) => {
  return [{
    field: 'shoukuan',
    label: '收款账户',
    component: 'Input',
  }, {
    field: 'way',
    label: '发货方式',
    component: 'Select',
  }, {
    field: 'receive',
    label: '收货信息',
    component: 'Input',
  }, {
    field: 'fapiao',
    label: '发票号',
    component: 'Input',
  }, {
    field: 'caiwu',
    label: '财务状态',
    component: 'Select',
  }, {
    field: 'order',
    label: '下单类型',
    component: 'Select',
  }, {
    field: 'order1',
    label: '订单类型',
    component: 'Select',
  }, {
    field: 'order_no',
    label: '订单编号',
    component: 'Input',
  }, {
    field: 'price_start',
    label: '金额',
    component: 'Input',
  }, {
    field: 'price_end',
    label: '——',
    labelCol: {
      style: {
        width: '8px',
        margin: '0 10px',
      },
    },
    component: 'Input',
  }, {
    field: 'hospital',
    label: '医院名称',
    component: 'Select',
  }, {
    field: 'user',
    label: '推荐人',
    component: 'Select',
  }, {
    field: 'department',
    label: '科室来源',
    component: 'Input',
  }, {
    field: 'product',
    label: '产品',
    component: 'Input',
  }, {
    field: 'user1',
    label: '引流人',
    component: 'Select',
  }, {
    field: 'user2',
    label: '转介绍人',
    component: 'Select',
  }, {
    field: 'user3',
    label: '达成人',
    component: 'Select',
  }, {
    field: 'time',
    label: '达成日期',
    component: 'DatePicker',
    bind: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      onChange: (e, dateString) => {
        // formData.time = dateString
      },
    },
  }, ];
};
const fcMap = new Map();
export const btnClick = (nameStr, fn) => {
  // if (nameStr === '') return
  // let arr = nameStr.split(',')
  // arr.forEach((v, index) => {
  //   fcMap.set(v, fn)
  // })
  fcMap.set(nameStr, fn);
};
const schema = [{
  field: 'aaa',
  label: '',
  placeholder: '请输入会员昵称、手机号或报单id',
  component: 'Input',
  bind: {},
}, {
  field: 'ddd',
  label: '所属团队',
  component: 'Select',
  bind: {
    options: [],
  },
}, ];
const btnSchema = [{
  component: 'Button',
  bind: {
    type: 'primary',
    onClick: () => {
      fcMap.get('btn')('select');
    },
  },
  text: '查询',
}, {
  component: 'Button',
  bind: {
    type: 'primary',
    onClick: () => {
      console.log('新增');
      fcMap.get('btn')('add');
    },
  },
  text: '新增',
}, {
  component: 'Button',
  bind: {
    type: 'primary',
    onClick: () => {
      console.log('只看自己');
    },
  },
  text: '只看自己',
}, {
  component: 'Button',
  bind: {
    type: 'primary',
    onClick: () => {
      console.log('导出');
    },
  },
  text: '导出',
}, ];
const dataSource = [];
const columns = [{
  title: '报单id',
  dataIndex: 'name',
  key: 'name',
  width: '100px',
}, {
  title: '订单来源',
  dataIndex: 'age',
  width: '100px',
  key: 'age',
}, {
  title: '金额',
  dataIndex: 'address',
  key: 'address',
  width: '100px',
}, {
  title: '收款账户',
  dataIndex: 'name',
  width: '100px',
  key: 'name',
}, {
  title: '产品',
  dataIndex: 'age',
  width: '100px',
  key: 'age',
}, {
  title: '达成日期',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '所属团队',
  dataIndex: 'name',
  width: '100px',
  key: 'name',
}, {
  title: '会员',
  dataIndex: 'age',
  width: '100px',
  key: 'age',
}, {
  title: '引流人',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '达成人',
  dataIndex: 'name',
  width: '100px',
  key: 'name',
}, {
  title: '干预人',
  dataIndex: 'age',
  width: '100px',
  key: 'age',
}, {
  title: '医院名称',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '推荐人',
  dataIndex: 'name',
  width: '100px',
  key: 'name',
}, {
  title: '科室来源',
  dataIndex: 'age',
  width: '100px',
  key: 'age',
}, {
  title: '转介绍人',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '下单类型',
  dataIndex: 'name',
  width: '100px',
  key: 'name',
}, {
  title: '订单编号',
  dataIndex: 'age',
  width: '100px',
  key: 'age',
}, {
  title: '发货方式',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '收件信息',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '财务状态',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '发票号',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
}, {
  title: '操作',
  dataIndex: 'address',
  width: '100px',
  key: 'address',
  fixed: 'right',
}, ];
export { columns, dataSource, userFormData, schema, btnSchema };