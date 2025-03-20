import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // Подключение к конкретному чату
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(chatId);
    client.emit('joinedChat', chatId);
  }

  // Обработка сообщений в конкретном чате
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() { chatId, message }: { chatId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.to(chatId).emit('message', message); // Отправляем сообщение только в этот чат
  }
}
