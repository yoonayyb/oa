<template>
  <div>
    <!-- form校验table -->
    <a-form class="disabled_form" ref="formRef" :model="formState" :label-col="labelCol">
      <BasicTable class="form_table" @register="registerTable" @field-value-change="fieldValueChange">
        <template #toolbar>
          <template v-if="isOutWarehouse">
            <a-radio-group v-model:value="isLogisticsShipment" @change="logisticsShipmentChange">
              <a-radio :value="true">物流发货</a-radio>
              <a-radio :value="false">手动发货</a-radio>
            </a-radio-group>
            <span :class="{ required: isLogisticsShipment }"> 物流公司：</span>
            <a-select
              placeholder="请选择"
              @change="expressState.change"
              show-search
              label-in-value
              :disabled="!isLogisticsShipment"
              style="width: 160px"
              v-model:value="formState.express"
              :fieldNames="{ label: 'key' }"
              @popupScroll="expressState.scroll"
              optionFilterProp="key"
              :filter-option="false"
              :not-found-content="expressState.fetching ? undefined : null"
              @search="expressState.fetchUser($event, { type: 'logistics' })"
              :options="expressState.options"
            >
            </a-select>
            <span :class="{ required: isLogisticsShipment }"> 快递单号：</span>
            <a-input style="width: 160px" :disabled="!isLogisticsShipment" v-model:value="formState.expressNo" placeholder="请输入" />
          </template>
          <a-button v-loading="btnLoading" type="primary" @click="submit()">提交出库 </a-button>
        </template>

        <template #bodyCell="{ index, column, record }">
          <template v-if="column.key === 'productId'">
            <a-form-item :name="['list', index, 'productNameObj']" name="productNameObj" :rules="rules.productNameObj">
              <a-select
                v-model:value="record.productNameObj"
                :field-names="{ label: 'productName', value: 'id' }"
                label-in-value
                :disabled="isOutWarehouse"
                :allowClear="true"
                :show-search="true"
                @change="handleProductChange($event, record, index)"
                style="width: 100%"
                placeholder="请选择"
                :options="productOptions"
              ></a-select>
            </a-form-item>
          </template>

          <template v-if="column.key === 'locationObj' && record.productNameObj && locationList.length">
            <a-form-item :name="['list', index, 'locationObj']" name="locationObj" :rules="rules.locationObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :disabled="isOutWarehouse"
                :options="locationList"
                v-model:value="record.locationObj"
                @change="locationChange($event, record)"
                :field-names="{ label: 'locationName', value: 'id' }"
                optionFilterProp="locationName"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'bracketObj' && record?.locationObj">
            <a-form-item :name="['list', index, 'bracketObj']" name="bracketObj" :rules="rules.bracketObj">
              <a-select
                style="width: 100%"
                showSearch
                :disabled="isOutWarehouse"
                :allowClear="true"
                label-in-value
                :options="record.bracketList"
                v-model:value="record.bracketObj"
                @change="bracketChange($event, record)"
                :field-names="{ label: 'bracketNo', value: 'id' }"
                optionFilterProp="bracketNo"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'batchNumber' && record.productNameObj && record.batchNumberOptions">
            <a-form-item :name="['list', index, 'batchNumberObj']" name="batchNumberObj" :rules="rules.batchNumberObj">
              <a-select
                v-model:value="record.batchNumberObj"
                placeholder="请选择"
                :disabled="isOutWarehouse"
                label-in-value
                :allowClear="true"
                @change="handleBatchNumberChange($event, record)"
                @dropdownVisibleChange="batchNumberInDropdownChange($event, record)"
                :options="record.batchNumberOptions"
                style="width: 100%"
                :field-names="{ label: 'batchNumber', value: 'batchNumber' }"
                :dropdownMatchSelectWidth="false"
              >
              </a-select>
            </a-form-item>
          </template>
          <template v-if="column.key === 'packageSpecs'"> {{ getSpace(record, 'package') }} </template>
          <template v-if="column.key === 'boxingSpecs'">{{ getSpace(record, 'boxing') }} </template>
          <template v-if="column.key === 'packingSpecs'">{{ getSpace(record, 'packing') }} </template>
          <template v-if="column.key === 'produceDate' && record.batchNumberObj">
            <a-form-item :name="['list', index, 'produceDate']" name="produceDate" :rules="rules.produceDate">
              <a-date-picker
                v-model:value="record.produceDate"
                :disabled="Boolean(record.inventoryId) || isOutWarehouse"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'shelfLife' && record.batchNumberObj">{{ getShelfLife(record) }} </template>
          <template v-if="column.key === 'expirationDate' && record.batchNumberObj">
            <a-form-item :name="['list', index, 'expirationDate']" name="expirationDate" :rules="rules.expirationDate">
              <a-date-picker
                :disabled="Boolean(record.inventoryId) || isOutWarehouse"
                v-model:value="record.expirationDate"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
              />
            </a-form-item>
          </template>

          <template v-if="column.key === 'amount' && record.batchNumberObj">
            <a-form-item :name="['list', index, 'amount']" name="amount" :rules="rules.amount">
              <a-input-number
                :disabled="isOutWarehouse"
                @change="amountChange($event, record)"
                style="width: 100%; min-width: 50px"
                v-model:value="record.amount"
                :min="1"
                :max="record.destinationBeforeStock"
                placeholder="请输入"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'whereabouts' && record.productNameObj">
            <a-form-item :name="['list', index, 'whereabouts']" name="whereabouts" :rules="rules.whereabouts">
              <a-select
                style="width: 100%"
                :disabled="isOutWarehouse"
                :options="whereaboutsOption"
                v-model:value="record.whereabouts"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'Aupload' && record.productNameObj">
            <a-button type="primary" @click="auploadOpen(record)">上传</a-button>
          </template>
          <template v-if="column.key === 'remark' && record.productNameObj">
            <a-button @click="openFn(index, record)">备注</a-button>
          </template>

          <template v-if="column.key === 'action' && !isOutWarehouse">
            <TableAction
              :actions="[
                {
                  icon: 'gala:add',
                  onClick: addData.bind(null, record),
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
    <uploadChecklist :picList="checkPicList" @onOk="onOk" />
    <Aupload ref="auploadRef" :defaultImageList="picList" :catgory="'inventory'" :hideBtn="true" :hideImageList="true" :limitNum="5" />
    <a-modal v-model:open="open" title="添加/修改备注" @ok="open = false">
      <a-textarea style="width: 100%" v-model:value="recordRow.remark" :rows="4" placeholder="请输入" />
    </a-modal>
    <Edit @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { Aupload } from '/@/components/Aupload';
  import { useConfigStore } from '@/store/modules/config';
  import { formatToDate, daysDiff } from '/@/utils/dateUtil';
  import { message } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Edit from './Edit.vue';
  import uploadChecklist from './uploadChecklist.vue';
  import { userSchemaFn } from './config';
  import { getSpecsStr } from '@/utils/business/index';
  import { uniqBy } from 'lodash-es';
  import { popupScrollSelect } from '@/views/order/customsList/index.js';
  import { isNumber } from '/@/utils/is';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  let { whereaboutsOption } = useConfigStore();
  const VNodes = defineComponent({
    props: {
      vnodes: {
        type: Object,
        required: true,
      },
    },
    render() {
      return this.vnodes;
    },
  });
  const labelCol = { style: { width: '150px' } };
  const rules = {
    productNameObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    manuBatchNumberObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    produceDate: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    expirationDate: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    batchNumberObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    locationObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    bracketObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    amount: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
    whereabouts: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
  };

  const initFormState = () => ({
    list: [],
    inventoryType: 10,
    company_id: localStorage.getItem('companyId'),
  });

  let formState = ref(initFormState());

  const getSpace = computed(() => (record, Specs) => {
    if (record?.productNameObj?.option) {
      return getSpecsStr(record.productNameObj.option, Specs);
    }
  });

  const getShelfLife = computed(() => (record, Specs) => {
    if (record?.produceDate && record?.expirationDate) {
      return daysDiff(record?.produceDate, record?.expirationDate) + '天';
    }
  });

  let { outboundHeaderSchema, outboundColumns } = userSchemaFn();
  const getProductOptions = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/product/list',
      data,
    });
    return result;
  };
  const getlLocationProductOptions = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/inventory/queryOutboundProductList',
      data,
    });
    return result;
  };
  const getBatchNumberOptions = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/inventory/batchNumberListByProductId',
      data,
    });
    return result;
  };
  const getBatchNumberList = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/inventory/queryBatchNumberListByLocation',
      data,
    });
    let allBatchOptions = [];
    Object.keys(result).forEach((key) => {
      result[key].forEach((v) => {
        allBatchOptions.push(v);
      });
    });
    return allBatchOptions;
  };
  const getLocationList = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/locationManage/list',
      data,
    });
    return result;
  };
  const getBracketList = async (data) => {
    return await window.http.post({
      // url: '/erp-ware/bracketManage/list',
      url: '/erp-ware/bracketManage/bracketInventoryStatusList',
      data,
    });
  };
  const putOutBatchFn = async (data) => {
    return await window.http.post({
      url: '/erp-ware/inventoryRecord/putOutBatch',
      data,
    });
  };
  const updateExpress = async (data) => {
    return await window.http.post({
      url: '/erp-ware/transferRecords/updateExpress',
      data,
    });
  };
  const getTransferRecordsFn = async (data) => {
    // return await window.http.get({
    //   url: '/erp-ware/transferRecords/' + id,
    // });
    return await window.http.post({
      url: '/erp-ware/transferRecords/list',
      params: data,
    });
  };

  const expressState = ref({});
  const formRef = ref();
  const open = ref(false);
  const isOutWarehouse = ref(false);
  const isLogisticsShipment = ref(true); //是否物流发货
  const btnLoading = ref(false);
  const manuBatchNumberInputRef = ref();
  const batchNumberInputRef = ref();
  const addBatchName = ref();
  const productOptions = ref([]);
  const locationList = ref([]);
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { getForm, reload, updateTableDataRecord, setLoading, setColumns, getColumns }] = useTable({
    title: '出库',
    rowKey: 'id',
    dataSource: formState.value.list,
    columns: outboundColumns,
    formConfig: {
      labelWidth: 100,
      schemas: outboundHeaderSchema,
      showSubmitButton: false, //隐藏查询按钮
      showResetButton: false, //隐藏重置按钮
    },
    useSearchForm: true,
    pagination: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },
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
  async function handleDelete(record, index) {
    formState.value.list.splice(index, 1);
    if (formState.value.list.length === 0) {
      addData();
    }
  }

  function handleSuccess({ isUpdate, values }) {
    reload();
  }
  const addData = () => {
    formState.value.list.push({});
  };
  const logisticsShipmentChange = (val) => {
    if (!isLogisticsShipment.value) {
      formState.value.express = null;
      formState.value.expressNo = '';
    }
  };

  const handleProductChange = async (item, record, index, outWarehouseObj = {}) => {
    let row = {
      productNameObj: item,
    };

    if (item?.value && item.option) {
      // const data = await getBatchNumberList({ productId: item.value, locationId: formState.value.locationId });
      const data = await getBatchNumberOptions({ productId: item.value });
      //根据托架id过滤出所有有库存但是不同的托架
      // const bracketList = uniqBy(data, 'bracketId');
      row = {
        productNameObj: item,
        allBatchNumberOptions: data,
        // bracketList,
        locationList: unref(locationList),
        productId: item.option.id,
        productName: item.option.productName,
        productNo: item.option.productNo,
        price: item.option.price,
        dosageUnit: item.option.dosageUnit,
        stockUnit: item.option.boxingUnit,
        picList: [],
        packageSpecsStr: getSpecsStr(item.option, 'package'),
      };

      //出仓时
      if (unref(isOutWarehouse)) {
        // const findLocation = unref(locationList).find((v) => v.id === outWarehouseObj.locationId);
        // locationChange({ option: { ...findLocation }, value: findLocation?.id, label: findLocation?.locationName }, row);
        const findBatchNumber = data.find((v) => v.id === outWarehouseObj.inventoryId);
        handleBatchNumberChange(
          {
            option: { ...findBatchNumber },
            value: findBatchNumber?.batchNumber,
            label: findBatchNumber?.batchNumber,
          },
          row,
          outWarehouseObj.amount,
        );
      }
    }

    formState.value.list[index] = {
      ...outWarehouseObj,
      ...row,
    };
  };
  const clearCommonPropsList = [
    'expirationDate',
    'produceDate',
    'whereabouts',
    'batchNumber',
    'inventoryId',
    'destinationBeforeStock',
    'destinationAfterStock',
  ];
  const locationChange = async (e, record) => {
    console.log('[ locationChange ]-448', e, record);
    clearCommonPropsFn(record, [...clearCommonPropsList, 'batchNumberOptions', 'batchNumberObj', 'bracketObj', 'bracketId']);
    if (e?.option) {
      record.locationName = e.option.locationName;
      record.locationId = e.option.id;
      record.bracketList = await getBracketList({
        locationId: e.option.id,
        status: 0,
      });
      console.log('[ record.bracketList ]-458', record.bracketList);
      if (record.bracketList.length === 0) {
        message.error('当前库位暂无托架');
      }
    }
  };

  const bracketChange = async (item, record) => {
    clearCommonPropsFn(record, [...clearCommonPropsList, 'batchNumberOptions', 'batchNumberObj']);
    if (item?.value && item.option) {
      let { id, bracketNo, inventoryStatus, remainAmount } = item.option;
      record.bracketId = id;
      record.bracketNo = bracketNo;
      record.batchNumberOptions = record.allBatchNumberOptions.filter((v) => v.bracketId === id && v.remainAmount > 0);
      if (record.batchNumberOptions.length === 0) {
        message.error('当前托架暂无有库存批次号，无法进行出库');
      }
    }
  };
  // const bracketDropdownChange = async (status, record) => {
  //   if (!status) return;

  //   record.bracketList = record.bracketList.map((v) => {
  //     return {
  //       ...v,
  //       disabled: formState.value.list.some((res) => {
  //         //禁用表格中已选的 同产品 同批次 同库位 同托架的
  //         return (
  //           res.bracketId === v.id &&
  //           res.productId === record.productId &&
  //           res.batchNumber === record.batchNumber &&
  //           res.locationId === record.locationId
  //         );
  //       }),
  //     };
  //   });
  // };

  const batchNumberInDropdownChange = async (status, record) => {
    if (!status) return;
    console.log('[  record.batchNumberOptions ]-497', record.batchNumberOptions);
    record.batchNumberOptions = record.batchNumberOptions.map((v) => {
      return {
        ...v,
        disabled: formState.value.list.some(
          //禁用选择整个表格中同个商品的同个库位同个托架同个批次号的
          (res) => {
            return (
              res.productId === record.productId &&
              res.batchNumber === v.batchNumber &&
              res.locationId === v.locationId &&
              record.bracketId === v.bracketId
            );
          },
        ),
      };
    });
  };
  // outWarehouseAmount是在出仓时才会有的
  const handleBatchNumberChange = async (item, record, outWarehouseAmount) => {
    console.log('[ handleBatchNumberChange ]-518');
    clearCommonPropsFn(record, [...clearCommonPropsList]);

    if (item?.value && item?.option?.id) {
      const { option } = item;
      record.inventoryId = option.id;
      const commonProps = ['expirationDate', 'produceDate', 'batchNumber', 'remainAmount'];
      commonProps.forEach((prop) => {
        record[prop] = option[prop];
      });

      record.destinationBeforeStock = option.remainAmount || 0;
      if (unref(isOutWarehouse)) {
        amountChange(outWarehouseAmount, record);
      } else {
        record.amount = 0;
        record.destinationAfterStock = '';
      }
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
  const assignRecord = (record, propName, sourceObj, propNames) => {
    record[propName] = {
      option: { ...sourceObj },
      value: sourceObj[propNames[0]],
      label: sourceObj[propNames[1]],
    };
  };
  const clearPropsList = [
    'bracketList',
    'bracketObj',
    'batchNumberObj',
    'batchNumberOptions',
    'productNameObj',
    'allBatchNumberOptions',
    'destinationBeforeStock',
    'destinationAfterStock',
  ];

  const amountChange = (val, record) => {
    console.log('[ record ]-457', val, record.destinationBeforeStock);
    if (val && Number(val)) {
      record.destinationAfterStock = record.destinationBeforeStock - val;
    } else {
      record.destinationAfterStock = '';
    }
  };
  const fieldValueChange = async (key, val) => {
    const { updateSchema } = getForm();

    formState.value.list.length = 0;
    productOptions.value = await getProductOptions();
    if (key === 'warehouseId') {
      formState.value.warehouseId = val;
      locationList.value = await getLocationList({ warehouseId: val });
      if (locationList.value.length === 0) {
        message.error('当前仓库暂无库位，无法出库');
      } else {
        updateSchema({ field: 'locationId', componentProps: { options: locationList.value } });
      }

      unref(isOutWarehouse) ? '' : formState.value.list.push({});
    }
    // if (key === 'locationId') {
    //   formState.value.locationId = val;
    //   formState.value.locationName = locationList.value.find((v) => v.id === val)?.locationName;
    //   unref(isOutWarehouse) ? '' : formState.value.list.push({});

    //   let arr = await getlLocationProductOptions({
    //     locationId: val,
    //   });

    //   productOptions.value = arr
    //     .map((v) => ({
    //       ...v, //禁用库存小于1的
    //       disabled: v.remainAmount < 1,
    //     })) //排序 让有库存的排前面
    //     .sort((a, b) => b.remainAmount - a.remainAmount);
    // }
  };
  const mapWarehouseDetails = async () => {
    await fieldValueChange('warehouseId', route.query.warehouseId);
    const { setFieldsValue, updateSchema } = getForm();
    updateSchema([
      {
        field: 'warehouseId',
        componentProps: {
          disabled: true,
        },
      },
    ]);

    const list = await getTransferRecordsFn({
      formId: route.query.formId,
      status: 2,
    });
    setFieldsValue({
      warehouseId: route.query.warehouseId,
    });
    //10入库；20出库   这里过滤入库的数据 进行改造
    const filterList = list.filter((v) => v.inoutType === 10);
    console.log('[ filterList ]-537', filterList);

    mapList(filterList);
  };
  //改造后端数据
  const mapList = (filterList) => {
    console.log('[ filterList ]-545', filterList);
    filterList.forEach(async (v, i) => {
      const productObj = unref(productOptions).find((item) => v.productId === item.id);
      const params = {
        ...v,
      };
      const sourceObj = { ...productObj };
      assignRecord(params, 'productNameObj', sourceObj, ['id', 'productName']);
      const locationObj = { locationId: v.locationId, locationName: v.locationName };
      const bracketObj = { bracketId: v.bracketId, bracketNo: v.bracketNo };
      const batchNumberObj = { batchNumber: v.batchNumber, bracketNo: v.bracketNo };
      assignRecord(v, 'locationObj', locationObj, ['locationId', 'locationName']);
      assignRecord(v, 'bracketObj', bracketObj, ['bracketId', 'bracketNo']);
      assignRecord(v, 'batchNumberObj', batchNumberObj, ['batchNumber', 'batchNumber']);
      v.batchNumberOptions = [];
      v.whereabouts = 20;
      //计算合并规则
      await setRowSpan(filterList, v);

      await handleProductChange(params.productNameObj, params, i, v);
      console.log('[  ]-653', formState.value.list);
    });
  };
  const setRowSpan = (mergedArr, v) => {
    v.rowSpan = 0;
    v.rowSpan2 = 0;
    const { allFindIndex, allListLength, findOutIndex, outListLength, outAllAmount } = getlistLength_IndexFn(mergedArr, v);
    v.outAllAmount = outAllAmount;
    const findVal = mergedArr[allFindIndex];
    findVal.rowSpan = allListLength;
    const findVal2 = mergedArr[findOutIndex];
    findVal2.rowSpan2 = outListLength;
  };
  const getlistLength_IndexFn = (list, record) => {
    console.log('[ list ]-192', list);
    // 记录同一个的产品数量
    let allAmount = 0;
    //移出库位 移出托架号 移出批次号都相同的产品数量
    let outAllAmount = 0;
    // allFindIndex是产品的合并index
    // allListLength是产品的合并Length
    let allFindIndex = null;
    let allListLength = 0;
    // findOutIndex是移出库位的合并index
    // outListLength是移出库位的合并Length
    let findOutIndex = null;
    let outListLength = 0;
    list.forEach((item, i) => {
      if (item.productId === record.productId) {
        allListLength++;
        allAmount = isNumber(item.amount) ? allAmount + item.amount : allAmount + 0;
        //找到相同的第一条 并记录index
        allFindIndex === null ? (allFindIndex = i) : '';
      }
      //记录选择了移出库位 移出托架号 移出批次号都相同的
      if (
        item.productId === record.productId &&
        item.bracketId === record.bracketId &&
        item.locationId === record.locationId &&
        item.batchNumber === record.batchNumber
      ) {
        //找到相同的第一条 并记录index
        findOutIndex === null ? (findOutIndex = i) : '';
        if (record.locationIdOut) {
          outAllAmount = isNumber(item.amount) ? outAllAmount + item.amount : outAllAmount + 0;
          // record.locationIdOut 和 item.locationIdOut 可能同时都不存在的情况 所以只有record.locationIdOut为真才增加length
          outListLength++;
        }
      }
    });
    return { allFindIndex, allListLength, findOutIndex, outListLength, allAmount, outAllAmount };
  };
  const submit = () => {
    try {
      if (!formState.value.warehouseId) {
        message.error('请选择仓库');
        return;
      }

      // 自送传4，物流发货传3
      let isOutWarehouseTransferType = 4;
      if (unref(isOutWarehouse) && unref(isLogisticsShipment)) {
        isOutWarehouseTransferType = 3;
        console.log('[ formState.value.express ]-573', formState.value.express);
        if (!formState.value.expressNo || !formState.value.express) {
          message.error('请选择物流公司和快递单号');
          return;
        }
      }

      btnLoading.value = true;

      formRef.value
        .validate()
        .then(async (values) => {
          const list = formState.value.list.map((item) => {
            let params = {
              ...item,
              purchasePrice: item.price,
              picList: item.picList.join(','),
            };
            clearCommonPropsFn(params, clearPropsList);
            return params;
          });
          const data = {
            ...formState.value,
            list,
            picList: checkPicList.value.join(','),
            transferType: unref(isOutWarehouse) ? isOutWarehouseTransferType : 0,
            objectId: unref(isOutWarehouse) ? route.query.formId : '',
          };

          console.log('[ data ]-585', data);
          const result = await putOutBatchFn(data);

          if (isOutWarehouseTransferType === 3) {
            console.log('[ formState.value.express ]-607', formState.value.express);
            const expressParams = {
              expressCode: formState.value.express?.value,
              expressName: formState.value.express?.label,
              expressNo: formState.value.expressNo,
              id: route.query.id,
              formId: route.query.formId,
            };
            const updateExpressResult = await updateExpress(expressParams);
          }
          message.success('提交成功');
          btnLoading.value = false;

          if (unref(isOutWarehouse)) {
            window.go('/InventoryManage/transferWarehouseList');
          } else {
            window.go('/InventoryManage/inventoryList');
          }
        })
        .catch((error) => {
          message.error(error.message || '请填写内容');
        });
    } catch (error) {
      console.log('[ error ]-599', error);
    } finally {
      btnLoading.value = false;
    }
  };
  const getWuliuOptions = async (key = {}) => {
    const [state] = popupScrollSelect('/basic_center/dictionary_api/select', { type: 'logistics', ...key });
    await state.requireApi();
    expressState.value = state;

    return { state };
  };
  onMounted(async () => {
    //有formId代表是转仓的  需要改造表格数据进行复现
    if (route.query.formId) {
      isOutWarehouse.value = true;
      await mapWarehouseDetails();
      await getWuliuOptions();
      const outboundColumns2 = getColumns().map((v) => {
        return {
          ...v,
          defaultHidden: v.key === 'action' ? true : false,
        };
      });
      setColumns(outboundColumns2);
    }
    // productOptions.value = await getProductOptions();
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
</style>
