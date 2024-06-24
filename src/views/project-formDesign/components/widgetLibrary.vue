<template>
<div>
 
  <div>
  <!-- <slot :text="greetingMessage" :count="count">
       {{slotcontent}}
   </slot>
  </div>
  <div>解构出来的：{{count}}</div>
  <slot  name="header" :message="1111">
       默认header
   </slot> -->
   <button @click="aaa">+++</button>
   <div>{{state1.id + 1}}</div>
   <div>{{state}}</div>
 
</div>
</div>
 
</template>

<script lang='ts' setup>
  let props = defineProps(['foo'])
  const activeKey = ref(1);
  const slotcontent = ref('我是子组件的数据')
  // const count = shallowReactive({
  //   count1:ref(1),
  //   deep:{
  //     countdeep:2
  //   }
  // })
  console.log('props', props.foo)
  //import { computed, unref } from 'vue';
  // 该 prop 变更时计算属性也会自动更新
  const props1 = props.foo
  const greetingMessage = ()=>{
    return '子组件状态'
  }
  
  
  // const aaa = async () => {
  //   count.count1++
  //   await nextTick()
  //   count.deep.countdeep ++
  //   console.log(count)
  // }
  // let { count1,deep } = count
  const state1 = ref({id:ref(1)})
const state = reactive([
  {
    name:'asd',
    list:[
      {a:1},
      {v:2}
      
    ]
  },
  {
    name:'4444',
    list:[
      {a:33},
      {v:44}
      
    ]
  }
]) 

// let { count,count1 } = state.value

   const count = ref({a:1})
 let [a,b] = state
   
  const aaa = async () => {
    a.name = 'yyb'
    // a.[0].count[0].a.b ++
    // console.log(a.[0].count[0].a.b)
    // a.count[0].a.b++
    // console.log(a.count[0].a.b)
    // b++
    // a.value++
    
    console.log(a)
    console.log(b)
    
  }
</script>
<style lang='less' scoped>
</style>
