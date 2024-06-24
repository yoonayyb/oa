<template>
  <div class="page">
    <CollapseSearchBar :formState="formState" :headerSchema="schema" :btnSchema="btnSchema" :initForm="initFormState"> </CollapseSearchBar>
    <a-table
      :pagination="{ hideOnSinglePage: true }"
      bordered
      :scroll="{ x: 'max-content', y: 800 }"
      :dataSource="dataSource"
      :columns="columns"
    >
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.dataIndex === 'dell'">
          <a-button @click="edit(record)" type="link">编辑</a-button>
          <a-button @click="deleteRow(record)" type="link" danger>删除</a-button>
        </template>
      </template>
    </a-table>
    <a-pagination
      style="text-align: center; marign-top: 20px"
      v-model:current="current"
      v-model:pageSize="pageSize"
      :total="0"
      hideOnSinglePage
    />
    <a-modal destroyOnClose :title="title" v-model:open="open" okText="提交" width="1000px" @ok="handleOk">
      <a-form ref="modalFormRef" :model="orderFrom" :label-col="{ style: { width: '90px' } }">
        <a-row :gutter="12">
          <a-col :xs="24" :sm="12">
            <a-form-item label="物料名称" name="name" :rules="[{ required: true, message: '请输入物料名称' }]">
              <a-input placeholder="请输入" v-model:value="orderFrom.name"> </a-input>
            </a-form-item>
            <a-form-item label="类型" name="name" :rules="[{ required: true, message: '请输入类型' }]">
              <a-radio-group v-model:value="orderFrom.type">
                <a-radio :value="1">原料</a-radio>
                <a-radio :value="2">成品</a-radio>
                <a-radio :value="3">半成品</a-radio>
                <a-radio :value="4">包材</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="物料编码" name="code" :rules="[{ required: true, message: '请输入物料编码' }]">
              <a-input placeholder="请输入" v-model:value="orderFrom.code"> </a-input>
            </a-form-item>
            <a-form-item label="规格单位" name="unit" :rules="[{ required: true, message: '请选择规格单位' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.unit" :options="orderOptions"> </a-select>
            </a-form-item>
            <a-form-item label="物料规格" required class="ant-form-item-cunstom">
              <a-row>
                <a-col :xs="12" :sm="12">
                  <a-form-item name="use_unit" :rules="[{ required: true, message: '请输入规格单位' }]">
                    <a-space>
                      <a-input-number
                        class="ant-input-number-cunstom"
                        :controls="false"
                        :precision="0"
                        v-model:value="orderFrom.use_unit"
                        :min="0"
                        :max="1000000"
                      />
                      <span>规格单位</span>
                    </a-space>
                  </a-form-item>
                </a-col>
                <a-col :xs="12" :sm="12">
                  <a-form-item name="pack_unit" :rules="[{ required: true, message: '请输入包装规格' }]">
                    <a-space>
                      <a-input-number
                        class="ant-input-number-cunstom"
                        :controls="false"
                        :precision="0"
                        v-model:value="orderFrom.pack_unit"
                        :min="0"
                        :max="1000000"
                      />
                      <span>包装规格</span>
                    </a-space>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="有效期" required class="ant-form-item-cunstom">
              <a-space>
                <a-form-item name="valid_day" :rules="[{ required: true, message: '请输入有效期' }]">
                  <a-input-number :controls="false" :precision="0" v-model:value="orderFrom.valid_day" :min="0" :max="1000000" />
                </a-form-item>
                <a-form-item name="day" :rules="[{ required: true, message: '请输入日期单位' }]">
                  <a-select
                    placeholder="请输入"
                    show-search
                    v-model:value="orderFrom.day"
                    :options="[
                      {
                        value: 1,
                        label: '日',
                      },
                      {
                        value: 2,
                        label: '月',
                      },
                      {
                        value: 3,
                        label: '年',
                      },
                    ]"
                  >
                  </a-select>
                </a-form-item>
              </a-space>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="物料名称简写" name="first_letter" :rules="[{ required: true, message: '请输入物料名称简写' }]">
              <a-input placeholder="请输入中文名称首字母" v-model:value="orderFrom.first_letter"> </a-input>
            </a-form-item>
            <a-form-item label="物料类别" name="wuliao" :rules="[{ required: true, message: '请选择物料类别' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.wuliao" :options="orderOptions"> </a-select>
            </a-form-item>
            <a-form-item label="供应商" name="supplier" :rules="[{ required: true, message: '请选择供应商' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.supplier" :options="orderOptions"> </a-select>
            </a-form-item>
            <a-form-item label="包装单位" name="baozhuang_unit" :rules="[{ required: true, message: '请选择包装单位' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.baozhuang_unit" :options="orderOptions"> </a-select>
            </a-form-item>
            <a-form-item label="进货单价" required>
              <a-space>
                <a-form-item name="price" :rules="[{ required: true, message: '请输入进货单价' }]">
                  <a-input-number
                    style="width: 50px"
                    :controls="false"
                    :precision="0"
                    v-model:value="orderFrom.price"
                    :min="0"
                    :max="1000000"
                  />
                </a-form-item>
                <a-form-item name="price_unit" :rules="[{ required: true, message: '请输入单价单位' }]">
                  <a-select
                    placeholder="请输入"
                    show-search
                    v-model:value="orderFrom.price_unit"
                    :options="[
                      {
                        value: 1,
                        label: '分',
                      },
                      {
                        value: 2,
                        label: '角',
                      },
                      {
                        value: 3,
                        label: '元',
                      },
                    ]"
                  >
                  </a-select>
                </a-form-item>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #footer>
        <div style="text-align: center">
          <a-button size="mini" key="submit" type="primary" :loading="loading" @click="ok">提交</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import Icon from '/@/components/Icon/icon.vue';
  import { CollapseSearchBar } from '/@/components/Business';
  import { formartData } from '@/utils/common.js';
  import { dataSource, columns, userFormData, schema, btnClick, btnSchema } from './index.js';
  import { message, Modal } from 'ant-design-vue';
  import { createVNode } from 'vue';
  const initForm = (obj = {}) => {
    return reactive(obj);
  };
  const orderFrom = initForm();
  const initFormState = () => reactive({});
  let formState = initFormState();
  const modalFormRef = ref();
  const open = ref(false);
  const loading = ref(false);
  const title = ref('');
  const deleteRow = (record) => {
    Modal.confirm({
      title: `是否删除此数据?`,
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, record),
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  };
  const ok = () => {
    modalFormRef.value.validateFields().then(() => {
      console.log(orderFrom);
      open.value = false;
    });
  };
  const orderOptions = reactive([
    {
      value: '均衡代谢管理',
      label: '均衡代谢管理',
    },
    {
      value: '残联',
      label: '残联',
    },
    {
      value: '燕瘦环肥',
      label: '燕瘦环肥',
    },
  ]);
  const edit = (record) => {
    title.value = '编辑物料';
    orderFrom.product_come = record.order_from;
    orderFrom.out_id = record.inventory;
    orderFrom.product_name = record.info;
    open.value = true;
  };
  btnClick('btn', (v) => {
    console.log(v);
    // if (v === 'reset') {
    //   formartData(formState, initForm())
    // }
    if (v === 'add') {
      formartData(orderFrom, initForm());
      open.value = true;
      title.value = '新增物料';
    }
  });
  const handleOk = (e) => {
    console.log(e);
    open.value = false;
  };
  let current = ref(1);
  let pageSize = ref(20);
</script>
<style lang="scss" scoped>
  .ant-input-number-cunstom {
    min-width: 0 !important;
    width: 80px !important;
  }

  .ant-form-item-cunstom {
    margin-bottom: 0 !important;
  }

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
