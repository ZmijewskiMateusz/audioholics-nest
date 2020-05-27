import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbConfigService {
  constructor(private configService: ConfigService) {}
  
  get type(): string {
    return this.configService.get<string>('db.type');
  }
  get host(): string {
    return this.configService.get<string>('db.host');
  }
  get port(): number {
   return Number(this.configService.get<number>('db.port'));
  }
  get username(): string {
    return this.configService.get<string>('db.username');
  }
  get password(): string {
    return this.configService.get<string>('db.password');
  }
  get database(): string {
    return this.configService.get<string>('db.database');
  }
  get synchronize(): boolean {
    return Boolean(this.configService.get<boolean>('db.synchronize'));
  }
}