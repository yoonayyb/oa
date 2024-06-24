<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="800px">
    <!-- form验证table -->
    <a-form class="disabled_form" ref="formRef" :model="formState" :label-col="labelCol" :disabled="disabledStatus">
      <a-form-item label="商品来源" name="source" :rules="rules.source">
        <a-select v-model:value="formState.source" :options="sourceOptions" @change="handleSourceChange" placeholder="请选择"> </a-select>
      </a-form-item>
      <a-form-item label="外部商品名称" name="goodsNameObj" :rules="rules.goodsNameObj">
        <!-- :field-names="{ label: 'title', value: 'id' }" -->
        <a-select
          v-model:value="formState.goodsNameObj"
          show-search
          allow-clear
          label-in-value
          placeholder="可输入商品名进行搜索"
          :default-active-first-option="false"
          :not-found-content="null"
          :options="goodsNameOptions"
          :filter-option="filterOption"
          @search="handleSearch"
          @change="goodsNameChange"
        ></a-select>
      </a-form-item>
      <a-form-item label="外部商品ID" name="externalId">
        <a-input disabled v-model:value="formState.externalId" placeholder="请选择商品"></a-input>
      </a-form-item>
      <a-form-item label="商品代号" name="goodsNo" :rules="rules.goodsNo">
        <a-input v-model:value="formState.goodsNo" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="启用状态" name="status" :rules="rules.status">
        <a-radio-group
          v-model:value="formState.status"
          :options="[
            { label: '启用', value: 0 },
            { label: '禁用', value: 1 },
          ]"
        />
      </a-form-item>
      <!-- v-if  -->
      <a-form-item label="产品表格" name="list">
        <a-table bordered style="width: 100%" :dataSource="formState.list" :columns="modelTableColumns" :pagination="false">
          <template #bodyCell="{ column, text, record, index }">
            <template v-if="column.dataIndex === 'name'">
              <a-form-item class="table_form_item" :name="['list', index, 'productObj']" :rules="rules.productObj">
                <a-select
                  style="width: 150px"
                  @change="productChange($event, record, formState.list)"
                  v-model:value="record.productObj"
                  placeholder="请选择"
                  allowClear
                  show-search
                  label-in-value
                  :options="productOptions"
                  :field-names="{ label: 'productName', value: 'id' }"
                >
                </a-select>
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'productQuantity'">
              <a-form-item class="table_form_item" :name="['list', index, 'productQuantity']" :rules="rules.productQuantity">
                <a-input-number
                  style="width: 150px"
                  placeholder="请输入"
                  :controls="false"
                  :precision="0"
                  v-model:value="record.productQuantity"
                  :min="0"
                  :max="1000000"
                />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'dell' && disabledStatus !== 'disable'">
              <Icon class="add_icon" @click="addOrderRow(record)" icon="gala:add" />
              <Icon class="del_icon" @click="delOrderRow(record, index)" icon="icon-park-outline:reduce-one" />
            </template>
          </template>
        </a-table>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { debounce } from 'lodash-es';
  import { isArray } from '/@/utils/is';
  import Icon from '@/components/Icon/Icon.vue';
  import { TableAction } from '/@/components/Table';

  import ProductItem from './productItem.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { formSchema, modelTableColumns, sourceOptions } from './index';

  const emits = defineEmits(['success', 'register']);
  const labelCol = { style: { width: '150px' } };
  const rules = {
    source: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    goodsNameObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    productQuantity: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    productObj: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    status: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    goodsNo: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  };

  const formRef = ref();
  const initFormState = () => ({
    source: 0,
    status: 0,
    list: [{}],
  });

  let formState = ref({ ...initFormState() });

  const saveApi = async (data) => {
    console.log('[ data ]-69', data);
    let saveUrl = unref(isUpdate) ? '/erp-ware/goods/update' : '/erp-ware/goods/save';
    let result = await window.http.post({
      url: saveUrl,
      data,
    });
    return result;
  };
  const productOptions = ref([]);

  const getProductOptions = async () => {
    let result = await window.http.post({
      url: '/erp-ware/product/list',
      data: {},
    });
    return result;
  };

  const goodsNameOptions = ref([]);

  /*
    source 0 均衡营养健康  1粤来粤营养
    */
  const getGoodsNameOptions = async (source, data = {}) => {
    //均衡营养健康
    let url = '/gp_mini/erp_oa/api/goods/select';
    if (source === 1) {
      url = '/ylyyy' + url;
    }

    let result = await window.http.post({
      url,
      data,
    });
    return result.records.map((v) => ({
      ...v,
      value: v.id,
      label: v.title,
    }));
  };

  const isUpdate = ref(true);
  const disabledStatus = ref('');
  const rowId = ref('');
  const delList = [];

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('[ formRef.value ]-153', formRef.value);
    formState.value = { ...initFormState() };

    productOptions.value = await getProductOptions();
    goodsNameOptions.value = await getGoodsNameOptions();
    setModalProps({ confirmLoading: false });

    isUpdate.value = !!data?.isUpdate;
    disabledStatus.value = data.status === 'disabled';
    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      formState.value = {
        ...data.record,
        goodsNameObj: {
          value: data.record.externalId,
          label: data.record.goodsName,
        },
        list: data.record.list.map((v) => {
          let findProduct = productOptions.value.find((item) => item.id === v.productId);
          return {
            ...v,
            productNo: findProduct?.productNo,
            productObj: {
              value: v.productId,
              label: v.productName,
            },
          };
        }),
      };
    }
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const submit = async (values) => {
    let list = [...values.list, ...delList].map((v) => {
      return {
        ...v,
        productObj: '',
      };
    });

    let data = {
      ...values,
      list,
      goodsName: values.goodsNameObj?.label,
      company_id: localStorage.getItem('companyId'),
      id: unref(isUpdate) ? rowId.value : '',
    };
    delete data.goodsNameObj;
    let result = await saveApi(data);
    return data;
  };

  async function handleSubmit() {
    try {
      if (status.value === 'disable') {
        closeModal();

        return;
      }
      setModalProps({ confirmLoading: true });

      formRef.value
        .validate()
        .then(async (values) => {
          let result = await submit(values);
          closeModal();
          emits('success', { isUpdate: unref(isUpdate), values: { ...result } });
        })
        .catch((error) => {
          console.log('error', error);
        });

      // TODO custom api
    } catch (error) {
      console.log('[ error ]-63', error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  const setRecordProduct = (record, productOption = {}) => {
    console.log('[ productOption ]-234', productOption);
    record.productId = productOption.id || '';
    record.productName = productOption.productName || '';
    record.productNo = productOption.productNo || '';
  };
  const productChange = (e, record, list) => {
    if (e?.value) {
      setRecordProduct(record, e.option);
      productOptions.value = productOptions.value.map((v) => {
        return {
          ...v, //禁用其他行选中的产品
          disabled: list.some((res) => res.productId === v.id),
        };
      });
    } else {
      setRecordProduct(record);
    }
  };

  const handleSearch = debounce(async (title: string) => {
    goodsNameOptions.value = await getGoodsNameOptions(formState.value.source, { title });
  }, 500);

  const filterOption = (input: string, option: any) => {
    return option.title.indexOf(input) >= 0;
  };
  const handleSourceChange = async (val) => {
    goodsNameOptions.value = await getGoodsNameOptions(val);
  };
  const goodsNameChange = (val, form) => {
    console.log('[ val ]-265', val);
    formState.value.externalId = val?.value;
  };

  // const closeFunc = () => {
  //   formState.value = { ...initFormState() };
  //   return true;
  // };
  const addOrderRow = () => {
    formState.value.list.push({});
  };

  const delOrderRow = (record, index) => {
    if (record.id) {
      delList.push({ ...record, deleted: 1 });
    }
    formState.value.list.splice(index, 1);
    if (formState.value.list.length === 0) {
      addOrderRow();
    }
  };
</script>
<style lang="less" scoped>
  .add_icon {
    cursor: pointer;
    color: #0079ff;
    margin-right: 8px;
    font-size: 20px !important;
  }
  .del_icon {
    cursor: pointer;
    font-size: 20px !important;
    color: red;
  }
</style>
