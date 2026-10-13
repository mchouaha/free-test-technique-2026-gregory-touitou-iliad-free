import { Link } from 'react-router';
import './App.css';

const screens = [
  {
    id: 'page-a',
    title: 'Formulaire simple',
    description: 'Une adresse et un bouton d’envoi.',
    number: '01',
  },
  {
    id: 'page-b',
    title: 'Formulaire avec condition',
    description: 'Acceptez les CGU pour afficher le champ adresse.',
    number: '02',
  },
];

function App() {
  return (
    <main className="home-shell">
      <div className="screen-brand">
        <span className="brand-mark" aria-hidden="true">✦</span>
        Démarches en ligne
      </div>

      <section className="home-card" aria-labelledby="home-title">
        <p className="screen-eyebrow">Démonstration</p>
        <h1 className="screen-title" id="home-title">Choisissez un écran</h1>
        <p className="screen-description">
          Explorez les formulaires générés dynamiquement à partir des intents du serveur.
        </p>

        <nav className="screen-navigation" aria-label="Écrans de démonstration">
          {screens.map(({ id, title, description, number }) => (
            <Link className="screen-link" key={id} to={`/screen/${id}`}>
              <span className="screen-link-number" aria-hidden="true">{number}</span>
              <span className="screen-link-copy">
                <span className="screen-link-title">{title}</span>
                <span className="screen-link-description">{description}</span>
              </span>
              <span className="screen-link-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}

export default App;
