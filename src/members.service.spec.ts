import { Test, TestingModule } from '@nestjs/testing'
import { Member, Prisma } from '@prisma/client'
import { MembersService } from './members.service'
import { PrismaService } from './database/prisma.service'

const fakeMembers: Member[] = [
  {
    id: 'existing-member-id',
    name: 'John Doe',
    role: 'CTO',
  },
]

const prismaServiceMock = {
  member: {
    findMany: jest.fn().mockResolvedValue(fakeMembers),
    findUnique: jest.fn(
      (args: Prisma.MemberFindUniqueArgs) =>
        fakeMembers.find((member) => member.id === args.where.id) ?? null,
    ),
    create: jest.fn((args: Prisma.MemberCreateArgs) => ({
      id: 'created-member-id',
      name: args.data.name,
      role: args.data.role,
    })),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

describe('MembersService', () => {
  let membersService: MembersService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile()

    membersService = module.get<MembersService>(MembersService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return all members', async () => {
      expect(await membersService.findAll()).toStrictEqual(fakeMembers)
      expect(prismaService.member.findMany).toHaveBeenCalledTimes(1)
      expect(prismaService.member.findMany).toHaveBeenCalledWith()
    })
  })

  describe('findById', () => {
    it('should return the member matching the id', async () => {
      expect(await membersService.findById('existing-member-id')).toStrictEqual(
        fakeMembers[0],
      )
      expect(prismaService.member.findUnique).toHaveBeenCalledTimes(1)
      expect(prismaService.member.findUnique).toHaveBeenCalledWith({
        where: { id: 'existing-member-id' },
      })
    })

    it('should return null when member is not found', async () => {
      expect(await membersService.findById('not-found-id')).toBeNull()
      expect(prismaService.member.findUnique).toHaveBeenCalledTimes(1)
      expect(prismaService.member.findUnique).toHaveBeenCalledWith({
        where: { id: 'not-found-id' },
      })
    })
  })

  describe('create', () => {
    it('should create a member', async () => {
      const name = 'Tom Delvalle'
      const role = 'CEO'

      expect(await membersService.create({ name, role })).toStrictEqual({
        id: 'created-member-id',
        name,
        role,
      })
      expect(prismaService.member.create).toHaveBeenCalledTimes(1)
      expect(prismaService.member.create).toHaveBeenCalledWith({
        data: {
          name,
          role,
        },
      })
    })
  })

  describe('update', () => {
    it('should update the member matching the id', async () => {
      const name = 'Tom Delvalle'
      const role = 'CEO'

      await membersService.update('existing-member-id', { name, role })

      expect(prismaService.member.update).toHaveBeenCalledTimes(1)
      expect(prismaService.member.update).toHaveBeenCalledWith({
        where: { id: 'existing-member-id' },
        data: { name, role },
      })
    })
  })

  describe('delete', () => {
    it('should delete the member matching the id', async () => {
      await membersService.delete('existing-member-id')

      expect(prismaService.member.delete).toHaveBeenCalledTimes(1)
      expect(prismaService.member.delete).toHaveBeenCalledWith({
        where: { id: 'existing-member-id' },
      })
    })
  })
})
