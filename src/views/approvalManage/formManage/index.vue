<template>

  <div class="page">
    <CollapseSearchBar :formState='formState' :headerSchema='headerSchema' :btnSchema='btnSchema' :initForm='initForm'
      :formLabelColStyle="{width:'70px'}" @reset='reset'>
    </CollapseSearchBar>

    <BasicTable @register="registerTable" class="w-full">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]" />
        </template>
      </template>
    </BasicTable>
    <Edit ref='edit' @submit='submitFn' />
  </div>
</template>

<script lang='ts' setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { userSchemaFn } from './config.ts';
  import Edit from './Edit.vue';
  import { CollapseSearchBar } from '/@/components/Business';

  const title = ref('add');
  const edit = ref(null);
  const initForm = () => reactive({});
  let formState = initForm();

  //打开modal
  const changeModal = (val, title = 'add', record) => {
    if (title === 'add') {
      window.go('createdForm');
    }
    // edit.value.setOpen(val, title, record);
  };
  let tableData = ref([]);
  const getTableList = async () => {
    let { records } = await window.http.get({
      url: '/work_center/form_tpl_api/list',
      params: { ...formState },
    });

    tableData.value = records.map((val) => {
      return {
        ...val,
        created_userName: val?.created_user?.name,
        updated_userName: val?.updated_user?.name,
      };
    });
    setTableData(tableData.value);
    return tableData.value;
  };
  const fnObj = {
    changeModal,
    getTableList,
  };
  let { headerSchema, btnSchema, columns } = userSchemaFn(formState, initForm, fnObj);

  const [registerTable, { reload, updateTableDataRecord, setTableData }] = useTable({
    dataSource: tableData.value,
    columns,
    striped: false,
    useSearchForm: false,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });
  onMounted(() => {
    getTableList();
  });

  const handleEdit = (record) => {
    let params = {
      path: 'createdForm',
      query: {
        id: record.id,
      },
    };
    window.go(params);
  };
  const handleDelete = async ({ id }) => {
    console.log('id', id)
    await window.http.post({
      url: '/work_center/form_tpl_api/del',
      data: { id },
    });
    getTableList();
  };
  const submitFn = async (form) => {
    await window.http.post({
      url: '/work_center/form_group_api/save',
      data: { ...form },
    });
    getTableList();
  };
  const reset = () => {
    getTableList();
  };
</script>
<style lang='less' scoped>
  .page {
    margin: 16px;
  }
</style>
