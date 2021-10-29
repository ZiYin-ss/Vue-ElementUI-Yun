import Vue from 'vue'
import Vuex from 'vuex'
import SockJs from 'sockjs-client'
import Stomp from 'stompjs'

Vue.use(Vuex)
const now = new Date();

const store = new Vuex.Store({
  state:{
    routes:[],
    sessions:[
      {
      id:1,
      user:{
        name:'示例介绍',
        img:'../src/assets/images/2.png'
      },
      messages:[
        {
        content:'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
        date:now
        },
        {
        content:'项目地址(原作者): https://github.com/coffcer/vue-chat',
        date:now
        },
        {
        content:'本项目地址(重构): https://github.com/is-liyiwei',
        date:now
        }]
      },
      {
      id:2,
      user:{
        name:'webpack',
        img:'../src/assets/images/3.jpg'
      },
      messages:[{
        content:'Hi，我是webpack哦',
        date:now
      }]
      }
    ],
    currentSessionId:1,
    filterKey:'',
    stomp:null
  },
  mutations: {
    initRoutes(state, data) {
      state.routes = data
    },
    mutations: {
      changeCurrentSessionId(state, id) {
        state.currentSessionId = id;
      },
      addMessage(state, msg) {
        state.sessions[state.currentSessionId - 1].messages.push({
          content: msg,
          date: new Date(),
          self: true
        })
      },
      INIT_DATA(state) {
        let data = localStorage.getItem('vue-chat-session');
        //console.log(data)
        if (data) {
          state.sessions = JSON.parse(data);
        }
      }
    }
  },
  actions:{
    connect(context){
      // 先连接
      context.state.stomp = Stomp.over(new SockJs('/ws/ep'));
      let token = window.sessionStorage.getItem('tokenStr')
      // 也需要jwt令牌的 然后把这个toke发给后端
      // 连接wsep端点 订阅消息频道 拿到msg回调获取消息体
      // 其实这个地方和python的tcp和udp连接很像 是不是建立了端口 发送了数据 来回发送不也可以吗
      context.state.stomp.connect({'Auth-Token':token},success=>{
        context.state.stomp.subscribe('/user/queue/chat',msg=>{
          console.log(msg.body)
        })
      },error=>{

      })
    },
    initData (context) {
      context.commit('INIT_DATA')
    }
  }
})

store.watch(function (state) {
  return state.sessions
},function (val) {
  console.log('CHANGE: ', val);
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
  deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store