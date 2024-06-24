<template>
  <PageWrapper dense contentFullHeight fixedHeight class="PageWrapper">
    <VFormDesign :configRes='configRes' @handleFormSave='handleFormSave' />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import VFormDesign from './components/VFormDesign/index.vue';
  const props = defineProps({
    configRes: {
      type: Object,
      default: {},
    },
  });
  const emit = defineEmits(['handleFormSave']);

  watch(
    () => props.configRes,
    (newVal) => {
      console.log('[ newVal ]-22', newVal);
    },
  );
  const handleFormSave = (formConfig) => {

    emit('handleFormSave', { payload: formConfig.value, stepNum: 3 });
  };
  onMounted(() => {
    console.log('[ onMounted ]-28', props.configRes);
  });
</script>

<style lang="less" scoped>
  .PageWrapper {
    width: 100%;
    background-color: #fff;
  }
</style>
