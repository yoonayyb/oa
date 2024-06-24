<template>

  <div class="page flex_aic_jcc ">

    <div class="form" style="max-width:800px;">

      <BasicForm @field-value-change="debouncedFieldValueChange" @register="register">
        <template #contactsOptions></template>
      </BasicForm>
      <productTable @produnctList="produnctList" style="margin-bottom: 60px;" v-if="configDetail.form_type === 1"></productTable>
      
      <approveTimeline ref="childRef" @arr="arr" :list="configDetail.approve_mans"></approveTimeline>
    </div>

    <div class="submit_btn">
      <a-button size="large" type="primary" @click="push">提交</a-button>
    </div>
  </div>

</template>

<script lang='ts' setup>
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import approveTimeline from './approve_timeline.vue';
  import  productTable  from '/@/components/Business/src/productTable/index.vue';
  import { message } from 'ant-design-vue';
  import { useDebounceFn } from '@vueuse/core';
  const department_id = ref('')
  const form_type_value = ref('')
  
  const errorMessage = ref([])
  const formConfig = reactive({
    showResetButton: false,
    showSubmitButton: false,
    // layout: 'horizontal',
    // labelLayout: 'flex',
    // labelWidth: 100,
    // labelCol: {},
    // wrapperCol: {},
  });
  const [register, { setProps, appendSchemaByField, submit, getSchema, validate, resetFields,validateFields }] = useForm({
    schemas: [],
  });
  const childRef = ref()
 

  const zhishuDept = {
    component: 'ApiSelect',
    label: '直属部门',
    icon: 'gg:select',
    field: 'company_department_ids',
    colProps: { span: 24 },
    contactsType: 'department',
    rules: [{ required: true, message: '请选择', trigger: ['blur'] }],
    componentProps: {
      labelInValue: true,
      labelField: 'title',
      valueField: 'id',
      api: () => {
        return new Promise((resolve, reject) => {
          window.http.get({
            url: '/company_center/department_api/select',
            params: { company_id: localStorage.getItem('companyId'), is_me: 1 },
          }).then(res => {
            let arr = []

            const objFilter = (obj) => {

              obj.forEach(v => {
                const { children, ...e } = v
                if (v.is_me) {
                  arr.push(e)
                }
                if (v.children?.length) {
                  objFilter(v.children)
                }
              })


            }
            objFilter(res)

            console.log('arr: ', arr)
            resolve(arr)
          })
        })
      }
    },
  }
  const fieldValueChange = async (key, val, oldSchema) => {
    console.log('key, val, oldSchema: ', key, val, oldSchema)
    
    const { schemas = [] } = formConfig
    schemas.filter(e => {
     
      if (e.field === key) {
        if(e?.itemProps?.required)validateFields([key])
        e.defaultValue = val
        console.log('e.defaultValue: ', e.defaultValue)
        if (e.contactsType === 'department') {
          e.defaultValue = val.label
        }
        
      }
    })
    if (oldSchema.contactsType === 'department') { //部门
      department_id.value = val.value

      getApprove()
    }
    if (oldSchema.field === 'out_warehouse_id') { //出库发货人
      form_type_value.value = val.value
      console.log('form_type_value.value: ', form_type_value.value)
      
      getApprove()
    }
    
    if (oldSchema.contactsType === 'contactsOptions') { //联系人
      if (val && childRef.value) {
        childRef.value.setContacts(val)
      }
    }
    // console.log('configDetail.value', key, val, oldSchema)
    console.log('configDetail.value', configDetail.value)
    console.log('formConfig.value', formConfig)
    
  }
  const debouncedFieldValueChange = useDebounceFn(fieldValueChange, 300);
  const products = ref([])
  const produnctList = (arr)=>{
    products.value = arr.map(v=>({product_id:v.product,num:v.number}))
    console.log('products.value: ', products.value)
    
  }
  const push = async () => {
    const values = await validate();
    console.log('values: ', values)
    console.log('configDetail.value.payload: ', configDetail.value.payload)
    // submit()
    const data = {
      form_template_id: configDetail.value.id,
      company_id,
      payload: configDetail.value.payload,
      parent_id: Number(parent_id),
      approve_mans: {
        department_id: department_id.value,
        ...buildArr(approveData.value,values),
        
      }

    }
    if (errorMessage.value.length) return
    window.http
      .post({
        url: '/work_center/project_api/apply_form_project',
        data: data,
      })
      .then((res) => {
        message.success('success')
        router.go(-1);
      });
    console.log('data: ', data)

  };
  let queryId = router.currentRoute.value.query?.id;
  let parent_id = router.currentRoute.value.query?.parent_id;
  let company_id = router.currentRoute.value.query?.company_id;
  const getDetail = async () => {
    let data = await window.http.get({
      url: '/work_center/project_api/form_tpl_detail',
      params: {
        form_template_id: queryId,
        company_id,
      },
    });
    await analysisFN(data)
    return data
  };
  const analysisFN = (data, type) => {
    if (data.payload?.schemas) {
      data.payload.schemas = data.payload.schemas.map((v) => {
        
        return {
          ...v,
          componentProps: {
            ...v.componentProps,
            api: v.componentProps?.api && new Function(`return ${v.componentProps?.api}`)(),
          },
        };
      });
      
       data.payload.schemas.forEach(v=>{
         let { componentProps:{apiy,labelField,valueField,params = ''},applay } = v
         // console.log('params: ', params)
         
         // params = params && JSON.parse(params) 
         if(apiy){
           v.componentProps.api = (p) => {
             console.log('p: ', p)
             console.log('apiy: ', apiy)
             console.log('apiy: ', applay)
             
          return new Promise((resolve, reject) => {
            window.http[applay]({
              url: apiy+ (applay === 'get'?p:''),//'/company_center/department_api/select',
              // params: { company_id: localStorage.getItem('companyId') },
            }).then(res => (resolve(res)))
          })
        }
         }
       })
      // console.log('data.payload.schemas: ', data.payload.schemas)
    }
  };
  const configDetail = ref({});
  const approveData = ref();
  const arr = (val) => {
    approveData.value = val;

    // buildArr(approveData.value)
  };
  /* 构造需要上传的数据*/
  const buildArr = (arr,values = {}) => {
    const buildObj = {};
    arr.map((v) => (buildObj[`approve_man_id_${v.approve_mans.id}`] = []));
    errorMessage.value = []
    arr.forEach((v,i) => {
      const { approve_mans, checked, contacts } = v;
      if (approve_mans.type === 7) {
        //类型为表单内联系人 特殊处理
        if (approve_mans.approves.length) {
          buildObj[`approve_man_id_${approve_mans.id}`] = approve_mans.approves.map((v) => ({
            company_user_id: v.id,
          }));
        } else if (contacts?.length) {
          buildObj[`approve_man_id_${approve_mans.id}`] = contacts.map((v) => ({
            company_user_id: v.value,
          }));
        } else {
          if (approve_mans.man_empty_condition !== 0) {
            errorMessage.value.push('请选择' + changeType(approve_mans.type));
          }

        }
      }else if(approve_mans.type === 8){
        //出库发货人特殊处理
        const {out_warehouse_id,in_warehouse_id} = values
        if(!products.value.length || products.value.some(v=>!v.product_id)) errorMessage.value.push('请选择产品')
        console.log('products.value: ', products.value)
        buildObj.form_type_value = {
          out_warehouse_id:out_warehouse_id.value,
          in_warehouse_id:in_warehouse_id.value,
          products:products.value           
        }
        console.log('v.form_type_value: ', v.form_type_value)
        if (approve_mans.approves.length) {
          buildObj[`approve_man_id_${approve_mans.id}`] = approve_mans.approves.map((v) => ({
            company_user_id: v.id,
          }));
        }else {
          if (approve_mans.man_empty_condition !== 0) {
            errorMessage.value.push('请选择' + changeType(approve_mans.type));
          }

        }
      } else {
        if (approve_mans.approves.length) {
          buildObj[`approve_man_id_${approve_mans.id}`] = approve_mans.approves.map((v) => ({
            company_user_id: v.id,
          }));
        } else {
          if (checked.length) {
            buildObj[`approve_man_id_${approve_mans.id}`] = checked.map((v) => ({
              company_user_id: v.id,
            }));
          } else if (![4, 5, 6].includes(approve_mans.type)) {
            errorMessage.value.push('请选择' + changeType(approve_mans.type));
          }
        }
      }
    });
    if (errorMessage.value.length) errorMessage.value.forEach(v => message.error(v))
    return buildObj;
  };
  const changeType = (settype) => {
    let type = '指定成员'; // 指定成员
    if (settype == 4) type = '直属主管'; //直属主管
    if (settype == 5) type = '部门主管'; //部门主管
    if (settype == 2) type = '发起人自选'; //发起人自选
    if (settype == 1) type = '发起人自己'; //发起人自己
    if (settype == 6) type = '连续多级主管'; //连续多级主管
    if (settype == 3) type = '角色'; //角色
    if (settype == 7) type = '表单内联系人'; //表单内联系人
    if (settype == 8) type = '出库发货人'; //出库发货人
    return type;
  };
  const getApprove = () => {
    return new Promise((resolve, reject) => {
      let params = {
        form_template_id: configDetail.value.id,
        company_id,
        approve_mans:{
          
        }
      }
      if(department_id.value)params.approve_mans.department_id = department_id.value
      if(form_type_value.value){
        params.approve_mans.form_type_value = {}
        params.approve_mans.form_type_value.out_warehouse_id = form_type_value.value
      } 
      console.log('params: ', params)
      window.http
        .post({
          url: '/work_center/project_api/get_lines',
          data:params
        })
        .then((res) => {

          const approve_mans = res.map(v => {
            return {
              ...v.approve_man,
              approves: [...v.approve_mans]
            }
          })
          if (department_id.value) {
            approve_mans.forEach((e, i) => {
              configDetail.value.approve_mans[i].approves = e.approves
            })

          } else {
            configDetail.value.approve_mans = approve_mans

          }
          resolve()
        });
    })

  };

  onMounted(async () => {
    if (queryId) {
      configDetail.value = await getDetail();


      //获取审批流程的数据
      await getApprove();

      console.log('configDetail.value: ', configDetail.value)

      //如果有部门相关的流程、就在表单后新增一个“直属部门”的下拉框
      if (configDetail.value.approve_mans.find(v => [4, 5, 6].includes(v.type))) {
        configDetail.value.payload.schemas.push(zhishuDept)

      }
      
      Object.assign(formConfig, configDetail.value.payload);
      setProps(formConfig);

    }
  });
</script>
<style lang='less' scoped>
  .page {
    flex-wrap: wrap;
    background-color: #fff;

    .form {
      width: 80%;
      padding: 20px;
    }

    .submit_btn {
      width: 80%;
      /* max-width: 800px; */
      padding: 20px;
      text-align: center;
    }
  }
</style>
