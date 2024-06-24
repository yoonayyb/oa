<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div style="padding: 8px">
          <a-input ref="searchInput1" :placeholder="`Search ${column.dataIndex}`" :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
          <a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)">
            <template #icon>
              <Icon icon="material-symbols:search"></Icon>
            </template> 筛选 </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)"> 重置 </a-button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered }">
        <Icon :style="{ color: filtered ? '#108ee9' : undefined }" icon="material-symbols:search">
        </Icon>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                label:'设定',
                tooltip: '设定角色权限',
                onClick: handleEdity.bind(null, record),
              },
              {
                label:'编辑',
                tooltip: '编辑角色信息',
                onClick: handleEdit.bind(null, record),
              },
              {
                label:'删除',
                tooltip: '删除角色',
                color: 'error',
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
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
    <RoleDrawery @register="registerDrawery" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getRoleListByPage, delRole } from '/@/api/demo/system';

  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';
  import RoleDrawery from './RoleDrawery.vue';
  import { message } from 'ant-design-vue';
  import { columns, searchFormSchema } from './role.data';
  import Icon from '@/components/Icon/Icon.vue';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, RoleDrawer, RoleDrawery, TableAction, Icon },
    setup() {


      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerDrawery, openDrawery] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        api: getRoleListByPage,
        columns,
        // formConfig: {
        //   labelWidth: 120,
        //   schemas: searchFormSchema,
        // },
        // useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record : Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }
      function handleEdity(record : Recordable) {
        openDrawery.openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record : Recordable) {
        console.log(record);
        delRole({ ids: record.id }).then(res => {
          message.success('SUCCESS')
          reload();
        })
      }

      function handleSuccess() {
        reload();
      }
      const state = reactive({
        searchText: '',
        searchedColumn: '',
      });
      const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        state.searchText = selectedKeys[0];
        state.searchedColumn = dataIndex;
      };

      const handleReset = clearFilters => {
        clearFilters({ confirm: true });
        state.searchText = '';
      };
      return {
        registerTable,
        handleSearch,
        handleReset,
        registerDrawer,
        registerDrawery,
        handleCreate,
        handleEdit,
        handleEdity,
        handleDelete,
        handleSuccess,

      };
    },
  });
</script>