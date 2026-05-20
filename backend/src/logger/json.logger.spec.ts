import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  describe('formatting written to console', () => {
    it('writes a single JSON line for log() with level log', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      logger.log('hello');
      expect(spy).toHaveBeenCalledTimes(1);
      const line = spy.mock.calls[0][0] as string;
      const parsed = JSON.parse(line) as {
        level: string;
        message: string;
        optionalParams: string[];
      };
      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('hello');
      expect(parsed.optionalParams).toEqual([]);
      spy.mockRestore();
    });

    it('serializes extra arguments into optionalParams', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      logger.log('x', { a: 1 }, 42);
      const line = spy.mock.calls[0][0] as string;
      const parsed = JSON.parse(line) as {
        optionalParams: string[];
      };
      expect(parsed.optionalParams[0]).toBe('{"a":1}');
      expect(parsed.optionalParams[1]).toBe('42');
      spy.mockRestore();
    });

    it('writes error level to console.error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      logger.error('fail');
      const line = spy.mock.calls[0][0] as string;
      expect(JSON.parse(line).level).toBe('error');
      spy.mockRestore();
    });
  });
});
