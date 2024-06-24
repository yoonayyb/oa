<template>
  <div>
    <!-- form校验table -->
    <a-form class="disabled_form" ref="formRef" :model="formState" :label-col="labelCol">
      <BasicTable class="form_table" @register="registerTable" @field-value-change="fieldValueChange">
        <template #toolbar>
          <a-button v-loading="btnLoading" type="primary" @click="submit()">提交入库 </a-button>
        </template>
        <template #bodyCell="{ index, column, record }">
          <template v-if="column.key === 'productId'">
            <a-form-item :name="['list', index, 'productNameObj']" name="productNameObj" :rules="rules.productNameObj">
              <a-select
                v-model:value="record.productNameObj"
                :field-names="{ label: 'productName', value: 'id' }"
                label-in-value
                :allowClear="true"
                :show-search="true"
                @change="handleProductChange($event, record, index)"
                :disabled="Boolean(record.batchNumberId) || isOutWarehouse"
                style="width: 100%"
                placeholder="请选择"
                :options="productOptions"
              ></a-select>
            </a-form-item>
          </template>
          <template v-if="column.key === 'manuBatchNumber' && record.productNameObj && record.manuBatchNumberOptions">
            <a-form-item :name="['list', index, 'manuBatchNumberObj']" name="manuBatchNumberObj" :rules="rules.manuBatchNumberObj">
              <a-select
                v-model:value="record.manuBatchNumberObj"
                placeholder="请选择"
                label-in-value
                :allowClear="true"
                @change="handleBatchNumberChange($event, record, ['manuBatchNumber', 'batchNumber'])"
                :options="record.manuBatchNumberOptions"
                :disabled="Boolean(record.batchNumberId) || isOutWarehouse"
                style="width: 100%"
                :field-names="{ label: 'manuBatchNumber', value: 'customId' }"
                :dropdownMatchSelectWidth="false"
              >
                <template #dropdownRender="{ menuNode: menu }">
                  <div style="width: 200px">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <a-space>
                      <!--  ref="inputRef" -->
                      <a-input
                        class="add_batch_name"
                        v-model:value="addBatchName"
                        onkeyup="value=value.replace(/[, ]/g,'')"
                        @input="getNumber($event)"
                        placeholder="请输入批次号"
                      />
                      <a-button type="text" @click="addItem($event, record, ['manuBatchNumber', 'batchNumber'], index)">
                        <template #icon>
                          <plus-outlined />
                        </template>
                        新增批次号
                      </a-button>
                    </a-space>
                  </div>
                </template>
              </a-select>
            </a-form-item>
          </template>
          <template v-if="column.key === 'packageSpecs'"> {{ getSpace(record, 'package') }} </template>
          <template v-if="column.key === 'boxingSpecs'">{{ getSpace(record, 'boxing') }} </template>
          <template v-if="column.key === 'packingSpecs'">{{ getSpace(record, 'packing') }} </template>
          <template v-if="column.key === 'produceDate' && record.productNameObj">
            <a-form-item :name="['list', index, 'produceDate']" name="produceDate" :rules="rules.produceDate">
              <a-date-picker
                v-model:value="record.produceDate"
                :disabled="Boolean(record.manuBatchNumberId || record.batchNumberId) || isOutWarehouse"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                @change="dateChange(record, 'produceDate')"
                :disabled-date="(e) => disabledDate(e, record)"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'shelfLife' && record.productNameObj">{{ getShelfLife(record) }} </template>
          <template v-if="column.key === 'expirationDate' && record.productNameObj">
            <a-form-item :name="['list', index, 'expirationDate']" name="expirationDate" :rules="rules.expirationDate">
              <a-date-picker
                :disabled="Boolean(record.manuBatchNumberId || record.batchNumberId) || isOutWarehouse"
                v-model:value="record.expirationDate"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                :disabled-date="(e) => disabledDate2(e, record)"
                @change="dateChange(record, 'expirationDate')"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'batchNumber' && record.productNameObj && record.batchNumberOptions">
            <a-form-item :name="['list', index, 'batchNumberObj']" name="batchNumberObj" :rules="rules.batchNumberObj">
              <a-select
                v-model:value="record.batchNumberObj"
                placeholder="请选择"
                label-in-value
                :allowClear="true"
                @change="handleBatchNumberChange($event, record, ['batchNumber', 'manuBatchNumber'])"
                :options="record.batchNumberOptions"
                :disabled="Boolean(record.manuBatchNumberId) || isOutWarehouse"
                style="width: 100%"
                :field-names="{ label: 'batchNumber', value: 'customId' }"
                :dropdownMatchSelectWidth="false"
              >
                <template #dropdownRender="{ menuNode: menu }">
                  <div style="width: 200px">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <a-space>
                      <a-input
                        class="add_batch_name"
                        v-model:value="addBatchName"
                        placeholder="请输入批次号"
                        onkeyup="value=value.replace(/[, ]/g,'')"
                        @input="getNumber($event)"
                      />
                      <a-button type="text" @click="addItem($event, record, ['batchNumber', 'manuBatchNumber'], index)">
                        <template #icon>
                          <plus-outlined />
                        </template>
                        新增批次号
                      </a-button>
                    </a-space>
                  </div>
                </template>
              </a-select>
            </a-form-item>
          </template>
          <template v-if="column.key === 'locationObj' && record.manuBatchNumberObj && locationList.length">
            <a-form-item :name="['list', index, 'locationObj']" name="locationObj" :rules="rules.locationObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :options="locationList"
                v-model:value="record.locationObj"
                @change="locationChange($event, record)"
                :field-names="{ label: 'locationName', value: 'id' }"
                optionFilterProp="locationName"
                placeholder="请选择"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'bracketObj' && record.locationObj && record.bracketList?.length">
            <a-form-item :name="['list', index, 'bracketObj']" name="bracketObj" :rules="rules.bracketObj">
              <a-select
                style="width: 100%"
                showSearch
                :allowClear="true"
                label-in-value
                :options="record.bracketList"
                v-model:value="record.bracketObj"
                @change="bracketChange($event, record)"
                @dropdownVisibleChange="bracketDropdownChange($event, record)"
                :field-names="{ label: 'bracketNo', value: 'id' }"
                optionFilterProp="bracketNo"
                placeholder="请选择"
              />
            </a-form-item>
          </template>

          <template v-if="column.key === 'amount' && record.manuBatchNumberObj && record.bracketList?.length && !isOutWarehouse">
            <a-form-item :name="['list', index, 'amount']" name="amount" :rules="rules.amount">
              <a-input-number style="width: 100%; min-width: 50px" v-model:value="record.amount" :min="1" placeholder="请输入" />
            </a-form-item>
          </template>
          <template v-if="column.key === 'inventoryStatus' && record.bracketObj">
            <a-form-item :name="['list', index, 'inventoryStatus']" name="inventoryStatus" :rules="rules.inventoryStatus">
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
  import { formatToDate, daysDiff, calculateDates } from '/@/utils/dateUtil';
  import { message } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Edit from './Edit.vue';
  import uploadChecklist from './uploadChecklist.vue';
  import { userSchemaFn } from './config';
  import { getSpecsStr } from '@/utils/business/index';
  import { uniqBy } from 'lodash-es';
  import { isNumber } from '/@/utils/is';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  let { inventoryStatusOption } = useConfigStore();
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
  const dateChange = (record, dateStr) => {
    formRef.value.clearValidate();
    if (record.produceDate && record.expirationDate) {
      // 如果produceDate和expirationDate都存在，则不执行任何操作
      return;
    }
    const date = record[dateStr];
    if (date) {
      const calculateDate = calculateDates(date, record.validPeriod);
      dateStr = dateStr === 'produceDate' ? 'expirationDate' : 'produceDate';
      record[dateStr] = calculateDate[dateStr === 'produceDate' ? 0 : 1];
    }
  };
  const getShelfLife = computed(() => (record, Specs) => {
    if (record?.produceDate && record?.expirationDate) {
      return daysDiff(record?.produceDate, record?.expirationDate) + '天';
    }
  });

  let { subpagesHeaderSchema, inboundColumns } = userSchemaFn();

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
      // url: '/erp-ware/bracketManage/list',
      url: '/erp-ware/bracketManage/bracketInventoryStatusList',
      data,
    });
  };
  const putInBatchFn = async (data) => {
    return await window.http.post({
      url: '/erp-ware/inventoryRecord/putInBatch',
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
  const isOutWarehouse = ref(false);
  const open = ref(false);
  const btnLoading = ref(false);
  const addBatchName = ref();
  const productOptions = ref([]);
  const locationList = ref([]);
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { getForm, reload, updateTableDataRecord, setLoading, setColumns, getColumns }] = useTable({
    title: '入库',
    rowKey: 'id',
    dataSource: formState.value.list,
    columns: inboundColumns,
    formConfig: {
      labelWidth: 100,
      schemas: subpagesHeaderSchema,
      showSubmitButton: false, //隐藏查询按钮
      showResetButton: false, //隐藏重置按钮
    },
    pagination: false,
    useSearchForm: true,

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

  const fieldValueChange = async (key, val) => {
    if (key === 'warehouseId') {
      formState.value.list.length = 0;
      formState.value.warehouseId = val;
      locationList.value = await getLocationList({ warehouseId: val });
      if (locationList.value.length === 0) {
        message.error('当前仓库暂无库位，无法入库');
      } else {
        formState.value.list.push({});
      }
    }
  };
  const getNumber = (obj) => {
    obj.target.value = obj.target.value.replace(/[\u4e00-\u9fa5]/g, '');
    addBatchName.value = obj.target.value;
  };
  const handleProductChange = async (item, record, index, outWarehouseObj) => {
    let row = {
      productNameObj: item,
    };
    if (item?.value && item.option) {
      const data = await getBatchNumberOptions({ productId: item.value });
      const batchOptions = uniqBy(data, 'manuBatchNumber').map((v) => ({ ...v, customId: v.id }));
      row = {
        productNameObj: item,
        manuBatchNumberOptions: batchOptions,
        batchNumberOptions: batchOptions,
        productId: item.option.id,
        productName: item.option.productName,
        productNo: item.option.productNo,
        price: item.option.price,
        validPeriod: item.option.validPeriod,
        dosageUnit: item.option.dosageUnit,
        stockUnit: item.option.boxingUnit,
        picList: [],
        packageSpecsStr: getSpecsStr(item.option, 'package'),
      };

      //出仓时
      if (unref(isOutWarehouse)) {
        const findBatchNumber = data.find((v) => v.id === outWarehouseObj.inventoryId);
        const option = { ...findBatchNumber, customId: findBatchNumber.id };
        const batchNumberItem = {
          option,
          value: findBatchNumber.id,
          label: findBatchNumber.batchNumber,
        };
        handleBatchNumberChange(batchNumberItem, row, ['batchNumber', 'manuBatchNumber']);
        handleBatchNumberChange(batchNumberItem, row, ['manuBatchNumber', 'batchNumber']);
        row.amount = Math.abs(outWarehouseObj.amount);

        // row.batchNumberOptions = [option];
      }
    }
    formState.value.list[index] = {
      ...row,
    };
  };

  const clearCommonPropsList = [
    'expirationDate',
    'produceDate',
    'inventoryStatus',
    'batchNumber',
    'manuBatchNumber',
    'id',
    'bracketObj',
    'bracketId',
    'bracketList',
    'locationObj',
    'locationId',
    'manuBatchNumberId',
    'batchNumberId',
    'amount',
  ];
  const handleBatchNumberChange = async (item, record, batchNameArr) => {
    const name1 = batchNameArr[0];
    const name2 = batchNameArr[1];

    if (item?.option?.id || record.manuBatchNumberId || record.batchNumberId) {
      clearCommonPropsFn(record, [...clearCommonPropsList, `${name2}Obj`]);
    }
    if (item?.value && item?.option?.id) {
      //选了带有id的批次

      const { option } = item;
      record[`${name1}Id`] = item.option.id;
      const commonProps = ['expirationDate', 'produceDate', 'batchNumber', 'manuBatchNumber'];
      commonProps.forEach((prop) => {
        record[prop] = option[prop];
      });
      assignRecord(record, `${name2}Obj`, item.option, ['customId', name2]);

      // const location = locationList.value.find((v) => v.id === option.locationId);
      // if (location) {
      //   assignRecord(record, 'locationObj', location, ['id', 'locationName']);
      //   await locationChange(record.locationObj, record);
      //   const bracket = record.bracketList.find((v) => v.id === option.bracketId);
      //   bracket && assignRecord(record, 'bracketObj', bracket, ['id', 'bracketNo']);
      // }
    }
  };
  const disabledDate = (current: dayjs, record, dateName) => {
    if (record.expirationDate) {
      return dayjs(current).unix() > dayjs(record.expirationDate).unix();
    }
  };
  const disabledDate2 = (current: dayjs, record, dateName) => {
    if (record.produceDate) {
      return dayjs(current).unix() < dayjs(record.produceDate).unix();
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

  const bracketChange = async (item, record) => {
    delete record.bracketId;
    delete record.inventoryStatus;
    if (item?.value && item.option) {
      let { id, bracketNo, inventoryStatus, remainAmount } = item.option;
      record.bracketId = id;
      record.bracketNo = bracketNo;

      // inventoryStatus 库存状态：-1冻结，0待检，1可用，-2退货

      let inventoryStatusVal = isNumber(remainAmount) && remainAmount > 0 ? inventoryStatus : 1;
      record.inventoryStatus = inventoryStatusVal;
      record.inventoryStatusOption = inventoryStatusOption.map((v) => {
        return {
          ...v,
          // 托架上有库存时就需要对入库产品进行状态限制  只能入库同状态产品
          disabled: remainAmount > 0 ? v.value !== inventoryStatusVal : false,
        };
      });
    }
  };
  const getDisabled = (res, v, record) => {
    if (unref(isOutWarehouse)) {
      return; //res.productId === record.productId && res.batchNumber === record.batchNumber && res.locationId === record.locationId;
    } else {
      return (
        res.bracketId === v.id &&
        res.productId === record.productId &&
        res.batchNumber === record.batchNumber &&
        res.locationId === record.locationId
      );
    }
  };
  const bracketDropdownChange = async (status, record) => {
    if (!status) return;

    record.bracketList = record.bracketList.map((v) => {
      return {
        ...v,
        disabled: formState.value.list.some((res) => {
          //禁用表格中已选的 同产品 同批次 同库位 同托架的
          return getDisabled(res, v, record);
        }),
      };
    });
  };

  const addItem = (e, record, batchNumberNameArr, index) => {
    const batchNumberName = batchNumberNameArr[0];
    e.preventDefault();
    const value = addBatchName.value ? addBatchName.value : `${formatToDate(new Date())}_${index}`;
    if (value && value !== ' ') {
      console.log('[ value ]-556', value);
      const params = {
        value,
        [batchNumberName]: value,
        customId: `${value}_${index}`, //自定义id  防止选中在同名批次号 option 会高亮问题 //约等于vue2的key效果
      };
      const includesStatus = record[`${batchNumberName}Options`].find((item) => item[batchNumberName] === value);
      if (includesStatus) {
        message.error('当前批次号已存在，无需新增');
        return;
      }
      record[`${batchNumberName}Options`] = [params, ...record[`${batchNumberName}Options`]];
      addBatchName.value = '';
    }
  };
  const locationChange = async (e, record) => {
    delete record.bracketObj;
    delete record.bracketId;
    delete record.inventoryStatus;
    if (e?.option) {
      record.locationName = e.option.locationName;
      record.locationId = e.option.id;
      record.bracketList = await getBracketList({
        locationId: e.option.id,
        status: 0,
      });
      if (record.bracketList.length === 0) {
        message.error('当前库位暂无托架');
      }
    }
  };

  const submit = () => {
    if (!formState.value.warehouseId) {
      message.error('请选择仓库');
      return;
    }

    formRef.value
      .validate()
      .then(async (values) => {
        btnLoading.value = true;
        const list = formState.value.list.map((item) => {
          let params = {
            ...item,
            batchNumber: item.batchNumberObj.label,
            manuBatchNumber: item.manuBatchNumberObj.label,
            // oldAmount: 0,
            picList: item.picList.join(','),
          };
          delete params.bracketList;
          delete params.locationObj;
          delete params.manuBatchNumberObj;
          delete params.batchNumberObj;
          delete params.bracketObj;
          delete params.manuBatchNumberOptions;
          delete params.batchNumberOptions;
          delete params.productNameObj;
          return params;
        });
        const data = {
          ...formState.value,
          list,
          picList: checkPicList.value.join(','),
          transferType: unref(isOutWarehouse) ? 5 : 0,
          objectId: unref(isOutWarehouse) ? route.query.formId : '',
        };
        const result = await putInBatchFn(data);
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
    const filterList = list.filter((v) => v.inoutType === 20);
    setFieldsValue({
      warehouseId: route.query.warehouseId,
    });
    mapList(filterList);
  };
  //改造后端数据
  const mapList = (filterList) => {
    filterList.forEach(async (v, i) => {
      const productObj = unref(productOptions).find((item) => v.productId === item.id);
      const params = {
        ...v,
      };
      const sourceObj = { ...productObj };
      assignRecord(params, 'productNameObj', sourceObj, ['id', 'productName']);
      const bracketObj = { bracketId: v.bracketId, bracketNo: v.bracketNo };
      const manuBatchNumberObj = { manuBatchNumber: v.manuBatchNumber, bracketNo: v.bracketNo, customId: v.manuBatchNumber };
      assignRecord(v, 'bracketObj', bracketObj, ['id', 'bracketNo']);
      // v.batchNumberOptions = [];
      v.whereabouts = 20;

      await handleProductChange(params.productNameObj, params, i, v);
    });
  };

  onMounted(async () => {
    productOptions.value = await getProductOptions();
    if (route.query.formId) {
      isOutWarehouse.value = true;
      await mapWarehouseDetails();
      const columns2 = getColumns().map((v) => {
        return {
          ...v,
          defaultHidden: v.key === 'action' ? true : false,
        };
      });
      setColumns(columns2);
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
