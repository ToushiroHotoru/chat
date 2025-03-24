import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '@/message/message.service';
import { ChatService } from './chat.service';
import { ChatDtoPost } from './chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(
    private MessageService: MessageService,
    private ChatService: ChatService,
  ) {}
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

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody()
    {
      messageId,
      text,
      chatId,
    }: { messageId: string; text: string; chatId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('zero');
    this.server.to(chatId).emit('editMessage', { text, messageId });
    await this.MessageService.update(messageId, { text });
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody()
    { messageId, chatId }: { messageId: string; chatId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.server.to(chatId).emit('deleteMessage', { messageId });
    await this.MessageService.delete(messageId);
  }

  @SubscribeMessage('newChats')
  handleCreateChat(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(userId);
    client.emit('new chats for', userId);
  }

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody()
    { reciverId, senderId }: { reciverId: string; senderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const payload: ChatDtoPost = {
      name: new Date().toDateString(),
      users: [reciverId, senderId],
    };

    const newChat = await this.ChatService.create(payload);

    this.server.to(reciverId).emit('chat', newChat);
  }
}
