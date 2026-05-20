import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  describe('TSKV line format', () => {
    it('emits tab-separated key=value pairs ending with newline', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      logger.log('ping');
      expect(spy).toHaveBeenCalledTimes(1);
      const line = spy.mock.calls[0][0] as string;
      expect(line.endsWith('\n')).toBe(true);
      const trimmed = line.trimEnd();
      const pairs = trimmed.split('\t');
      expect(pairs).toEqual(['level=log', 'message=ping']);
      spy.mockRestore();
    });

    it('maps extra params to p0, p1, ... as string values', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      logger.log('m', 'a', 2);
      const line = spy.mock.calls[0][0] as string;
      const trimmed = line.trimEnd();
      const map = Object.fromEntries(
        trimmed.split('\t').map((kv) => {
          const eq = kv.indexOf('=');
          return [kv.slice(0, eq), kv.slice(eq + 1)];
        }),
      );
      expect(map.level).toBe('log');
      expect(map.message).toBe('m');
      expect(map.p0).toBe('a');
      expect(map.p1).toBe('2');
      spy.mockRestore();
    });

    it('replaces tab and newline inside values with spaces', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      logger.log('a\tb\nc');
      const line = spy.mock.calls[0][0] as string;
      const messagePair = line
        .trimEnd()
        .split('\t')
        .find((p) => p.startsWith('message='));
      expect(messagePair).toBeDefined();
      expect(messagePair).toBe('message=a b c');
      spy.mockRestore();
    });
  });
});
