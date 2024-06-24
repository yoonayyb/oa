<template>
  <a-drawer :append-to-body="true" :title="(approverConfig.type==2?'抄送人':'审批人')+'设置'" v-model:open="visible"
    class="set_promoter" :show-close="false" :width="550" :before-close="saveApprover">
    <div class="demo-drawer__content">
      <div class="drawer_content">
        <a-row class="my-4">
          <a-col>
            <div class="mb-2">审批类型：</div>
            <a-radio-group size="large" v-model:value="approverConfig.approverType">
              <a-radio :value="1">人工审批</a-radio>
              <!-- <a-radio :value="2">自动通过</a-radio>
              <a-radio :value="3">自动拒绝</a-radio> -->
            </a-radio-group>
          </a-col>
        </a-row>
        <a-card v-if="approverConfig.approverType === 1" title="请选择该节点审批人">
          <a-row justify="center">
            <a-col span="8">
              <Icon icon="material-symbols:person"></Icon>
              <span class="mb-2 inline-block">常用审批人</span>
              <a-radio-group size="large" v-model:value="approverConfig.settype" class="clear inline-block! border-b-1"
                style="border-bottom: 1px solid #f2f2f2;" @change="changeType">
                <a-radio class="w33 mb-2" v-for="({value, label}) in setTypes" :key="value"
                  :value="value">{{label}}</a-radio>
              </a-radio-group>

            </a-col>
            <a-col span="8">
              <Icon icon="flat-color-icons:manager"></Icon>

              <span class="mb-2 inline-block">主管</span>

              <a-radio-group v-model:value="approverConfig.settype" class="clear inline-block! border-b-1"
                style="border-bottom: 1px solid #f2f2f2;" @change="changeType">
                <a-radio class="w33 mb-2" v-for="({value, label}) in manager" :key="value"
                  :value="value">{{label}}</a-radio>
              </a-radio-group>

            </a-col>
            <a-col span="8">
              <Icon icon="icon-park-outline:other"></Icon>

              <span class="mb-2 inline-block">其他</span>

              <a-radio-group v-model:value="approverConfig.settype" class="clear  inline-block! border-b-1"
                style="border-bottom: 1px solid #f2f2f2;" @change="changeType">
                <a-radio :disabled="formConfig.form_type === 0 && value===9" class="w33 mb-2"
                  v-for="({value, label}) in other" :key="value" :value="value">{{label}}</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
          <div class="mt-2">{{setTypesName}}</div>
          <a-button class="my-2 ml-0! " type="primary" @click="addApprover"
            v-if="approverConfig.settype==1">添加/修改成员</a-button>
          <!-- <p class="selected_list" v-if="approverConfig.settype==1">
            <span v-for="(item,index) in  approverConfig.nodeUserList" :key="index">{{item.name}}
              <img src="@/assets/images/add-close1.png"
                @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
            </span>
            <a v-if="approverConfig.nodeUserList.length!=0" @click="approverConfig.nodeUserList=[]">清除</a>
          </p> -->
          <p v-if="approverConfig.settype==1" class="selected_list"
            v-for="(item,index) in mergeByCompanyId(approverConfig.nodeUserList) " :key="index">


            <a-button type="link" v-if="item?.[0]?.companyName">
              <span style="border: none !important;padding: 0;margin: 0;"> {{item[0].companyName}} </span>

            </a-button>
          <div>
            <span v-for="(c,v) in item" :key="v">{{c.name}}
              <img src="@/assets/images/add-close1.png"
                @click="$func.removeEle(approverConfig.nodeUserList,c,'targetId')">
            </span>
             <a v-if="item.length!=0" @click="$func.removeItem(approverConfig.nodeUserList,item,'companyId')">清除</a>
          </div>
         
          </p>
          <div class="approver_manager" v-if="approverConfig.settype==2 ||approverConfig.settype==3  ">
            <p>
              <span>发起人的：</span>
              <select v-model="approverConfig.directorLevel">
                <option v-for="item in directorMaxLevel" :value="item" :key="item">{{item==1?'直接':'第'+item+'级'}}主管
                </option>
              </select>
            </p>
            <p v-if="approverConfig.settype == 3"> <a-checkbox v-model:checked="approverConfig.beforManager"> <span
                  class="text-amber-500">找不到主管时，由上级主管代审批</span> </a-checkbox> </p>
          </div>
          <div class="approver_self" v-if="approverConfig.settype==5">
            <p>该审批节点设置“发起人自己”后，审批人默认为发起人</p>
          </div>
          <div class="approver_self_select" v-show="approverConfig.settype==4">
            <a-radio-group v-model:value="approverConfig.selectMode" style="width: 100%;">
              <a-radio v-for="({value, label}) in selectModes" :value="value" :key="value">{{label}}</a-radio>
            </a-radio-group>
            <h3>选择范围</h3>
            <a-radio-group v-model:value="approverConfig.selectRange" style="width: 100%;" @change="changeRange">
              <a-radio v-for="({value, label}) in selectRanges" :value="value" :key="value">{{label}}</a-radio>
            </a-radio-group>
            <template v-if="approverConfig.selectRange==2||approverConfig.selectRange==3">
              <a-button type="primary" @click="addApprover" v-if="approverConfig.selectRange==2">添加/修改成员</a-button>
              <a-button type="primary" @click="addRoleApprover" v-else>添加/修改角色</a-button>
              <!-- <p class="selected_list">
                <span v-for="(item,index) in approverConfig.nodeUserList" :key="index"> {{item.name}}
                  <img src="@/assets/images/add-close1.png"
                    @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                </span>
                <a v-if="approverConfig.nodeUserList.length!=0&&approverConfig.selectRange!=1"
                  @click="approverConfig.nodeUserList=[]">清除</a>
              </p> -->
              <p v-if="approverConfig.selectRange==2" class="selected_list"
                v-for="(item,index) in mergeByCompanyId(approverConfig.nodeUserList)" :key="index">


                <a-button type="link" v-if="item?.[0]?.companyName">
                  <span style="border: none !important;padding: 0;margin: 0;"> {{item[0].companyName}} </span>

                </a-button>
                <div>
                <span v-for="(c,v) in item" :key="v">{{c.name}}
                  <img src="@/assets/images/add-close1.png"
                    @click="$func.removeEle(approverConfig.nodeUserList,c,'targetId')">
                </span>
                <a v-if="item.length!=0" @click="$func.removeItem(approverConfig.nodeUserList,item,'companyId')">清除</a>
                </div>
              </p>
              <p v-else class="selected_list">
                <span v-for="(item,index) in approverConfig.nodeUserList" :key="index"> {{item.name}}
                  <img src="@/assets/images/add-close1.png"
                    @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                </span>
                <a v-if="approverConfig.nodeUserList.length!=0&&approverConfig.selectRange!=1"
                  @click="approverConfig.nodeUserList=[]">清除</a>
              </p>
            </template>

          </div>
          <div class="approver_manager" v-if="approverConfig.settype==7 || approverConfig.settype==6">
            <template v-if="approverConfig.settype==6">
              <p>审批终点</p>
              <p style="padding-bottom:20px">
                <a-radio-group v-model:value="approverConfig.approverEnd" style="width: 100%;">

                  <a-flex vertical justify="start">
                    <a-radio :value="1" :key="1">
                      <div>指定角色(同时是 <span class="text-cyan-500">主管线上的主管</span> )</div>

                      <a-button type="primary" @click="addRoleApprover">添加/修改角色</a-button>
                      <p class="selected_list mt-3">
                        <span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.name}}
                          <img src="@/assets/images/add-close1.png"
                            @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                        </span>
                        <a v-if="approverConfig.nodeUserList.length!=0&&approverConfig.selectRange!=1"
                          @click="approverConfig.nodeUserList=[]">清除</a>
                      </p>

                    </a-radio>
                    <a-radio :value="2" :key="2">通讯录中的</a-radio>
                    <select v-if="approverConfig.approverEnd === 2" v-model="approverConfig.directorLevel">
                      <option v-for="item in addressBookMaxLevel" :value="item" :key="item">
                        {{item==1?'最高层级':'第'+item+'级'}}主管
                      </option>
                    </select>
                  </a-flex>



                </a-radio-group>
              </p>
            </template>
            <template v-if="approverConfig.settype==7">
              <a-button type="primary" @click="addRoleApprover">添加/修改角色</a-button>
              <p class="selected_list mt-3">
                <span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.name}}
                  <img src="@/assets/images/add-close1.png"
                    @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                </span>
                <a v-if="approverConfig.nodeUserList.length!=0&&approverConfig.selectRange!=1"
                  @click="approverConfig.nodeUserList=[]">清除</a>
              </p>
            </template>

          </div>

          <div class="approver_some" v-if="approverConfig.settype==8">
            <a-select label-in-value mode="multiple" style="width: 100%" v-model:value="approverConfig.contacts"
              how-search :options="approverConfig.contactsOptions">

            </a-select>

          </div>
          <div class="approver_some"
            v-if=" ((approverConfig.settype==1&&approverConfig.nodeUserList.length>1)||approverConfig.settype==3|| approverConfig.settype==9 ||approverConfig.settype==7||approverConfig.settype==8||(approverConfig.settype==4&&approverConfig.selectMode==2))">
            <p>多人审批时采用的审批方式</p>
            <a-radio-group v-model:value="approverConfig.examineMode" class="clear">
              <!-- <a-radio :value="0">依次审批(按顺序同意或拒绝)</a-radio>
              <br /> -->
              <a-radio :value="0">会签(需要所有审批人都同意才可通过)</a-radio>
              <br />
              <a-radio :value="1">或签(其中一名审批人员同意或拒绝即可)</a-radio>
            </a-radio-group>
          </div>
          <div class="approver_some"
            v-if=" (approverConfig.settype==2||approverConfig.settype==8|| approverConfig.settype==9 || approverConfig.settype==3||approverConfig.settype==7 ||approverConfig.settype==6)">
            <p>审批人为空时</p>
            <a-radio-group v-model:value="approverConfig.noHanderAction" class="clear">
              <a-radio :value="0">自动通过</a-radio>
              <br />
              <!-- <a-radio :value="1">转交给审核管理员</a-radio>
              <br /> -->
              <a-radio :value="2">指定人员审批</a-radio>
            </a-radio-group>
            <template v-if="approverConfig.noHanderAction==2">
              <a-button class="my-2 ml-0! " type="primary" @click="addApprover(1)">添加/修改成员</a-button>
              <!-- <p class="selected_list">
                <span v-for="(item,index) in approverConfig.pointNodeUserList" :key="index">{{item.name}}
                  <img src="@/assets/images/add-close1.png"
                    @click="$func.removeEle(approverConfig.pointNodeUserList,item,'targetId')">
                </span>
                <a v-if="approverConfig.pointNodeUserList.length!=0" @click="approverConfig.pointNodeUserList=[]">清除</a>
              </p> -->
              <p class="selected_list" v-for="(item,index) in mergeByCompanyId(approverConfig.pointNodeUserList) "
                :key="index">


                <a-button type="link" v-if="item?.[0]?.companyName">
                  <span style="border: none !important;padding: 0;margin: 0;"> {{item[0].companyName}} </span>

                </a-button>
                <div>
                <span v-for="(c,v) in item" :key="v">{{c.name}}
                  <img src="@/assets/images/add-close1.png"
                    @click="$func.removeEle(approverConfig.pointNodeUserList,c,'targetId')">
                </span>
                <a v-if="item.length!=0"
                  @click="$func.removeItem(approverConfig.pointNodeUserList,item,'companyId')">清除</a>
                  </div>
              </p>
            </template>
          </div>

        </a-card>



      </div>
      <div class="demo-drawer__footer clear">
        <a-button type="primary" @click="saveApprover">确 定</a-button>
        <a-button @click="closeDrawer">取 消</a-button>
      </div>
      <employees-dialog :isDepartment="true" v-model:visible="approverVisible" :data="checkedList"
        @change="sureApprover" />
      <role-dialog v-model:visible="approverRoleVisible" :data="checkedRoleList" @change="sureRoleApprover" />
      <errorDialog v-model:visible="tipVisible" :list="tipList" />
    </div>
  </a-drawer>
