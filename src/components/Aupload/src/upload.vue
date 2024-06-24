<template>
  <div class="clearfix">
    <a-upload
      :beforeUpload="beforeImageUpload"
      list-type="picture-card"
      :file-list="imageList"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleImageChange"
      @preview="handlePreview"
      :custom-request="customRequest"
    >
      <div v-if="imageList.length < limitNum && !disabled">
        <!-- <Icon type="plus" /> -->
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <div class="text-center">
        <img alt="example" style="width: 80%" :src="previewImage" />
      </div>
    </a-modal>
  </div>
</template>
<script setup>
  import { message } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  const props = defineProps({
    defaultImageList: {
      type: Array,
      default: function () {
        return [];
      },
      required: true,
    },
    fileTypeList: {
      type: Array,
      default: function () {
        return [];
      },
      required: false,
    },
    limitSize: {
      type: Number,
      default: 5,
      required: false,
    },
    limitNum: {
      type: Number,
      default: 1,
      required: false,
    },
    multiple: {
      type: Boolean,
      default: false,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  });
  const emit = defineEmits(['change', 'showAvatar']);
  const previewVisible = ref(false);
  const previewImage = ref('');
  let imageList = ref([]);
  console.log('defaultImageList', props.defaultImageList);
  const clearImageList = () => {
    imageList.value = [];
    console.log('clearImageList', imageList);
  };
  defineExpose({
    clearImageList,
  });
  watch(
    () => props.defaultImageList,
    (newVal) => {
      // console.log('newVal', newVal)
      // imageList.value = handleData(newVal)
      //
      console.log('传出的defaultImageList', newVal);
      emit('showAvatar', newVal);
    },
  );
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
  };
  const beforeImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (!props.fileTypeList) {
        const index = props.fileTypeList.indexOf(file.type);
        if (index > 0) {
          message.error(`您只能上传${props.fileTypeList[index]}文件`);
        }
      }
      const limitSize = file.size / 1024 / 1024 < props.limitSize;
      if (!limitSize) {
        message.error(`文件大小不能大于${props.limitSize}MB`);
        return reject(new Error(`文件大小不能大于${props.limitSize}MB`));
      }
      return resolve(true);
    });
  };
  const handleCancel = () => {
    previewVisible.value = false;
  };
  const customRequest = ({ action, file, onSuccess, onError, onProgress }) => {
    new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        let index = {
          uid: genId(5),
          name: file.name,
          status: 'done',
          url: fileReader.result,
          file,
        };
        imageList.value = [...imageList.value.filter((item) => item.status === 'done'), index];
        handleChange();
        resolve(fileReader.result);
      };
    });
  };
  const handleImageChange = (info) => {
    let fileList = [...info.fileList];
    imageList.value = fileList;
    handleChange();
  };
  const handleChange = () => {
    let index = imageList.value
      .filter((item) => item.url)
      .map((item) => {
        return item;
      });
    emit('change', index ? index : []);
  };
  const genId = (length) => {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  };
  const handleData = (list) => {
    return list.map((item) => {
      let index = genId(5);
      return {
        uid: index,
        name: index,
        status: 'done',
        url: item,
      };
    });
  };
  // imageList.value = handleData(props.defaultImageList)
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
