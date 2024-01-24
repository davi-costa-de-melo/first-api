import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { Prisma, Member } from '@prisma/client'
import { AppController } from './app.controller'
import { MembersService } from './members.service'

const fakeMembers: Member[] = [
  {
    id: 'existing-member-id',
    name: 'John Doe',
    role: 'CTO',
  },
]

const membersServiceMock = {
  findAll: jest.fn().mockResolvedValue(fakeMembers),
  findById: jest.fn(
    (id: string) => fakeMembers.find((member) => member.id === id) ?? null,
  ),
  create: jest.fn(({ name, role }: Prisma.MemberCreateInput) =>
    Promise.resolve({
      id: 'created-member-id',
      name,
      role,
    }),
  ),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('AppController', () => {
  let appController: AppController
  let membersService: MembersService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: MembersService, useValue: membersServiceMock }],
    }).compile()

    appController = app.get<AppController>(AppController)
    membersService = app.get<MembersService>(MembersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getMembers', () => {
    it('should return all members', async () => {
      expect(await appController.getMembers()).toStrictEqual({
        members: fakeMembers,
      })
      expect(membersService.findAll).toHaveBeenCalledTimes(1)
      expect(membersService.findAll).toHaveBeenCalledWith()
    })
  })

  describe('getMemberById', () => {
    it('should return the member matching the id', async () => {
      expect(
        await appController.getMemberById('existing-member-id'),
      ).toStrictEqual({
        member: fakeMembers[0],
      })
      expect(membersService.findById).toHaveBeenCalledTimes(1)
      expect(membersService.findById).toHaveBeenCalledWith('existing-member-id')
    })

    it('should throw NotFoundException when member is not found', async () => {
      await expect(appController.getMemberById('not-found-id')).rejects.toThrow(
        new NotFoundException('Member not found'),
      )

      expect(membersService.findById).toHaveBeenCalledTimes(1)
      expect(membersService.findById).toHaveBeenCalledWith('not-found-id')
    })
  })

  describe('createMember', () => {
    it('should create a member', async () => {
      const name = 'Tom Delvalle'
      const role = 'CEO'

      expect(await appController.createMember({ name, role })).toStrictEqual({
        member: { id: 'created-member-id', name, role },
      })
      expect(membersService.create).toHaveBeenCalledTimes(1)
      expect(membersService.create).toHaveBeenCalledWith({ name, role })
    })
  })

  describe('updateMember', () => {
    it('should update the member matching the id', async () => {
      const name = 'George Rivera'
      const role = 'CEO'

      await appController.updateMember('existing-member-id', { name, role })

      expect(membersService.findById).toHaveBeenCalledTimes(1)
      expect(membersService.findById).toHaveBeenCalledWith('existing-member-id')
      expect(membersService.update).toHaveBeenCalledTimes(1)
      expect(membersService.update).toHaveBeenCalledWith('existing-member-id', {
        name,
        role,
      })
    })

    it('should throw NotFoundException when member is not found', async () => {
      await expect(
        appController.updateMember('not-found-id', {}),
      ).rejects.toThrow(new NotFoundException('Member not found'))

      expect(membersService.findById).toHaveBeenCalledTimes(1)
      expect(membersService.findById).toHaveBeenCalledWith('not-found-id')
      expect(membersService.update).toHaveBeenCalledTimes(0)
    })
  })

  describe('deleteMember', () => {
    it('should delete the member matching the id', async () => {
      await appController.deleteMember('existing-member-id')

      expect(membersService.findById).toHaveBeenCalledTimes(1)
      expect(membersService.findById).toHaveBeenCalledWith('existing-member-id')
      expect(membersService.delete).toHaveBeenCalledTimes(1)
      expect(membersService.delete).toHaveBeenCalledWith('existing-member-id')
    })

    it('should throw NotFoundException when member is not found', async () => {
      await expect(appController.deleteMember('not-found-id')).rejects.toThrow(
        new NotFoundException('Member not found'),
      )

      expect(membersService.findById).toHaveBeenCalledTimes(1)
      expect(membersService.findById).toHaveBeenCalledWith('not-found-id')
      expect(membersService.delete).toHaveBeenCalledTimes(0)
    })
  })
})
