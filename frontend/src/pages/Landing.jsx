// src/pages/Landing.jsx
import { Link } from 'react-router-dom';

// Les 6 cartes de la section "Fonctionnalités"
const fonctionnalites = [
  { icone: '🧺', titre: 'Votre frigo en quelques clics', texte: 'Cochez les ingrédients que vous avez chez vous, rien de plus.' },
  { icone: '🍳', titre: 'Des recettes réalisables', texte: 'On vous montre uniquement ce que vous pouvez cuisiner tout de suite.' },
  { icone: '📖', titre: 'Recettes détaillées', texte: 'Ingrédients, étapes et temps de préparation sur une seule page.' },
  { icone: '✍️', titre: 'Ajoutez les vôtres', texte: 'Partagez vos propres recettes avec les autres utilisateurs.' },
  { icone: '⭐', titre: 'Notes et avis', texte: 'Donnez votre avis et découvrez les recettes préférées des autres.' },
  { icone: '💸', titre: 'Moins de courses', texte: 'Cuisinez avec ce que vous avez déjà et gardez votre budget.' },
];

// Les 3 étapes de "Comment ça marche"
const etapes = [
  { numero: '1', titre: 'Ouvrez votre frigo', texte: 'Sélectionnez les ingrédients que vous avez sous la main.' },
  { numero: '2', titre: 'Choisissez une idée', texte: 'L\'app vous propose les recettes que vous pouvez faire.' },
  { numero: '3', titre: 'Régalez-vous', texte: 'Suivez les étapes, puis laissez votre avis.' },
];

// Les questions de la FAQ
const questions = [
  { q: 'L\'application est-elle gratuite ?', r: 'Oui, entièrement. Il suffit de créer un compte pour commencer.' },
  { q: 'Que se passe-t-il si je n\'ai pas tous les ingrédients ?', r: 'L\'app vous montre les recettes réalisables avec ce que vous avez coché. Ajoutez des ingrédients pour voir plus d\'idées.' },
  { q: 'Puis-je ajouter mes propres recettes ?', r: 'Oui ! Depuis la page « Ajouter », vous créez une recette avec son titre, ses étapes et ses ingrédients.' },
];

export default function Landing() {
  return (
    <>
      {/* ---------- 1. Le grand bloc d'accueil ---------- */}
      <section className="hero">
        <span className="badge">🥗 Vos restes méritent mieux</span>

        <h1>
          Ouvrez le frigo, <br />
          <span className="degrade">on s'occupe du menu !</span>
        </h1>

        <p>
          Dites-nous ce que vous avez sous la main et trouvez en un instant
          des recettes simples à préparer, sans courses en plus.
        </p>

        <div className="boutons">
          <Link to="/inscription" className="btn btn-principal">
            Trouver ma recette →
          </Link>
          <a href="#presentation" className="btn btn-secondaire">Voir comment ça marche</a>
        </div>

        <p className="note">✅ Gratuit et sans engagement</p>
      </section>

      {/* ---------- 2. C'est quoi ? (explication + aperçu) ---------- */}
      <section className="section" id="presentation">
        <div className="presentation">
          {/* Colonne gauche : le texte */}
          <div>
            <span className="badge">C'est quoi Mon Frigo Malin ?</span>
            <h2 className="titre-gauche">Une idée de repas à partir de ce qu'il vous reste</h2>
            <p className="texte-presentation">
              Qui n'a jamais ouvert son frigo en se demandant quoi cuisiner ?
              Mon Frigo Malin vous aide à transformer vos ingrédients du moment
              en vrais repas, et vous évite de jeter ou de racheter inutilement.
            </p>
            <ul className="liste-points">
              <li>✔ Sélectionnez vos ingrédients</li>
              <li>✔ Obtenez les recettes possibles</li>
              <li>✔ Cuisinez, notez et partagez</li>
            </ul>
          </div>

          {/* Colonne droite : un faux aperçu de l'app, dessiné en HTML/CSS */}
          <div className="apercu">
            <div className="apercu-titre">🧊 Mon frigo</div>
            <div className="puces">
              <span className="puce actif">🥚 Œufs ✓</span>
              <span className="puce actif">🍅 Tomates ✓</span>
              <span className="puce">🧀 Fromage</span>
              <span className="puce actif">🍚 Riz ✓</span>
              <span className="puce">🥔 Pommes de terre</span>
            </div>
            <div className="apercu-sous-titre">2 recettes possibles</div>
            <div className="apercu-recette">🍳 <b>Omelette aux tomates</b><span>⏱ 10 min</span></div>
            <div className="apercu-recette">🍚 <b>Riz sauté aux œufs</b><span>⏱ 15 min</span></div>
          </div>
        </div>
      </section>

      {/* ---------- 3. Les fonctionnalités ---------- */}
      <section className="section" id="fonctionnalites">
        <h2>Tout ce qu'il faut pour cuisiner malin</h2>
        <div className="grille-3">
          {fonctionnalites.map((f) => (
            <div className="carte-info" key={f.titre}>
              <div className="carte-icone">{f.icone}</div>
              <h3>{f.titre}</h3>
              <p>{f.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 4. Comment ça marche ---------- */}
      <section className="section section-vert" id="comment">
        <h2>Comment ça marche ?</h2>
        <div className="grille-3">
          {etapes.map((e) => (
            <div className="etape" key={e.numero}>
              <div className="numero">{e.numero}</div>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 5. FAQ ---------- */}
      <section className="section faq">
        <h2>Questions fréquentes</h2>
        {questions.map((item) => (
          // <details> : s'ouvre et se ferme au clic, sans code en plus
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.r}</p>
          </details>
        ))}
      </section>

      {/* ---------- 6. Appel final ---------- */}
      <section className="appel-final">
        <h2>Prêt à vider votre frigo malin ?</h2>
        <p>Créez votre compte gratuitement et trouvez votre première recette.</p>
        <Link to="/inscription" className="btn btn-blanc">Créer mon compte →</Link>
      </section>

      {/* ---------- 7. Pied de page ---------- */}
      <footer className="footer">
        © 2027 Mon Frigo Malin — Projet réalisé avec React, Spring Boot et GraphQL
      </footer>
    </>
  );
}