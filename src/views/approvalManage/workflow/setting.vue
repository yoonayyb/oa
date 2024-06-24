<template>
  <div class="workFlow" style="width:100%">
    <div class="fd-nav">
      <div class="fd-nav-left">
        <!-- <div class="fd-nav-back" @click="toReturn">
          <i class="anticonyyb anticonyyb-left"></i>
        </div> -->
        <div class="fd-nav-title">{{ workFlowDef.name }}</div>
      </div>
      <div class="fd-nav-right">

        <button type="primary" class=" antyyb-btn button-publish" @click="saveSet()">
          <span>发 布</span>
        </button>
      </div>
    </div>
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div class="zoom-out" :class="nowVal == 50 && 'disabled'" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div class="zoom-in" :class="nowVal == 300 && 'disabled'" @click="zoomSize(2)"></div>
        </div>
        <div class="box-scale" :style="`transform: scale(${ nowVal / 100});`">
          <nodeWrap @changeNodeConfig="changeNodeConfig" v-model:nodeConfig="nodeConfig"
            v-model:flowPermission="flowPermission" />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <errorDialog v-model:visible="tipVisible" :list="tipList" />
    <promoterDrawer />
    <approverDrawer @setFormData="setFormData" v-model:nodeConfig="nodeConfig" @upload="upload" :sorts="sorts"
      :workFlowData="workFlowData" :directorMaxLevel="directorMaxLevel" :addressBookMaxLevel="addressBookMaxLevel" />

    <!-- <copyerDrawer /> -->
    <conditionDrawer />
  </div>
</template>

