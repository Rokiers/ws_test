import { WebSocketGateway,SubscribeMessage,MessageBody,WebSocketServer,OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { InfoService,InfoBrief } from "./app.InfoService";

@WebSocketGateway({
    namespace:'/order',
    cors: { origin : '*' },
})
export class InfoGateWay implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;

    constructor(private infoService:InfoService){}

    handleConnection(client: Socket) {
        console.log(`client connect ${client.id}`)
    }

    @SubscribeMessage('get_all_orders')
    async handelMessage(@MessageBody() data:any):Promise<InfoBrief[]>{
        return await this.infoService.getInfo()
    }
}
