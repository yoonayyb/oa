<template>
  <div>
    <div v-for="item in arr"> arr:{{item}}</div>
    <!-- <div v-for="item1 in arr2">arr2: {{item1}}</div> -->
  </div>
</template>
<script setup>
  let arr = reactive([])
  // let arr2 = ref([])
  // arr = [1, 2, 3, 4, 5]

  setTimeout(() => {
    arr.push(...[1, 2, 3, 4, 5])
    // arr2.value = [11, 22, 33, 44, 55]
  }, 1500)

</script>
<style lang="less" scoped></style>