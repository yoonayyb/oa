<template>
  <div>
    <!-- form校验table -->
    <a-form class="disabled_form" ref="formRef" :model="formState" :label-col="labelCol">
      <BasicTable class="form_table" @register="registerTable">
        <template #toolbar>
          <a-button v-loading="btnLoading" type="primary" @click="submit()">返回上一页</a-button>
        </template>
        <template #bodyCell="{ index, column, record }">
          <!-- <template v-if="column.key === 'packageSpecs'"> {{ getSpecsStr(record, 'package') }} </template>
          <template v-if="column.key === 'boxingSpecs'">{{ getSpecsStr(record, 'boxing') }} </template>
          <template v-if="column.key === 'packingSpecs'">{{ getSpecsStr(record, 'packing') }} </template> -->
          <template v-if="column.key === 'shelfLife'">{{ getShelfLife(record) }} </template>
          <template v-if="column.key === 'inoutType'">{{ getInoutType(record) }} </template>

          <template v-if="column.key === 'Aupload'">
            <a-button type="primary" @click="auploadOpen(record)">查看记录图片</a-button>
          </template>
          <template v-if="column.key === 'remark'">
            <a-button @click="openFn(index, record)">备注</a-button>
          </template>
        </template>
      </BasicTable>
    </a-form>

    <a-modal v-model:open="auploadOpenStatus" title="查看记录图片">
      <a-image style="padding: 8px" :width="140" v-for="v in picList" :src="v" />
    </a-modal>
    <uploadChecklist :picList="outerPicList" />
    <a-modal v-model:open="open" title="添加/修改备注" @ok="open = false">
      <a-textarea style="width: 100%" v-model:value="recordRow.remark" :rows="4" placeholder="请输入" />
    </a-modal>
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
  import uploadChecklist from './uploadChecklist.vue';
  import { userSchemaFn } from './config';
  import { getSpecsStr } from '@/utils/business/index';
  import { uniqBy } from 'lodash-es';
  import { isNumber } from '/@/utils/is';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  let { inventoryStatusOption, whereaboutsOption } = useConfigStore();
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
  const initFormState = () => ({
    list: [],
    inventoryType: 10,
    company_id: localStorage.getItem('companyId'),
  });

  let formState = ref(initFormState());
  const getShelfLife = computed(() => (record) => {
    if (record?.produceDate && record?.expirationDate) {
      return daysDiff(record?.produceDate, record?.expirationDate) + '天';
    }
  });

  const getInoutType = computed(() => (record) => {
    console.log('[ whereaboutsOption ]-77', whereaboutsOption);
    return whereaboutsOption.find((v) => v.value === record.whereabouts)?.label;
  });
  //subpagesHeaderSchema,
  const { inboundColumns, outboundColumns, transferStockColumns, getOperationType } = userSchemaFn();
  const title = ref('入库');
  const getInventoryRecord = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/inventoryRecord/page',
      data,
    });
    return result;
  };
  const getInventoryByProLocBra = async (data) => {
    return await window.http.post({
      url: '/erp-ware/inventory/queryInventoryByProLocBra',
      data,
    });
  };
  const getProductOptions = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/product/list',
      data,
    });
    return result;
  };
  const formRef = ref();
  const isOutWarehouse = ref(false);
  const operationTypeVal = ref(10);
  const auploadOpenStatus = ref<boolean>(false);
  const open = ref(false);

  const btnLoading = ref(false);
  const productOptions = ref([]);
  const locationList = ref([]);
  const [registerTable, { getForm, reload, updateTableDataRecord, setLoading, setColumns, getColumns }] = useTable({
    title,
    rowKey: 'id',
    dataSource: formState.value.list,
    columns: inboundColumns,
    // useSearchForm: true,
    pagination: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
  });

  const auploadRef = ref();
  const picList = ref([]);
  const outerPicList = ref([]);
  const auploadOpen = (record) => {
    auploadOpenStatus.value = true;
    console.log('[  record.picList ]-125', record.picList);
    picList.value = record.picList?.split(',') || [];
    // auploadRef.value.open({ reqStatus: true });
  };
  let recordRow = ref({});
  const openFn = (index, record) => {
    recordRow.value.remark = record.remark;
    console.log('[  record.remark ]-131', record.remark);
    console.log('[ recordRow ]-131', recordRow);
    open.value = true;
  };

  const mapWarehouseDetails = async () => {
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

    const filterList = list.filter((v) => v.inoutType === 20);
    setFieldsValue({
      warehouseId: route.query.warehouseId,
    });
    mapList(filterList);
  };
  //改造后端数据
  const mapList = (filterList) => {
    //改造数组
    filterList.forEach(async (v, i) => {
      const productObj = unref(productOptions).find((item) => v.productId === item.id);
      const params = {
        ...v,
        ...productObj,
        boxingSpecsStr: getSpecsStr(productObj, 'boxing'),
        packingSpecsStr: getSpecsStr(productObj, 'packing'),
        packageSpecsStr: getSpecsStr(productObj, 'package'),
        amount: Math.abs(v.amount), //负数转成正数显示
        remainAmount: v.remainAmount,
        remark: v.remark,
        inventoryStatusStr: inventoryStatusOption.find((item) => {
          return item.value === v.inventoryStatus;
        })?.label,
      };
      formState.value.list[i] = {
        ...params,
      };
      //用改造后的数组 计算合并规则
      setRowSpan(formState.value.list, formState.value.list[i]);
    });
  };
  const submit = () => {
    window.go('/InventoryManage/inventoryRecords');
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
        item.bracketNoIn === record.bracketNoIn &&
        item.locationIdIn === record.locationIdIn &&
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
  const buildSelectObj = (record, nameArr) => {
    return {
      [nameArr[0]]: record[nameArr[0]],
      [nameArr[1]]: record[nameArr[1]],
      label: record[nameArr[0]],
      value: record[nameArr[1]],
    };
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
    } catch (error) {
      console.log('[ error ]-649', error);
    }
  };
  const transformRecord = async (outRecord, inRecord) => {
    // 获取相关数据
    // const queryFindVal = queryDataList.find((v) => v.objectId === outRecord.objectId);
    const productObj = productOptions.value.find((item) => item.id === outRecord.productId);
    // 构建新对象
    const newRow = {
      ...inRecord,
      // ...queryFindVal,
      isWithdraw: true,
      boxingSpecsStr: getSpecsStr(productObj, 'boxing'),
      packingSpecsStr: getSpecsStr(productObj, 'packing'),
      packageSpecsStr: getSpecsStr(productObj, 'package'),
      locationIdOutObj: outRecord.locationName,
      bracketIdOutObj: outRecord.bracketNo,
      locationIdInObj: inRecord.locationName,
      bracketIdInObj: inRecord.bracketNo,
      batchNumberObj: inRecord.batchNumber,
      // locationIdOutObj: buildSelectObj(inRecord, ['locationName', 'locationId']),
      // bracketIdOutObj: buildSelectObj(inRecord, ['bracketNo', 'bracketId']),
      // locationIdInObj: buildSelectObj(outRecord, ['locationName', 'locationId']),
      // bracketIdInObj: buildSelectObj(outRecord, ['bracketNo', 'bracketId']),
      // batchNumberObj: {
      //   batchNumber: inRecord.batchNumber,
      //   manuBatchNumber: inRecord.manuBatchNumber,
      //   label: inRecord.batchNumber,
      //   value: inRecord.batchNumber,
      // },
      bracketIdIn: outRecord.bracketId,
      bracketIdOut: inRecord.bracketId,
      bracketNoIn: outRecord.bracketNo,
      bracketNoOut: inRecord.bracketNo,
      locationIdIn: outRecord.locationId,
      locationIdOut: inRecord.locationId,
      locationNameIn: outRecord.locationName,
      locationNameOut: inRecord.locationName,
      stockUnit: productObj.boxingUnit,
      specs: productObj.boxingQuantity,
      productNo: productObj.productNo,
      num: inRecord.amount,
      //  inRecord.picList?.split(',') ||
      // picList: [],
      inventoryStatusStr: inventoryStatusOption.find((item) => {
        return item.value === outRecord.inventoryStatus;
      })?.label,
    };
    newRow.sourceBeforeStock = outRecord.beforeAmount;
    newRow.sourceAfterStock = outRecord.remainAmount;
    // newRow.amount = currentInventory.remainAmount >= inRecord.amount ? inRecord.amount : 0;
    newRow.destinationBeforeStock = inRecord.beforeAmount;
    newRow.destinationAfterStock = inRecord.remainAmount;

    return newRow;
  };
  /*
   * 查看移库时 改造table数据方法
   * 需要将后端返回的 出入库（两条数据）结合成一条数据
   */
  const mapRecordsTableFn = async (records) => {
    console.log('[ mapRecordsTableFn ]-290');
    const mergedArr = [];

    for (let index = 0; index < records.length; index += 2) {
      const outRecord = records[index];
      const inRecord = records[index + 1];
      const newRow = await transformRecord(outRecord, inRecord);
      mergedArr.push(newRow);
    }

    formState.value.list.length = 0;
    mergedArr.forEach((v) => {
      //计算合并规则
      setRowSpan(mergedArr, v);

      formState.value.list.push(v);
      // amountChange(v.amount, v);
    });
  };
  const setRowSpan = (mergedArr, v) => {
    v.rowSpan = 0;
    v.rowSpan2 = 0;
    const { allFindIndex, allListLength, findOutIndex, outListLength, outAllAmount } = getlistLength_IndexFn(mergedArr, v);
    console.log('[ allFindIndex, t ]-331', allFindIndex, allListLength, findOutIndex, outListLength, outAllAmount);
    v.outAllAmount = outAllAmount;
    const findVal = mergedArr[allFindIndex];
    findVal.rowSpan = allListLength;
    const findVal2 = mergedArr[findOutIndex];
    findVal2.rowSpan2 = outListLength;
  };
  const columnsObj = {
    10: inboundColumns,
    20: outboundColumns,
    30: transferStockColumns,
  };
  const titleObj = {
    10: '入库',
    20: '出库',
    30: '移库',
  };

  onMounted(async () => {
    productOptions.value = await getProductOptions();
    const { id, operationType, picList } = route.query;
    outerPicList.value = picList?.split(',') || [];
    title.value = titleObj[operationType];
    if (id && operationType) {
      operationTypeVal.value = operationType;
      getOperationType(operationType);
      const data = await getInventoryRecord({
        operationType,
        operationId: id,
      });
      console.log('[ data ]-363', data);
      // checkPicList
      setColumns(columnsObj[operationType]);
      if (operationType == 30) {
        await mapRecordsTableFn(data.records);
      } else {
        mapList(data.records);
      }
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
</style>
