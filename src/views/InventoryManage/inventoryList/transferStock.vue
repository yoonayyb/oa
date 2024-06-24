<template>
  <div>
    <!-- form验table -->
    <a-form class="disabled_form" ref="formRef" :model="formState" :label-col="labelCol">
      <BasicTable class="form_table" @register="registerTable" @field-value-change="fieldValueChange">
        <template #toolbar>
          <a-button v-loading="btnLoading" type="primary" @click="submit()">提交移库</a-button>
        </template>
        <template #bodyCell="{ index, column, record }">
          <template v-if="column.key === 'productId'">
            <a-form-item :name="['list', index, 'productNameObj']" name="productNameObj" :rules="rules.productNameObj">
              <a-select
                v-model:value="record.productNameObj"
                :disabled="isPicking || isExamine"
                :field-names="{ label: 'productName', value: 'id' }"
                label-in-value
                :allowClear="true"
                :show-search="true"
                @change="handleProductChange($event, record, index)"
                @dropdownVisibleChange="productDropdownChange($event, record)"
                style="width: 100%"
                placeholder="请选择"
                :options="productOptions"
              ></a-select>
            </a-form-item>
          </template>

          <template v-if="column.key === 'packageSpecs'"> {{ getSpace(record, 'package') }} </template>
          <template v-if="column.key === 'boxingSpecs'">{{ getSpace(record, 'boxing') }} </template>
          <template v-if="column.key === 'packingSpecs'">{{ getSpace(record, 'packing') }} </template>

          <template v-if="column.key === 'locationIdOutObj' && record.locationOutList?.length">
            <a-form-item :name="['list', index, 'locationIdOutObj']" name="locationIdOutObj" :rules="rules.locationIdOutObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :disabled="isExamine"
                :options="record.locationOutList"
                v-model:value="record.locationIdOutObj"
                @change="locationOutChange($event, record)"
                :field-names="{ label: 'locationName', value: 'id' }"
                optionFilterProp="locationName"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'bracketIdOutObj' && record.locationIdOutObj && record.bracketOutList?.length">
            <a-form-item :name="['list', index, 'bracketIdOutObj']" name="bracketIdOutObj" :rules="rules.bracketIdOutObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :disabled="isExamine"
                :options="record.bracketOutList"
                v-model:value="record.bracketIdOutObj"
                @change="bracketOutChange($event, record)"
                :field-names="{ label: 'bracketNo', value: 'id' }"
                optionFilterProp="bracketNo"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'batchNumberObj' && record.bracketIdOutObj && record.batchNumberOutList?.length">
            <a-form-item :name="['list', index, 'batchNumberObj']" name="batchNumberObj" :rules="rules.batchNumberObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :disabled="isExamine"
                :options="record.batchNumberOutList"
                v-model:value="record.batchNumberObj"
                @change="batchNumberOutChange($event, record)"
                @dropdownVisibleChange="batchNumberOutDropdownChange($event, record)"
                :field-names="{ label: 'batchNumber', value: 'id' }"
                optionFilterProp="batchNumber"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'allAmount' && record.sourceBeforeStock > 0"> {{ getAmount(record, index) }} </template>
          <template v-if="column.key === 'locationIdInObj' && record.sourceBeforeStock > 0 && locationList?.length">
            <a-form-item :name="['list', index, 'locationIdInObj']" name="locationIdInObj" :rules="rules.locationIdInObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :options="record.locationInList"
                v-model:value="record.locationIdInObj"
                @change="locationIdInChange($event, record)"
                @dropdownVisibleChange="locationIdInDropdownChange($event, record)"
                :field-names="{ label: 'locationName', value: 'id' }"
                optionFilterProp="locationName"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'bracketIdInObj' && record.locationIdInObj && record.bracketInList?.length">
            <a-form-item :name="['list', index, 'bracketIdInObj']" name="bracketIdInObj" :rules="rules.bracketIdInObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :options="record.bracketInList"
                v-model:value="record.bracketIdInObj"
                @change="bracketIdInChange($event, record)"
                @dropdownVisibleChange="bracketInDropdownChange($event, record)"
                :field-names="{ label: 'bracketNo', value: 'id' }"
                optionFilterProp="bracketNo"
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
                :max="record.sourceBeforeStock"
                placeholder="请输入"
                @change="amountInChange($event, record)"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'inventoryStatus'">
            <a-form-item
              v-if="record.bracketIdInObj"
              :name="['list', index, 'inventoryStatus']"
              name="inventoryStatus"
              :rules="rules.inventoryStatus"
            >
              <a-select
                style="width: 100%"
                :options="record.inventoryStatusOption"
                v-model:value="record.inventoryStatus"
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

          <template v-if="column.key === 'action'">
            <a-row>
              <!-- v-if="!isPicking" -->
              <a-col v-if="!isPicking && !isExamine" span="24">
                <a-button @click="handleAddRow(record, index)" type="link">添加新产品</a-button>
              </a-col>
              <a-col span="24" v-if="!isExamine">
                <a-button :disabled="!(record.productId && record.locationIdOut)" @click="addData(record, index, 'out')" type="link"
                  >新增移出库位</a-button
                >
              </a-col>
              <a-col span="24">
                <a-button
                  :disabled="!(record.productId && record.locationIdOut && record.bracketIdOut && record.batchNumber)"
                  @click="addData(record, index, 'in')"
                  type="link"
                  >新增移入库位</a-button
                >
              </a-col>
              <a-col span="12">
                <a-button @click="handleDelete(record, index)" danger type="link">删除</a-button>
              </a-col>
            </a-row>
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
  import { isNumber } from '/@/utils/is';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  let { inventoryStatusOption } = useConfigStore();
  const labelCol = { style: { width: '150px' } };
  const rules = {
    productNameObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    batchNumberObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    locationIdOutObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    bracketIdOutObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    locationIdInObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    bracketIdInObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    amount: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
    inventoryStatus: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
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

  let { subpagesHeaderSchema, transferStockColumns } = userSchemaFn();

  const getProductOptions = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/product/list',
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
  const getLocationList = async (data) => {
    let result = await window.http.post({
      url: '/erp-ware/locationManage/list',
      data,
    });
    return result;
  };
  const getBracketList = async (data) => {
    return await window.http.post({
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
  const getTransferRecordsFn = async (data) => {
    return await window.http.post({
      url: '/erp-ware/transferRecords/list',
      params: data,
    });
  };

  const formRef = ref();
  const open = ref(false);
  //拣货
  const isPicking = ref(false);
  //检查
  const isExamine = ref(false);
  const btnLoading = ref(false);
  const batchNumberInputRef = ref();
  const addBatchName = ref();
  const productOptions = ref([]);
  const locationList = ref([]);
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { getForm, reload, updateTableDataRecord, setLoading, setColumns }] = useTable({
    title: '移库',
    rowKey: 'id',
    dataSource: formState.value.list,
    columns: transferStockColumns,
    formConfig: {
      labelWidth: 100,
      schemas: subpagesHeaderSchema,
      showSubmitButton: false, //隐藏查询按钮
      showResetButton: false, //隐藏重置按钮
    },
    useSearchForm: true,
    pagination: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    actionColumn: {
      width: 110,
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
  /*
   * 该方法 返回两个合并规则 以及两个数量
   * 1.allFindIndex和allListLength 是根据产品来合并的规则
   * 2.findOutIndex和outListLength 是根据移出库位 移出托架号 移出批次号的合并的规则
   */
  const getlistLength_IndexFn = (list, record) => {
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
        item.locationIdOut === record.locationIdOut &&
        item.bracketIdOut === record.bracketIdOut &&
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

    console.log('[  ]-371', allAmount);
    return { allFindIndex, allListLength, findOutIndex, outListLength, allAmount, outAllAmount };
  };
  const addData = (record, index, type) => {
    const { allFindIndex, allListLength, findOutIndex, outListLength } = getlistLength_IndexFn(formState.value.list, record);

    // 检查时需要找到 相同的产品 库位 托架 批次号 的第一行  因为会有多个产品但不同批次号的情况
    // 正常移库和拣货只需要找到相同的产品第一行  因为只会有一个相同的产品
    const targetIndex = unref(isExamine) ? findOutIndex : allFindIndex;
    //outListLength +1是相同的产品 库位 托架 批次号 的总长度
    //allListLength +1就是所有相同的产品总长度
    const targetLength = unref(isExamine) ? outListLength : allListLength;

    const findVal = formState.value.list[targetIndex];
    findVal.rowSpan = targetLength + 1;
    // 找到相同 产品 移出库位 移出托架号 移出批次号的第一行
    const findVal2 = formState.value.list[findOutIndex];
    const newItem = {
      ...record,
      rowSpan: 0,
      // rowSpan2: 0,
    };
    const clearCommonArr = [
      'locationIdInObj',
      'inventoryStatus',
      'allAmount',
      'bracketIdInObj',
      'destinationBeforeStock',
      'amount',
      'destinationAfterStock',
    ];
    if (type === 'out') {
      clearCommonArr.push(
        'locationIdOut',
        'bracketIdOut',
        'locationIdOutObj',
        'bracketIdOutObj',
        'batchNumber',
        'rowSpan2',
        'sourceBeforeStock',
        'sourceAfterStock',
      );

      // allFindIndex + allListLength就是在当前产品最下一行添加 防止rowSpan rowSpan2乱
      formState.value.list.splice(allFindIndex + allListLength, 0, newItem);
    } else {
      findVal2.rowSpan2 = outListLength + 1;
      newItem.rowSpan2 = 0;
      //findOutIndex + outListLength就是在相同的移出库位...的 最下一行添加 防止rowSpan rowSpan2乱
      formState.value.list.splice(findOutIndex + outListLength, 0, newItem);
    }

    clearCommonPropsFn(newItem, clearCommonArr);
  };
  function handleDelete(record, index) {
    const { allFindIndex, allListLength, findOutIndex, outListLength } = getlistLength_IndexFn(formState.value.list, record);
    // allFindIndex 是所有当前产品的index
    // findOutIndex 是所有同批次的当前产品的index
    if (allListLength > 1) {
      //如果是 检查 则合并所有同批次的当前产品
      //其他情况需要合并所有的同产品
      const targetIndex = unref(isExamine) ? findOutIndex : allFindIndex;
      const targetLength = unref(isExamine) ? outListLength : allListLength;
      handleRowSpan(targetIndex + (targetIndex === index ? 1 : 0), 'rowSpan', targetLength);
      handleRowSpan(findOutIndex + (findOutIndex === index ? 1 : 0), 'rowSpan2', outListLength);
      deleteRecord(index);
    }
  }
  const handleRowSpan = (targetIndex, targetKey, targetLength) => {
    if (targetLength > 1) {
      const targetVal = formState.value.list[targetIndex];
      targetVal[targetKey] = targetLength - 1;
    }
  };
  const deleteRecord = (index) => {
    formState.value.list.splice(index, 1);
    if (formState.value.list.length === 0 && !unref(isPicking) && !unref(isExamine)) {
      handleAddRow();
    }
  };

  function handleAddRow(record, index) {
    formState.value.list.push({});
  }

  function handleSuccess({ isUpdate, values }) {
    reload();
  }

  const fieldValueChange = async (key, val) => {
    if (key === 'warehouseId') {
      formState.value.list.length = 0;
      formState.value.warehouseId = val;
      locationList.value = await getLocationList({ warehouseId: val });
      if (locationList.value.length === 0) {
        message.error('当前仓库暂无库位，无法移库');
      } else {
        !unref(isPicking) && !unref(isExamine) && formState.value.list.push({});
      }
    }
  };
  // pickingObj是在拣货或者检查状态才有的
  const handleProductChange = async (item, record, index, pickingObj = {}) => {
    let row = {};
    let locationOutList = [];
    if (item?.value && item.option) {
      const data = await getBatchNumberOptions({ productId: item.value });
      locationOutList = locationList.value.filter((v) => {
        return data.some((val) => val.locationId === v.id);
      });
      const locationInList = locationList.value;
      row = {
        productNameObj: item,
        batchNumberOptions: data,
        productId: item.option.id,
        productName: item.option.productName,
        productNo: item.option.productNo,
        price: item.option.price,
        stockUnit: item.option.boxingUnit,
        dosageUnit: item.option.dosageUnit,
        picList: [],
        packageSpecsStr: getSpecsStr(item.option, 'package'),
        batchNumberList: data,
        locationOutList,
        locationInList,
      };
    }

    //检查状态需要将移出库位 的库位 托架 批次号 进行复现并且禁用
    if (unref(isExamine)) {
      const locationIdOutObj = { locationName: record.locationName, id: record.locationId };
      assignRecord(row, 'locationIdOutObj', locationIdOutObj, ['id', 'locationName']);
      await locationOutChange(row.locationIdOutObj, row);

      const bracketIdOutObj = { bracketNo: record.bracketNo, id: record.bracketId };
      assignRecord(row, 'bracketIdOutObj', bracketIdOutObj, ['id', 'bracketNo']);
      await bracketOutChange(row.bracketIdOutObj, row);

      const batchNumberObj = { batchNumber: record.batchNumber, id: record.inventoryId };
      assignRecord(row, 'batchNumberObj', batchNumberObj, ['id', 'batchNumber']);
      await batchNumberOutChange(row.batchNumberObj, row);
    }

    formState.value.list[index] = {
      ...pickingObj,
      ...row,
    };
    if (locationOutList.length === 0) {
      message.error(`${item?.option?.productName || '当前产品'}无可操作库存，无法进行移库操作`);
    }
  };

  const productDropdownChange = (status, record) => {
    if (!status) return;
    productOptions.value = productOptions.value.map((v) => {
      return {
        ...v,
        disabled: formState.value.list.some((res) => {
          //禁用表格中已选的 同产品 同批次的 同库位 同托架的
          return v.id === res.productId;
        }),
      };
    });
  };
  const locationOutChange = async (e, record) => {
    delete record.bracketIdOutObj;
    if (e?.option) {
      record.locationNameOut = e.option.locationName;
      record.locationIdOut = e.option.id;
      const bracketList = await getBracketList({
        locationId: e.option.id,
        status: 0,
      });

      record.bracketOutList = unref(isExamine)
        ? bracketList
        : bracketList.filter((v) => {
            return record.batchNumberList.some((val) => val.bracketId === v.id);
          });
      if (record.bracketOutList.length === 0) {
        message.error('当前库位下托架库存为0');
        return;
      }
    }
  };
  const clearCommonPropsList = [
    // 'allAmount',
    'batchNumber',
    'batchNumberIdOut',
    'manuBatchNumber',
    'produceDate',
    'expirationDate',
    'inventoryStatus',
    'sourceBeforeStock',
    'sourceAfterStock',
    'locationIdInObj',
    'locationNameIn',
    'locationIdIn',
    'bracketInList',
    'bracketIdInObj',
    'bracketNoIn',
    'bracketIdIn',
    'destinationBeforeStock',
    'amount',
    'destinationAfterStock',
  ];
  const bracketOutChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, [...clearCommonPropsList, 'batchNumberObj']);

    if (item?.value && item.option) {
      record.bracketIdOut = item.option.id;
      record.bracketNoOut = item.option.bracketNo;
      record.batchNumberOutList = record.batchNumberList.filter((v) => v.bracketId === item.option.id);
    }
  };
  const batchNumberOutDropdownChange = (status, record) => {
    if (!status) return;
    record.batchNumberOutList = record.batchNumberOutList.map((v) => {
      return {
        ...v,
        disabled: formState.value.list.some((res) => {
          //禁用表格中已选的 同产品 同批次的 同库位 同托架的
          return (
            res.productId === record.productId &&
            res.batchNumber === v.batchNumber &&
            res.bracketIdOut === v.bracketId &&
            res.locationIdOut === v.locationId
          );
        }),
      };
    });
  };
  const batchNumberOutChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, clearCommonPropsList);

    if (item?.value && item.option) {
      record.batchNumberIdOut = item.option.id;
      record.batchNumber = item.option.batchNumber;
      record.manuBatchNumber = item.option.manuBatchNumber;
      record.produceDate = item.option.produceDate;
      record.expirationDate = item.option.expirationDate;
      // record.inventoryStatus = item.option.inventoryStatus;
      const params = {
        productId: record.productId,
        locationId: record.locationIdOut,
        bracketId: record.bracketIdOut,
        batchNumber: record.batchNumber,
      };
      let currentInventory = await getInventoryByProLocBra(params);
      record.sourceBeforeStock = currentInventory.remainAmount || 0;
      // record.allAmount = 0;
      record.sourceAfterStock = currentInventory.remainAmount || 0;
      if (!record.sourceBeforeStock || record.sourceBeforeStock === 0) {
        message.error('当前批次库存为0');
      }
    }
  };
  const getAmount = (record, index) => {
    const { allAmount, outAllAmount, findOutIndex } = getlistLength_IndexFn(formState.value.list, record);
    let findVal = formState.value.list[findOutIndex];
    record.allAmount = allAmount;
    record.outAllAmount = outAllAmount;
    findVal.allAmount = allAmount;
    findVal.outAllAmount = outAllAmount;
    findVal.sourceAfterStock = findVal.sourceBeforeStock - outAllAmount || findVal.sourceBeforeStock;

    return outAllAmount || 0;
  };
  const amountInChange = (val, record) => {
    const { findOutIndex, allAmount, outAllAmount } = getlistLength_IndexFn(formState.value.list, record);
    let findVal = formState.value.list[findOutIndex];
    if (val && Number(val)) {
      record.destinationAfterStock = record.destinationBeforeStock + val;
      let num, errorStr, allAmountStatus;
      if (unref(isPicking) || unref(isExamine)) {
        num = record.num;
        errorStr = `商品：${record.productName}的需要移出的数量为${num} 请勿超出`;
        // allAmountStatus = allAmount === num;
      } else {
        num = record.sourceBeforeStock;
        errorStr = `移库数量不能大于移库前库存`;
        // allAmountStatus = !(allAmount > record.sourceBeforeStock);
      }
      record.allAmountStatus = allAmountStatus;
      let isNum = unref(isPicking) ? allAmount : outAllAmount;
      if (isNum > num) {
        message.error(errorStr);
      }
    } else {
      record.destinationAfterStock = '';
      findVal.allAmount = '';
      findVal.sourceAfterStock = '';
    }
  };

  const clearlocationIdInList = ['destinationBeforeStock', 'destinationAfterStock', 'amount', 'bracketNoIn', 'bracketIdIn'];
  const locationIdInChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, [...clearlocationIdInList, 'bracketInList', 'bracketIdInObj', 'locationIdIn']);
    if (item?.option) {
      record.locationNameIn = item.option.locationName;
      record.locationIdIn = item.option.id;
      let bracketList = await getBracketList({
        locationId: item.option.id,
      });
      record.bracketInList = bracketList.filter((v) => {
        return v.id !== record.bracketIdOut;
      });
      if (record.bracketInList.length === 0) {
        message.error('当前库位下无托架可进行移库，请添加托架');
        return;
      }
    }
  };
  const locationIdInDropdownChange = (status, record) => {
    //2024-03-10 取消库位的限制
    // //只有在拣货和检查状态下才进行库位的限制
    // //限制只能选同一种库位
    // if (!status && (!unref(isPicking) || !unref(isExamine))) return;
    // const locationIdIn = formState.value.list.find((v) => v.locationIdIn)?.locationIdIn;
    // record.locationInList = record.locationInList.map((v) => {
    //   console.log('[  ]-674', locationIdIn, v.id);
    //   return {
    //     ...v,
    //     disabled: locationIdIn ? locationIdIn !== v.id : false,
    //   };
    // });
  };
  //1.禁用前面选择的移出托架
  const ifBracketDisabled = (res, v, record) => {
    return (
      res.productId === record.productId &&
      res.batchNumber === record.batchNumber &&
      res.bracketIdIn === v.id &&
      res.locationIdIn === v.locationId
    );
  };
  const ifBracketDisabled2 = (res, v, record) => {
    //2.禁用不是冻结或无状态的托架  拣货时只能进入冻结或无状态的托架
    //3.无状态的托架 就是 托架还没有inventoryStatus  或者有inventoryStatus 但库存为0
    return ifBracketDisabled(res, v, record) || (v.inventoryStatus !== -1 && v.inventoryStatus !== null && v.remainAmount);
  };
  const bracketInDropdownChange = (status, record) => {
    if (!status) return;

    if (unref(isPicking)) {
      record.bracketInList = record.bracketInList.map((v) => {
        return {
          ...v,
          disabled: formState.value.list.some((res) => {
            //禁用表格中已选的 同产品 同批次的 同库位 同托架的
            return ifBracketDisabled2(res, v, record);
          }),
        };
      });
    } else {
      record.bracketInList = record.bracketInList.map((v) => {
        return {
          ...v,
          disabled: formState.value.list.some((res) => {
            //禁用表格中已选的 同产品 同批次的 同库位 同托架的
            return ifBracketDisabled(res, v, record);
          }),
        };
      });
    }
  };
  const bracketIdInChange = async (item, record) => {
    //只要值有变化时  都需要将后面的数据重置为空
    clearCommonPropsFn(record, [...clearlocationIdInList, 'bracketIdIn', 'inventoryStatus']);
    if (item?.value && item.option) {
      let { id, bracketNo, remainAmount, inventoryStatus } = item.option;
      record.bracketIdIn = id;
      record.bracketNoIn = bracketNo;

      const params = {
        productId: record.productId,
        locationId: record.locationIdIn,
        bracketId: record.bracketIdIn,
        batchNumber: record.batchNumber,
      };
      let currentInventory = await getInventoryByProLocBra(params);
      record.destinationBeforeStock = currentInventory.remainAmount || 0;
      // record.amount = record.amount;
      record.destinationAfterStock = currentInventory.remainAmount || 0;

      let inventoryStatusVal = isNumber(remainAmount) && remainAmount > 0 ? inventoryStatus : 1;
      console.log('[ inventoryStatusVal ]-743', inventoryStatus, inventoryStatusVal);
      //拣货状态入库的产品都要设定为冻结状态
      record.inventoryStatus = unref(isPicking) ? -1 : inventoryStatusVal;
      record.inventoryStatusOption = inventoryStatusOption.map((v) => {
        const disabled = unref(isPicking) ? -1 : remainAmount > 0 && v.value !== inventoryStatusVal;
        return {
          ...v,
          // 托架上有库存时就需要对入库产品进行状态限制，只能入库同状态产品
          disabled,
        };
      });
      // const calcRemainAmount = currentInventory.remainAmount;
      // let destinationAfterStock = calcRemainAmount;
      if ((unref(isPicking) || unref(isExamine)) && record.sourceBeforeStock >= record.num) {
        record.amount = record.num;
        // destinationAfterStock = calcRemainAmount + record.num;
        amountInChange(record.num, record);
      }

      // record.destinationBeforeStock = calcRemainAmount || 0;
      // // record.amount = record.amount;
      // record.destinationAfterStock = destinationAfterStock || 0;
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
  ];

  const mapPickingDetails = async () => {
    await fieldValueChange('warehouseId', route.query.warehouseId);

    const { setFieldsValue, updateSchema } = getForm();
    updateSchema({
      field: 'warehouseId',
      componentProps: {
        disabled: true,
      },
    });
    setFieldsValue({
      warehouseId: route.query.warehouseId,
    });
    let list = [];

    if (route.query.status) {
      // 检查状态
      isExamine.value = true;
      list = await getTransferRecordsFn({
        formId: route.query.formId,
        status: route.query.status,
      });
    } else if (route.query.list) {
      // 拣货状态
      isPicking.value = true;
      list = JSON.parse(route.query.list);
    }
    list.forEach(async (v, i) => {
      const productObj = unref(productOptions).find((item) => v.productId === item.id);
      const params = {
        ...v,
        num: v.num || v.amount, //拣货状态 用v.num 限制最大移库数量，   检查状态 用v.amount
        amount: 0, //默认移库数量  //拣货状态下才会有 v.num
      };

      const sourceObj = { ...productObj };
      assignRecord(v, 'productNameObj', sourceObj, ['id', 'productName']);
      await handleProductChange(v.productNameObj, v, i, params);
    });
  };
  const assignRecord = (record, propName, sourceObj, propNames) => {
    record[propName] = {
      option: { ...sourceObj },
      value: sourceObj[propNames[0]],
      label: sourceObj[propNames[1]],
    };
  };

  const submit = () => {
    try {
      btnLoading.value = true;
      if (!formState.value.warehouseId) {
        message.error('请选择仓库');
        return;
      }
      formRef.value
        .validate()
        .then(async (values) => {
          let allAmountStatusArr = [];
          const list = formState.value.list.map((item) => {
            let allAmountStatus;

            if (unref(isPicking) || unref(isExamine)) {
              allAmountStatus = item.allAmount === item.num;
              console.log('[ item.allAmount]-851', item.allAmount, item.outAllAmount, item.num);
            } else {
              console.log('[  ]-863', item.allAmount, item.outAllAmount, item.sourceBeforeStock);
              allAmountStatus = !(item.outAllAmount > item.sourceBeforeStock);
            }
            if (!allAmountStatus) {
              allAmountStatusArr.push(`${item.productName} 移出数量有误，请修改`);
              return;
            }

            let params = {
              ...item,
              locationType: 10,
              picList: item.picList.join(','),
            };
            // 提交时清理后端不需要的字段
            clearCommonPropsFn(params, clearParamsPropsList);
            return params;
          });
          //证明有商品移库数量超额
          if (allAmountStatusArr.length) {
            [...new Set(allAmountStatusArr)].forEach((v) => message.error(v));
            return;
          }

          let transferType = 0;
          if (unref(isPicking)) transferType = 2;
          if (unref(isExamine)) transferType = 6;
          const data = {
            ...formState.value,
            list,
            picList: checkPicList.value.join(','),
            transferType,
            objectId: unref(isPicking) || unref(isExamine) ? route.query.formId : '',
          };
          const result = await transferFn(data);
          message.success('提交成功');
          if (unref(isPicking) || unref(isExamine)) {
            window.go('/InventoryManage/transferWarehouseList');
          } else {
            window.go('/InventoryManage/inventoryList');
          }
        })
        .catch((error) => {
          message.error(error.message || '请填写内容');
        });
    } catch (error) {
      console.log('[ error ]-849', error);
    } finally {
      btnLoading.value = false;
    }
  };
  onMounted(async () => {
    productOptions.value = await getProductOptions();
    if (route.query.formId) {
      mapPickingDetails();
      const transferStockColumns2 = transferStockColumns.map((v) => {
        return {
          ...v,
          defaultHidden: false,
        };
      });
      setColumns(transferStockColumns2);
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
  ::deep(.ant-picker-disabled) {
    input {
      color: #000 !important;
    }
  }
</style>
