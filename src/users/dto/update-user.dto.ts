import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  readonly password: string;
}
