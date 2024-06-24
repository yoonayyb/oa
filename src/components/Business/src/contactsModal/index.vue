<template>
  <div>
    <BasicModal @register="registerModal" v-bind="getBindValue" @ok="ok">
      <a-row :gutter="16">
        <template v-if="look">
          <a-col span="24">
            <div class="flex flex-wrap">
              <div v-for="(i, v) in resultList" :key="i.id" class="flex items-center">
                <div style="width: 3rem" class="flex flex-col justify-center items-center">
                  <!-- <img style="width: 32px;height: 32px;" src="@/assets/images/icon_role.png"> -->
                  <HeadImg :userInfo="{ name: i.name, avatar: i.avatar }" :size="32"></HeadImg>
                  <div style="width: 100%" class="text-gray-400 text-center truncate">{{ i.name }}</div>
                </div>

                <Icon v-if="v !== resultList.length - 1" size="20" icon="mingcute:right-line"></Icon>
              </div>
            </div>
          </a-col>
        </template>
        <template v-else>
          <a-col style="height: 462px" class="flex flex-col" :xs="{ span: 24 }" :sm="{ span: 12 }">
            <a-input-search v-model:value="searchValue" enter-button placeholder="搜索" @search="onSearch" />
            <ContactsList :checkedUser="checkedUser" @result="result" class="flex-1 min-h-0 overflow-auto" :list="list"> </ContactsList>
            <a-pagination
              v-model:current="pagetions.current"
              :pageSize="pagetions.pageNum"
              @change="pageChange"
              :total="pagetions.total"
              show-less-items
            />
          </a-col>
          <a-col :xs="{ span: 0 }" :sm="{ span: 12 }">
            <ContactsListResult @delItem="delItem" :list="resultList"></ContactsListResult>
          </a-col>
        </template>
      </a-row>
    </BasicModal>
  </div>
</template>
<script setup>
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { basicProps } from './props.js';
  import { message } from 'ant-design-vue';
  import { HeadImg } from '/@/components/Business';
  import Icon from '@/components/Icon/Icon.vue';
  import ContactsList from './contactsList.vue';
  import ContactsListResult from './ContactsListResult.vue';
  const props = defineProps(basicProps);
  const emits = defineEmits(['ok', 'register']);
  const getBindValue = computed(() => ({ ...useAttrs(), ...props }));
  console.log('getBindValue: ', getBindValue);

  const list = ref([]);
  const checkedUser = ref([]);
  watch(checkedUser, (newVal) => {
    console.log('newVal', newVal);
  });
  const resultList = ref([]);
  const parentData = ref({});
  const look = ref(false);
  const searchPrams = ref({});
  const optional_man_type = ref(1); // 1多选 0单选
  let company_id = router.currentRoute.value.query?.company_id || localStorage.getItem('companyId');
  const [registerModal, { closeModal, setModalProps }] = useModalInner((data) => {
    parentData.value = data;
    checkedUser.value = data.checked.map((v) => v.id);
    resultList.value = data.approves.length ? data.approves : data.checked;

    if (data.type === 7) {
      //表单内联系人特殊处理
      resultList.value = data.approves.length ? data.approves : data.contacts.map((v) => ({ name: v.label, id: v.value }));
    }
    //切换 查看全部
    look.value = data.look;
    //通过传过来的id 查询人员

    if (data.type === 2) {
      // 2发起人自选 optional_man_type:1多选 0单选
      optional_man_type.value = data.optional_man_type;
      searchPrams.value = { company_user_ids: data.regular_man_ids };
      if (data.selectRange === 3) {
        //selectRange :1全公司 2.指定成员 3.角色
        searchPrams.value = { company_role_ids: data.regular_man_ids };
      }
      getPerson();
    }

    console.log('data', data);
    console.log('searchPrams', searchPrams.value);
    // approve_mans.type !== 1 && getPerson()
  });
  const result = (ids) => {
    checkedUser.value = ids;
    console.log('checkedUser', checkedUser);

    resultList.value = list.value.filter((v) => ids.includes(v.id));
  };
  const delItem = (id) => {
    if (id.length) {
      checkedUser.value = [];
      resultList.value = [];
    } else {
      checkedUser.value = checkedUser.value.filter((v) => v !== id);

      resultList.value = resultList.value.filter((v) => v.id !== id);
    }
    console.log('resultList', resultList);
  };
  const ok = () => {
    if (optional_man_type.value === 0 && resultList.value.length > 1) {
      return message.error('限制单选，请重新选择');
    }
    parentData.value.checked = resultList.value;

    console.log('parentData.value', parentData.value);
    emits('ok', resultList);
  };
  const searchValue = ref();
  const pagetions = reactive({
    current: 1,
    pageNum: 15,
    total: 0,
  });
  const pageChange = (val) => {
    console.log(val);
    getPerson();
  };
  const onSearch = () => {
    pagetions.current = 1;
    getPerson();
  };
  const getPerson = async (name = '') => {
    console.log('[ getPerson ]-136');
    const { records, total } = await window.http.get({
      url: '/company_center/staff_api/select',
      params: {
        company_id,
        pageNum: pagetions.pageNum,
        pages: pagetions.current,
        name: searchValue.value,
        ...searchPrams.value,
      },
    });
    list.value = records;
    pagetions.total = total;

    console.log('list', list.value);
    // console.log('data', data)
    // console.log('checkedEmployessList', checkedEmploye
  };
  onMounted(() => {
    // getPerson()
  });
</script>
