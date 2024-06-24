<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
       <!-- <a-button type="primary" @click="changeTableExpandStatus"> {{tableExpandStatus?'折叠所有':'展开所有'}} </a-button>
        <a-button type="primary" @click="handleCreate"> 新增部门 </a-button> -->
      </template>
  <!--    <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                label:'编辑',

                onClick: handleEdit.bind(null, record),
              },
              {
               label:'删除',
                color: 'error',
                tooltip: '删除部门',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]" />
        </template>
      </template> -->
    </BasicTable>

    
  </div>
</template>
<script lang="ts" setup name='DeptManagement'>
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getLogtList } from '/@/api/demo/system';
  
  import { columns, searchFormSchema } from './log.data';

  const tableExpandStatus = ref(false);

  const getTableData = async (params) => {
    // console.log('params: ', params)
    const [ start_time, end_time] = params.time || []
    console.log('end_time: ', end_time)
    console.log('start_time: ', start_time)
    if(start_time && end_time){
      params.start_time = start_time
      params.end_time = end_time
      delete params.time
    }
    let res = await getLogtList({ ...params });
    return res;
  };

  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload, expandAll, collapseAll, updateTableDataRecord }] = useTable({
    title: '操作日志',
    rowKey: 'id',
    api: getTableData,
    columns,
    isTreeTable: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    // actionColumn: {
    //   width: 100,
    //   title: '操作',
    //   dataIndex: 'action',
    //   // slots: { customRender: 'action' },
    //   fixed: undefined,
    // },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record) {
    openModal(true, {
      record: { ...record },
      isUpdate: true,
    });
  }

  async function handleDelete(record) {
    await window.http.post({
      url: '/company_center/department_api/del',
      data: { id: record.id },
    });
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  function changeTableExpandStatus() {
    tableExpandStatus.value = !tableExpandStatus.value;
    tableExpandStatus.value ? expandAll() : collapseAll();
  }
</script>
