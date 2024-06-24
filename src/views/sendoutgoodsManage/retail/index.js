import { h } from 'vue';


const userFormData = [{
    field: 'order_sn',
    label: '订单编号',
    placeholder: '请输入',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'from_type',
    label: '订单来源',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '均衡代谢管理', value: 0 },
        { label: '残联小程序', value: 1 },
        { label: '内部订单', value: 2 },
        { label: '其他订单', value: 3 },
      ],
    }
  },
  {
    field: 'ship_status',
    label: '发货状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '已取消', value: -1 },
        { label: '待发货', value: 0 },
        { label: '已发货', value: 1 },
      ],
    }
  },
];
export const openInfo = ref()
const openM = (records, type) => {
  return { data: records, type }
}
const from_type = {
  0: '均衡代谢管理',
  1: '残联小程序',
  2: '内部订单',
  3: '其他订单',
}
const ship_status = {
  '-1': '已取消',
  0: '待发货',
  1: '已发货',
}
const columns = [{
    align: 'center',
    title: '订单编号',
    dataIndex: 'order_sn',
    key: 'order_sn',
    width: 100,
  },
  {
    title: '订单来源',
    dataIndex: 'from_type',
    align: 'center',
    width: 100,
    customRender: ({ record }) => {
      const text = from_type[record.from_type]
      return text
    },
  },
  {
    title: '产品',
    dataIndex: 'products',
    align: 'center',
    width: 200,
    resizable: true,
    customRender: ({ record }) => {
      const list = record.goods.filter(v => v.is_product === 0)

      // return h('div', [text, h('br'), mobile])
      return h('div', [record.products.map(v => h('div', v.title + ' *' + v.num + ' ')), h(
        'div', {
          style: { color: 'red' },
        },
        [

          list.map((v, i) => h('div', '未录入：' + '(' + 'id:' + v.gid + ')' + v.title + '*' + v
              .num + ' ')

          )
        ]

      )]);
    },
  },
  // {
  //   align: 'center',
  //   title: '库存',
  //   dataIndex: 'inventory',
  //   width: 100,
  // },
  {
    title: '收货信息',
    dataIndex: 'receiverInfo',
    align: 'center',
    width: 200,
    customRender: ({ record }) => {
      let addressDetail = record.order_report_info?.province ? record.order_report_info?.province + '/' + record
        .order_report_info?.city + '/' + record.order_report_info?.area : record.province ? record.province + '/' +
        record
        .city + '/' + record.area : ''
      return h('div', [('收货地址：' + addressDetail),
        h('br'), '详细地址：' + (record.order_report_info?.address || record?.address || '-'),
        h('br'), '收件人姓名：' + (record.order_report_info?.realname || record?.realname || '-'),
        h('br'), '收件人手机：' + (record.order_report_info?.mobile || record?.mobile || '-'),
      ])
    },
    customCell: (record) => {

      return {
        onClick: (e) => {
          openInfo.value = openM(record, 3)
        },
      };
    },
  },
  {
    align: 'center',
    title: '发货人',
    dataIndex: 'realname',
    width: 100,
    customRender: ({ record }) => {

      return h('div', [record.warehouse_order.map(v => h('div', v.name))])
    },

  },
  {
    align: 'center',
    title: '发货状态',
    dataIndex: 'ship_status',
    width: 100,
    customRender: ({ record }) => {
      const text = ship_status[record.ship_status]
      return text
    },
  },
  {
    align: 'center',
    title: '物流信息',
    dataIndex: 'logistics',
    width: 150,
  },
];
export { columns, userFormData };
