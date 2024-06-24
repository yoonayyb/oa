

import { h } from 'vue';
import { Tag } from 'ant-design-vue';
const getAreaRecord = async (params) => {
  let data = await window.http.get({
    url: '/basic_center/address_api/list',
    params: { ...params },
  });
  return data;
};

const warehouseTypeOption = [
  {
    label: '待审核',
    value: 0,
  },
  {
    label: '已完成',
    value: 1,
  },
  {
    label: '已驳回',
    value: 2,
  }, {
    label: '已撤销',
    value: 3,
  },
];
const colorObj = {
  2: 'red',
  0: 'blue',
  3: 'orange',
  1: 'green',
};

export const userSchemaFn = (addressLabel, loadData) => {
  const headerSchema = [
    // {
    //   field: 'title',
    //   label: '表单名称',
    //   component: 'Input',
    //   colProps: { span: 6 },
    // },
    // {
    //   field: 'time',
    //   label: '发起时间',
    //   component: 'RangePicker',
    //   colProps: { span: 6 },
    // },
    // {
    //   field: 'time',
    //   label: '完成时间',
    //   component: 'RangePicker',
    //   colProps: { span: 6 },
    // },
    // {
    //   field: 'id',
    //   label: '审批编号',
    //   component: 'Input',
    //   colProps: { span: 6 },
    // },
    {
      field: 'status',
      label: '审批状态',
      component: 'Select',
      colProps: { span: 6 },
      componentProps: {
        options: warehouseTypeOption,
      },
    },
    // {
    //   field: 'type',
    //   label: '发起人',
    //   component: 'Input',

    //   colProps: { span: 6 },
    // },

  ];
  const columns = [
    {
      title: '审批编号',
      dataIndex: 'id',
    },
    {
      title: '表单名称',
      dataIndex: 'title',
    },
    {
      title: '发起人',
      dataIndex: 'company_user',
      customRender: ({ record }) => {
        return record.company_user.name
      },
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      customRender: ({ record }) => {
        const text = warehouseTypeOption.find((v) => v.value === record.status)?.label
        const color = colorObj[record.status]
        return h(Tag, { color: color, class: 'ant_Tag' }, () => text);
        // return record.status === 0 ? '待审核' : record.status === 1 ? '已完成' : record.status === 2 ? '已驳回' : '已撤销'
      },
    },

    {
      title: '发起时间',
      dataIndex: 'created_at',
    },
    {
      title: '完成时间',
      dataIndex: 'finish_time',
    },
    {
      title: '当前审批人',
      dataIndex: 'current_approve_mans"',
      customRender: ({ record }) => {
        return record.current_approve_mans.map(v => v.name).join(',')
      },
    }, {
      title: '历史审批人',
      dataIndex: 'history_approve_mans"',
      customRender: ({ record }) => {
        return record.history_approve_mans.map(v => v.name).join(',')
      },
    },

  ]

  const formSchema = [
    {
      field: 'name',
      label: '仓库名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'no',
      label: '仓库编号',
      component: 'Input',
      required: true,
    },
    {
      field: 'type',
      label: '仓库类型',
      component: 'Select',
      componentProps: {
        options: warehouseTypeOption,
      },
      required: true,
    },


    {
      field: 'areaCode',
      component: 'ApiCascader',
      label: '所属地区',
      componentProps: {
        api: getAreaRecord,
        apiParamKey: 'pid',
        labelField: 'name',
        valueField: 'id',
        initFetchParams: {
          parent_id: 0,
        },
        isLeaf: (record) => {
          return !(record.level < 3);
        },
        onChange: (valArr, ...arg) => {
          let str = arg?.map(v => v.label)
          addressLabel.value = str?.join('-')
        },
      },
      required: true,

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
