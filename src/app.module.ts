import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaService } from './database/prisma.service'
import { MembersService } from './members.service'

@Module({
  controllers: [AppController],
  providers: [PrismaService, MembersService],
})
export class AppModule {}
