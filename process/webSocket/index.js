let ws = require('ws');            //引入websocket模块
let uuid = require('uuid');        //引入创建唯一id模块

let socketServer = ws.Server;
let wss = new socketServer({port: 8090});    //创建websocketServer实例监听8090端口
let clients = {};                // 创建客户端列表，用于保存客户端及相关连接信息
// 聊天记录
let chatRecord = []
// 头像列表
const headPortraitList = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpeg']

/**
 * 广播所有客户端消息
 * @param  {object} params                      形参
 * @param  {number} params.type                1-消息，2-登录, 3-登出
 * @param  {string} params.id                  用户标识
 * @param  {string} params.content             消息
 * @param  {string} params.headPortraitUrl     用户头像
 */
function broadcastSend(params) {
    for(key in clients) {
        let item = clients[key]
        if(item.ws.readyState === ws.OPEN) {
            item.ws.send(JSON.stringify({
                type: 1,
                id: params.id,
                content: params.content,
                headPortraitUrl: params.headPortraitUrl
            }));
        }
    }
}

function login(params) {
    for(key in clients) {
        let item = clients[key]
        console.log(params.id, 'params.id??????')
        if(item.id !== params.id) {
            item.ws.send(JSON.stringify({
                type: 2,
                length: params.length
            }));
        }
    }
}

//监听连接
wss.on('connection', function(ws) {
    let id = uuid.v4();
    // console.log(ws, 'ws')
    // 除了你以外在线人数
    let length = Object.keys(clients).length
    clients[id] = {
        ws: ws,
        id: id,
        headPortraitUrl: `head_portrait_url/chat/${headPortraitList[length%4]}`
    }

    // 当有人登录了，就把他的id和聊天记录以及在线人数推送给他
    // 第一次连接
    ws.send(JSON.stringify({
        id: id,
        type: 2,
        chatRecord,
        length: length + 1
    }))

    // 同时通知其他在线的人，有人登录了,并更新在线人数
    login({
        id,
        length: length + 1
    })

    console.log(`client ${id} connected`);
    /**
     * 关闭服务，从客户端监听列表删除
     */
    function closeSocket() {
        delete clients[id]
        let length = Object.keys(clients).length
        for(key in clients) {
            let item = clients[key]
            item.ws.send(JSON.stringify({
                type: 3,
                length: length
            }));
        }
    }
    /*监听消息*/
    ws.on('message', function(message) {
        let { id, content } = JSON.parse(message)
        let headPortraitUrl = clients[id].headPortraitUrl
        let obj = {
            id: id,
            content,
            headPortraitUrl: headPortraitUrl
        }
        // 记录聊天内容
        chatRecord.push(obj)
        broadcastSend(obj)
    });
    /*监听断开连接*/
    ws.on('close', function(e) {
        closeSocket();
    })
})