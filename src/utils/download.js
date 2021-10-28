import axios from 'axios'

const service = axios.create({
  responseType:'arraybuffer'
})

service.interceptors.request.use(config=>{
  config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
  return config
},error => {
  console.log(err)
})

service.interceptors.response.use(resp=>{
  const  headers = resp.headers;
  let reg = RegExp(/application\/json/)
  if(headers['content-type'].match(reg)){
    resp.data = unitToString(resp.data)
  }else {
    let fileDownload = require('js-file-download');
    let fileName = headers['content-disposition'].split('filename=')[1];
    let contentType = headers['content-type']
    fileName = decodeURIComponent(fileName)
    fileDownload(resp.data, fileName, contentType)  //这个地方就是下载文件 不需要响应回来什么东西啊
  }
},error => {
  console.log(err)
})


function unitToString(untiArray){
  let encodeString = String.fromCharCode.apply(null,new Uint8Array(untiArray));
  let decodeString = decodeURIComponent(escape(encodeString))
  // 先编码后解码 然后转换为json对象
  return JSON.parse(decodeString)
}


let base = ''

export const downloadRequest=(url,params)=>{
  return service({
    method:'get',
    url:`${base}${url}`,
    data:params
  })
}

export default service