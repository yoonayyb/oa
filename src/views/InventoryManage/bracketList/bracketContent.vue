<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-title>
        <a-row class="title" justify="center">
          <a-col span="8"> 当前仓库：{{ route.query.warehouseName }} </a-col>
          <a-col span="8"> 当前库位：{{ route.query.locationName }} </a-col>
          <a-col span="8"> 当前托架：{{ route.query.bracketNo }} </a-col>
        </a-row>
        <a-divider></a-divider>
        <a-row class="title">
          <a-col span="8">
            当前托架状态：{{
              inventoryStatusOption.find((v) => {
                return v.value === inventoryStatus;
              })?.label || '未启用'
            }}
          </a-col>
          <a-col span="8">
            更改托架状态：
            <a-select
              ref="select"
              v-model:value="inventoryStatus"
              style="width: 150px"
              :options="inventoryStatusOption"
              @change="handleInventoryStatusChange"
            >
            </a-select
          ></a-col>
        </a-row>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';

  import { userSchemaFn } from './config';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  import { useConfigStore } from '@/store/modules/config';
  const { inventoryStatusOption } = useConfigStore();
  const initFormState = () =>
    reactive({
      company_id: localStorage.getItem('companyId'),
      id: route.query.id,
    });

  let formState = initFormState();
  const inventoryStatus = ref('');

  let { bracketContentFormSchema, bracketContentColumns } = userSchemaFn();

  const getTableData = async (params) => {
    const data = await window.http.post({
      url: '/erp-ware/bracketManage/bracketProductList',
      data: { ...formState, ...params },
    });
    if (data.length) {
      inventoryStatus.value = data[0].inventoryStatus;
    }
    return data;
  };
  const updateBracketInventoryStatus = async (params) => {
    const data = await window.http.post({
      url: '/erp-ware/bracketManage/updateBracketInventoryStatus',
      data: { ...params },
    });
    return data;
  };

  // const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '托架库存记录',
    rowKey: 'id',
    api: getTableData,
    columns: bracketContentColumns,
    formConfig: {
      labelWidth: 0,
      schemas: bracketContentFormSchema,
      showSubmitButton: false, //隐藏查询按钮
      showResetButton: false, //隐藏重置按钮
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
  });

  const handleInventoryStatusChange = async (inventoryStatus) => {
    const data = await updateBracketInventoryStatus({
      id: route.query.id,
      inventoryStatus,
    });
    console.log('[ data ]-92', data);
    message.success('成功修改托架状态');
  };
</script>
<style lang="less" scoped>
  .title {
    text-align: center;
    :deep(.ant-col) {
      font-size: 14px;
      font-weight: 700;
    }
  }
</style>
