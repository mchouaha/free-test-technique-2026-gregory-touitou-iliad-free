export type ScreenIntents = Record<string, Record<string, unknown>>;

const intents = {
  'page-a': {
    'address-form': { default: '16 RUE DE LA VILLE LEVEQUE 75008 PARIS' },
    button: { label: 'Envoyer' },
  },
  'page-b': {
    'accept-cgu': { label: 'J’accepte les CGU' },
    'address-form': {
      'visible-if': { 'accept-cgu': true },
      default: '16 RUE DE LA VILLE LEVEQUE 75008 PARIS',
    },
    button: { label: 'Envoyer' },
  },
} satisfies Record<string, ScreenIntents>;

type ScreenId = keyof typeof intents;

export function fetchIntents(screenId: string): Promise<ScreenIntents | undefined> {
  if (!Object.hasOwn(intents, screenId)) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(intents[screenId as ScreenId]);
    }, 50 + Math.random() * 2950);
  });
}