</template>
<script setup>
  import { ref, watch, computed } from 'vue'
  import $func from '@/utils/workIndex'
  import { setTypes, selectModes, selectRanges, manager, other, } from '@/utils/const'
  import { useStore } from '@/store/modules/workIndex'
  import employeesDialog from '../dialog/employeesDialog.vue'
  import roleDialog from '../dialog/roleDialog.vue'
  import errorDialog from "../dialog/errorDialog.vue"
  import
  Icon
  from '/@/components/Icon/icon.vue';
  import { message } from 'ant-design-vue';
  let props = defineProps({
    directorMaxLevel: {
      type: Number,
      default: 0
    },
    addressBookMaxLevel: {
      type: Number,
      default: 0
    },
    workFlowData: {
      type: Object,
      default: () => {}
    },
    nodeConfig: {
      type: Object,
      default: () => {}
    },
    sorts: {
      type: Array,
      default: () => []
    },
  });
  const emits = defineEmits(['upload', 'setFormData'])
  const formConfig = inject('formConfig')
  let approverConfig = ref({

  })
  let tipList = ref([])
  let tipVisible = ref(false)
  let approverVisible = ref(false)
  let approverRoleVisible = ref(false)
  let checkedRoleList = ref([])
  let checkedList = ref([])
  let store = useStore()
  let { setApproverConfig, setApprover, setCopyerConfig } = store
  let approverConfig1 = computed(() => store.approverConfig1)
  let approverDrawer = computed(() => store.approverDrawer)
  let visible = computed({
    get() {

      if (approverDrawer.value) {

      }
      return approverDrawer.value
    },
    set() {
      closeDrawer()
    }
  })

  onMounted(() => {

    // contactsOptions
  })


  const tabs = [...setTypes, ...manager, ...other]
  const setTypesName = computed(() => tabs.find(v => v.value === approverConfig.value.settype)?.label || '')


  watch(() => props.sorts, (val) => {

    // approverConfig.value = val.value


  })
  const pagetions = reactive({
    current: 1,
    pageNum: 15,
    total: 0
  })
  const getPerson = async (name = '') => {

    const { records, total } = await window.http.get({
      url: '/company_center/staff_api/select',
      params: {
        company_id: localStorage.getItem('companyId'),
        pageNum: pagetions.pageNum,
        pages: pagetions.current,
        name,
      }
    })
    pagetions.total = total
    return records
    // 
    // console.log('checkedEmployessList', checkedEmploye

  }

  // const fetching = ref(false);

  // const handleSearch = async (value = '') => {
  //   fetching.value = true;
  //   // 模拟异步加载数据
  //   pagetions.current = 1
  //   approverConfig.value.contactsOptions = await getPerson(value)

  //   if (approverConfig.value.contactsOptions.length) {
  //     fetching.value = false;
  //   }


  // };

  // const handlePopupScroll = async (e) => {

  //   // 判断是否滚动到底部
  //   if (pagetions.total === approverConfig.value.contactsOptions.length) return
  //   const { scrollTop, scrollHeight, clientHeight } = e.target
  //   if (scrollTop + 2 + clientHeight >= scrollHeight) {
  //     // 触发加载更多数据的操作
  //     // 这里可以根据需要调用加载更多数据的方法
  //     pagetions.current++
  //     let data = await getPerson()
  //     if (data.length)
  //       approverConfig.value.contactsOptions = [...approverConfig.value.contactsOptions, ...data]

  //   }
  // };
  const mergeByCompanyId = (arr) => {
    const map = {};

    // 遍历原始数组，按照 companyId 将元素分组存储在 map 中
    for (const obj of arr) {
      if (!obj.hasOwnProperty('companyId')) {
        return arr; // 如果某个元素缺少 companyId 属性，则返回原数组
      }

      const companyId = obj.companyId;

      if (!map[companyId]) {
        map[companyId] = [];
      }

      map[companyId].push(obj);
    }

    // 将分组后的数组合并为结果数组
    const result = Object.values(map);

    return result;
  }
  watch(approverConfig1, async (val) => {
    approverConfig.value = val.value
    console.log('approverConfig.value: ', approverConfig.value)
    // if (approverConfig.value.nodeUserList.length) {

    //   approverConfig.value.nodeUserList = mergeByCompanyId(approverConfig.value.nodeUserList)

    // }
    // if (approverConfig.value.pointNodeUserList.length) {
    //   approverConfig.value.pointNodeUserList = mergeByCompanyId(approverConfig.value.pointNodeUserList)

    // }
    const arr = formConfig?.value?.payload?.schemas.filter(v => v.contactsType === 'contactsOptions')
    if (arr?.length) {
      pagetions.current = 1
      approverConfig.value.contactsOptions = arr.map(v => ({
        label: v.label,
        value: v
          .field
      })) // await getPerson() 





    } else {
      approverConfig.value.contactsOptions = []
    }

  })
  let changeRange = () => {
    approverConfig.value.nodeUserList = [];
  }
  const changeType = (val) => {
    approverConfig.value.nodeUserList = [];
    approverConfig.value.pointNodeUserList = [];
    approverConfig.value.examineMode = 0;
    approverConfig.value.noHanderAction = 0;


    if (val == 2) {
      approverConfig.value.directorLevel = 1;
    } else if (val == 4) {
      approverConfig.value.selectMode = 1;
      approverConfig.value.selectRange = 1;
    } else if (val == 7) {
      approverConfig.value.examineEndDirectorLevel = 1
    }
  }
  const addApprover = (type) => {
    approverVisible.value = true;
    checkedList.value = type === 1 ? approverConfig.value.pointNodeUserList : approverConfig.value.nodeUserList
  }
  const addRoleApprover = () => {
    approverRoleVisible.value = true;
    checkedRoleList.value = approverConfig.value.nodeUserList
  }
  const sureApprover = (data) => {

    // if ( approverConfig.value.settype == 2 && approverConfig.value.noHanderAction == 2) { //指定人员审批
    //   approverConfig.value.pointNodeUserList = data;
    //   if (approverConfig.value.settype == 2) {
    //     approverConfig.value.nodeUserList = data;
    //   }

    // } else {

    //   approverConfig.value.nodeUserList = data;
    //   approverConfig.value.pointNodeUserList = [];
    // }
    // data = mergeByCompanyId(data)

    if (approverConfig.value.settype == 7 && approverConfig.value.noHanderAction == 2) { //角色、指定人员
      approverConfig.value.pointNodeUserList = data;

    } else if (approverConfig.value.settype == 2 && approverConfig.value.noHanderAction == 2) { //直接主管、指定人员
      approverConfig.value.pointNodeUserList = data;
    } else if (approverConfig.value.settype == 3 && approverConfig.value.noHanderAction == 2) { //部门主管、指定人员
      approverConfig.value.pointNodeUserList = data;
    } else if (approverConfig.value.settype == 6 && approverConfig.value.noHanderAction == 2) { //连续多级主管、指定人员
      approverConfig.value.pointNodeUserList = data;
    } else if (approverConfig.value.settype == 8 && approverConfig.value.noHanderAction == 2) { //表单内的联系人、指定人员
      approverConfig.value.pointNodeUserList = data;
    } else if (approverConfig.value.settype == 9 && approverConfig.value.noHanderAction == 2) { //表单内的联系人、指定人员
      approverConfig.value.pointNodeUserList = data;
    } else {
      approverConfig.value.nodeUserList = data;
    }

    // approverConfig.value.nodeUserList = data;
    approverVisible.value = false;
  }
  const sureRoleApprover = (data) => {
    approverConfig.value.nodeUserList = data;
    approverRoleVisible.value = false;
  }
  const setType = (settype) => {
    let type = 0 // 指定成员
    if (settype == 2) type = 4 //直属主管
    if (settype == 3) type = 5 //部门主管
    if (settype == 4) type = 2 //发起人自选
    if (settype == 5) type = 1 //发起人自己
    if (settype == 6) type = 6 //连续多级主管
    if (settype == 7) type = 3 //角色
    if (settype == 8) type = 7 //表单内联系人
    if (settype == 9) type = 8 //出库发货人
    return type
  }

  const reErr = ({ error, nodeName, type, childNode }) => {
    if (error) {
      tipList.value.push({
        name: nodeName,
        type: ["", "审核人", "抄送人"][type],
      })
    }
    if (childNode) {
      reErr(childNode)
    }
  }
  const saveApprover = () => {

    approverConfig.value.error = !$func.setApproverStr(approverConfig.value)

    tipList.value = []
    reErr(approverConfig.value)



    if (tipList.value.length != 0) {
      tipVisible.value = true
      return
    }

    // return message.error('请选择')
    // 
    // const filterObj = (obj, approveObj) => {
    //   const { approve_man_id, type } = obj // type 0发起人
    //   if (type != 0) { //过滤掉发起人
    //     if (approve_man_id && approve_man_id === approveObj?.approve_man_id || !
    //       approve_man_id) { //新增的时候还没有approve_man_id
    //       const { approve_man_id, childNode, ...v } = approveObj
    //       obj = Object.assign(obj, v, { tag: true })

    //     } else {
    //       obj.tag = false
    //     }

    //   }
    //   if (obj.childNode) {
    //     filterObj(obj.childNode, approveObj)
    //   }

    // }
    // filterObj(props.workFlowData.nodeConfig, approverConfig.value)
    // 



    const { childNode, ...current } = approverConfig.value


    let paramsArr = {
      approve_man_id: approverConfig.value.approve_man_id || 0,
      form_template_id: formConfig.value.id,
      type: setType(approverConfig.value.settype),
      regular_man_ids: approverConfig.value.nodeUserList.map(v => v.targetId).join(','),
      optional_man_type: approverConfig.value.selectMode == 1 ? 0 : 1,
      company_role_ids: approverConfig.value.nodeUserList.map(v => v.targetId).join(','),
      condition: approverConfig.value.examineMode,
      man_empty_condition: approverConfig.value.noHanderAction,
      man_empty_regular_man_ids: approverConfig.value.pointNodeUserList && approverConfig.value.pointNodeUserList
        .map(v =>
          v.targetId).join(
          ',') || '',
      action_type: approverConfig.value.type == 2 ? 0 : 1,
      /* company_department_level settype=3是部门主管直接传directorLevel,连续多级主管的时候approverEnd = 2才传directorLevel*/
      company_department_level: approverConfig.value.settype == 3 ? approverConfig.value.directorLevel :
        approverConfig.value
        .approverEnd == 2 ? approverConfig.value.directorLevel : 0,
      company_department_bubble: Number(approverConfig.value.beforManager),
      company_department_end_type: approverConfig.value.approverEnd == 1 ? 0 : 2,
      form_contact_identify: approverConfig.value.contacts && approverConfig.value.contacts.map(v => v.value).join(
        ','),
      meta: JSON.stringify(current)
    }



    // return
    window.http.post({
      url: '/work_center/form_tpl_api/save_line_man',
      data: paramsArr
    }).then(async res => {
      message.success('success')
      if (approverConfig.value.type == 1) {
        approverConfig.value.error = !$func.setApproverStr(approverConfig.value)
        // setApproverConfig({
        //   // approverType:approverConfig.approverType
        //   value: approverConfig.value,
        //   flag: true,
        //   id: approverConfig1.value.id
        // })
      } else if (approverConfig.value.type == 2) {
        // approverConfig.value.ccSelfSelectFlag = ccSelfSelectFlag.value.length == 0 ? 0 : 1;
        // approverConfig.value.error = !$func.copyerStr(approverConfig.value);
        approverConfig.value.error = !$func.setApproverStr(approverConfig.value)
        // setCopyerConfig({
        //   value: approverConfig.value,
        //   flag: true,
        //   id: approverConfig1.value.id
        // })
      }
      if (setType(approverConfig.value.settype) === 7) { //表单内联系人选中之后 重新赋值 提交一次表单模板 
        // emits('setFormData', approverConfig.value.contacts)
      }
      const { approve_man_id, approve_line_id } = res
      if (approverConfig.value.approve_man_id) { //编辑不用重新排序
        emits('upload')
        closeDrawer()
        return
      }
      //新增、插入都要重新排序
      approverConfig.value.id = approve_line_id
      approverConfig.value.approve_man_id = approve_man_id
      // let index = approve_line_id
      // let sorts = []
      // const setOrderBy = (obj) => {

      //   if (obj.childNode && Object.keys(obj.childNode).length) {
      //     index = obj.childNode.approve_man_id + index

      //     setOrderBy(obj.childNode)
      //   } else {
      //     index = index++
      //   }
      //   sorts.push({
      //     id: obj.id,
      //     order_by: index
      //   })
      // }


      // if (!Object.keys(approverConfig.value.childNode).length) { // 如果是插入最后的话 sorts要比上一条大
      //   sorts = [{
      //     id: approve_line_id,
      //     order_by: props.sorts[0].order_by++
      //   }]
      // } else {
      //   setOrderBy(approverConfig.value)
      // }
      const setOrderBy = (obj) => {

        sorts.push({
          id: obj.id,
          order_by: index++
        });
        if (obj.childNode && Object.keys(obj.childNode).length) {
          setOrderBy(obj.childNode)
        }
        // return currentIndex;
      };

      let sorts = [];
      let index = approve_line_id;

      // const processApproverConfig = (config) => {
      //   const finalIndex = setOrderBy(config, index);
      //   sorts.push({
      //     id: config.id,
      //     order_by: finalIndex
      //   });
      //   if (config.childNode) {
      //     processApproverConfig(config.childNode);
      //   }
      // };

      const { childNode = {} } = approverConfig.value

      if (!Object.keys(childNode).length) {
        // 如果是插入最后的话 sorts要比上一条大
        sorts = [{
          id: approve_line_id,
          order_by: props.sorts[0]?.order_by ? (props.sorts[0]?.order_by + 1) : 0
        }];
      } else {
        index = childNode.approve_man_id
        setOrderBy(approverConfig.value)
        // const finalIndex = setOrderBy(approverConfig.value, index);
        // sorts.push({
        //   id: approverConfig.value.id,
        //   order_by: finalIndex
        // });
        // processApproverConfig(approverConfig.value)
      }


      //排序
      window.http.post({
        url: '/work_center/form_tpl_api/set_order_by',
        data: {
          form_template_id: formConfig.value.id, //模板id
          sorts
        }
      }).then(res => {
        emits('upload')
        closeDrawer()
      })

    })


  }
  const closeDrawer = () => {
    setApprover(false)
  }
