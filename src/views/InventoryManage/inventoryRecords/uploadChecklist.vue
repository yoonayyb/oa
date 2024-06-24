<template>
  <div class="aupload_box">
    <div class="aupload_pic">
      <div class="aupload_info">
        <div class="aupload_info_t"> {{ title }} </div>
        <div class="aupload_info_b"> 注: 仅限上传 5 张图片，图片格式：JPG/JPEG/PNG/WEBP/PDF </div>
      </div>
      <a-button type="primary" @click="auploadOpen(record)">查看记录图片</a-button>
      <a-modal v-model:open="auploadOpenStatus" title="查看记录图片">
        <div v-if="picList.length">
          <a-image style="padding: 8px" :width="140" v-for="v in picList" :src="v" />
        </div>
        <div v-else> 本次记录暂无图片 </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Aupload } from '/@/components/Aupload';
  // const picList = ref([]);
  const props = defineProps({
    picList: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: '上传本次操作清单照片：',
    },
  });
  const auploadOpenStatus = ref<boolean>(false);
  const emits = defineEmits(['onOk']);
  // const newPicList = ref([]);

  const auploadOpen = (arr, list) => {
    auploadOpenStatus.value = true;
  };
  const onOk = (arr, list) => {
    emits('onOk', list);
  };
</script>
<style lang="less" scoped>
  .aupload_box {
    padding: 16px;
    padding-top: 0;
    .aupload_pic {
      padding-left: 10px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 200px;

      background-color: #fff;

      .aupload_info {
        margin-right: 100px;
        margin-left: 48px;
        // text-align: right;
        font-size: 14px;
        .aupload_info_t {
          font-weight: 700;
          color: rgb(16, 16, 16);
          margin-bottom: 15px;
        }
        .aupload_info_b {
          font-size: 10px;
          color: rgba(96, 98, 102, 1);
        }
      }
    }
  }
</style>
