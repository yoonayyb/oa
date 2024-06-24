<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleCreate"> 新增 </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                label: '审核',
                onClick: handleEdit.bind(null, record),
              }
            ]" />
        </template>
      </template>
    </BasicTable>
    <Edit @register="registerModal" @success="handleSuccess" />
    <Drawer @register="register" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Drawer from '../../project/projectList/examine/approveDetail.vue';
  import { useDrawer } from '/@/components/Drawer';
  import Edit from './Edit.vue';
  import { userSchemaFn } from './config';
  const initFormState = () =>
    reactive({
      company_id: localStorage.getItem('companyId'),
    });

  let formState = initFormState();

  let { headerSchema, columns } = userSchemaFn();

  const getTableData = async (params) => {
    let data = await window.http.get({
      url: '/work_center/form_api/list',
      params: { ...formState, ...params },
    });
    return data;
  };
  const [register, { openDrawer }] = useDrawer();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '审批记录',
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
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record) {
    openDrawer(true, { company_id: formState.company_id, form_id: record.id })
  }

  async function handleDelete(record) {
    console.log(record);
    await window.http.post({
      url: '/erp-ware/warehouse/remove',
      data: { ids: [record.id] },
    });
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    console.log('[ isUpdate ]-97', isUpdate);
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
</script>
