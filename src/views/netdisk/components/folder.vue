<template>
  <view>
    <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="getTitle" @ok="handleSubmit" :okText="okText">
      <a-form
          :model="formState"
          name="basic"
          ref="formRef"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
        <!-- <a-form-item
          label="文件夹搜索"
        >
        <a-input-search v-model:value="formState.searchValue" style="margin-bottom: 8px" placeholder="Search" />
        </a-form-item> -->
          <a-form-item
            label="文件夹"
            name="selectedKeys"
            :rules="[{ required: true, message: '请选择文件夹',type:'array',trigger:['change', 'blur'] }]"
          >
           <a-directory-tree
               v-model:selectedKeys="formState.selectedKeys"
               :load-data="onLoadData"
               :fieldNames="{children:'children', title:'title', key:'id' }"
               :tree-data="treeData"
             ></a-directory-tree>
          </a-form-item>
        </a-form>
    </BasicModal>
    
  </view>
</template>

<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  const treeData = ref([
    {
      title: '我的文件',
      id: '0',
      children: [
       
      ],
    },
    
  ]
  ) 
  
 
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('[ data ]-34', data);
    
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    getTitle.value = data.title
    okText.value = data.okText
    rowId.value = data.ids || 0
    saveUrl.value = data.saveUrl
     
    if (unref(isUpdate)) {
     
    }
  });
  const saveUrl = ref('')
  const rowId = ref(0);
  const emits = defineEmits(['success', 'register']);
  const formRef = ref(null)
  const isUpdate = ref(true);
   const getTitle = ref('移动到')
   const okText = ref('确定')
  const formState = reactive({
    selectedKeys:[0],
    expandedKeys:[]
  });
  const onFinish = values => {
    console.log('Success:', values);
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
 // const expandedKeys = ref(['0-0', '0-1']);


 const getTableData = async (id) => {
   
   const p = {
     
     
     parent_id:id,
   }
   let data = await window.http.get({
     url: '/Netdisk/File/dirs',
     
     params: p
   });
   return data;
 };
 const load = (v,b)=>{
   console.log('v,b: ', v,b)
   
 }
 const onLoadData =  treeNode => {
   console.log('treeNode: ', treeNode)
   return new Promise(async resolve => {
     
    
    const data = await getTableData(treeNode.id)
    console.log('data: ', data)
    treeNode.dataRef.children =data.map(v=>({
      title:v.title,
      id:v.id,
      
    })) 
    treeData.value = [...treeData.value];
    resolve();
   });
   };

 //   const select = async (a,e)=>{
 //     console.log('a,node: ', a,e)
    
 
 //    const data = await getTableData(a[0])
 //    console.log('data: ', data)
 //    e.node.dataRef.children =data.map(v=>({
 //      title:v.title,
 //      id:v.id,
 //      isLeaf:false,
 //    })) 
  
 //    treeData.value = [...treeData.value];
 //   }
 const submit = async (values) => {
   
   let data = {
     parent_id:formState.selectedKeys[0],
    ids:rowId.value,
    
   };
   console.log('data: ', data)
   
   let result = await window.http.post({
     url: saveUrl.value,
     data,
   });
   return result
 };
    async function handleSubmit() {
      try {
        
        console.log('selectedKeys: ', formState.selectedKeys)
        const values = await formRef.value.validate();
        setModalProps({ confirmLoading: true });
        let result = await submit(values);
        closeModal();
        
        emits('success', { isUpdate: unref(isUpdate), values: { ...result } });
      } catch (error) {
        console.log('[ error ]-63', error);
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
    
    
    
</script>

<style lang="scss" scoped>
</style>
