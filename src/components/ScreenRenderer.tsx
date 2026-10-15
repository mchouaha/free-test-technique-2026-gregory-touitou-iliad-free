import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AcceptCGU from './AcceptCGU.tsx';
import AddressForm from './AddressForm.tsx';
import Button from './Button.tsx';
import type { ScreenIntents } from '../mock/intents.ts';
import { fetchIntents } from '../services/intents.ts';

type LoadState =
  | { status: 'loading'; screenId: string }
  | { status: 'success'; screenId: string; intents: ScreenIntents }
  | { status: 'error'; screenId: string; message: string };

export default function ScreenRenderer() {
  const { screenId } = useParams();
  const [loadState, setLoadState] = useState<LoadState | null>(null);
  const [acceptCguChecked, setAcceptCguChecked] = useState(false);

  useEffect(() => {
    let isCurrentRequest = true;
    setAcceptCguChecked(false);

    if (!screenId) return;

    setLoadState({ status: 'loading', screenId });

    fetchIntents(screenId)
      .then((result) => {
        if (!isCurrentRequest) return;
        if (!result) {
          setLoadState({
            status: 'error',
            screenId,
            message: `L’écran « ${screenId} » est introuvable.`,
          });
          return;
        }
        setLoadState({ status: 'success', screenId, intents: result });
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;
        setLoadState({
          status: 'error',
          screenId,
          message: error instanceof Error && error.message
            ? `Impossible de charger l’écran : ${error.message}`
            : 'Une erreur est survenue pendant le chargement. Veuillez réessayer.',
        });
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [screenId]);

  if (!screenId) {
    return (
      <main className="screen-shell">
        <section className="screen-card screen-error" role="alert" aria-labelledby="screen-error-title">
          <p className="screen-eyebrow">Écran manquant</p>
          <h1 className="screen-title" id="screen-error-title">Aucun écran sélectionné</h1>
          <p className="screen-description">
            Indiquez un identifiant d’écran dans l’adresse, par exemple <code>/screen/page-a</code>.
          </p>
        </section>
      </main>
    );
  }

  // Avoid showing the previous screen for the render before the new effect runs.
  if (!loadState || loadState.screenId !== screenId || loadState.status === 'loading') {
    return <div className="screen-loading">Chargement de votre formulaire…</div>;
  }

  if (loadState.status === 'error') {
    return (
      <main className="screen-shell">
        <section className="screen-card screen-error" role="alert" aria-labelledby="screen-error-title">
          <p className="screen-eyebrow">Erreur de chargement</p>
          <h1 className="screen-title" id="screen-error-title">Impossible d’afficher cet écran</h1>
          <p className="screen-description">{loadState.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="screen-shell">
      <div className="screen-brand">
        <span className="brand-mark" aria-hidden="true">✦</span>
        Démarches en ligne
      </div>
      <section className="screen-card" aria-labelledby="screen-title">
        <header className="screen-card-header">
          <p className="screen-eyebrow">Votre dossier · Étape 1 sur 2</p>
          <h1 className="screen-title" id="screen-title">Complétez vos informations</h1>
          <p className="screen-description">Vérifiez les informations ci-dessous pour poursuivre votre démarche en toute simplicité.</p>
        </header>
        <div className="intent-list">
          {Object.entries(loadState.intents).map(([name, props]) => {
            if (!isVisible(props['visible-if'], acceptCguChecked)) return null;

            const componentProps = props;
            switch (name) {
              case 'address-form':
                return <AddressForm key={name} {...(componentProps as { default: string })} />;
              case 'accept-cgu':
                return (
                  <AcceptCGU
                    key={name}
                    {...(componentProps as { label: string })}
                    checked={acceptCguChecked}
                    onCheckedChange={setAcceptCguChecked}
                  />
                );
              case 'button':
                return <Button key={name} {...(componentProps as { label: string })} />;
              default:
                return null;
            }
          })}
        </div>
      </section>
    </main>
  );
}

function isVisible(rule: unknown, acceptCguChecked: boolean): boolean {
  if (rule === undefined) return true;
  if (typeof rule !== 'object' || rule === null || Array.isArray(rule)) return false;

  const acceptCguRule = (rule as Record<string, unknown>)['accept-cgu'];
  return typeof acceptCguRule === 'boolean' && acceptCguChecked === acceptCguRule;
}
