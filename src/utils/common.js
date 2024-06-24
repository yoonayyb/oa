export const formartData = (formState, obj) => {
  for (let i in formState) {
    formState[i] = obj[i] || ''
  }
  console.log('formState', formState)
}
export const debounce = (func, delay) => {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}
export const formatTopicTime = (date) => {
  if (!date) return ''
  const newDate = date.replace(/-/g, '/')
  const time = new Date(newDate)
  const timestamp = time.getTime() / 1000
  const _time = new Date()
  const _timestamp = _time.getTime() / 1000
  const m_diff = _timestamp / 60 - timestamp / 60
  if (m_diff < 60) {
    let current = m_diff.toFixed(0) == true ? m_diff.toFixed(0) : 1
    return current + '分钟前'
  } else if (m_diff < 1440) {
    const h_diff = _timestamp / 60 / 60 - timestamp / 60 / 60
    let current = h_diff.toFixed(0) == true ? h_diff.toFixed(0) : 1
    return current + '小时前'
  } else {
    return date
  }
}

export const useContactsSelect = () => {

  const pagetions = reactive({
    current: 1,
    pageNum: 15,
    total: 0
  })
  const contactsOptions = ref([])
  const searchParams = ref()
  const onSearch = (val) => {
    pagetions.current = 1
    searchParams.value = val
    getPerson()
  }
  const getPerson = async () => {

    const { records, total } = await window.http.get({
      url: '/company_center/staff_api/select',
      params: {
        company_id: localStorage.getItem('companyId'),
        pageNum: pagetions.pageNum,
        pages: pagetions.current,
        name: searchParams.value

      }
    })
    contactsOptions.value = pagetions.current === 1 ? records : [...contactsOptions.value, ...records]

    pagetions.total = total


  }
  const requireApi = () => {
    getPerson()
  }

  const handleScroll = (e) => {
    const { target: { scrollTop, scrollHeight, clientHeight } } = e
    if (scrollTop + 2 + clientHeight >= scrollHeight) {
      // 当滚动到底部时加载更多数据的逻辑
      console.log('当滚动到底部时加载更多数据的逻辑:')
      if (pagetions.total > contactsOptions.value.length) {
        pagetions.current++
        getPerson()
      }
      // ...
    }
  };
  return [pagetions, contactsOptions, searchParams, onSearch, handleScroll, requireApi];
}
export const checkFileType = (file)=>{
    let url = ''
    let file_type = 'IMG'
    switch (file){
      case 'mp4':
      url = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/video.png'
      file_type = 'VIDEO'
      break 
      case 'pdf':
      url = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/pdf.png'
      file_type = 'PDF'
      break 
      case 'doc':
      url = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/word.png'
      file_type = 'WORD'
      break 
      case 'docx':
      url = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/word.png'
      file_type = 'WORD'
      break 
      case 'xlsx':
      url = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/xlsx.png'
      file_type = 'EXCEL'
      break
      case 'ppt':
      url = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/ppt.png'
      file_type = 'PPT'
      break
      case 'pptx':
      url = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/ppt.png'
      file_type = 'PPT'
      break
      default:
       
    }
    console.log('url,file_type: ', url,file_type)
    return {url,file_type}
    
  }
