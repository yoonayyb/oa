<template>
  <div>
    <!-- <div class="header_btn"></div> -->
    <!-- form验证table -->
    <div class="header_btn" v-if="!isWithdraw">
      <a-button @click="handleBtnClick(0)" :type="isDetails === 0 ? 'primary' : 'default'">汇总</a-button>
      <a-button @click="handleBtnClick(1)" :type="isDetails === 1 ? 'primary' : 'default'">明细</a-button>
    </div>
    <a-form v-show="isDetails === 1" class="disabled_form" ref="formRef" :model="formState" :label-col="labelCol">
      <BasicTable class="form_table" @register="registerTable" @field-value-change="fieldValueChange">
        <!-- <template #tableTitle>
          <a-button @click="handleBtnClick(0)" :type="isDetails === 0 ? 'primary' : 'default'">汇总</a-button>
          <a-button @click="handleBtnClick(1)" :type="isDetails === 1 ? 'primary' : 'default'">明细</a-button>
        </template> -->
        <template #toolbar>
          <a-button v-loading="btnLoading" type="primary" @click="submit()">提交移库</a-button>
        </template>
        <template #bodyCell="{ index, column, record }">
          <!--  && record.locationOutList?.length -->
          <template v-if="column.key === 'locationIdOutObj'">
            <a-form-item :name="['list', index, 'locationIdOutObj']" name="locationIdOutObj" :rules="rules.locationIdOutObj">
              <a-select
                style="width: 100%"
                showSearch
                :disabled="isWithdraw"
                :allowClear="true"
                label-in-value
                :options="record.locationOutList"
                v-model:value="record.locationIdOutObj"
                @change="locationOutChange($event, record)"
                :field-names="{ label: 'locationName', value: 'locationId' }"
                optionFilterProp="locationName"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'bracketIdOutObj' && record.locationIdOutObj">
            <a-form-item :name="['list', index, 'bracketIdOutObj']" name="bracketIdOutObj" :rules="rules.bracketIdOutObj">
              <a-select
                style="width: 100%"
                showSearch
                :disabled="isWithdraw"
                :allowClear="true"
                label-in-value
                :options="record.bracketOutList"
                v-model:value="record.bracketIdOutObj"
                @change="bracketOutChange($event, record)"
                :field-names="{ label: 'bracketNo', value: 'bracketId' }"
                optionFilterProp="bracketNo"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'batchNumberObj' && record.bracketIdOutObj">
            <a-form-item :name="['list', index, 'batchNumberObj']" name="batchNumberObj" :rules="rules.batchNumberObj">
              <a-select
                style="width: 100%"
                showSearch
                :disabled="isWithdraw"
                :allowClear="true"
                :options="record.batchNumberOutList"
                v-model:value="record.batchNumberObj"
                label-in-value
                @change="batchNumberOutChange($event, record)"
                @dropdownVisibleChange="batchNumberOutDropdownChange($event, record)"
                :field-names="{ label: 'batchNumber', value: 'batchNumber' }"
                optionFilterProp="batchNumber"
                placeholder="请选择"
              />
            </a-form-item>
          </template>

          <template v-if="column.key === 'amount' && record.sourceBeforeStock > 0">
            <a-form-item :name="['list', index, 'amount']" name="amount" :rules="rules.amount">
              <a-input-number
                style="width: 100%; min-width: 50px"
                v-model:value="record.amount"
                :min="1"
                :max="disabledNumInput(record)"
                placeholder="请输入"
                @change="amountChange($event, record)"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'sourceAfterStock' && record.sourceBeforeStock > 0">
            {{ getSourceAfterStock(record) }}
          </template>

          <template v-if="column.key === 'locationIdInObj' && locationList?.length">
            <a-form-item :name="['list', index, 'locationIdInObj']" name="locationIdInObj" :rules="rules.locationIdInObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :options="locationList"
                v-model:value="record.locationIdInObj"
                @change="locationIdInChange($event, record)"
                @dropdownVisibleChange="locationIdInDropdownChange($event, record)"
                :field-names="{ label: 'locationName', value: 'id' }"
                optionFilterProp="locationName"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'bracketIdInObj' && record.locationIdInObj">
            <a-form-item :name="['list', index, 'bracketIdInObj']" name="bracketIdInObj" :rules="rules.bracketIdInObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :options="record.bracketInList"
                v-model:value="record.bracketIdInObj"
                @change="bracketIdInChange($event, record)"
                @dropdownVisibleChange="bracketIdInDropdownChange($event, record)"
                :field-names="{ label: 'bracketNo', value: 'id' }"
                optionFilterProp="bracketNo"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'inventoryStatus' && record.bracketIdInObj">
            <a-form-item :name="['list', index, 'inventoryStatus']" name="inventoryStatus" :rules="rules.inventoryStatus">
              <a-select
                style="width: 100%"
                :options="record.inventoryStatusOption"
                v-model:value="record.inventoryStatus"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'Aupload' && record.locationIdOutObj">
            <a-button type="primary" @click="auploadOpen(record)">上传</a-button>
          </template>
          <template v-if="column.key === 'remark' && record.locationIdOutObj">
            <a-button @click="openFn(index, record)">备注</a-button>
          </template>

          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  icon: 'gala:add',
                  onClick: handleAdd.bind(null, record, index),
                },
                {
                  icon: 'icon-park-outline:reduce-one',
                  color: 'error',
                  onClick: handleDelete.bind(null, record, index),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </a-form>

    <BasicTable v-show="isDetails === 0" class="form_table" @register="registerTable1"> </BasicTable>
    <uploadChecklist v-show="isDetails === 1" :picList="checkPicList" @onOk="onOk" />
    <Aupload ref="auploadRef" :defaultImageList="picList" :catgory="'inventory'" :hideBtn="true" :hideImageList="true" :limitNum="5" />
    <a-modal v-model:open="open" title="添加/修改备注" @ok="open = false">
      <a-textarea style="width: 100%" v-model:value="recordRow.remark" :rows="4" placeholder="请输入" />
    </a-modal>
    <!-- <Edit @register="registerModal" @success="handleSuccess" /> -->
  </div>
</template>
<script lang="ts" setup>
  import { Aupload } from '/@/components/Aupload';
  import { formatToDate, daysDiff } from '/@/utils/dateUtil';
  import { message } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  // import Edit from './Edit.vue';
  import uploadChecklist from '/@/views/InventoryManage/inventoryList/uploadChecklist.vue';
  import { useRoute } from 'vue-router';
  import { userSchemaFn } from './config';
  import { getSpecsStr } from '@/utils/business/index';
  import { useConfigStoreWithOut } from '/@/store/modules/config';
  import { isNumber } from '/@/utils/is';
  const configStore = useConfigStoreWithOut();
  let { inventoryStatusOption } = configStore;
  const route = useRoute();
  const labelCol = { style: { width: '150px' } };
  const rules = {
    batchNumberObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    locationIdOutObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    bracketIdOutObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    bracketIdInObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    locationIdInObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    amount: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  };

  const initFormState = () => ({
    list: [],
    inventoryType: 10,
    company_id: localStorage.getItem('companyId'),
  });

  let formState = ref(initFormState());
  const getSpace = computed(() => (record, Specs) => {
    if (record?.productName) {
      return getSpecsStr(record, Specs);
    }
  });

  const { schemas, detailsColumns, summaryColumns } = userSchemaFn();

  const getProductOptions = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/product/list',
      data,
    });
    return result;
  };
  const getShippingRecords = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/inventoryRecord/shippingRecords',
      data,
    });
    return result;
  };
  const getAllBatchNumberOptions = async (productIdList) => {
    let result = await window.http.post({
      url: '/erp-ware/inventory/batchQueryBatchNumberList',
      data: {
        productIdList,
        warehouseId: unref(warehouseId),
      },
    });
    return result;
  };
  const getLocationList = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/locationManage/list',
      data,
    });
    return result;
  };
  const getBracketListFn = async (data) => {
    return await window.http.post({
      // url: '/erp-ware/bracketManage/list',
      url: '/erp-ware/bracketManage/bracketInventoryStatusList',
      data,
    });
  };

  const getInventoryByProLocBra = async (data) => {
    return await window.http.post({
      url: '/erp-ware/inventory/queryInventoryByProLocBra',
      data,
    });
  };
  const transferFn = async (data) => {
    return await window.http.post({
      url: '/erp-ware/inventoryRecord/transfer',
      data,
    });
  };
  const getPendingList = async (warehouse_id) => {
    return await window.http.get({
      url: '/order_center/order_api/pending_list',
      params: {
        warehouse_id,
      },
    });
  };
  const warehouseId = computed(() => {
    return configStore.getCurrentWarehouseId;
  });
  watch(
    () => warehouseId.value,
    (newVal, oldVal) => {
      reqMapTableFn(newVal);
    },
  );

  let queryDataList = [];
  const formRef = ref();
  const open = ref(false);
  const btnLoading = ref(false);
  //isWithdraw为true时 是撤回发货  false为待发
  const isWithdraw = ref(false);
  const isDetails = ref(1);

  const batchNumberInputRef = ref();

  const addBatchName = ref();
  const productOptions = ref([]);
  const pendingList = ref([]);
  const summaryList = ref([]);
  const locationList = ref([]);
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord, setLoading, setColumns }] = useTable({
    title: '详情列表',
    rowKey: 'id',
    dataSource: formState.value.list,
    columns: detailsColumns,
    formConfig: {
      labelWidth: 100,
      schemas,
      showSubmitButton: false, //隐藏查询按钮
      showResetButton: false, //隐藏重置按钮
    },
    showTableSetting: false,
    showIndexColumn: false,
    pagination: false,
    bordered: true,
  });
  const [registerTable1] = useTable({
    title: '汇总列表',
    rowKey: 'id',
    dataSource: summaryList,
    columns: summaryColumns,
    formConfig: {
      labelWidth: 100,
      schemas,
      showSubmitButton: false,
      showResetButton: false,
    },
    showTableSetting: true,
    showIndexColumn: false,
    pagination: false,
    bordered: true,
  });
  const checkPicList = ref([]);
  const onOk = (list) => {
    checkPicList.value = list.value;
  };
  const auploadRef = ref();
  const picList = ref([]);
  const auploadOpen = (record) => {
    picList.value = record.picList;
    auploadRef.value.open();
  };
  let recordRow = {};
  const openFn = (index, record) => {
    recordRow = record;
    open.value = true;
  };

  function handleSuccess({ isUpdate, values }) {
    reload();
  }

  const handleBtnClick = (val) => {
    isDetails.value = val;
  };
  const addData = (record, index) => {
    let list = formState.value.list.filter((item) => item.id === record.id);
    let findIndex = formState.value.list.findIndex((item) => item.id === record.id);
    let findVal = formState.value.list[findIndex];
    findVal.rowSpan = list.length + 1;
    let newItem = {
      ...record,
      rowSpan: 0,
    };

    if (unref(isWithdraw)) {
      //撤回时
      const filteredPropsList = clearCommonPropsList.filter(
        (prop) => !['batchNumber', 'sourceBeforeStock', 'sourceAfterStock'].includes(prop),
      );
      clearCommonPropsFn(newItem, [...filteredPropsList]);
    } else {
      //发货时
      //清理一些不需要的数据
      clearCommonPropsFn(newItem, [...clearCommonPropsList, 'bracketIdOutObj', 'locationIdOutObj']);
    }

    formState.value.list.splice(index + 1, 0, newItem);
  };

  function handleAdd(record, index) {
    addData(record, index);
  }
  function handleDelete(record, index) {
    //过滤出当前 record.id一样的数据  也就是进行行合并后的数据
    let list = formState.value.list.filter((item) => item.id === record.id);
    if (list.length !== 1) {
      let findIndex = formState.value.list.findIndex((item) => item.id === record.id);
      if (findIndex === index) {
        //当前点击删除的是当前合并行数组中的第一条
        //所以需要对合并行数组中的第二条的rowSpan进行修改
        let findVal = formState.value.list[findIndex + 1];
        findVal.rowSpan = list.length - 1;
      } else {
        //当前点击删除的不是是当前合并行数组中的第一条
        //所以需要对第一条的rowSpan进行--
        let findVal = formState.value.list[findIndex];
        findVal.rowSpan--;
      }
      formState.value.list.splice(index, 1);
    }
  }

  const fieldValueChange = async (key, val) => {
    // if (key === 'warehouseId') {
    //   formState.value.list.length = 0;
    //   formState.value.warehouseId = val;
    //   locationList.value = await getLocationList({ warehouseId: val });
    //   if (locationList.value.length === 0) {
    //     message.error('当前仓库暂无库位，无法移库');
    //   } else {
    //     formState.value.list.push({});
    //   }
    // }
  };

  const clearCommonPropsList = [
    'amount',
    'batchNumber',
    'batchNumberIdOut',
    'manuBatchNumber',
    'produceDate',
    'expirationDate',
    'inventoryStatus',
    'locationIdInObj',
    'locationNameIn',
    'locationIdIn',
    'bracketInList',
    'bracketIdInObj',
    'bracketNoIn',
    'bracketIdIn',
    'sourceBeforeStock',
    'amount',
    'sourceAfterStock',
    'destinationBeforeStock',
    'amountIn',
    'destinationAfterStock',
    'remark',
    // 'picList',
  ];
  const locationOutChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, [...clearCommonPropsList, 'bracketIdOutObj']);
    if (item?.option) {
      record.locationIdOut = item.option.locationId;
      record.locationNameOut = item.option.locationName;
      record.locationType = locationList.value.find((v) => v.id === item.option.locationId)?.locationType;
      const filterBatchOptions = record.batchOptions.filter((v) => v.locationId === item.option.locationId);
      record.bracketOutList = mapBatch(record.productName, filterBatchOptions, ['bracketId', 'bracketNo']);
      // record.bracketOutList = record.batchOptions.filter((v) => v.locationId === item.option.locationId);
      if (record.bracketOutList.length === 0) {
        message.error('当前库位下托架库存为0');
        return;
      }
    }
  };

  const bracketOutChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, [...clearCommonPropsList, 'batchNumberObj']);

    if (item?.value && item.option) {
      record.bracketIdOut = item.option.bracketId;
      record.bracketNoOut = item.option.bracketNo;

      record.batchNumberOutList = record.batchOptions.filter((v) => v.bracketId === item.option.bracketId);
    }
  };
  const batchNumberOutChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, clearCommonPropsList);
    if (item?.value && item.option) {
      // record.batchNumberIdOut = item.option.id;
      record.batchNumber = item.option.batchNumber;
      record.manuBatchNumber = item.option.manuBatchNumber;
      record.produceDate = item.option.produceDate;
      record.expirationDate = item.option.expirationDate;
      // record.inventoryStatus = item.option.inventoryStatus;
      const params = {
        productId: record.product_id,
        locationId: record.locationIdOut,
        bracketId: record.bracketIdOut,
        batchNumber: record.batchNumber,
      };

      // let currentInventory = await getInventoryByProLocBra(params);
      record.sourceBeforeStock = item.option.remainAmount || 0;
      if (!record.sourceBeforeStock || record.sourceBeforeStock === 0) {
        message.error('当前批次库存为0');
        return;
      }
      // if (item.option.remainAmount > record.num) {
      // }

      const filterformStateList = formState.value.list.filter((v) => v.id === record.id);

      //只有同单号第一条才默认移库数量
      if (filterformStateList.length === 1) {
        if (record.sourceBeforeStock >= record.num) {
          record.amount = record.num;
        } else {
          message.error(`当前批次号库存为${record.sourceBeforeStock} 少于发货总数 可以点击加号添加额外批次`);
          record.amount = record.sourceBeforeStock;
        }
      }
      amountChange(record.num, record);
    }
  };
  const batchNumberOutDropdownChange = (e, record) => {
    record.batchNumberOutList = record.batchNumberOutList.map((v) => {
      return {
        ...v,
        disabled: formState.value.list.some((res) => {
          //禁用表格中已选的 同产品 同批次的 同库位 同托架的
          return (
            res.id === record.id &&
            res.batchNumber === v.batchNumber &&
            res.bracketIdOut === v.bracketId &&
            res.locationIdOut === v.locationId
          );
        }),
      };
    });
  };
  const disabledNumInput = (record) => {
    // return record.sourceBeforeStock > record.num ? record.num : record.sourceBeforeStock;
  };
  //allAmountStatus状态用来判断移库数量是否正确
  const updateAllAmountStatus = (list, record, allAmount) => {
    list.forEach((v) => {
      if (v.id === record.id) {
        v.allAmountStatus = allAmount === record.num;
      }
    });
  };
  const getSourceAfterStock = (record) => {
    let filterList = getFilterList(record, 1);
    const allAmount = filterList.reduce((total, item) => {
      return total + (item.amount ? item.amount : 0);
    }, 0);
    return record.sourceBeforeStock - allAmount;
  };
  const getAllAmount = (val, record) => {
    let filterList = getFilterList(record, 2);
    const allAmount = filterList.reduce((total, item) => {
      return total + (item.amount ? item.amount : 0);
    }, 0);
    console.log('[ allAmount ]-543', allAmount);

    if (unref(isWithdraw)) {
      //撤回发货时的逻辑
      if (allAmount > record.num) {
        message.error('移库数量不能大于当前发货总数');
      }
      // filterList[0].sourceAfterStock = record.sourceBeforeStock - allAmount;
      updateAllAmountStatus(filterList, record, allAmount);
    } else {
      if (allAmount > record.num) {
        message.error('移库数量不能大于当前发货总数');
      }
      //发货时的逻辑

      // record.sourceAfterStock = record.sourceBeforeStock - allAmount;
      updateAllAmountStatus(formState.value.list, record, allAmount);
    }
  };

  const getFilterList = (record, filterType) => {
    const { batchNumber, bracketIdOut, locationIdOut, id, productId } = record;
    let filterFunction;
    if (filterType === 1) {
      filterFunction = (v) =>
        v.productId === productId && v.batchNumber === batchNumber && v.bracketIdOut === bracketIdOut && v.locationIdOut === locationIdOut;
    } else {
      //判断同一订单同一物流的  id上带有 物流id 订单id了
      filterFunction = (v) => v.id === id;
    }
    const filterList = formState.value.list.filter((v) => filterFunction(v));
    return filterList;
  };

  const amountChange = (val, record) => {
    if (val && Number(val)) {
      getAllAmount(val, record);
      if (record.bracketIdIn) {
        record.amountIn = val;
        record.destinationAfterStock = record.destinationBeforeStock + val;
      }
    } else {
      // record.sourceAfterStock = '';
      clearCommonPropsFn(record, ['sourceAfterStock', 'amountIn', 'destinationAfterStock']);
    }
  };

  const clearlocationIdInList = ['destinationBeforeStock', 'destinationAfterStock', 'amountIn', 'bracketNoIn', 'bracketIdIn'];
  const locationIdInChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, [...clearlocationIdInList, 'bracketInList', 'bracketIdInObj']);
    if (item?.option) {
      record.locationIdIn = item.option.id;
      record.locationNameIn = item.option.locationName;
      // record.locationIdIn = item.option.id;
      // record.bracketInList = await getBracketList(item.option.id, record.bracketIdOut);
    }
  };

  const getBracketList = async (locationId) => {
    let bracketList = await getBracketListFn({
      locationId,
      status: 0,
    });
    // let bracketInList = bracketList.filter((v) => {
    //   return v.id !== bracketIdOut;
    // });
    if (bracketList.length === 0) {
      message.error('当前库位下无托架可进行移库，请添加托架');
    }
    return bracketList;
  };

  const locationIdInDropdownChange = (item, record) => {
    locationList.value = locationList.value.map((v) => {
      return {
        ...v, //禁用前面选择的移出库位
        disabled: v.id === record.locationOutId,
      };
    });
  };

  const bracketIdInDropdownChange = async (status, record) => {
    if (!status) return;
    if (!record.bracketInList) {
      record.bracketInList = await getBracketList(record.locationIdIn);
    }
    if (unref(isWithdraw)) {
      //撤回发货
      record.bracketInList = record.bracketInList.map((v) => {
        return {
          ...v,
          disabled: formState.value.list.some(
            //1.禁用当前行已选的移出托架号
            //2.禁用整个表格中同个商品的同个托架
            (res) => {
              return record.bracketIdOut === v.id || (res.bracketIdIn === v.id && res.productId === record.productId);
            },
          ),
        };
      });
    } else {
      //正常发货
      record.bracketInList = record.bracketInList.map((v) => {
        return {
          ...v,
          //1.禁用前面选择的移出托架
          //2.禁用不是冻结或无状态的托架  发货时只能进入冻结或无状态的托架
          //3.无状态的托架 就是 托架还没有inventoryStatus  或者有inventoryStatus 但库存为0
          disabled: v.id === record.bracketIdOut || (v.inventoryStatus !== -1 && v.inventoryStatus !== null && v.remainAmount),
        };
      });
    }
  };
  const getInventoryStatusOption = (record, inventoryStatus, remainAmount) => {
    let inventoryStatusVal = isNumber(remainAmount) && remainAmount > 0 ? inventoryStatus : 1;
    record.inventoryStatus = inventoryStatusVal;
    record.inventoryStatusOption = inventoryStatusOption.map((v) => {
      return {
        ...v,
        // 托架上有库存时就需要对入库产品进行状态限制  只能入库同状态产品
        disabled: remainAmount > 0 && inventoryStatus !== null ? v.value !== inventoryStatusVal : false,
      };
    });
  };
  const getInventoryByProLocBraFn = async (record, locationId, bracketId) => {
    try {
      const params = {
        productId: record.product_id || record.productId,
        locationId,
        bracketId,
        batchNumber: record.batchNumber,
      };
      const currentInventory = await getInventoryByProLocBra(params);
      return currentInventory;
    } catch (error) {}
  };
  const mapBracketIdIn = async (record, inventoryStatus, remainAmount) => {
    const currentInventory = await getInventoryByProLocBraFn(record, record.locationIdIn, record.bracketIdIn);
    record.destinationBeforeStock = currentInventory.remainAmount || 0;
    record.amountIn = record.amount;
    record.destinationAfterStock = currentInventory.remainAmount + record.amount;
    getInventoryStatusOption(record, inventoryStatus, remainAmount);
  };
  const bracketIdInChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, [...clearlocationIdInList]);
    if (item?.value && item.option) {
      const { id, bracketNo, inventoryStatus, remainAmount } = item.option;
      record.bracketIdIn = id;
      record.bracketNoIn = bracketNo;
      record.inventoryStatus = inventoryStatus;
      mapBracketIdIn(record, inventoryStatus, remainAmount);
    }
  };

  /*
   *清理已选内容
   */
  const clearCommonPropsFn = (record, clearCommonPropsList) => {
    clearCommonPropsList.forEach((prop) => {
      delete record[prop];
    });
  };

  const clearParamsPropsList = [
    'amountIn',
    'categoryName',
    'defaultFrequency',
    'defaultDosage',
    'defaultUsage',
    'createdTime',
    'createdUsername',
    'overdueWarningTime',
    'overdueWarningTimeUnit',
    'supplier',
    'supplierId',
    'boxingQuantity',
    'boxingUnit',
    'expiredAmount',
    'destinationAfterStock',
    'destinationBeforeStock',
    'express_no',
    'instructions',
    'inventoryAlertQuantity',
    'order_id',
    'id',
    'order_logistics_id',
    'order_logistics_product_id',
    'recordNo',
    'sourceAfterStock',
    'sourceBeforeStock',
    'shape',
    'approvalNumber',
    'banner',
    'barCode',
    'remainAmount',
    'status',
    'title',
    'validPeriod',
    'validPeriodUnit',
    'categoryId',
    'batchOptions',
    'batchNumberList',
    'batchNumberObj',
    'batchNumberOptions',
    'batchNumberOutList',
    'bracketIdInObj',
    'bracketIdOutObj',
    'bracketInList',
    'bracketOutList',
    'locationIdInObj',
    'locationIdOutObj',
    'locationOutList',
    'productNameObj',
    'manufacturer',
  ];

  const buildSelectObj = (record, nameArr) => {
    return {
      [nameArr[0]]: record[nameArr[0]],
      [nameArr[1]]: record[nameArr[1]],
      label: record[nameArr[0]],
      value: record[nameArr[1]],
    };
  };
  //撤回发货时
  const transformRecord = async (outRecord, inRecord) => {
    // 获取相关数据
    const queryFindVal = queryDataList.find((v) => v.objectId === outRecord.objectId);
    const product = productOptions.value.find((item) => item.id === outRecord.productId);

    // 构建新对象
    const newRow = {
      ...inRecord,
      ...queryFindVal,
      isWithdraw: true,
      boxingSpecsStr: getSpecsStr(product, 'boxing'),
      packingSpecsStr: getSpecsStr(product, 'packing'),
      locationIdOutObj: buildSelectObj(inRecord, ['locationName', 'locationId']),
      bracketIdOutObj: buildSelectObj(inRecord, ['bracketNo', 'bracketId']),
      locationIdInObj: buildSelectObj(outRecord, ['locationName', 'locationId']),
      bracketIdInObj: buildSelectObj(outRecord, ['bracketNo', 'bracketId']),
      batchNumberObj: {
        batchNumber: inRecord.batchNumber,
        manuBatchNumber: inRecord.manuBatchNumber,
        label: inRecord.batchNumber,
        value: inRecord.batchNumber,
      },
      bracketIdIn: outRecord.bracketId,
      bracketIdOut: inRecord.bracketId,
      bracketNoIn: outRecord.bracketNo,
      bracketNoOut: inRecord.bracketNo,
      locationIdIn: outRecord.locationId,
      locationIdOut: inRecord.locationId,
      locationNameIn: outRecord.locationName,
      locationNameOut: inRecord.locationName,
      // bracketInList,
      // sourceBeforeStock: inRecord.remainAmount,
      // destinationBeforeStock: outRecord.remainAmount,
      // destinationAfterStock: outRecord.remainAmount,
      stockUnit: product.boxingUnit,
      specs: product.boxingQuantity,
      productNo: product.productNo,
      num: inRecord.amount,
      //  inRecord.picList?.split(',') ||
      picList: [],
    };
    //请求库存的最新数据
    const currentInventory = await getInventoryByProLocBraFn(newRow, newRow.locationIdOut, newRow.bracketIdOut);
    const currentInventory2 = await getInventoryByProLocBraFn(newRow, newRow.locationIdIn, newRow.bracketIdIn);
    newRow.sourceBeforeStock = currentInventory.remainAmount;
    newRow.amount = currentInventory.remainAmount >= inRecord.amount ? inRecord.amount : 0;
    newRow.destinationBeforeStock = currentInventory2.remainAmount;
    getInventoryStatusOption(newRow, currentInventory2.inventoryStatus, currentInventory2.remainAmount);
    return newRow;
  };
  /*
   * 撤回发货时 改造table数据方法
   * 需要将后端返回的 出入库（两条数据）结合成一条数据
   */
  const mapRecordsTableFn = async (records) => {
    const mergedArr = [];

    for (let index = 0; index < records.length; index += 2) {
      const outRecord = records[index];
      const inRecord = records[index + 1];
      const newRow = await transformRecord(outRecord, inRecord);
      mergedArr.push(newRow);
    }

    formState.value.list.length = 0;
    mergedArr.forEach((v) => {
      formState.value.list.push(v);
      amountChange(v.amount, v);
    });
  };
  const reqMapTableFn = async (id) => {
    pendingList.value = await getPendingList(id);
    mapTable();
  };

  const mapTable = () => {
    const { list } = pendingList.value;
    summaryTableFn(list);
    detailsTableFn(list);
  };

  //汇总明细  只在待发时出现
  const summaryTableFn = (list) => {
    summaryList.value.length = 0;
    const summary = list.reduce((acc, item) => {
      const key = `${item.product_id}`;
      if (!acc[key]) {
        acc[key] = { ...item, objectId: item.product_id };
      } else {
        acc[key].num += item.num;
      }
      return acc;
    }, {});

    Object.values(summary).forEach((v) => {
      summaryList.value.push(v);
    });

    // setColumns(summaryColumns);
  };
  //改造待发列表方法
  const detailsTableFn = async (list) => {
    const productIdList = list.map((v) => v.product_id);
    if (!productIdList.length) {
      message.error('暂无产品待发');
      return;
    }
    const allBatchOptions = await getAllBatchNumberOptions([...new Set(productIdList)]);

    const detailsList = list.map((v, i) => {
      const product = productOptions.value.find((item) => item.id === v.product_id);
      const batchOptions = allBatchOptions[v.product_id];
      const locationOutList = mapBatch(product, batchOptions, ['locationId', 'locationName']);
      return {
        ...v,
        ...product,
        isCollecting: v.is_collecting,
        picList: [],
        stockUnit: product.boxingUnit,
        specs: product.boxingQuantity,
        packageSpecsStr: getSpecsStr(product, 'package'),
        boxingSpecsStr: getSpecsStr(product, 'boxing'),
        packingSpecsStr: getSpecsStr(product, 'packing'),
        purchasePrice: product.price,
        objectId: v.order_logistics_product_id,
        productId: product.id,
        id: `${product.id}_${v.express_no}_${v.order_id}`,
        batchOptions,
        locationOutList,
      };
    });
    detailsList.forEach((v) => {
      formState.value.list.push(v);
    });
    // setColumns(detailsColumns);
  };
  const mapBatch = (productInfo, list, keyNameArr) => {
    if (list && list.length) {
      const reduceList = list.reduce((acc, item) => {
        const key = item[keyNameArr[0]];
        if (!acc[key]) {
          acc[key] = {
            [keyNameArr[0]]: key,
            [keyNameArr[1]]: item[keyNameArr[1]],
          };
        }
        return acc;
      }, {});
      return Object.values(reduceList); // 将对象转换为数组并返回
    } else {
      message.error(`商品：${productInfo.productName}找不到可发批次`);
    }
  };
  const submit = () => {
    formRef.value
      .validate()
      .then(async (values) => {
        btnLoading.value = true;
        let allAmountStatusArr = [];

        const list = formState.value.list.map((item) => {
          if (!item.allAmountStatus) {
            allAmountStatusArr.push(`报单号 ${item.order_id} 的 ${item.productName} 移出数量有误，请修改`);
            return;
          }
          let params = {
            ...item,
            picList: item.picList.join(','),
          };
          // 提交时清理后端不需要的字段
          clearCommonPropsFn(params, clearParamsPropsList);
          return params;
        });

        //证明有商品移库数量超额
        if (allAmountStatusArr.length) {
          [...new Set(allAmountStatusArr)].forEach((v) => message.error(v));
          throw new Error();
          return;
        }

        const data = {
          ...formState.value,
          list,
          transferType: isWithdraw.value ? -1 : 1,
          warehouseId: warehouseId.value,
          picList: checkPicList.value.join(','),
        };
        const result = await transferFn(data);
        message.success('提交成功');

        btnLoading.value = false;
        window.go('/sendoutgoodsManage/retail');
      })
      .catch((error) => {
        btnLoading.value = false;
        // message.error(error.message || '请填写内容');
      });
  };

  onMounted(async () => {
    productOptions.value = await getProductOptions();
    locationList.value = await getLocationList({ warehouseId: warehouseId.value });
    if (locationList.value.length === 0) {
      message.error('当前仓库暂无库位');
      return;
    }
    if (route.query.dataList) {
      //撤回发货
      isDetails.value = 1;
      isWithdraw.value = true;
      queryDataList = JSON.parse(route.query.dataList);
      const goodsIdList = queryDataList.map((v) => v.objectId);
      let shippingRecords = await getShippingRecords({ goodsIdList });
      await mapRecordsTableFn(shippingRecords);
    } else {
      //正常待发列表
      isDetails.value = 1;
      await reqMapTableFn(warehouseId.value);
    }
  });
</script>
<style lang="less" scoped>
  .add_batch_name {
    border-color: #d9d9d9 !important;
    &:hover {
      border-color: #0079ff !important;
    }
  }
  :deep(.ant-picker-disabled) {
    input {
      color: #000 !important;
    }
  }
  .header_btn {
    // height: 100%;
    padding: 16px;
    margin: 16px;
    margin-bottom: 0;
    background-color: #fff;
  }
</style>
