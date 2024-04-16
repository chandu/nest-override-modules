import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, it, expect } from 'vitest';

describe('NestJs Override Modules', () => {
  describe('Can override a provider imported via a module', () => {
    it('should work', async () => {
      @Module({
        providers: [{ provide: 'Some-Token', useValue: 'Batman' }],
      })
      class FirstModule {}

      @Module({
        imports: [FirstModule],
        providers: [{ provide: 'Some-Token', useValue: 'Robin' }],
      })
      class SecondModule {}
      const moduleRef = await Test.createTestingModule({
        imports: [SecondModule],
      }).compile();
      const value = moduleRef.get('Some-Token');
      expect(value).toEqual('Robin');
    });
  });
});
