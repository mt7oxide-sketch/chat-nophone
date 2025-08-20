import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, path: '/rt' })
export class MessagingGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const uid = client.handshake.auth?.userId;
    if (uid) client.join(uid);
  }

  @SubscribeMessage('msg')
  onMessage(@MessageBody() data: { to: string; cipher: string }, @ConnectedSocket() client: Socket) {
    if (!data?.to || !data?.cipher) return { ok: false };
    this.server.to(data.to).emit('msg', { from: client.handshake.auth?.userId, ...data });
    return { ok: true };
  }
}