<script setup>
  import nodeWrap from '@/views/approvalManage/workflow/components/nodeWrap.vue'
  import { ref, onMounted } from "vue"
  import { useRoute } from 'vue-router'
  // import { ElMessage } from 'element-plus'
  import { message } from 'ant-design-vue';
  import { getWorkFlowData, setWorkFlowData } from '@/api/index'
  import { useUserStoreWithOut } from '@/store/modules/workIndex'
  import errorDialog from "./components/dialog/errorDialog.vue"
  import promoterDrawer from "./components/drawer/promoterDrawer.vue"
  import approverDrawer from "./components/drawer/approverDrawer.vue"
  import copyerDrawer from "./components/drawer/copyerDrawer.vue"
  import conditionDrawer from "./components/drawer/conditionDrawer.vue"


  const emits = defineEmits(['handleFormSave'])
  let { setTableId, setIsTried } = useUserStoreWithOut()

  let tipList = ref([])
  let tipVisible = ref(false)
  let nowVal = ref(100)
  let processConfig = ref({})
  let nodeConfig = ref({})
  let workFlowDef = ref({})
  let flowPermission = ref([])
  let directorMaxLevel = ref(0)
  let addressBookMaxLevel = ref(0)
  let workFlowData = reactive({})
  const sorts = ref([])
  const formConfig = inject('formConfig')
  const detail = ref()
  onMounted(async () => {


    setIsTried(false)
    upload()
  })
  const upload = async () => {
    let route = useRoute()
    sorts.value = []
    let data = await window.http.get({
      url: '/work_center/form_tpl_api/get_line',
      params: {
        form_template_id: formConfig.value.id
      }
    })
    let arrid
    const { data: aa } = await getWorkFlowData()
    workFlowData = aa
    if (!data.length) {
      // const { data: aa } = await getWorkFlowData({ workFlowDefId: route.query.workFlowDefId })

      // workFlowData = aa

    } else {


      for (let i = data.length - 1; i >= 0; i--) {
        const obj = data[i].meta && JSON.parse(data[i].meta)
        obj.error = false
        obj.approve_man_id = data[i].targetable_id
        obj.id = data[i].id
        sorts.value.push({
          id: obj.id,
          order_by: data[i].order_by
        })
        data[i].meta = obj
        if (data[i - 1]) {
          const { childNode, ...v } = obj
          data[i - 1].childNode = childNode || obj
        }

      }
      const arr = data.map(v => {

        return v.meta


      })

      for (let i = arr.length - 1; i >= 0; i--) {
        arr[i].error = false

        if (arr[i - 1]) {
          const { childNode, ...v } = arr[i]
          arr[i - 1].childNode = arr[i]
        } else {
          arr[0].childNode = arr[1]
        }

      }


      workFlowData.nodeConfig.childNode = data[0].meta



      // arrid = data.map(v => v.targetable_id)

      // let index = 0
      // const filterObj = (obj) => {
      //   let { childNode, ...val } = obj || {}
      //   if (obj.type != 0) {
      //     obj.approve_man_id = arrid[index]
      //     obj.id = 
      //     index++
      //   }
      //   if (childNode && Object.keys(childNode).length) {

      //     filterObj(childNode)
      //   }
      // }
      // filterObj(workFlowData.nodeConfig)

    }
    // let { data } = await getWorkFlowData({ workFlowDefId: route.query.workFlowDefId })



    processConfig.value = workFlowData

    let {
      nodeConfig: nodes,
      flowPermission: flows,
      directorMaxLevel: directors,
      addressBookMaxLevel: level,
      workFlowDef: works,
      tableId,
    } = workFlowData

    nodeConfig.value = nodes

    flowPermission.value = flows
    directorMaxLevel.value = directors
    addressBookMaxLevel.value = level
    workFlowDef.value = works
    
      
  
    setTableId(tableId)
  }
  const toReturn = () => {
    //window.location.href = ""
  }
  const changeNodeConfig = (val) => {

    upload()
    // const delobj = (obj) => {
    //   if (obj.approve_man_id === val.approve_man_id) {
    //     obj.type = 1000
    //   } else {
    //     delobj(obj.childNode)
    //   }
    // }
    // delobj(nodeConfig.value)
    // 

    // saveSet(1)
  }

  const reErr = ({ childNode }) => {
    if (childNode) {
      let { type, error, nodeName, conditionNodes } = childNode
      if (type == 1 || type == 2) {
        if (error) {
          tipList.value.push({
            name: nodeName,
            type: ["", "审核人", "抄送人"][type],
          })
        }
        reErr(childNode)
      } else if (type == 3) {
        reErr(childNode)
      } else if (type == 4) {
        reErr(childNode)
        for (var i = 0; i < conditionNodes.length; i++) {
          if (conditionNodes[i].error) {
            tipList.value.push({ name: conditionNodes[i].nodeName, type: "条件" })
          }
          reErr(conditionNodes[i])
        }
      }
    } else {
      childNode = null
    }
  }
  const arr = ref([])
  const filterObj = (obj) => {

    let { childNode, ...val } = obj || {}
    if (obj.type != 0 && obj.type != 1000) {
      arr.value.push(val)
    }
    if (childNode && Object.keys(childNode).length) {
      filterObj(childNode)
    }
  }
  const changeType = (settype) => {
    let type = 0 // 指定成员
    if (settype == 2) type = 4 //直属主管
    if (settype == 3) type = 5 //部门主管
    if (settype == 4) type = 2 //发起人自选
    if (settype == 5) type = 1 //发起人自己
    if (settype == 6) type = 6 //连续多级主管
    if (settype == 7) type = 3 //角色
    if (settype == 8) type = 7 //表单内联系人
    return type
  }
  const setFormData = (formData) => {


    const { payload: { schemas } } = formConfig.value
    schemas.find(v => {
      if (v.contactsType === "contactsOptions") {

        return v.componentProps.options = formData.map(v => ({ label: v.label, value: v.value }))
      }
    })

  }
  const saveSet = async (type = '') => {
    //发布的时候默认启用


    setIsTried(true)
    tipList.value = []
    reErr(nodeConfig.value)
    if (tipList.value.length != 0) {
      tipVisible.value = true
      return
    }
    emits('handleFormSave', { ...formConfig.value, stepNum: 4 });

    // let paramsArr = []
    // arr.value = []
    // processConfig.value.flowPermission = flowPermission.value
    // // const { nodeConfig: nconfig } = processConfig.value
    // 

    // filterObj(nodeConfig.value)

    // arr.value.forEach(v => {
    //   paramsArr.push({
    //     approve_man_id: v.approve_man_id || 0,
    //     form_template_id: formConfig.value.id,
    //     type: changeType(v.settype),
    //     regular_man_ids: v.nodeUserList.map(v => v.targetId).join(','),
    //     optional_man_type: v.selectMode == 1 ? 0 : 1,
    //     company_role_ids: v.nodeUserList.map(v => v.targetId).join(','),
    //     condition: v.examineMode,
    //     man_empty_condition: v.noHanderAction,
    //     man_empty_regular_man_ids: v.pointNodeUserList && v.pointNodeUserList.map(v => v.targetId).join(
    //       ',') || '',
    //     action_type: v.type == 2 ? 0 : 1,
    //     /* conpany_department_level settype=3是部门主管直接传directorLevel,连续多级主管的时候approverEnd = 2才传directorLevel*/
    //     conpany_department_level: v.settype == 3 ? v.directorLevel : v.approverEnd == 2 ? v.directorLevel :
    //       0,
    //     conpany_department_bubble: Number(v.beforManager),
    //     form_contact_identify: v.contacts && v.contacts.map(v => v.value).join(','),
    //     meta: JSON.stringify(processConfig.value)
    //   })
    // })
    // // 
    // 
    // 
    // 

    // let task = paramsArr.map(async v => {
    //   return await window.http.post({
    //     url: '/work_center/form_tpl_api/save_line_man',
    //     data: {
    //       ...v
    //     }
    //   })
    // })
    // Promise.all(task).then(res => {
    //   

    //   if (!type) {
    //     router.push('/approvalManage/formManage')
    //     message.success('成功')
    //   }
    // })

  }
  const zoomSize = (type) => {
    if (type == 1) {
      if (nowVal.value == 50) {
        return
      }
      nowVal.value -= 10
    } else {
      if (nowVal.value == 300) {
        return
      }
      nowVal.value += 10
    }
  };
</script>
<style>
  @import '@/css/workflow.css';

  .error-modal-list {
    width: 455px;
  }
</style>
