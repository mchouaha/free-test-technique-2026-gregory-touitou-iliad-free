import { fetchIntents as fetchMockIntents } from '../mock/intents.ts';
import type { ScreenIntents } from '../mock/intents.ts';

/** Data-access boundary for intents; currently backed by the assessment mock. */
export function fetchIntents(screenId: string): Promise<ScreenIntents | undefined> {
  return fetchMockIntents(screenId);
}
