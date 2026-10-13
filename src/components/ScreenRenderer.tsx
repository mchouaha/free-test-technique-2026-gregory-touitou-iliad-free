import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AcceptCGU from './AcceptCGU.tsx';
import AddressForm from './AddressForm.tsx';
import Button from './Button.tsx';
import { fetchIntents, type ScreenIntents } from '../mock/intents.ts';

export default function ScreenRenderer() {
  const { screenId } = useParams();
  const [intents, setIntents] = useState<ScreenIntents | null>(null);
  const [acceptCguChecked, setAcceptCguChecked] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setIntents(null);
    setAcceptCguChecked(false);

    if (!screenId) return;

    fetchIntents(screenId).then((result) => {
      if (isCurrent) setIntents(result ?? {});
    });

    return () => {
      isCurrent = false;
    };
  }, [screenId]);

  if (intents === null) {
    return <div className="screen-loading">Chargement de votre formulaire…</div>;
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
          {Object.entries(intents).map(([name, props]) => {
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
