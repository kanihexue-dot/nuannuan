import { createMockMemoryService } from './mockMemoryService';
import { createMemoryRepository } from './repository';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-27T08:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

it('creates a visible low risk memory from friendship content', () => {
  const repo = createMemoryRepository();
  const service = createMockMemoryService(repo);

  const result = service.processEntry({
    sourceType: 'chat',
    text: '最近和朋友关系有点僵，她回消息很慢，我会一直想是不是我做错了什么。',
  });

  expect(result.memory?.summary).toContain('朋友');
  expect(result.memory?.riskLevel).toBe('low');
  expect(result.riskRecord.actionTaken).toBe('stored_memory');
  expect(repo.listMemories()).toEqual([result.memory]);
});

it('softens medium risk summaries and keeps them visible', () => {
  const repo = createMemoryRepository();
  const service = createMockMemoryService(repo);

  const result = service.processEntry({
    sourceType: 'record',
    text: '我这几天一直睡不着，觉得很崩溃，也很无助。',
  });

  expect(result.memory?.riskLevel).toBe('medium');
  expect(result.memory?.summary).not.toContain('很崩溃');
  expect(result.memory?.summary).not.toContain('无助');
  expect(result.riskRecord.riskTags).toContain('hopelessness_signal');
  expect(repo.listMemories()).toEqual([result.memory]);
});

it('does not save high risk original details and creates safety guide log', () => {
  const repo = createMemoryRepository();
  const service = createMockMemoryService(repo);

  const result = service.processEntry({
    sourceType: 'chat',
    text: '我想自伤，不想活了。',
  });

  expect(result.memory).toBeUndefined();
  expect(result.riskRecord.riskLevel).toBe('high');
  expect(result.riskRecord.actionTaken).toBe('safety_guide');
  expect(repo.listMemories()).toEqual([]);
  expect(repo.listSafetyGuideLogs()[0].guideType).toBe('emergency_support');
});
