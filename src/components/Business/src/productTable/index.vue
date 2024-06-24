<template>
  <div>
    <a-table :dataSource="dataSource1" :columns="columns1" :pagination="false">
      <template  #bodyCell="{ column, text, record,index }">
        <template v-if="column.dataIndex === 'product'">
          <!-- {{text}} -->
          <a-select  :disabled="filteredOptionsDisabled || Boolean(list.length) " style="width:200px"
            placeholder="请输入" show-search v-model:value="record.product" :options="productOptions">
          </a-select>
        </template>
        <template v-if="column.dataIndex === 'number'">
          <!-- {{text}} -->
          <a-input-number :disabled="Boolean(list.length)" @change="change($event,record)" placeholder="请输入" :controls="false" :precision="0" v-model:value="record.number"
            :min="1" :max="1000000" />
        </template>
        <template v-if="column.dataIndex === 'dell'">
          <div v-if=" !Boolean(list.length)">
            <Icon @click="addOrderRow(record)" style="color:#0079ff;margin-right: 5px;font-size:20px"
              icon="gala:add" />
            <Icon @click="delOrderRow(index)" icon="icon-park-outline:reduce-one"
              style="font-size:20px;color:red" />
          </div>
         
        </template>
      </template>
    </a-table>
  </div>
 
</template>

<script  setup>
import { cloneDeep } from 'lodash-es';
import Icon from '@/components/Icon/Icon.vue'
  const emits = defineEmits(['produnctList'])
  const props = defineProps({
    list:{
      type:Array,
      default:()=>[]
    }
  })
 const dataSource1 = ref([{
   key: 1,
   product: '',
   number: 1,
 }])
 const columns1 = [{
     title: '产品',
     align: 'center',
     dataIndex: 'product',
     // key: 'product',
     width: 200,
   },
   {
     title: '数量',
     align: 'center',
     dataIndex: 'number',
     key: 'number',
     width: 100,
   },
   {
     title: '操作',
     align: 'center',
     dataIndex: 'dell',
     key: 'dell',
     width: 100,
   },
 ];
 
 const productOptions = ref([])
 const filteredOptionsDisabled = computed(() => {
   let flag = false
   const pro = dataSource1.value.map(v => v.product)
 
   productOptions.value.forEach(o => {
     o.disabled = pro.includes(o.value)
   })
 
   return flag
 });
 const getProducts = async () => {
   let data = await window.http.post({
     url: '/erp-ware/product/list',
   });
 
   productOptions.value = data.map(v => ({
     label: v.productName,
     value: v.id
   }))
   return
 }
 const addOrderRow = (record) => {
 
   let newRow = JSON.parse(JSON.stringify(record))
   dataSource1.value.push({
     key: dataSource1.value.length + 1,
     product: '',
     number: 1,
   })
 }
 const delOrderRow = (index) => {
   if (dataSource1.value.length > 1) {
     dataSource1.value.splice(index, 1)
   }
 }
 watch(dataSource1,(val)=>{
   
   
   emits('produnctList',val)
 }, { deep: true })
 
 watchEffect((val)=>{
   
   dataSource1.value = props.list?.length? cloneDeep(props.list.map(v=>({key: props.list.length + 1, product: v.product_id, number: v.num}))) :dataSource1.value 
   
 })
 const change = (e,item)=>{
   item.number = e?e:1
 }
 onBeforeUnmount(()=>{
   
 })
 
 onMounted(async() =>{
   getProducts()
 })
</script>

<style>
</style>
