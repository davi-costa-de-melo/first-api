import {
  HttpCode,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common'
import { Member as MemberModel } from '@prisma/client'
import { MembersService } from './members.service'
import { CreateMemberDto, UpdateMemberDto } from './dto'

@Controller('members')
export class AppController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async getMembers(): Promise<{ members: MemberModel[] }> {
    const members = await this.membersService.findAll()

    return { members }
  }

  @Get(':id')
  async getMemberById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ member: MemberModel }> {
    const member = await this.membersService.findById(id)

    if (!member) {
      throw new NotFoundException('Member not found')
    }

    return { member }
  }

  @Post()
  @HttpCode(201)
  async createMember(
    @Body() { name, role }: CreateMemberDto,
  ): Promise<{ member: MemberModel }> {
    const member = await this.membersService.create({ name, role })

    return { member }
  }

  @Put(':id')
  @HttpCode(204)
  async updateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { name, role }: UpdateMemberDto,
  ): Promise<void> {
    const member = await this.membersService.findById(id)

    if (!member) {
      throw new NotFoundException('Member not found')
    }

    await this.membersService.update(id, { name, role })
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteMember(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const member = await this.membersService.findById(id)

    if (!member) {
      throw new NotFoundException('Member not found')
    }

    await this.membersService.delete(id)
  }
}
