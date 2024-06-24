import { defHttp } from '/@/utils/http/axios';
import axios from 'axios'
import SparkMD5 from 'spark-md5';
enum Api {
  upload_params = '/basic_center/upload_api/oss_upload_params',
  getfolder = '/basic_center/upload_api/my_files',
  upload_success ='/basic_center/upload_api/upload_success',
  get_file_by_hash='/basic_center/upload_api/get_file_by_hash',
  netdisk_upload='/Netdisk/File/save',
  
}



export const getfolder = (data) => {
  return defHttp.post({ url: Api.getfolder, data });
}
export const upload_success = (data) => {
  return defHttp.post({ url: Api.upload_success,data });
}
const netdisk_upload = async (data)=>{
  return defHttp.post({ url: Api.netdisk_upload,data });
}

let md5Hash = ''
const calculateMD5 = (file)=>{
  return new Promise((resolve,reject)=>{
    const fileReader = new FileReader();
          fileReader.onload = () => {
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(fileReader.result);
             md5Hash = spark.end();
            console.log('MD5 Hash:', md5Hash);
            // 在这里可以将 md5Hash 发送到服务器或执行其他操作
            resolve(md5Hash) 
          };
          fileReader.readAsArrayBuffer(file);
  })

        
}
/**
 * @description: get oss upload_params 
 */
export const get_upload_params = async (file, catgory,file_type="IMG") => {
  console.log('file: ', file)
  
  //获取上传文件的md5哈希值
  let hash = await calculateMD5(file);
  console.log('hash',hash)
  return new Promise(async (resolve, reject) => {
    //上传前检查是否有重复的文件
    const {file:get_file} = await defHttp.get({ url: Api.get_file_by_hash, params: {hash} });
    console.log('get_file: ', get_file)
    if(get_file){
        return resolve(get_file)
    }
    const result = await defHttp.post({ url: Api.upload_params, data: { catgory,file_type } });
    console.log('[ result ]-20', result)
    let formData = new FormData();
    formData.append("key", result.key);
    formData.append("policy", result.policy);
    formData.append("OSSAccessKeyId", result.OSSAccessKeyId);
    formData.append("signature", result.signature);
    // formData.append("success_action_status", "200");
    formData.append("file", file);
    axios({
      url: result.host,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(res => {
        console.log('执行到这里', res)
        if (res.status == 204) {
          upload_success({file_id:result.file_id,hash,postfix:file.name.split('.').pop(),size:file.size}).then(({file})=>{
            console.log('file: ', file)
            resolve(file);
          })
         
        } else {
          reject(res);
        }
      })
      .catch(err => {
        console.log('err', err)
        reject(err);
      });
  })


};
/**
 * @description: get oss upload_params 
 */
export const folder_upload_params = async (file, catgory,file_type="IMG",parent_id = 0) => {
  console.log('file: ', file)
  
  //获取上传文件的md5哈希值
  let hash = await calculateMD5(file);
  console.log('hash',hash)
  return new Promise(async (resolve, reject) => {
    //上传前检查是否有重复的文件
    const {file:get_file} = await defHttp.get({ url: Api.get_file_by_hash, params: {hash} });
    console.log('get_file: ', get_file)
    if(get_file){
     return netdisk_upload({
        file_hash:hash,
        title:file.name,
        parent_id,
      }).then(res=>{
          resolve(get_file)
      })
      
    }
    const result = await defHttp.post({ url: Api.upload_params, data: { catgory:'netdisk',file_type,is_netdisk:1 } });
    console.log('[ result ]-20', result)
    let formData = new FormData();
    formData.append("key", result.key);
    formData.append("policy", result.policy);
    formData.append("OSSAccessKeyId", result.OSSAccessKeyId);
    formData.append("signature", result.signature);
    // formData.append("success_action_status", "200");
    formData.append("file", file);
    axios({
      url: result.host,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(res => {
        console.log('执行到这里', res)
        if (res.status == 204) {
          upload_success({file_id:result.file_id,hash,postfix:file.name.split('.').pop(),size:file.size,}).then(({file:v})=>{
            console.log('v: ', v)
            resolve(v);
            netdisk_upload({
              file_hash:hash,
              title:file.name,
              parent_id,
            })
          })
         
        } else {
          reject(res);
        }
      })
      .catch(err => {
        console.log('err', err)
        reject(err);
      });
  })


};
