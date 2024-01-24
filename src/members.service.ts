import { Injectable } from '@nestjs/common'
import { Member, Prisma } from '@prisma/client'
import { PrismaService } from './database/prisma.service'

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Member[]> {
    const members = await this.prisma.member.findMany()

    return members
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        id,
      },
    })

    return member
  }

  async create({ name, role }: Prisma.MemberCreateInput): Promise<Member> {
    const member = await this.prisma.member.create({
      data: {
        name,
        role,
      },
    })

    return member
  }

  async update(
    id: string,
    { name, role }: Omit<Prisma.MemberUpdateInput, 'id'>,
  ): Promise<void> {
    await this.prisma.member.update({
      where: {
        id,
      },
      data: {
        name,
        role,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.member.delete({
      where: {
        id,
      },
    })
  }
}
