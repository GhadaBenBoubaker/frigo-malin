// src/pages/AjouterRecette.jsx
import { useState } from 'react';
import { ingredients } from '../data/donneesTest';

// Mets "true" quand le backend de ton binôme est prêt (route /upload)
const BACKEND_PRET = false;

export default function AjouterRecette() {
  // ----- Ce que l'utilisateur écrit -----
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [temps, setTemps] = useState('');
  const [etapes, setEtapes] = useState('');
  const [choisis, setChoisis] = useState([]);   // numéros des ingrédients choisis

  // ----- La photo -----
  const [fichier, setFichier] = useState(null); // le fichier choisi
  const [apercu, setApercu] = useState('');     // l'aperçu à afficher
  const [cleFichier, setCleFichier] = useState(0); // sert à vider le champ fichier

  // ----- Les messages -----
  const [message, setMessage] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  // Coche ou décoche un ingrédient
  function basculer(id) {
    if (choisis.includes(id)) {
      setChoisis(choisis.filter((c) => c !== id)); // déjà choisi : on le retire
    } else {
      setChoisis([...choisis, id]);                // pas choisi : on l'ajoute
    }
  }

  // Quand l'utilisateur choisit une photo
  function choisirPhoto(e) {
    const f = e.target.files[0];
    if (!f) return;

    // On refuse les fichiers trop lourds (5 Mo maximum)
    if (f.size > 5 * 1024 * 1024) {
      setMessage('⚠️ La photo est trop lourde (5 Mo maximum).');
      return;
    }

    setFichier(f);
    setApercu(URL.createObjectURL(f)); // lien temporaire pour l'aperçu
    setMessage('');
  }

  // Enlève la photo choisie
  function retirerPhoto() {
    setFichier(null);
    setApercu('');
    setCleFichier(cleFichier + 1); // change la "clé" : le champ fichier se vide
  }

  // Quand on clique sur "Enregistrer la recette"
  async function envoyer(e) {
    e.preventDefault(); // empêche le rechargement de la page

    if (choisis.length === 0) {
      setMessage('⚠️ Choisissez au moins un ingrédient.');
      return;
    }

    setEnvoiEnCours(true);
    setMessage('');

    try {
      let adresseImage = null;

      // 1) S'il y a une photo ET que le backend est prêt, on l'envoie d'abord
      if (fichier && BACKEND_PRET) {
        const donnees = new FormData(); // l'outil pour envoyer un fichier
        donnees.append('fichier', fichier);

        const reponse = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: donnees,
        });

        if (!reponse.ok) throw new Error("L'envoi de la photo a échoué");

        // Le backend répond par exemple : { "chemin": "/uploads/abc123.jpg" }
        const resultat = await reponse.json();
        adresseImage = resultat.chemin;
      }

      // 2) On prépare la recette. Une étape par ligne dans la zone de texte.
      const recette = {
        titre,
        description,
        image: adresseImage,
        tempsPreparation: Number(temps),
        etapes: etapes.split('\n').filter((ligne) => ligne.trim() !== ''),
        ingredientIds: choisis,
      };

      // Plus tard : ici on appellera la mutation GraphQL "ajouterRecette"
      console.log('Recette à enregistrer :', recette);

      setMessage("✅ Recette enregistrée (simulation pour l'instant) !");

      // 3) On vide le formulaire
      setTitre('');
      setDescription('');
      setTemps('');
      setEtapes('');
      setChoisis([]);
      retirerPhoto();
    } catch (erreur) {
      setMessage('❌ Erreur : ' + erreur.message);
    } finally {
      setEnvoiEnCours(false); // dans tous les cas, on réactive le bouton
    }
  }

  return (
    <section className="section">
      <h2>Ajouter une recette</h2>

      <form className="form-carte" onSubmit={envoyer}>
        {/* Message de succès ou d'erreur */}
        {message && <div className="message">{message}</div>}

        <label>Titre</label>
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex : Omelette aux tomates"
          required
        />

        <label>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Une phrase pour donner envie"
        />

        <label>Temps de préparation (minutes)</label>
        <input
          type="number"
          min="1"
          value={temps}
          onChange={(e) => setTemps(e.target.value)}
          placeholder="15"
          required
        />

        <label>Photo de la recette (facultatif)</label>
        <input
          key={cleFichier}   /* quand la clé change, le champ est remis à zéro */
          type="file"
          accept="image/*"   /* accepte seulement les images */
          onChange={choisirPhoto}
        />

        {/* Aperçu de la photo, avec un bouton pour la retirer */}
        {apercu && (
          <div className="apercu-photo">
            <img src={apercu} alt="Aperçu" className="detail-banniere" style={{ height: 160 }} />
            <button type="button" onClick={retirerPhoto} className="btn-retirer">
              ✕ Retirer la photo
            </button>
          </div>
        )}

        <label>Ingrédients</label>
        <div className="puces">
          {ingredients.map((ing) => (
            <button
              type="button" /* "button" évite d'envoyer le formulaire par erreur */
              key={ing.id}
              onClick={() => basculer(ing.id)}
              className={choisis.includes(ing.id) ? 'puce actif' : 'puce'}
            >
              {ing.emoji} {ing.nom}
            </button>
          ))}
        </div>

        <label>Étapes (une par ligne)</label>
        <textarea
          value={etapes}
          onChange={(e) => setEtapes(e.target.value)}
          rows="6"
          placeholder={'Coupez les légumes.\nFaites-les revenir.\nServez chaud.'}
          required
        />

        <button
          type="submit"
          className="btn btn-principal btn-plein"
          disabled={envoiEnCours} /* bloque le bouton pendant l'envoi */
        >
          {envoiEnCours ? 'Envoi en cours...' : 'Enregistrer la recette'}
        </button>
      </form>
    </section>
  );
}