<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'list'">
          <div v-for="v in record.list"> {{ v.productName }} x {{ v.num }} </div>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag class="ant_tag" :bordered="true" :color="colorObj[record.status]">
            {{ transferWhereaboutsOption.find((v) => v.value === record.status)?.label }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="handleEdit(record)">
            {{ transferWhereaboutsBtnOption.find((v) => v.value === record.status)?.label }}
          </a-button>
        </template>
      </template>
    </BasicTable>
    <Edit @register="registerModal" />
    <Drawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { uniq, compact } from 'lodash-es';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Edit from './Edit.vue';
  import { userSchemaFn } from './config';
  import Drawer from '../../project/projectList/examine/approveDetail.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useConfigStoreWithOut } from '/@/store/modules/config';
  const configStore = useConfigStoreWithOut();
  const transferWhereaboutsOption = configStore.transferWhereaboutsOption;
  const transferWhereaboutsBtnOption = configStore.transferWhereaboutsBtnOption;

  const getTableData = async (params) => {
    try {
      const data = await window.http.post({
        url: '/erp-ware/transferRecords/page',
        data: { ...formState, ...params },
      });

      let company_user_ids = [];
      data.records.forEach((v) => {
        company_user_ids = company_user_ids.concat([
          v.approvalUserId,
          v.companyUserId,
          v.applyUserId,
          v.signInUserId,
          v.pickingUserId,
          v.inWarehouseUserId,
          v.outWarehouseUserId,
        ]);
      });

      const userList = await getStaffList(compact(uniq(company_user_ids)));
      const userMap = {};
      userList.forEach((item) => {
        // userMap[item.user_id] = item.name;
        userMap[item.id] = item.name;
      });
      console.log('[ userMap ]-52', userMap);
      data.records = data.records.map((v) => {
        return {
          ...v,
          approvalUserIdName: userMap[v.approvalUserId],
          companyUserIdName: userMap[v.companyUserId],
          applyUserIdName: userMap[v.applyUserId],
          signInUserIdName: userMap[v.signInUserId],
          pickingUserIdName: userMap[v.pickingUserId],
          inWarehouseUserIdName: userMap[v.inWarehouseUserId],
          outWarehouseUserIdName: userMap[v.outWarehouseUserId],
        };
      });
      return data;
    } catch (error) {
      console.log('[ error ]-54', error);
    }
  };
  const getWarehouseList = async () => {
    const data = await window.http.post({
      url: '/erp-ware/warehouse/list',
      data: {
        type: 10,
      },
    });
    return data;
  };
  const getStaffList = async (company_user_ids) => {
    const { records, total } = await window.http.get({
      url: '/company_center/staff_api/select',
      params: {
        pageNum: 1000,
        page: 1,
        company_user_ids: company_user_ids.join(','),
      },
    });
    return records;
  };
  const colorObj = {
    '-1': 'red',
    0: 'blue',
    1: 'purple',
    2: 'cyan',
    3: 'orange',
    4: 'orange',
    5: 'volcano',
    6: 'green',
  };
  const warehouseList = ref([]);
  const initFormState = () =>
    reactive({
      company_id: localStorage.getItem('companyId'),
    });

  let formState = initFormState();

  let { headerSchema, columns } = userSchemaFn({ warehouseList });

  const [registerModal, { openModal }] = useModal();
  const [register, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '转仓列表',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: headerSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });
  //审核
  const examineFn = (row) => {
    openDrawer(true, { company_id: localStorage.getItem('companyId'), form_id: row.formId });
  };
  // 拣货
  const pickingFn = (record) => {
    jumpFn(record, '/transferWarehouseList/transferStock', { warehouseId: record.outWarehouseId });
  };
  // 出仓
  const warehouseOutFn = (record) => {
    jumpFn(record, '/transferWarehouseList/outbound', { warehouseId: record.outWarehouseId });
  };
  // 签收
  const signForFn = (record) => {
    jumpFn(record, '/transferWarehouseList/inbound', { warehouseId: record.inWarehouseId });
  };

  // 检查
  const warehouseInFn = (record) => {
    jumpFn(record, '/transferWarehouseList/transferStock', { warehouseId: record.inWarehouseId, status: record.status });
  };
  // 申请
  const applyForFn = () => {};
  const jumpFn = (record, path, queryParams) => {
    let params = {
      path,
      query: {
        formId: record.formId,
        id: record.id,
        list: JSON.stringify(record.list),
        ...queryParams,
      },
    };
    window.go(params);
  };
  const btnFnObj = {
    '-1': applyForFn,
    0: examineFn,
    1: pickingFn,
    2: warehouseOutFn,
    3: signForFn,
    4: signForFn,
    5: warehouseInFn,
  };

  function handleEdit(record) {
    console.log('[ record.status ]-208', record.status);
    const fn = btnFnObj[record.status];
    fn(record);
  }

  function handleSuccess() {
    reload();
  }
  onMounted(async () => {
    warehouseList.value = await getWarehouseList();

    // console.log('[ data ]-158', data);
  });
</script>
<style lang="less" scoped></style>
