import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketServerGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  events(@MessageBody() msg: string): void {
    this.server.emit('message', msg);
  }
}
