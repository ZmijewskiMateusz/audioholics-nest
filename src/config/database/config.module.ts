import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { DbConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().default(process.env.DB_TYPE),
        DB_HOST: Joi.string().default(process.env.DB_HOST),
        DB_PORT: Joi.number().default(process.env.DB_PORT),
        DB_USERNAME: Joi.string().default(process.env.DB_USERNAME),
        DB_PASSWORD: Joi.string().default(process.env.DB_PASSWORD),
        DB_DATABASE: Joi.string().default(process.env.DB_DATABASE),
        DB_SYNCHRONIZE: Joi.bool().default(process.env.DB_SYNCHRONIZE),


      }),
    }),
  ],
  providers: [ConfigService, DbConfigService],
  exports: [ConfigService, DbConfigService],
})
export class DbConfigModule {}