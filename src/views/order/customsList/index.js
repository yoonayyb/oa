import { h } from 'vue';
import { debounce } from 'lodash-es';
import { Tag,Button } from 'ant-design-vue';
import { RedoOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';


//判断是否是残联小程序
export const is_ylyyy = (type) => {
  let flag = false
  if (type === 1) flag = true
  return flag
}
//判断是否小程序报单
export const is_mpReport = (type) => {
  let flag = false
  if (type === 1 || type === 0) flag = true
  return flag
}
//查找会员信息 (转介绍人也属于会员)
export const getVipInfo = async (url, params) => {
  let data = await window.http.get({
    url: url + '/gp_mini/erp_oa/api/member/select',
    params,
  });
  return data;
}
//查找推荐人信息
export const getReferrer = async (url, params) => {
  let data = await window.http.get({
    url: url + '/gp_mini/erp_oa/api/staff/select',
    params,
  });
  return data;
}
//查询医院信息
export const getHospital = async (url, params) => {
  let data = await window.http.get({
    url: url + '/gp_mini/erp_oa/api/hospital/select',
    params,
  });
  return data;
}
//查询推荐人所在的医院、团队信息
export const getReferrerDetail = async (url, params) => {
  let data = await window.http.get({
    url: url + '/gp_mini/erp_oa/api/staff/detail',
    params,
  });
  return data;
}
//查询团队全名信息
const getTeamFull = async (url, id) => {
  let data = await window.http.get({
    url: url + '/gp_mini/erp_oa/api/team/select',
    params: {
      id
    }
  });
  return data
}
//查询团队信息
const getTeam = async (url, id) => {
  let data = await window.http.get({
    url: url + '/gp_mini/erp_oa/api/team/select',
    params: {
      id
    }
  });
  return data
}
//查询地址详情
export const getAdressDetail = async (params) => {
  let data = await window.http.get({
    url: '/basic_center/address_api/info',
    params
  });
  return data
}

export const reviewInfo = (v, info, idtype, type) => {
  info.forEach(e => {
    if (e.id === v[idtype]) {
      v[type] = h('div', [e.nickname || e.realname, h('br'), e.mobile])
      if (idtype === 'hospital_id') v[type] = e.title
      if (idtype === 'team_id') v[type] = { title: e.title, id: e.id }
    }
  })
}
export const get_total_vipInfo = async (dataSource) => {
  //判断多少条是残联小程序
  let ylyyy = []
  let mpReport = []
  //残联
  let ylyyy_vipInfo = [] //会员
  let ylyyy_referrerInfo = [] //推荐人
  let ylyyy_sponsorInfo = [] //转介绍人
  let ylyyy_hospitalInfo = [] //医院信息
  let ylyyy_teamInfo = [] //团队信息
  //减重
  let mpReport_vipInfo = [] //会员
  let mpReport_referrerInfo = [] //推荐人
  let mpReport_sponsorInfo = [] //转介绍人
  let mpReport_hospitalInfo = [] //医院信息
  let mpReport_teamInfo = [] //团队信息
  dataSource.forEach(v => {
    if (v.from_type === 1) ylyyy.push(v)
    if (v.from_type === 0) mpReport.push(v)
  })
  //只有小程序的报单才请求 会员接口复显
  if (ylyyy.length) {
    let member_id = Array.from(new Set(ylyyy.filter(v => v.member_id).map(v => v.member_id)))
    let sponsor_id = Array.from(new Set(ylyyy.filter(v => v.sponsor).map(v => v.sponsor))) //转介绍人id
    let referrer_id = Array.from(new Set(ylyyy.filter(v => v.referrer).map(v => v.referrer))) //推荐人id
    let hospital_id = Array.from(new Set(ylyyy.filter(v => v.hospital_id).map(v => v.hospital_id))) //医院id
    let team_id = Array.from(new Set(ylyyy.filter(v => v.team_id).map(v => v.team_id))) //团队id


    let vipInfo = member_id.length ? await getVipInfo('/ylyyy', { ids: member_id.join(',') }) : {}
    let sponsor = sponsor_id.length ? await getVipInfo('/ylyyy', { ids: sponsor_id.join(',') }) : {}
    let referrerInfo = referrer_id.length ? await getReferrer('/ylyyy', { ids: referrer_id.join(',') }) : {}
    let hospitalInfo = hospital_id.length ? await getHospital('', { ids: hospital_id.join(',') }) : {}
    let teamInfo = team_id.length ? await getTeam('', { ids: team_id.join(',') }) : {}

    ylyyy_vipInfo = vipInfo.records || []
    ylyyy_sponsorInfo = sponsor.records || []
    ylyyy_referrerInfo = referrerInfo.records || []
    ylyyy_hospitalInfo = hospitalInfo.records || []
    ylyyy_teamInfo = teamInfo.records || []
  }
  if (mpReport.length) {
    let member_id = Array.from(new Set(mpReport.filter(v => v.member_id).map(v => v.member_id)))
    let sponsor_id = Array.from(new Set(mpReport.filter(v => v.sponsor).map(v => v.sponsor))) //转介绍人id
    let referrer_id = Array.from(new Set(mpReport.filter(v => v.referrer).map(v => v.referrer))) //推荐人id
    let hospital_id = Array.from(new Set(mpReport.filter(v => v.hospital_id).map(v => v.hospital_id))) //医院id
    let team_id = Array.from(new Set(mpReport.filter(v => v.team_id).map(v => v.team_id))) //团队id

    let vipInfo = member_id.length ? await getVipInfo('', { ids: member_id.join(',') }) : {}
    let sponsor = sponsor_id.length ? await getVipInfo('', { ids: sponsor_id.join(',') }) : {}
    let referrerInfo = referrer_id.length ? await getReferrer('', { ids: referrer_id.join(',') }) : {}
    let hospitalInfo = hospital_id.length ? await getHospital('', { ids: hospital_id.join(',') }) : {}
    let teamInfo = team_id.length ? await getTeam('', { ids: team_id.join(',') }) : {}

    mpReport_vipInfo = vipInfo.records || []
    mpReport_sponsorInfo = sponsor.records || []
    mpReport_referrerInfo = referrerInfo.records || []
    mpReport_hospitalInfo = hospitalInfo.records || []
    mpReport_teamInfo = teamInfo.records || []
  }
  return {
    total_vipInfo: [...ylyyy_vipInfo, ...mpReport_vipInfo],
    total_sponsorInfo: [...ylyyy_sponsorInfo, ...mpReport_sponsorInfo],
    total_referrerInfo: [...ylyyy_referrerInfo, ...mpReport_referrerInfo],
    total_hospitalInfo: [...ylyyy_hospitalInfo, ...mpReport_hospitalInfo],
    total_teamInfo: [...ylyyy_teamInfo, ...mpReport_teamInfo],

  }
}

export const popupScrollSelect = (url, params = {}, { mode = "", max = 15, obj, key } = {}) => {

  const pagetions = reactive({
    current: 1,
    pageNum: 15,
    total: 0
  })
  const options = ref([])
  const searchParams = ref()
  let fetching = false
  const change = debounce(async (val) => {
    
    if (val && Array.isArray(val)) {
      //val是数组时就是多选 在change时需要清空最开始复现携带的id
      // searchParams.value = {}
    }
    pagetions.current = 1
    if (!val || val.length === 0) searchParams.value = {};
    try {
      fetching = true;
      await getOptions()
    } catch (e) {

    }
    fetching = false;
  }, 300)
  const onSearch = debounce(async (val, p = {}) => {
    searchParams.value = { ...p, keywords: val }
    pagetions.current = 1
    try {
      fetching = true;
      await getOptions()
    } catch (e) {

    }
    fetching = false;
  }, 300)
  const getOptions = async () => {

    const { records, total } = await window.http.get({
      url,
      params: {
        ...searchParams.value,
        pageNum: pagetions.pageNum,
        pages: pagetions.current,
      }
    })
    options.value = pagetions.current === 1 ? records : [...options.value, ...records],
      pagetions.total = total
    return
  }
  const requireApi = async (params2) => {
    searchParams.value = params2 || params;
    await getOptions();
    return;
  };


  const handleScroll = async (e) => {
    const { target: { scrollTop, scrollHeight, clientHeight } } = e
    if (scrollTop + 2 + clientHeight >= scrollHeight) {
      // 当滚动到底部时加载更多数据的逻辑

      if (fetching === true) return

      if (pagetions.total > options.value.length) {
        pagetions.current++
        fetching = true
        await getOptions()
        fetching = false
      }
      // ...
    }

  };

  return [{
    fetching,
    options,
    change,
    fetchUser: onSearch,
    scroll: handleScroll,
    requireApi,
  }, ];
}
let url = ''
const isDisabled = type => typeof type !== 'number'

const userFormData = [{
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
      onChange: (e) => {
        url = e === 1 ? '/ylyyy' : ''
      },
    }
  },
  {
    field: 'order_no',
    label: '订单编号',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'collection_account',
    label: '收款账户',
    colProps: { span: 6 },
    component: 'Input',
  },

  {
    field: 'delivery_method',
    label: '发货方式',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '公司发货', value: 0 },
        { label: '区域发货', value: 1 },
        { label: '医院发货', value: 2 },
        { label: '代理发货', value: 3 },
      ]
    }
  },
  {
    field: 'address_keyword',
    label: '收货信息',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'is_first_order',
    label: '下单类型',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '复购', value: 0 },
        { label: '首购', value: 1 },
      ]
    }
  },
  {
    field: 'price_min',
    label: '最低金额',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'price_max',
    label: '最高金额',
    colProps: { span: 6 },
    labelCol: {

      style: {
        width: '8px',
        margin: '0 10px',
      },
    },
    component: 'Input',
  },
  {
    field: 'drainage',
    label: '引流人',
    colProps: { span: 6 },
    component: 'Select',
  },
  {
    field: 'reach',
    label: '达成人',
    colProps: { span: 6 },
    component: 'Select',
  },
  {
    field: 'intervener',
    colProps: { span: 6 },
    label: '干预人',
    component: 'Select',
  },
  {
    field: 'department',
    colProps: { span: 6 },
    label: '科室来源',
    component: 'Input',
  },
  {
    field: 'reach_date',
    label: '达成日期',
    colProps: { span: 6 },
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      onChange: (e, dateString) => {
        // formData.time = dateString
      },
    },
  },
  {
    field: 'team_id',
    label: '所属团队',
    component: 'Cascader',
    colProps: { span: 6 },
    dynamicDisabled: ({ values }) => {
      return isDisabled(values.from_type)
    },
    componentProps: {

    },
  },

  {
    field: 'hospital_id',
    label: '医院名称',
    colProps: { span: 6 },
    component: 'Select',
    dynamicDisabled: ({ values }) => {

      return isDisabled(values.from_type)
    },
  },
  {
    field: 'referrer',
    label: '推荐人',
    colProps: { span: 6 },
    component: 'Select',
    dynamicDisabled: ({ values }) => {
      return isDisabled(values.from_type)
    },

  },
  {
    field: 'sponsor',
    colProps: { span: 6 },
    component: 'Select',
    label: '转介绍人',
    dynamicDisabled: ({ values }) => {
      return isDisabled(values.from_type)
    },

  },


];

