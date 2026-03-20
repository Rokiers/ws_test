import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma } from "@prisma/client";

const InfoBriefSelect = Prisma.validator<Prisma.OrderSelect>()({
    id:true,
    status:true,
    title:true,
})
export type InfoBrief = Prisma.OrderGetPayload<{select:typeof InfoBriefSelect}>
// 这里最好这么写 因为决定产出的数据形状只有select 和include 来决定，这里先这么写，以后有问题再行修改
@Injectable()
export class InfoService{
    constructor(private prisma:PrismaService){}

    async getInfo():Promise<InfoBrief[]>{
        const user = await this.prisma.order.findMany({
            select:InfoBriefSelect,
            where:{
                status:{
                    not: 'completed'
                }
            }
        });
        return user
    }

    async updateInfo(orderId:string,newStatus:string):Promise<boolean>{
        try{
            await this.prisma.order.update({
                where:{
                    id:orderId,
                },
                data:{
                    status:newStatus
                }
            })
            return true
        }catch(e){
            return false
        }
    }
}
