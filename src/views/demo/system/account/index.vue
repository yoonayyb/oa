<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" /> -->
    <BasicTable @register="registerTable" class="w-full">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <a-avatar :size="64" :src="record.avatar">
          </a-avatar>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
             
              {
                label:'权限',
                tooltip: '添加权限',
                onClick: handleEdit1.bind(null, record),
              },
              {
                label:'编辑',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                label:'删除',
                color: 'error',
                tooltip: '删除此账号',
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
    <AccountModal :name='"account"' :type='"account"' @register="registerModal" @success="handleSuccess" />
    <AccountModal :name='"permission"' :type='"permission"' @register="registerModaly" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAccountList } from '/@/api/demo/system';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';

  import { useModal } from '/@/components/Modal';
  import AccountModal from './AccountModal.vue';

  import { columns, searchFormSchema } from './account.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction },
    setup() {
      const go = useGo();
      const [registerModal, { openModal }] = useModal();
      const [registerModaly, openModaly] = useModal();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        rowKey: 'id',
        title: '账号列表',
        api: getAccountList,
        columns,
        formConfig: {
          labelWidth: 100,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        console.log(record);
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      function handleEdit1(record: Recordable) {
        console.log(record);
        openModaly.openModal(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        // console.log(record);
        window.http
          .post({
            url: '/user_center/user_api/del',
            data: {
              ids: record.id,
            },
          })
          .then((res) => {
            message.success('SUCCESS');
            reload();
            // handleSuccess({
            //   isUpdate: true,
            //   values: { ...record, id: ref(record.id).value }
            // })
            console.log(res);
          });
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          console.log('[ values ]-128', values);
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
        } else {
          reload();
        }
      }

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      function handleView(record: Recordable) {
        go('/system/account_detail/' + record.id);
      }

      return {
        registerTable,
        registerModal,
        registerModaly,
        handleCreate,
        handleEdit,
        handleEdit1,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
      };
    },
  });
</script>
