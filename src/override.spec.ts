import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, it, expect } from 'vitest';

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
        providers: [{ provide: tokenSymbol, useValue: 'Robin' }],
      })
      class SecondModule {}
      const moduleRef = await Test.createTestingModule({
        imports: [SecondModule],
      }).compile();
      const value = moduleRef.get(tokenSymbol);
      expect(value).toEqual('Robin');
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
