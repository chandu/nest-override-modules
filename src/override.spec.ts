import {
  DynamicModule,
  INestApplication,
  Module,
  ModuleMetadata,
  Scope,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { describe, it, expect } from 'vitest';
import * as util from 'util';

const tokenSymbol = Symbol('Some-Token');
describe('NestJs Override Modules', () => {
  describe('Can override a provider imported via a module', () => {
    it('should work', async () => {
      @Module({
        providers: [{ provide: tokenSymbol, useValue: 'Batman' }],
      })
      class FirstModule {}

      @Module({
        imports: [FirstModule],
        providers: [
          {
            provide: tokenSymbol,
            useFactory() {
              return 'ROBIN';
            },
          },
        ],
        exports: [tokenSymbol],
      })
      class SecondModule {}

      let app: INestApplication | null = null;
      try {
        app = await NestFactory.create(SecondModule, {
          logger: false,
        });

        const value = app.get(tokenSymbol);
        expect(value).toEqual('Robin');
      } finally {
        app?.close();
      }
    });
  });

  describe('Can override a provider imported via a module#2', () => {
    it('should work', async () => {
      @Module({})
      class FirstModule {
        static register(overrides: ModuleMetadata): DynamicModule {
          return {
            module: FirstModule,
            providers: [
              {
                provide: tokenSymbol,
                useValue: 'Batman',
              },
            ],
            ...overrides,
          };
        }
      }

      @Module({
        imports: [
          FirstModule.register({
            providers: [{ provide: tokenSymbol, useValue: 'Robin' }],
          }),
        ],
      })
      class SecondModule {}
      const moduleRef = await Test.createTestingModule({
        imports: [SecondModule],
      }).compile();
      const value = moduleRef.get(tokenSymbol);
      expect(value).toEqual('Robin');
    });
  });
});
