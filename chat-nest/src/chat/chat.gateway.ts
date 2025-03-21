import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '@/message/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private MessageService: MessageService) {}
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
  async handleMessage(
    @MessageBody()
    {
      chatId,
      message,
      userId,
    }: { chatId: string; message: string; userId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.server.to(chatId).emit('message', { text: message, userId: userId }); // Отправляем сообщение только в этот чат
    await this.MessageService.create({
      chatId: chatId,
      text: message,
      userId: userId,
    });
  }
}
