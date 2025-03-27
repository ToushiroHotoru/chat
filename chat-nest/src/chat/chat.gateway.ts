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

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(chatId);
    client.emit('joinedChat', chatId);
  }

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
    try {
      const newMessage = await this.MessageService.create({
        chatId: chatId,
        text: message,
        userId: userId,
      });

      this.server.to(chatId).except(client.id).emit('message', {
        text: message,
        userId: userId,
        createdAt: newMessage.createdAt,
        _id: newMessage._id,
      });

      client.emit('message', {
        text: message,
        userId: userId,
        createdAt: newMessage.createdAt,
        _id: newMessage._id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody()
    { _id, text, chatId }: { _id: string; text: string; chatId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.server.to(chatId).emit('editMessage', { text, _id });
      await this.MessageService.update(_id, { text, isEdited: true });
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() { _id, chatId }: { _id: string; chatId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.server.to(chatId).emit('deleteMessage', { _id });
      await this.MessageService.delete(_id);
    } catch (err) {
      console.log(err);
    }
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
    try {
      const payload: ChatDtoPost = {
        name: new Date().toDateString(),
        users: [reciverId, senderId],
      };

      const newChat = await this.ChatService.create(payload);

      this.server.to(reciverId).except(client.id).emit('chat', newChat);
      client.emit('chat', newChat);
    } catch (err) {
      console.log(err);
    }
  }
}
