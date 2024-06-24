<template>
  <div class="page">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="goShippingList"> 待发列表 </a-button>
        <!-- <a-button type="primary" @click="handleCreate"> 新增 </a-button>
        <a-button type="primary" @click="is_my = !is_my;getForm().submit()"> 只看自己 </a-button>
        <a-button type="primary" @click="handleCreate"> 导出 </a-button> -->

      </template>
      <template #bodyCell="{ column, text, record,index }">
        <template v-if="column.dataIndex === 'logistics'">
          <div v-for="item of record.logistics" class="flex justify-center flex-col align-center">
            <a-button @click="openSendModal(record,4,item.id)" style="height:auto;display:block;text-align: start;"
              class="!m-0 !p-0" type="link">
              <div>单号：{{item.express_no}}</div>
              <div>状态：{{item.status_text}} <span v-if="item.status === 2" style="color:red">(已撤回)</span> </div>

            </a-button>
          </div>


        </template>
        <template v-if="column.key === 'action'">
          <!-- disabled:record?.order_logistics?.shipment_status === 0, -->
          <TableAction :actions="[
             {
               label:record?.order_logistics?.[0]?.shipment_type === 1?'补发':'发货',
               disabled:record?.shipment_status === 1,
               onClick: openSendModal.bind(null, record,2),
             },
              {
                label:'刷新',
               onClick:reloadRow
              },
            ]" />
          <TableAction :actions="[
                {
                  label:'转交',
                  onClick: openSendModal.bind(null, record,1),
                },
                {
                  label:'查看',
                  onClick: openSendModal.bind(null, record,5),
                },
                
              ]" />
        </template>
      </template>
    </BasicTable>
    <BasicModal destroyOnClose :afterClose="afterClose" @ok="ok" :title="title" @register="register"
      :width="(opentype===2 ||opentype===4 || opentype===5 ) ?'800px':'500px'">
      <a-form ref="modalFormRef" :model="zhuanjiaoFrom" :label-col="{ style: { width: '120px' } }">
        <div v-if="opentype ===1">
          <a-form-item label="当前发货人">
            <div v-for="item in zhuanjiaoFrom.userName">
              {{item}}
            </div>

          </a-form-item>
          <a-form-item label="选择发货人" name="to_warehouse_id" :rules="[{ required: true, message: '请选择' }]">
            <a-select optionFilterProp="name" show-search v-model:value="zhuanjiaoFrom.to_warehouse_id"
              style="width: 200px;" :options="warehouseOptions" :field-names="{ label: 'name', value: 'id' } ">
            </a-select>
          </a-form-item>
          <!-- <a-form-item label="选择发货人" name="username1">
            <a-radio-group v-model:value="zhuanjiaoFrom.username1" style="display: flex;flex-direction: column;">
              <a-radio :value="1">物流公司</a-radio>
              <a-radio :value="2">快递单号</a-radio>
              <a-radio :value="3">其他仓</a-radio>
            </a-radio-group>
          </a-form-item> -->
        </div>
        <div v-if="opentype ===2" style="display:flex;flex-wrap:wrap;width:100%">
          <a-table :scroll="{ x: 'max-content', y: 800 }" bordered style="width:100%"
            :dataSource="zhuanjiaoFrom.products" :columns="columns2">
            <template #bodyCell="{ column, text, record,index }">
              <template v-if="column.dataIndex === 'products'">

                <div style="margin-bottom:5px" v-for="(item,itemIndex) of record.productItem" :key="itemIndex">
                  <!-- <a-select style="width:200px" placeholder="请输入" show-search v-model:value="item.realproduct"
                    :options="[{value:1,label:'测试1'},{value:2,label:'实发产品测试'}]">
                  </a-select> -->

                  <a-form-item :name="['products',index,'productItem', itemIndex, 'product_id']"
                    :rules="[{ required: true, message: '请选择产品' }]">
                    <div style="display:flex;align-items:center">
                      <a-select @change="change" :disabled="filteredOptionsDisabled" style="width:200px"
                        placeholder="请输入" show-search v-model:value="item.product_id" :options="productOptions">
                      </a-select>
                      <Icon @click="addOrderRow1(record,item)" style="color:#0079ff;margin-left: 5px;font-size:20px"
                        icon="gala:add" />
                      <Icon @click="delOrderRow1(record,itemIndex)" icon="zondicons:minus-outline"
                        style="font-size:20px;color:red" />
                    </div>
                  </a-form-item>

                  <!-- <div style="text-align: start;color:red" v-if="!item.product_id">请选择</div> -->

                </div>

              </template>
              <template v-if="column.dataIndex === 'realnumber'">

                <div style="display:flex;align-items:center;margin-bottom:5px"
                  v-for="(item,itemIndex) of record.productItem" :key="itemIndex">
                  <a-form-item :name="['products',index,'productItem', itemIndex, 'num']"
                    :rules="[{ required: true, message:'请输入',trigger: 'change'}]">
                    <a-input-number :status="numStatus(record,item)" placeholder="请输入" :controls="false" :precision="0"
                      v-model:value="item.num" :min="1" :max="1000000" />
                    <div v-if="errorStatus(record,item)" style="text-align: start;color:red">数量应等于应发数量</div>
                  </a-form-item>
                </div>

              </template>
            </template>
          </a-table>
          <a-form-item label="发货方式" style="width:800px" name="type" :rules="[{ required: true, message: '请选择发货方式' }]">
            <a-radio-group v-model:value="zhuanjiaoFrom.type">
              <a-radio :value="0">物流发货</a-radio>
              <a-radio :value="1">线下发货</a-radio>
            </a-radio-group>
          </a-form-item>
          <template v-if="zhuanjiaoFrom.type === 0">
            <a-form-item style="width:350px" label="物流公司" name="express"
              :rules="[{ required: true, message: '请选择物流公司' }]">
              <a-select placeholder="请输入" @change="expressState.change" show-search labelInValue
                v-model:value="zhuanjiaoFrom.express" :fieldNames="{label:'key'}" @popupScroll="expressState.scroll"
                optionFilterProp="key" :filter-option="false"
                :not-found-content="expressState.fetching ? undefined : null"
                @search="expressState.fetchUser($event,{type:'logistics'})" :options="expressState.options">
              </a-select>
            </a-form-item>
            <a-form-item style="width:350px" label="快递单号" name="express_no"
              :rules="[{ required: true, message: '请输入快递单号' }]">
              <a-input placeholder="请输入" v-model:value="zhuanjiaoFrom.express_no" />
            </a-form-item>
            <a-form-item style="width:350px" label="报单收件信息">

              <div v-if="zhuanjiaoFrom.order_report_info?.province">
                收货地址：{{zhuanjiaoFrom.order_report_info?.province + '/' + zhuanjiaoFrom.order_report_info?.city + zhuanjiaoFrom.order_report_info?.area }}
              </div>
              <div>详细地址：{{zhuanjiaoFrom.order_report_info?.address|| '-'}}</div>
              <div>收件人姓名：{{zhuanjiaoFrom.order_report_info?.realname|| '-'}}</div>
              <div>收件人手机：{{zhuanjiaoFrom.order_report_info?.mobile|| '-'}}</div>
            </a-form-item>
            <a-form-item style="width:350px" label="商城订单收件信息">
              <div v-if="zhuanjiaoFrom.province">
                收货地址：{{zhuanjiaoFrom.province + '/' + zhuanjiaoFrom.city + zhuanjiaoFrom.area }}
              </div>
              <div>详细地址：{{zhuanjiaoFrom.address || '-'}}</div>
              <div>收件人姓名：{{zhuanjiaoFrom.realname|| '-'}}</div>
              <div>收件人手机：{{zhuanjiaoFrom.mobile|| '-'}}</div>
            </a-form-item>
            <a-form-item label="多批发货" name="shipment_type" style="width: 500px"
              :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group :disabled="shipment_type_disabled" v-model:value="zhuanjiaoFrom.shipment_type">
                <a-radio :value="0">完全发货</a-radio>
                <a-radio :value="1">多批发货</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="多地发货" name="region_type" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group @change="region_type_change(zhuanjiaoFrom.region_type)"
                v-model:value="zhuanjiaoFrom.region_type">
                <a-radio :value="0">独立发货</a-radio>
                <a-radio :value="1">多地发货</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="zhuanjiaoFrom.region_type === 1" name="other_warehouse_ids"
              :rules="[{ required: true, message: '请选择' }]">
              <a-select optionFilterProp="name" v-model:value="zhuanjiaoFrom.other_warehouse_ids" style="width: 200px;"
                mode="multiple" :options="warehouseOptions" :field-names="{ label: 'name', value: 'id' } ">
              </a-select>
            </a-form-item>
          </template>

        </div>
        <div v-if="opentype ===3">

          <a-form-item label="收件人姓名" name="realname">
            <a-input placeholder="请输入" v-model:value="zhuanjiaoFrom.order_report_info.realname" />
          </a-form-item>
          <a-form-item label="收件人手机号" name="mobile">
            <a-input placeholder="请输入" v-model:value="zhuanjiaoFrom.order_report_info.mobile" />
          </a-form-item>
          <a-form-item label="收货地址" name="address_adcode">

            <a-cascader :displayRender="handleRenderDisplay" @change="addressChange"
              v-model:value="zhuanjiaoFrom.order_report_info.address_adcode" :options="system_address_id_options"
              placeholder="请选择" :load-data="loadData" :fieldNames="{label:'name',value:'adcode'}" />
          </a-form-item>

          <!-- <a-form-item label="所在地区" name="adress" :rules="[{ required: true, message: '请输入收件人所在地区' }]">
            <a-cascader showSearch change-on-select v-model:value="tableData.adress" :options="[]"
              placeholder="请输入" />
          </a-form-item> -->
          <a-form-item label="详细地址" name="address">
            <a-textarea placeholder="请输入" v-model:value="zhuanjiaoFrom.order_report_info.address" />
          </a-form-item>
        </div>
        <div v-if="opentype ===4">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane v-for="item in zhuanjiaoFrom.order_logistics" :key="item.id" :tab="item.remark">
              <a-form-item label="物流公司">
                <span v-if="!companyEdit">{{item?.logistics?.express_name || '无'}}</span>
                <a-select ref="inputRef" style="width:200px" v-else placeholder="请输入" show-search labelInValue
                  v-model:value="item.logistics.express_name_obj" :fieldNames="{label:'key'}"
                  @popupScroll="expressState.scroll" optionFilterProp="key" :filter-option="false"
                  :not-found-content="expressState.fetching ? undefined : null"
                  @search="expressState.fetchUser($event,{type:'logistics'})" :options="expressState.options">
                </a-select>
                <Icon v-if="!companyEdit" @click="companyEdit = true"
                  style="color:#0079ff;margin-right: 5px;font-size:20px" icon="fe:edit" />
                <a-button v-if="companyEdit" @click="wuliuSave(item,zhuanjiaoFrom)" type="primary">保存</a-button>
                <a-button v-if="companyEdit" @click="companyEdit = false" type="error">取消</a-button>
              </a-form-item>
              <a-form-item label="快递单号">
                <span v-if="!companyEdit">{{item?.logistics?.express_no || '无'}}</span>
                <a-input style="width:200px" v-else placeholder="请输入" v-model:value="item.logistics.express_no_obj" />

                <Icon @click="onCopy(item.logistics?.express_no)" style="color:#0079ff;margin-right: 5px;font-size:20px"
                  icon="ph:copy-bold" />
              </a-form-item>
              <div class="text-end mb-6 mr-6">
                <a-popconfirm title="是否确认收货?" ok-text="确定" cancel-text="取消" @confirm="submit(item,1,zhuanjiaoFrom)">
                  <a-button v-if="item.is_confirm === 0 && item.status !== 2" type="primary">确认收货</a-button>
                </a-popconfirm>
                <a-popconfirm title="是否撤回?" ok-text="确定" cancel-text="取消" @confirm="submit(item,2,zhuanjiaoFrom)">
                  <a-button v-if="item.status !== 2" type="error">撤回</a-button>
                </a-popconfirm>
                <!-- <a-button @click="submit(item,1,zhuanjiaoFrom)" v-if="item.is_confirm === 0"
                  type="primary">确认收货</a-button>
                <a-button v-if="item.status !== 2" @click="submit(item,2,zhuanjiaoFrom)" type="error">撤回</a-button> -->
                <a-button disabled v-if="item.status === 2" type="info"
                  style="background-color: darkgray;color:#fff">已撤回</a-button>
              </div>
              <a-form-item>
                <a-table :pagination="false" :scroll="{ x: 'max-content', y: 800 }" bordered style="width:100%"
                  :dataSource="item.product" :columns="columns3"> </a-table>
              </a-form-item>

              <a-form-item label="物流进度">
                <a-timeline>
                  <a-timeline-item v-for="v in item.logistics?.last_result?.data">
                    <div>{{v.time}}</div>
                    <div>
                      {{v.context}}
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>

        </div>
        <div v-if="opentype ===5">
          <a-table :pagination="false" :scroll="{ x: 'max-content', y: 800 }" bordered style="width:100%"
            :dataSource="zhuanjiaoFrom.products" :columns="columns2">
            <template #bodyCell="{ column, text, record,index }">
              <template v-if="column.dataIndex === 'products'">

                <div style="margin-bottom:5px" v-for="(item,itemIndex) of record.productItem" :key="itemIndex">
                  <a-select @change="change" disabled style="width:200px" placeholder="请输入" show-search
                    v-model:value="item.product_id" :options="productOptions">
                  </a-select>
                </div>

              </template>
              <template v-if="column.dataIndex === 'realnumber'">

                <div style="display:flex;align-items:center;margin-bottom:5px;justify-content: center;"
                  v-for="(item,itemIndex) of record.productItem" :key="itemIndex">
                  {{item.num}}
                </div>

              </template>
            </template>
          </a-table>
          <div style="display:flex;flex-wrap:wrap;width:100%">
            <!-- <a-form-item style="width:350px" label="物流公司" name="express"
              :rules="[{ required: true, message: '请选择物流公司' }]">
              <a-select disabled placeholder="请输入" @change="expressState.change" show-search labelInValue
                v-model:value="zhuanjiaoFrom.express" :fieldNames="{label:'key'}" @popupScroll="expressState.scroll"
                optionFilterProp="key" :filter-option="false"
                :not-found-content="expressState.fetching ? undefined : null"
                @search="expressState.fetchUser($event,{type:'logistics'})" :options="expressState.options">
              </a-select>
            </a-form-item>
            <a-form-item style="width:350px" label="快递单号" name="express_no"
              :rules="[{ required: true, message: '请输入快递单号' }]">
              <a-input disabled placeholder="请输入" v-model:value="zhuanjiaoFrom.express_no" />
            </a-form-item> -->
            <a-form-item style="width:350px" label="报单收件信息">
              <div v-if="zhuanjiaoFrom.province">
                收货地址：{{zhuanjiaoFrom.province + '/' + zhuanjiaoFrom.city + zhuanjiaoFrom.area }}
              </div>
              <div>详细地址：{{zhuanjiaoFrom.address || '-'}}</div>
              <div>收件人姓名：{{zhuanjiaoFrom.realname|| '-'}}</div>
              <div>收件人手机：{{zhuanjiaoFrom.mobile|| '-'}}</div>
            </a-form-item>
            <a-form-item style="width:350px" label="商城订单收件信息">
              <div v-if="zhuanjiaoFrom.order_report_info?.province">
                收货地址：{{zhuanjiaoFrom.order_report_info?.province + '/' + zhuanjiaoFrom.order_report_info?.city + zhuanjiaoFrom.order_report_info?.area }}
              </div>
              <div>详细地址：{{zhuanjiaoFrom.order_report_info?.address|| '-'}}</div>
              <div>收件人姓名：{{zhuanjiaoFrom.order_report_info?.realname|| '-'}}</div>
              <div>收件人手机：{{zhuanjiaoFrom.order_report_info?.mobile|| '-'}}</div>
            </a-form-item>
          </div>
        </div>
      </a-form>
      <template #footer>
        <div style="text-align: center;">
          <a-button size="mini" type="primary" @click="onOk"
            :loading="loading">{{ opentype===3 || opentype===4?'确认':"提交" }}</a-button>
        </div>
      </template>
    </BasicModal>
  </div>
