import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { ocrModule } from './nodo_ocr/ocr_module';
import { Agent } from './nodo_ocr/entities/agent.entity';
import { Client } from './nodo_ocr/entities/client.entity';
import { ShoppingClient } from './nodo_ocr/entities/shoppingClient.entity';
import { Store } from './nodo_ocr/entities/store.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { CorsMiddleware } from '@nest-middlewares/cors';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || '8080',
      port: 1433,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Agent, Client, ShoppingClient, Store],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
      },
    }),
    CommonModule,
    ocrModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*');
  }
}