const from_type = {
  0: '均衡代谢管理',
  1: '残联小程序',
  2: '内部订单',
  3: '其他订单',
}
const is_first_order = {
  0: '复购',
  1: '首购',
}
const delivery_method = {
  0: '公司发货',
  1: '区域发货',
  2: '医院发货',
  3: '代理发货',
}

const columns1 = [{
    title: '产品',
    align: 'center',
    dataIndex: 'product',
    // key: 'product',
    width: 200,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'number',
    key: 'number',
    width: 100,
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'dell',
    key: 'dell',
    width: 100,
  },
];
const loading = ref(false)

const getColumns =(reload)=>{
   return [{
      title: '报单id',
      dataIndex: 'id',
      align: 'center',
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
      title: '金额',
      dataIndex: 'price',
      align: 'center',
      width: 100,
    },
    {
      title: '收款账户',
      dataIndex: 'collection_account',
      align: 'center',
      width: 100,
    },
    {
      title: '产品',
      dataIndex: 'products',
      align: 'center',
      width: 400,
      resizable: true,
      customRender: ({ record }) => {
         
        const list = record.goods.filter(v => v.is_product === 0)
        // return h('div', [text, h('br'), mobile])
        return h('div', [record.products.map(v => h('div', v.title + ' *' + v.num + ' ')),
         h(
          'div', {
            style: { display:'flex',justifyContent: 'center',alignItem:'center',color:'red'},
          },
          [
            h(Button, {icon:h(RedoOutlined),type:'primary',shape:'circle',loading:loading.value,onClick: async ()=>{
              const { id,report_status} = record
              if(report_status !== 0){
                return message.error('已报单不允许此操作')
              }
              loading.value = true
              window.http.post({
                url:'/order_center/order_api/sync_products',
                data: {
                  order_id:id
                }
              }).then(res => {
                reload.value()
              }).finally(e => {
                loading.value = false
              })
            }, style:{display:list.length?'':'none',marginRight:'10px',} }, () => ''),
            list.map((v, i) => h('div', '未录入：' + '(' + 'id:' + v.gid + ')' + v.title + '*' + v
                .num + ' ')
  
            )
          ]
        )]);
      },
    },
    {
      title: '达成日期',
      dataIndex: 'reach_date',
      align: 'center',
      width: 100,
    }, {
      title: '所属团队',
      dataIndex: 'teamInfo',
      align: 'center',
      width: 100,
    }, {
      title: '会员',
      dataIndex: 'vipInfo',
      align: 'center',
      width: 100,
    }, {
      title: '引流人',
      dataIndex: 'drainage_man',
      align: 'center',
  
      customRender: ({ record }) => {
  
  
        const text = record.drainage_man?.name
        const mobile = record.drainage_man?.mobile ?? ''
        return h('div', [text, h('br'), mobile])
      },
    }, {
      title: '达成人',
      dataIndex: 'reach_man',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        const text = record.reach_man?.name
        const mobile = record.reach_man?.mobile ?? ''
        return h('div', [text, h('br'), mobile])
  
      },
  
    }, {
      title: '干预人',
      dataIndex: 'intervener_man',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
  
  
        const text = record.intervener_man?.name
  
        const mobile = record.intervener_man?.mobile ?? ''
        return h('div', [text, h('br'), mobile])
      },
    }, {
      title: '医院名称',
      dataIndex: 'hospitalInfo',
      width: 100,
    }, {
      title: '推荐人',
      dataIndex: 'referrerInfo',
      align: 'center',
      width: 100,
  
    }, {
      title: '科室来源',
      dataIndex: 'department',
      align: 'center',
      width: 100,
    }, {
      title: '转介绍人',
      dataIndex: 'sponsorInfo',
      align: 'center',
      width: 100,
    }, {
      title: '下单类型',
      dataIndex: 'is_first_order',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        const text = is_first_order[record.is_first_order]
        return text
      },
    }, {
      title: '订单编号',
      dataIndex: 'order_sn',
      align: 'center',
      width: 100,
  
    }, {
      title: '发货方式',
      dataIndex: 'delivery_method',
      align: 'start',
      width: 150,
      // customRender: ({ record }) => {
      //   const text = delivery_method[record.delivery_method]
      //   return text
      // },
    },
    {
      title: '收件信息',
      dataIndex: 'receiverInfo',
      align: 'center',
      width: 200,
      customRender: ({ record }) => {
        let addressDetail = record.order_report_info?.province ? record.order_report_info?.province + '/' + record
          .order_report_info?.city + '/' + record.order_report_info?.area : record.province ? record.province + '/' +
          record
          .city + '/' + record.area : ''
        return h('div', [addressDetail,
          h('br'), '详细地址：' + (record.order_report_info?.address || record?.address || '-'),
          h('br'), '收件人姓名：' + (record.order_report_info?.realname || record?.realname || '-'),
          h('br'), '收件人手机：' + (record.order_report_info?.mobile || record?.mobile || '-'),
        ])
      },
    },
  ];
}
 

export { getColumns, columns1, userFormData };
