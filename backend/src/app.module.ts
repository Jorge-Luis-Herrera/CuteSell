import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Servir frontend estático en producción
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend/out'),
      exclude: ['/api/*', '/uploads/*'],
    }),
    // Servir uploads de imágenes
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    InventoryModule,
  ],
})
export class AppModule {}
