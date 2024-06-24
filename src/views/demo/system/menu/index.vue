<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="changeTableExpandStatus"> {{tableExpandStatus?'折叠所有':'展开所有'}} </a-button>
        <a-button v-auth="'menuxz'" type="primary" @click="handleCreate"> 新增菜单
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                label:'编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label:'删除',
                color: 'error',
                auth:'menusc',
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
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getMenuList } from '/@/api/demo/system';

  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

  import { columns, searchFormSchema } from './menu.data';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'MenuManagement',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const { hasPermission } = usePermission()
      const tableExpandStatus = ref(false);
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll, collapseAll }] = useTable({
        title: '菜单列表',
        api: async (params) => {
          const { tree } = await getMenuList(params);
          console.log('tree', tree);
          return tree;
        },
        columns,
        // formConfig: {
        //   labelWidth: 120,
        //   schemas: searchFormSchema,
        // },
        isTreeTable: true,
        pagination: false,
        striped: false,
        // useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: true,
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

      function handleDelete(record : Recordable) {
        window.http
          .post({
            url: '/user_center/menu_api/del',
            data: {
              id: record.id,
            },
          })
          .then((res) => {
            message.success(res.msg);
            handleSuccess();
            console.log(res);
          });
        console.log(record);
      }

      function handleSuccess() {
        reload();
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        // nextTick(expandAll);
      }

      function changeTableExpandStatus() {
        tableExpandStatus.value = !tableExpandStatus.value;
        tableExpandStatus.value ? expandAll() : collapseAll();
      }

      return {
        hasPermission,
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        tableExpandStatus,
        changeTableExpandStatus,
      };
    },
  });
</script>
