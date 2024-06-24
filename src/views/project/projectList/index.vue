<template>
  <div class="page">
    <CollapseSearchBar :formState="formState" :headerSchema="headerSchema" :btnSchema="btnSchema" :initForm="initForm" @reset="reset">
    </CollapseSearchBar>
    <vxe-table
      show-overflow
      :row-config="{ isHover: true, useKey: true }"
      :column-config="{ resizable: true }"
      border
      :tree-config="treeConfig"
      :data="tableData"
      :scroll-y="{ enabled: false }"
      align="center"
      :row-class-name="rowClassName"
    >
      <vxe-column field="title" title="项目" align="left" tree-node></vxe-column>
      <vxe-column field="targetable_type_title" title="类型">
        <template #default="{ row }">
          <div class="flex_aic_jcc">
            <a-alert style="width: 60px; height: 30px" :message="row.targetable_type_title" :type="row.alertType" />
          </div>
        </template>
      </vxe-column>
      <vxe-column field="size" title="创建人">
        <template #default="{ row }">
          {{ row.created_user?.name }}
        </template>
      </vxe-column>
      <vxe-column field="created_at" title="创建时间"></vxe-column>
      <vxe-column field="company_title" title="所属主体"> </vxe-column>
      <vxe-column field="status_text" title="状态">
        <template #default="{ row }">
          <a-tag class="ant_tag" :bordered="true" :color="colorObj[row.status_text]">
            {{ row.status_text }}
          </a-tag>
        </template>
      </vxe-column>

      <!-- <vxe-column field="select" title="待办事项">
        <template #default="{ row }">
          <ApiCascader v-model:value="row.value" multiple :options="options" placeholder="请选择"
            suffix-icon="Shopping Around">
            <template #expandIcon>
              <div>1</div>
            </template>
          </ApiCascader>
        </template>
      </vxe-column> -->
      <vxe-column field="date" title="操作">
        <template #default="{ row }">
          <a-button :class="{ btn_link_success: row.targetable_type === 4 }" type="link" @click="addSubProject(row, 'edit')">{{
            row.btnName
          }}</a-button>
          <a-button v-if="row.targetable_type === 3" @click="addSubProject(row, 'add')" type="link">添加</a-button>
          <a-popconfirm title="确认删除该数据?" ok-text="Yes" cancel-text="No" @confirm="delConfirm(row)">
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <a-pagination
      v-show="formState.total"
      class="a_pagination"
      v-model:current="formState.pages"
      v-model:pageSize="formState.pageSize"
      :total="formState.total"
      @change="pageChange"
      show-size-changer
      show-quick-jumper
    />
    <SubProject ref="subProject" @success="handleSuccess" />
    <Drawer @register="register" @success="drawerHandleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import ApiCascader from '@/components/Form/src/components/ApiCascader.vue';
  import Drawer from './examine/approveDetail.vue';
  import { message, Modal, Cascader } from 'ant-design-vue';

  import SubProject from './subProject.vue';
  import { CollapseSearchBar } from '/@/components/Business';
  import { userSchemaFn } from './config.ts';
  import { useDrawer } from '/@/components/Drawer';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const subProject = ref(null);

  const [register, { openDrawer }] = useDrawer();

  const changeModal = (val, title = 'add', compRef) => {
    compRef.value.setOpen(val, title);
  };
  const initForm = () =>
    reactive({
      pages: 1,
      pageSize: 20,
      total: 20,
      // company_id: +localStorage.getItem('companyId'),
    });

  let formState = initForm();

  const rowClassName = (record) => {
    let calssName = '';
    if (record.row.parent_id === 0) {
      calssName = 'parent_row';
    }
    if (record.row.targetable_type === 3) {
      calssName += ' project_row';
    }
    return calssName;
  };
  const treeConfig = reactive({
    transform: true,
    line: true,
    rowField: 'id',
    parentField: 'parentId',
    lazy: true,
    hasChild: 'has_sub',
    loadMethod({ row }) {
      // 异步加载子节点
      return fetchChildListApi(row);
    },
  });

  const fetchChildListApi = async (row) => {
    let data = await getTableList({ parent_id: row.id });
    return data;
  };

  const addMasterProject = (val, type) => {
    addSubProject({ company_id: localStorage.getItem('companyId') }, 'add');
  };
  const addSubProject = (row, type) => {
    if (type === 'edit' && row.targetable_type === 4) {
      //审批
      // let params = {
      //   path: '/project/approveDetail',
      //   query: {
      //     id: row.id
      //   },
      // };

      openDrawer(true, { company_id: row.company.id, form_id: row.targetable_id });
      // window.go(params);
    } else {
      //项目或子项目
      changeModal(row, type, subProject);
    }
  };
  const handleSuccess = (val, type) => {
    getTableList();
  };
  const drawerHandleSuccess = () => {
    reload();
  };
  const tableData = ref([]);
  const reset = () => {
    getTableList();
  };
  const colorObj = {
    已驳回: 'red',
    待审核: 'blue',
    已撤回: 'orange',
    已完成: 'green',
  };
  let typeObj = {
    3: '项目',
    31: '子项目',
    4: '审批',
  };
  const getTableList = async (child) => {
    let data = await window.http.get({
      url: '/work_center/project_api/list',
      params: child ? child : { ...formState },
    });
    console.log('[ records ]-160', data);

    data.records = data.records.map((v) => {
      let typeStatus = v.targetable_type === 3;
      let type = typeStatus && v.parent_id ? 31 : v.targetable_type;
      return {
        ...v,
        targetable_type_title: typeObj[type],
        alertType: typeStatus ? 'success' : 'info',
        btnName: typeStatus ? '编辑' : '审批',
        company_title: v.company?.title,
      };
    });
    if (!child) {
      formState.total = data.total;
      tableData.value = data.records;
    }
    return data.records;
  };
  const pageChange = (e) => {
    formState.pages = e;
    getTableList();
  };

  let { headerSchema, btnSchema } = userSchemaFn(formState, initForm, addMasterProject, getTableList);

  let schema = reactive([]);
  const delConfirm = async (row) => {
    let data = await window.http.post({
      url: '/work_center/project_api/del',
      data: { id: row.id },
    });
    getTableList();
  };
  onMounted(() => {
    getTableList();
  });
</script>
<style lang="less" scoped>
  .page {
    margin: 16px;
  }

  :deep(.row--level-0) {
    .col--tree-node {
      .vxe-tree--line-wrapper {
        display: none;
      }
    }
  }

  // border-top: 1px solid #000;
  :deep(.parent_row) {
    background-image: linear-gradient(var(--vxe-table-border-color), var(--vxe-table-border-color)),
      linear-gradient(var(--vxe-table-border-color), var(--vxe-table-border-color));
    background-repeat: no-repeat;
    background-size: var(--vxe-table-border-width) 100%, 100% var(--vxe-table-border-width);
    background-position: left bottom, left top;

    &:first-child {
      background: none;
    }
  }

  :deep(.project_row) {
    .col--tree-node {
      .vxe-tree--line-wrapper {
        .vxe-tree--line {
          //隐藏主项目与子项目链接
          // border: 0;
          // width: 0;
        }
      }
    }
  }
  .a_pagination {
    border: 1px solid #e8eaec;
    border-top: 0;
    text-align: right;
    padding: 10px;
    background-color: #fff;
  }
</style>
