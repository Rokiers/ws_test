import { WebSocketGateway,SubscribeMessage,MessageBody,WebSocketServer,OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { InfoService,InfoBrief } from "./app.InfoService";
import { WsResponse } from "@nestjs/websockets";
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

    private async broadcastUpdate(){
        const orders = await this.infoService.getInfo();
        this.server.emit('order_need_update',orders)
    }

    @SubscribeMessage('get_all_orders')
    async handelGetAllOrder(@MessageBody() data:any):Promise<WsResponse<InfoBrief[]>>{
        const orders =  await this.infoService.getInfo()
        return { event:'get_all_orders',data:orders}
    }

    @SubscribeMessage('update_order_info')
    async handelUpdateOrder(@MessageBody() data:{id:string,status:string}){
        const commandStatus = await this.infoService.updateInfo(data.id,data.status);
        this.broadcastUpdate();
        return {event:'update_order_info',data:commandStatus}
    }
}