</template>
<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import Icon from '/@/components/Icon/icon.vue';
  import { CollapseSearchBar } from '/@/components/Business';
  import { formartData } from '@/utils/common.js'
  import { columns, userFormData, openInfo } from './index.js'
  import { useModal } from '/@/components/Modal';
  import BasicModal from '/@/components/Modal/src/BasicModal.vue';
  import { message, Modal } from 'ant-design-vue';
  const [modal] = Modal.useModal();
  import { createVNode } from 'vue'
  import { cloneDeep } from 'lodash-es';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { popupScrollSelect } from '@/views/order/customsList/index.js'
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  const getTableList = async (p) => {
    let data = await window.http.get({
      url: '/order_center/order_api/list',
      params: { ...p, warehouse_id: localStorage.getItem('warehouseId') }
    });
    const ids = data.records.filter(v => v.warehouse_order.length).flatMap(v => v.warehouse_order).map(v => v
      .warehouse_id)

    let result = []
    if (ids.length) {
      result = await window.http.post({
        url: '/erp-ware/warehouse/list',
        data: {
          idList: ids
        }
      });
    }
    data.records.forEach(v => {
      //物流信息
      v.logistics = v.order_logistics.map(e => ({
        status: e.status,
        status_text: e.logistics?.status_text,
        id: e.id,
        express_no: e
          .logistics?.express_no
      }))

      //发货人
      v.warehouse_order.map(c => {
        const obj = result.find(e => e.id == c.warehouse_id)

        if (obj) {
          c.name = obj.name
        }
      })

    })

    return data
  }
  const [registerTable, { reload, updateTableDataRecord, getRowSelection, getForm, getDataSource }] = useTable({
    title: '零售发货',
    rowKey: 'id',
    api: getTableList,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: userFormData
    },
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },

  });
  const ship_status = {
    '-1': '已取消',
    0: '待发货',
    1: '已发货',
  }
  const zhuanjiaoFrom = ref({})

  function handleEdit(record, type) {

  }
  const afterClose = () => {
    openInfo.value = null
  }
  const system_address_id_options = ref([])
  watch(openInfo, async val => {
    if (!val) return

    const { data: record, type } = val
    if (type === 3) {
      system_address_id_options.value = await getAreaRecord()
    }
    openSendModal(record, type)
  })
  const displayRenderArray = ref([])
  const addressLabels = ref([])
  const expressState = ref({})
  const handleRenderDisplay = ({ labels, selectedOptions }) => {
    if (unref(zhuanjiaoFrom.value.order_report_info.address_adcode).length === selectedOptions?.length) {
      return labels.join(' / ');
    }
    if (displayRenderArray.value.length) {
      return displayRenderArray.value.join(' / ');
    }
    return '';
  };
  const addressChange = (e, selectedOptions) => {
    // 通过selectedOptions获取标签值
    addressLabels.value = selectedOptions && selectedOptions.map(option => option.name);


  }
  const getAreaRecord = async (params, level = 0) => {
    let data = await window.http.get({
      url: '/basic_center/address_api/list',
      params: { ...params },
    });
    if (!data.length) {
      message.warning('没有下一级了')
    }
    data.forEach(v => {
      v.isLeaf = level
    })
    return data;
  }
  const loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    const { level } = targetOption
    targetOption.loading = true;

    // load options lazily
    setTimeout(async () => {
      targetOption.loading = false;

      targetOption.children = await getAreaRecord({ pid: targetOption.id }, level)
      system_address_id_options.value = [...system_address_id_options.value];
    }, 100);
  }
  const reloadRow = () => {
    reload()
  }
  async function handleDelete(record) {

    return
    await window.http.post({
      url: '/order_center/warehouse_address_map_api/del',
      data: { id: record.id },
    });
    reload();
  }
  const getWuliuOptions = async (key = {}) => {
    const [state] = popupScrollSelect('/basic_center/dictionary_api/select', { type: 'logistics', ...key })
    await state.requireApi()
    expressState.value = state

    return { state }
  }


  const productOptions = ref([])
  const filteredOptionsDisabled = computed(() => {
    let flag = false
    const pro = zhuanjiaoFrom.value.products.flatMap(v => v.productItem).map(v => v.product_id)


    productOptions.value.forEach(o => {
      o.disabled = pro.includes(o.value)
    })

    return flag
  });
  const getProducts = async () => {
    let data = await window.http.post({
      url: '/erp-ware/product/list',
    });

    productOptions.value = data.map(v => ({
      label: v.productName,
      value: v.id
    }))
    return
  }







  const change = (e) => {



  }
  const initForm = (obj = {}) => {
    return reactive(obj)
  }
  const orderFrom = initForm({
    userType: 1
  })
  const initFormState = () =>
    reactive({});

  let formState = initFormState();

  const state = reactive({
    selectedRowKeys: []
  })
  const onSelectChange = (selectedRowKeys, selectedRows) => {


    state.selectedRowKeys = selectedRowKeys;
  };
  const modalFormRef = ref();
  const inputRef = ref()
  const open = ref(false)
  const loading = ref(false)
  const title = ref('')
  const companyEdit = ref(false)
  const region_type_change = (e) => {

    if (e === 1 && !warehouseOptions.value.length) {
      getWarehouseOptions()
    }
  }
  const warehouseOptions = ref([])

  const getWarehouseOptions = async () => {
    let data = await window.http.post({
      url: '/erp-ware/warehouse/list',
      // data: { user_id },
    });
    warehouseOptions.value = data;

    // configStore.setMainOptions(warehouseOptions.value);
  };

  watch(inputRef, (newx) => {



    if (newx) {
      if (companyEdit.value) newx?.[0].focus()
    }
  })
  const deleteRow = (record) => {
    Modal.confirm({
      title: `是否删除此数据?`,
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, record),
      onOk() {

      },
      onCancel() {

      },
      class: 'test',
    });
  }
  const [register, { openModal, closeModal }] = useModal();
  const ok = () => {

    // closeModal();
  }
  const onOk = async () => {
try {
      loading.value = true
    let params = {}
    let url = ''

    if (opentype.value === 3) { //修改收件信息
    
      params = {
        realname: zhuanjiaoFrom.value.realname,
        mobile: zhuanjiaoFrom.value.mobile,
        province: addressLabels.value[0] || zhuanjiaoFrom.value.province,
        city: addressLabels.value[1] || zhuanjiaoFrom.value.city,
        area: addressLabels.value[2] || zhuanjiaoFrom.value.area,
        address: zhuanjiaoFrom.value?.address,
        "id": zhuanjiaoFrom.value.id,
        address_adcode: zhuanjiaoFrom.value.address_adcode?.length ? zhuanjiaoFrom.value.address_adcode[
          zhuanjiaoFrom.value
          .address_adcode.length - 1
        ] : zhuanjiaoFrom.value.address_adcode,
      }
      url = '/order_center/order_api/edit'
    } else if (opentype.value === 2) {
      url = '/order_center/order_api/delivery'
      if (!zhuanjiaoFrom.value.products.length) return message.error('该订单异常，不允许发货')
      if (zhuanjiaoFrom.value.shipment_type === 0) { //完全发货状态下 特殊校验

        let err = false
        zhuanjiaoFrom.value.products.forEach(v => {
          v.productItem.forEach(e => {
            if (e.num !== v.num) {
              err = true
            }
          })
        })

        if (err) return
      }

      await modalFormRef.value.validateFields().then(() => {

        params = {
          "order_id": zhuanjiaoFrom.value.id,
          "warehouse_id": localStorage.getItem('warehouseId'), //仓库id
          "type": zhuanjiaoFrom.value.type, //0线上发货1线下发货
          "shipment_type": zhuanjiaoFrom.value.shipment_type, //发货类型0完全发货1多批发货
          "region_type": zhuanjiaoFrom.value.region_type, //0独立发货1多地发货
          "other_warehouse_ids": zhuanjiaoFrom.value.other_warehouse_ids, //其他发货仓库
          "express_name": zhuanjiaoFrom.value.express.label,
          "express_code": zhuanjiaoFrom.value.express.value,
          "express_no": zhuanjiaoFrom.value.express_no,
          products: zhuanjiaoFrom.value.products.flatMap(v => v.productItem).map(v => ({
            id: v.product_id,
            num: v.num,
            original_product_id: v.original_product_id,
            original_product_title: v.original_product_title,
            original_product_num: v.original_product_num,
            title: productOptions.value.find(e => e.value === v.product_id)?.label,
          }))
        }
        return Promise.resolve()
      })
    } else if (opentype.value === 4) {
      return closeModal();
    } else if (opentype.value === 1) {
      url = "/order_center/order_api/transfer"
      params = {
        ...zhuanjiaoFrom.value
      }


    }


    window.http.post({
      url,
      data: params
    }, { successMessageMode: 'message' }).then(res => {
      closeModal();
      reload()
    }).finally(err => {

    })
} catch (error) {
  console.log('[ error ]-675', error)
  
}finally{
      loading.value = false

}


  };
  let opentype = ref(null)
  const activeKey = ref()
  const wuliuSave = (item, record) => {
    let params = {
      order_logistics_id: item.id,
      express_name: item.logistics.express_name_obj?.label || item.logistics.express_name,
      express_code: item.logistics.express_name_obj?.value || item.logistics.express_code,
      express_no: item.logistics.express_no_obj || item.logistics.express_no,
      warehouse_id: localStorage.getItem('warehouseId')
    }

    window.http.post({
      url: '/order_center/order_api/delivery_edit',
      data: params
    }).then(async res => {
      companyEdit.value = false
      let data = await getWuliuDetail(record.id)
      // await getWuliuOptions()


      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.order_logistics.forEach(v => {
        v.logistics.express_name_obj = v.logistics.express_name
        v.logistics.express_no_obj = v.logistics.express_no
      })
      // activeKey.value = id
      reload()
    })
  }
  const openSendModal = async (record, type, id) => {



    opentype.value = type
    if (type === 1) {
      title.value = '转交'
      await getWarehouseOptions()
      zhuanjiaoFrom.value = {
        order_id: record.id,
        warehouse_id: localStorage.getItem('warehouseId') || '',
        userName: record.warehouse_order.map(v => v.name)
      }

    } else if (type === 2) {
      title.value = '发货'
      // zhuanjiaoFrom.info = '报单收件信息'
      // zhuanjiaoFrom.info1 = '商城订单收件信息'
      let data = await getOrderDetail(record.id)
      await getWuliuOptions()
      await getProducts()
      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.type = 0
      if (data.products.length) {
        zhuanjiaoFrom.value.products.forEach((v, i) => {
          v.productItem = cloneDeep([data.products[i]])
          v.productItem.forEach(e => {
            e.original_product_num = v.num
            e.original_product_title = v.title
            e.original_product_id = v.product_id

          })
        })
      }


      if (zhuanjiaoFrom.value.order_logistics.length) {
        zhuanjiaoFrom.value.shipment_type = zhuanjiaoFrom.value.order_logistics[0].shipment_type

      } else {
        zhuanjiaoFrom.value.shipment_type = zhuanjiaoFrom.value.products.flatMap(v => v.productItem).length >
          zhuanjiaoFrom.value.products
          .length ? 1 : 0
      }


    } else if (type === 3) {
      title.value = '修改收件信息'
      zhuanjiaoFrom.value = cloneDeep(record)
      if (!zhuanjiaoFrom.value.order_report_info?.address_adcode) {
        zhuanjiaoFrom.value.order_report_info = {
          address: zhuanjiaoFrom.value.address,
          address_adcode: zhuanjiaoFrom.value.address_adcode,
          area: zhuanjiaoFrom.value.area,
          city: zhuanjiaoFrom.value.city,
          mobile: zhuanjiaoFrom.value.mobile,
          province: zhuanjiaoFrom.value.province,
          realname: zhuanjiaoFrom.value.realname,
        }
      }
      displayRenderArray.value = [
        zhuanjiaoFrom.value.order_report_info.province || zhuanjiaoFrom.value.province,
        zhuanjiaoFrom.value.order_report_info.city || zhuanjiaoFrom.value.city,
        zhuanjiaoFrom.value.order_report_info.area || zhuanjiaoFrom.value.area
      ]

    } else if (type === 4) {
      title.value = '物流查询'

      let data = await getWuliuDetail(record.id)
      await getWuliuOptions()

      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.order_logistics.forEach(v => {
        v.logistics.express_name_obj = v.logistics.express_name
        v.logistics.express_no_obj = v.logistics.express_no
      })

      activeKey.value = id

    } else if (type === 5) {
      title.value = '订单详情'

      let data = await getOrderDetail(record.id)
      await getWuliuOptions()
      await getProducts()
      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.type = 0
      if (data.products.length) {
        zhuanjiaoFrom.value.products.forEach((v, i) => {
          v.productItem = cloneDeep([data.products[i]])
          v.productItem.forEach(e => {
            e.original_product_num = v.num
            e.original_product_title = v.title
            e.original_product_id = v.product_id

          })
        })
      }
    }
    openModal()
  }
  const getOrderDetail = async (id) => {
    let data = await window.http.get({
      url: '/order_center/order_api/detail',
      params: {
        id
      }
    });
    return data
  }
  const getWuliuDetail = async (order_id) => {
    let data = await window.http.get({
      url: '/order_center/order_api/logistics',
      params: {
        order_id
      }
    });
    return data
  }
  const submit = (item, type, record) => { // type 1 收货 2 撤回

    let params = {
      order_logistics_id: item.id,
      warehouse_id: localStorage.getItem('warehouseId')
    }
    if (type === 2) delete params.warehouse_id
    let url = type === 1 ? '/order_center/order_api/confirm' : '/order_center/order_api/cancel_delivery'
    window.http.post({
      url,
      data: params
    }).then(async res => {
      if (type === 2) {
        if (item.status === 1 && res.is_rollback_warehouse) {
          // const goodsIdList = record.order_logistics.map((v) => v.id)?.join(',');
          // console.log('[ goodsIdList ]-837', goodsIdList)
          let dataList = [];
          record.order_logistics.forEach((v) =>
            v.product.forEach((item) => {
              dataList.push({
                objectId:item.id,
                express_no:v.logistics.express_no,
                order_id:v.order_id,
              });
            }),
          );
                console.log('[ dataList ]-839', dataList)
          const params = {
            path: '/sendoutgoodsManage/shippingList',
            query: {
              dataList:JSON.stringify(dataList) 
            },
          };
          window.go(params);
          return
        }
      }


      companyEdit.value = false
      let data = await getWuliuDetail(record.id)
      // await getWuliuOptions()


      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.order_logistics.forEach(v => {
        v.logistics.express_name_obj = v.logistics.express_name
        v.logistics.express_no_obj = v.logistics.express_no
      })

      reload()
    })

  }
  const dataSource1 = reactive([{
    key: 1,
    product: '好处阿萨德',
    number: 11,
  }])
  const productStatus = (id) => {
    let flag = ''
    if (!id) {
      flag = 'error'
    }
    return flag
  }

  const errorStatus = (record, item) => {
    const { num } = record //应发数量
    let flag = ''

    if (item && item.num > 0 && zhuanjiaoFrom.value.shipment_type === 0) {
      if (num !== item.num) {
        flag = true
      }
    }

    return flag
  }
  const numStatus = (record, item) => {
    const { num } = record //应发数量
    let flag = ''
    if (item && zhuanjiaoFrom.value.shipment_type === 0) {
      if (num !== item.num) {
        flag = 'error'
      }
    }

    return flag
  }
  const numMessage = ref(0)
  const validatorNum = async (rule, value, callback) => {
    if (!value) {
      return Promise.reject('请输入');
    } else if (numMessage.value === 1) {

      return Promise.reject("数量应等于应发数量");
    } else {
      return Promise.resolve();
    }
  };
  const validator = async (record, item) => {

    const { num } = record //应发数量
    if (item.num <= 1) {
      numMessage.value = 0
    } else {
      if (zhuanjiaoFrom.value.shipment_type === 0) {
        if (num !== item.num) {
          numMessage.value = 1

        } else {
          numMessage.value = 0
        }
      }
    }
  };
  const shipment_type_disabled = computed(() => {
    let flag = false
    if (productsChangeLength.value > zhuanjiaoFrom.value.products?.length ||
      zhuanjiaoFrom.value.order_logistics?.[0]?.shipment_type === 1) {
      flag = true
    }

    return flag

  })
  const productsChangeLength = computed(() => {


    return zhuanjiaoFrom.value?.products?.flatMap(v => v.productItem)?.length || 0
  })
  watch(productsChangeLength, val => {

    if (zhuanjiaoFrom.value.order_logistics?.[0]?.shipment_type !== 1) {
      zhuanjiaoFrom.value.shipment_type = val > zhuanjiaoFrom.value?.products?.length ? 1 : 0
    }


  })
  const columns3 = [{
    title: '应发产品',
    align: 'center',
    dataIndex: 'original_product_title',
    // key: 'product',
    width: '200px',
  }, {
    title: '应发数量',
    align: 'center',
    dataIndex: 'original_product_num',

    width: '100px',
  }, {
    title: '实发产品',
    align: 'center',
    dataIndex: 'title',
    width: '200px',
  }, {
    title: '实发数量',
    align: 'center',
    dataIndex: 'num',
    width: '120px',
  }, ]
  const columns2 = [{
    title: '应发产品',
    align: 'center',
    dataIndex: 'title',
    // key: 'product',
    width: '200px',
  }, {
    title: '应发数量',
    align: 'center',
    dataIndex: 'num',

    width: '100px',
  }, {
    title: '实发产品',
    align: 'center',
    dataIndex: 'products',
    width: '200px',
  }, {
    title: '实发数量',
    align: 'center',
    dataIndex: 'realnumber',
    width: '120px',
  }, ]
  const orderOptions = reactive([{
    value: '均衡代谢管理',
    label: '均衡代谢管理',
  }, {
    value: '残联',
    label: '残联',
  }, {
    value: '燕瘦环肥',
    label: '燕瘦环肥',
  }, ])
  const { createSuccessModal, createMessage } = useMessage();
  const { t } = useI18n();
  const onCopy = (val) => {
    const { isSuccessRef } = useCopyToClipboard(
      val,
    );
    unref(isSuccessRef) &&
      createSuccessModal({
        title: '成功',
        content: JSON.stringify(unref(val), null, 2),

      });
    // if (navigator.clipboard && window.isSecureContext) {
    //   // 页面在安全上下文中，所以 Clipboard API 可用
    //   // do something...
    //   return navigator.clipboard.writeText(val).then(() => {
    //     message.success("复制成功");
    //   });
    // } else {
    //   message.error('请手动复制')
    // }
  }
  const addOrderRow = (record) => {
    dataSource1.push({
      key: dataSource1.length + 1,
      product: '好处阿萨德',
      number: dataSource1.length + 1,
    })
  }
  const addOrderRow1 = (record, item) => {


    // 

    record.productItem.push({
      product_id: '',
      num: 1,
      original_product_id: record.product_id,
      original_product_num: record.num,
      original_product_title: record.title
    })

  }
  const delOrderRow = (index) => {
    if (dataSource1.length > 1) {
      dataSource1.splice(index, 1)
    }
  }
  const delOrderRow1 = (record, index) => {

    if (record.productItem.length > 1) {
      record.productItem.splice(index, 1)
    }
  }
  const goShippingList = () => {
    window.go('/sendoutgoodsManage/shippingList')
  }
</script>
<style lang="scss" scoped>
  .container {
    background: #f7f7f7;
    min-height: 100vh;
  }

  .ant-pagination {
    margin-top: 20px;
  }

  .ant-card-head {
    border: 4px solid #fff;
  }

  .ant-card-body {
    border: 4px solid #fff;
  }
</style>
