import { IsNotEmpty } from 'class-validator'

export class CreateMemberDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  role: string
}
