import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AssessmentTimerEngine } from '@/lib/games/core/timer';

describe('AssessmentTimerEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts and calculates elapsed time', () => {
    // We inject a fake time provider for ultimate safety, 
    // but vi.setSystemTime works globally for Date.now()
    vi.setSystemTime(1000);
    const timer = new AssessmentTimerEngine(60, undefined, { now: () => Date.now() });
    
    expect(timer.getElapsedTimeMs()).toBe(0);
    
    timer.start();
    vi.setSystemTime(5000);
    
    expect(timer.getElapsedTimeMs()).toBe(4000);
    expect(timer.getRemainingSeconds()).toBe(56);
  });

  it('handles stop and reset', () => {
    vi.setSystemTime(1000);
    const timer = new AssessmentTimerEngine(60, undefined, { now: () => Date.now() });
    
    timer.start();
    vi.setSystemTime(3000); // 2s elapsed
    timer.stop();
    vi.setSystemTime(5000); // Wait 2s more
    
    // Elapsed time should still be 2000
    expect(timer.getElapsedTimeMs()).toBe(2000);

    timer.reset();
    expect(timer.getElapsedTimeMs()).toBe(0);
    expect(timer.getRemainingSeconds()).toBe(60);
  });

  it('calls onComplete when time runs out', () => {
    const onComplete = vi.fn();
    vi.setSystemTime(0);
    const timer = new AssessmentTimerEngine(10, onComplete, { now: () => Date.now() });
    
    timer.start();
    
    // Simulate tick loops that the browser would normally do
    vi.setSystemTime(11000); // 11s passed
    // We have to manually tick for tests since we're not running real timers,
    // or just rely on the fallback setTimeout
    vi.advanceTimersByTime(11000); 
    
    expect(onComplete).toHaveBeenCalled();
    expect(timer.getRemainingTimeMs()).toBe(0);
  });
});
