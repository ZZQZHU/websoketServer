// app.js
const http = require('http');


// 1. 建立websocket HTTP服务器。无需返回 Express 实例，因为我们只需要与 HTTP 服务器关联
const webserver = http.createServer((req, res) => {

})
const webport = 8880;

const setupWebSocket = require('./controllers/websocket/index'); // 引入websocket文件夹下的index

setupWebSocket(webserver); // 初始化 WebSocket

// 处理websocket请求 8880端口的
webserver.listen(webport, () => {
    console.log(`websocket运行起来了 ${webport}`);
});


//  中间件的执行顺序非常重要。中间件按照它们添加到应用程序的顺序依次执行，所以根据中间件的添加顺序，你可以区分出哪个中间件用于处理未找到的路由。
//  可以试着将错误处理中间件往前放，结果就不一样了