
function initWebSocket(server) {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server });

  // 用于存储 WebSocket 连接的映射表，连接标识 -> WebSocket 连接  可以使用数组吗？
  const webSocketConnections = []

  wss.on('connection', (ws) => {
    console.log('用户连接成功');

    // 监听消息事件
    ws.on('message', (message) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        console.error('无法解析消息:', message);
        return;
      }

      const { event, data } = parsedMessage;

      switch (event) {

        case 'identify':
          const { identification, clientType } = data;
          // 将 WebSocket 连接与identification和clientType关联，可以根据identification和clientType两个条件才找到对应的 WebSocket 连接
          webSocketConnections.push({ identification, clientType, ws });


          console.log(webSocketConnections, 'socket映射')
          console.log(`标识 ${identification},${clientType} 关联成功`);
          break;

        case 'registrationComplete':
          const { identification: regIdentification, registrationData, clientType: regClientType } = data;
          // 根据标识找到对应的 WebSocket 连接
          const webSocketConnection = webSocketConnections.find((connection) => connection.identification === regIdentification && connection.clientType === regClientType);
          if (webSocketConnection && webSocketConnection.clientType === 'Web') {
            // 向对应的 WebSocket 连接发送注册成功消息
            const response = JSON.stringify({ event: 'registrationComplete', data: registrationData });
            webSocketConnection.ws.send(response);
          }
          break;

        default:
          console.log('未知事件:', event);
          break;
      }
    });

    // 监听断开连接事件
    ws.on('close', () => {
      console.log('用户断开连接');
      // 从映射表中移除断开连接的websocket
      const index = webSocketConnections.findIndex((connection) => connection.ws === ws);
      console.log(index, 'index')
      if (index !== -1) {
        webSocketConnections.splice(index, 1);
      }

      console.log(webSocketConnections, 'socket映射222')

    });
  });
}

module.exports = initWebSocket;
