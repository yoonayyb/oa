<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看',
                onClick: handleEdit.bind(null, record, 'disable'),
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <!-- <Edit @register="registerModal" @success="handleSuccess" /> -->
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  // import Edit from './Edit.vue';
  import { userSchemaFn } from './config';
  const initFormState = () =>
    reactive({
      company_id: localStorage.getItem('companyId'),
    });

  let formState = initFormState();

  let { headerSchema, columns } = userSchemaFn();

  const getTableData = async (params) => {
    let data = await window.http.post({
      url: '/erp-ware/product/page',
      data: { ...formState, ...params },
    });
    return data;
  };

  // const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '产品列表',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: headerSchema,
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function handleCreate() {
    window.go('/goodsManage/productDetails');
  }

  function handleEdit(record, status = '') {
    let params = {
      path: '/goodsManage/productDetails',
      query: {
        id: record.id,
        status,
      },
    };
    window.go(params);
  }

  async function handleDelete(record) {
    console.log(record);
    await window.http.post({
      url: '/erp-ware/product/remove',
      data: { ids: [record.id] },
    });
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
</script>
