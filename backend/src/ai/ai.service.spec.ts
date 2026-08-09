import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

describe('AiService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGenerateContent.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retries transient failures and falls back to another model', async () => {
    mockGenerateContent
      .mockRejectedValueOnce(Object.assign(new Error('503 UNAVAILABLE'), { status: 503 }))
      .mockRejectedValueOnce(Object.assign(new Error('503 UNAVAILABLE'), { status: 503 }))
      .mockRejectedValueOnce(Object.assign(new Error('503 UNAVAILABLE'), { status: 503 }))
      .mockRejectedValueOnce(Object.assign(new Error('503 UNAVAILABLE'), { status: 503 }))
      .mockResolvedValueOnce({
        text: 'ok',
        candidates: [{ finishReason: 'STOP' }],
        promptFeedback: {},
      });

    const service = new AiService({
      get: jest.fn().mockReturnValue('test-key'),
    } as unknown as ConfigService);

    const promise = service.generateCompletion('system', 'user');

    await jest.advanceTimersByTimeAsync(7000);
    await expect(promise).resolves.toBe('ok');

    expect(mockGenerateContent).toHaveBeenCalledTimes(5);
    expect(mockGenerateContent.mock.calls[0][0].model).toBe('gemini-3.6-flash');
    expect(mockGenerateContent.mock.calls[4][0].model).toBe('gemini-3.5-flash');
  });
});