</script>
<style lang="less" scoped>
  .selected_list {}

  .set_promoter {
    .approver_content {
      padding-bottom: 10px;
      border-bottom: 1px solid #f2f2f2;
    }

    .approver_self_select,
    .approver_content {
      .ant-button {
        // margin-bottom: 20px;
      }
    }

    .approver_content,
    .approver_some,
    .approver_self_select {
      .ant-radio-group {
        display: unset;
      }

      .ant-radio {
        // width: 27%;
        // margin-bottom: 20px;
        // height: 16px;
      }
    }

    .approver_manager p {
      line-height: 32px;
    }

    .approver_manager select {
      width: 300px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(217, 217, 217, 1);
      margin-top: 10px;
    }

    .approver_manager p.tip {
      margin: 10px 0 22px 0;
      font-size: 12px;
      line-height: 16px;
      color: #f8642d;
    }

    .approver_self {
      padding: 28px 20px;
    }

    .approver_self_select,
    .approver_manager,
    .approver_content,
    .approver_some {
      padding: 20px 20px 0;
    }

    .approver_manager p:first-of-type,
    .approver_some p {
      line-height: 19px;
      font-size: 14px;
      margin-bottom: 14px;
    }

    .approver_self_select h3 {
      margin: 5px 0 20px;
      font-size: 14px;
      font-weight: bold;
      line-height: 19px;
    }
  }
</style>
