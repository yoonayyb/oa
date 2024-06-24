<template>
  <div>
    <BasicTable @row-mouseenter="rowMouseenter" @row-mouseleave="rowMouseleave" @row-dbClick="rowDbClick" @row-click="rowClick" @register="registerTable">

      <template #headerTop>

        <a-breadcrumb>
          <a-breadcrumb-item @click="breadcrumbClick(item)" v-for="(item,index) of filesPath" :key="index">
            <a :class="{'!text-slate-950 !font-bold':index === filesPath.length - 1 }">{{item.breadcrumbName}}</a>

          </a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <template #tableTitle>

        <view class="ml-4" v-if="selectRowFiles.length">
          <view class="!font-bold">已选{{selectRowFiles.length}}项</view>
          <a-space>
            <a-button @click="handleDownload('')" v-if="!selectRowFiles.find(v=>v.file_id == 0)"
              type="primary">下载</a-button>
          </a-space>
        </view>

      </template>
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleCreate2"> 上传 </a-button> -->
        <span>文件数量：{{total}}</span>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">


          <a-checkbox v-if="record.show" v-model:checked="record.checked"> </a-checkbox>
          <span v-else style="display: inline-block; width: 1rem;height: 1rem;"> </span>
          <view class="inline-flex justify-center items-center">
            <TableImg v-if="record.file && record.file.file_type === 'IMG'" class="!mx-4" :size="50" simpleShow
              :imgList="[record.file.url]"></TableImg>
            <TableImg v-else-if="record.file && record.file.file_type !== 'IMG'" class="!mx-4" :size="50" simpleShow
              :imgList="[checkFileType(record.file.postfix).url]"></TableImg>
            <TableImg v-else class="!mx-4" :size="50" simpleShow
              :imgList="['https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/folder.png']"></TableImg>
            <span class="!font-bold">{{record.title}}</span>
          </view>



        </template>

        <template v-if="column.key === 'action'">
          <TableAction :dropDownActions="[
             
              {
                label: '下载',
                ifShow:record.file_id>0,
                onClick: handleDownload.bind(null, record),
              },
            ]" />
        </template>
      </template>
    </BasicTable>

  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction, TableImg } from '/@/components/Table';
  import { userSchemaFn } from './config';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { checkFileType } from '@/utils/common.js';
  import { downloadByUrl } from '@/utils/file/download';

  const parent_id = ref()
 const filesPath = ref([
    {

      breadcrumbName: '我的文件',
      value: 0,
    },
  ])
 

  // 下载
  function handleDownload(item = '') {
    // const { response:{url} } = item;
    // const url = item || item.
    if (!item && selectRowFiles.value.length) {
      // selectRowFiles.value.forEach(v=>{
      //   downloadByUrl({ url: v.file.url,target:'_blank',fileName:v.title, })
      // })
      let arr = selectRowFiles.value.map(v => ({ url: v.file.url, target: '_blank', fileName: v.title, }))
      downloadSequentially(arr)
    } else {
      downloadByUrl({ url: item.file.url, target: '_blank', fileName: item.title})
    }

  }
  function downloadSequentially(arr, currentIndex = 0) {
    if (currentIndex >= arr.length) {
      // 所有链接已经下载完成
      return Promise.resolve();
    }

    const obj = arr[currentIndex];

    return new Promise((resolve, reject) => {
      // 下载当前链接
      const success = downloadByUrl({
        url: obj.url,
        fileName: obj.fileName,
        target: '_self', // 在当前窗口下载
      });

      if (success) {
        // 下载成功后，等待一段时间再继续下载下一个链接
        setTimeout(() => {
          // 递归下载下一个链接
          downloadSequentially(arr, currentIndex + 1)
            .then(resolve)
            .catch(reject);
        }, 500); // 等待 1 秒钟再继续下载下一个链接，可以根据需要调整等待时间
      } else {
        reject(new Error(`Failed to download ${obj.url}`));
      }
    });
  }

  // let formState = initFormState();
  const breadcrumbClick = (e) => {
    console.log('breadcrumbClick: ', e)
    let index = filesPath.value.findIndex(v => v.value === e.value)
    console.log('index: ', index)
    filesPath.value = filesPath.value.slice(0, index + 1)
    parent_id.value = e.value
    reload()
  }
 
  let { headerSchema, columns } = userSchemaFn();





  const tableData = ref([])
  const total = ref(0)
  const params = router.currentRoute.value.query || {}
  parent_id.value = ''
  filesPath.value[0].value =  params.parent_id
  const getTableData = async () => {
    
    
    console.log('params: ', params)
    
    const p = {
      parent_id: parent_id.value,
      hash:params.hash
    }
    let data = await window.http.get({
      url: '/Netdisk/Share/list',
      params: p
    });
    console.log('data ', data)
    data.list.forEach(v => {

      v.show = false
      v.checked = false
    })
    tableData.value = data.list
    console.log('tableData.value: ', tableData.value)
    total.value = data.list.length

    return data.list;
  };


  const [registerTable, { reload }] = useTable({
    title: '分享文件',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: headerSchema,
    },
    // clickToRowSelect:true,
    // rowSelection: true,
    useSearchForm: false,
    showIndexColumn: false,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },

  });

  onMounted(() => {
    document.addEventListener('keydown', backspace, true)
  })
  const backspace = (e) => {
    console.log('e.target: ', e.target.matches('body'))
    if (e.keyCode === 8 && e.target.matches('body')) {

      // 回退键被按下
      console.log('Backspace键被按下');
      // 在这里可以执行你想要的操作
      if (filesPath.value.length > 1) {
        filesPath.value.pop()
        const { value } = filesPath.value[filesPath.value.length - 1]
        parent_id.value = value
        reload()
      }
    }
  }
  const selectRowFiles = computed(() => {
    return tableData.value.filter(v => v.checked)
  })
  const rowMouseenter = (e) => {
  
    tableData.value.forEach(v => {
  
      v.show = v.checked ? v.checked : v.id === e.id
    })
  }
  const rowDbClick = (e) => {
    if (e.file_id !== 0) return
    parent_id.value = e.id
    filesPath.value.push({


      breadcrumbName: e.title,
      value: e.id,

    })
    console.log('e: ', e)
    reload();
  }
  const rowMouseleave = (e) => {
    tableData.value.forEach(v => {
  
      v.show = v.checked
    })
  }
  const rowClick = (e) => {
    console.log('e: ', e.checked)
    e.checked = !e.checked
  }
</script>
