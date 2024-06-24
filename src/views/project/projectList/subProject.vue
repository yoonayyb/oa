<template>
  <a-modal v-model:open="open" width="500px" :title="modalTitle" :centered="true" @ok="handleOk" @cancel="handleCancel">
    <!-- <template #title>  </template> -->
    <a-form style="padding:22px 0" :model="formState" :labelCol='{style:{width:"100px"}}' @finish="onFinish"
      @finishFailed="onFinishFailed" :colon='true'>
      <!-- v-if="formState.parent_id" -->
      <a-form-item label="类型" name="radio">
        <a-radio-group v-model:value="formState.type" @change="typeChange">
          <a-radio value="a">{{formState.btnName?'子':''}}项目</a-radio>
          <a-radio value="b">审批</a-radio>
        </a-radio-group>
      </a-form-item>
      <template v-if="formState.type==='a'">
        <a-form-item label="项目名称" name="title" required>
          <a-input v-model:value="formState.title" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="备注说明" name="describe">
          <a-textarea v-model:value="formState.describe" placeholder="请输入" :rows="5" />
        </a-form-item>
      </template>

      <template v-if="formState.type==='b'">
        <a-form-item label="模板分组">
          <a-select ref="select" v-model:value="formState.templateGroupId" style="width: 200px"
            :options="tempGroupOptions" placeholder="请选择" :field-names="{ label: 'title', value: 'id' }"
            @change="handleChange">
          </a-select>
        </a-form-item>
        <a-row class="project_type">

          <!-- :class="{blue_border:item.checked}" -->
          <a-col class="project_type_item" :span="5" v-for="(item,index) in tempInfoOptions" :key="item.id"
            @click="clickChecked(item,index)">
            <!-- <Icon class="icon" :icon='item.icon'></Icon>
            <div class="inline-block min-w-12"> {{item.title}}</div> -->
            <a-button :type="item.checked?'primary':'default'">
              <a-tooltip>
                <template #title>{{item.title}}</template>
                <div class="item_title ellipsis inline-block ">
                  <Icon class="icon" :icon='item.icon'></Icon>
                  {{item.title}}
                </div>
              </a-tooltip>
            </a-button>
          </a-col>
        </a-row>
      </template>

    </a-form>
  </a-modal>
</template>

<script lang='ts' setup>
  import { message } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  defineExpose({
    async setOpen(row, title) {
      open.value = true;

      formState.company_id = row.company?.id || row.company_id,
        await getTempGroup();
      let form = { ...row };

      console.log('form: ', form)
      if (title === 'add') {
        form = {
          // ...form,
          parent_id: row.id || 0,
          id: '', //如果是新增需要清空
          title: '',
          describe: '',
          btnName: form.btnName
        };
      }
      formState = Object.assign(formState, {
        ...form,
        company_id: row.company?.id || row.company_id,
      });
      console.log('[ formState ]-51', formState);
      modalTitle.value = titleObj[title];
      titleVal.value = title;
    },
  });
  const emit = defineEmits(['success']);
  interface FormState {
    type: string;
    form_template_id: Number;
  }
  const open = ref(false);
  const modalTitle = ref('添加');
  const titleVal = ref('');

  const titleObj = {
    add: '添加',
    edit: '编辑',
  };

  const tempGroupOptions = ref([]);
  const getTempGroup = async () => {
    let result = await window.http.get({
      url: '/work_center/form_group_api/select',
      params: {
        company_id: formState.company_id,
      },
    });
    tempGroupOptions.value = result;
    return result;
  };
  const tempInfoOptions = ref([]);

  const clickChecked = (item, index) => {
    tempInfoOptions.value = tempInfoOptions.value.map((v, i) => ({
      ...v,
      checked: i === index,
    }));
  };
  const getTempInfoOptions = async (params) => {
    let result = await window.http.get({
      url: '/work_center/form_tpl_api/select',
      params,
    });
    tempInfoOptions.value = result;
    return tempInfoOptions.value;
  };

  const initForm = () =>
    reactive({
      type: 'a',
    });
  let formState = initForm();
  const submitForApproval = async (form_template_id) => {
    console.log('[ form_template_id ]-96', form_template_id);
    let params = {
      path: '/project/approvePage',
      query: {
        id: form_template_id,
        company_id: formState.company_id,
        parent_id: titleVal.value === 'add' ?
          formState.parent_id : formState.id
      },
    };
    window.go(params);
  };
  const submitSubProjects = async () => {
    let data = {
      ...formState,
    };
    let result = await window.http.post({
      url: '/work_center/project_api/save_regular_project',
      data,
    });
  };
  const handleOk = async (e) => {
    try {
      console.log('[ formState.type ]-120', formState.type);
      if (formState.type === 'a') {
        await submitSubProjects();
        message.success('成功');
        emit('success');
      }
      if (formState.type === 'b') {
        let form_template_id = tempInfoOptions.value.find((v) => v.checked)?.id;
        if (!form_template_id) {
          message.error('请选择审批模板');
          return false;
        }
        await submitForApproval(form_template_id);
      }

      open.value = false;
    } catch (error) {
      console.log('[ error ]-132', error);
    } finally {}
  };
  const handleCancel = (e) => {
    formState = initForm();
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  const handleChange = (e) => {
    // console.log('[ e ]-87', e);
    getTempInfoOptions({
      form_template_group_id: e,
      company_id: formState.company_id
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const typeChange = (e) => {
    console.log('[ e ]-80', e);
  };
</script>

<style lang='less' scoped>
  .radio_group {
    width: 100%;

    :deep( .ant-radio-button-wrapper) {
      width: 33%;
      text-align: center;
    }
  }

  .icon {
    width: 15px;
    vertical-align: text-bottom;
  }

  .project_type {
    .project_type_item {
      padding: 0;
      margin-bottom: 10px;

      .ant-btn {
        padding: 0 !important;
      }

      .item_title {
        padding-left: 5px;
        text-align: left;
        width: 80px;
      }
    }

    .blue_border {
      // background-color: rgba(0, 121, 255, 1);
      border: 1px solid rgba(0, 121, 255, 1);
      // color: #fff;
    }
  }
</style>
