// src/pages/AjouterRecette.jsx
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ingredients } from '../data/donneesTest';
import { useRecettes } from '../context/RecettesContext';
import { reduireImage } from '../utils/photo';

export default function AjouterRecette() {
  const { id } = useParams();     // présent seulement sur /modifier/:id
  const navigate = useNavigate();
  const { mesRecettes, ajouterRecette, modifierRecette } = useRecettes();

  // Mode modification ? Alors on cherche la recette parmi MES recettes
  const modeModif = Boolean(id);
  const aModifier = modeModif ? mesRecettes.find((r) => r.id === Number(id)) : null;

  // Les champs : vides pour un ajout, remplis pour une modification
  const [titre, setTitre] = useState(aModifier?.titre ?? '');
  const [description, setDescription] = useState(aModifier?.description ?? '');
  const [temps, setTemps] = useState(aModifier?.tempsPreparation ?? '');
  const [etapes, setEtapes] = useState(aModifier ? aModifier.etapes.join('\n') : '');
  const [choisis, setChoisis] = useState(aModifier?.ingredientIds ?? []);
  const [photo, setPhoto] = useState(aModifier?.image ?? ''); // photo réduite (texte) ou vide
  const [cleFichier, setCleFichier] = useState(0);            // sert à vider le champ fichier
  const [message, setMessage] = useState('');

  // Modification demandée mais recette introuvable (ou qui n'est pas à moi)
  if (modeModif && !aModifier) {
    return (
      <section className="section">
        <p className="vide">Cette recette est introuvable, ou elle ne vous appartient pas 😕</p>
        <div className="boutons">
          <Link to="/recettes" className="btn btn-secondaire">← Retour aux recettes</Link>
        </div>
      </section>
    );
  }

  // Coche ou décoche un ingrédient
  function basculer(idIng) {
    setChoisis(
      choisis.includes(idIng) ? choisis.filter((c) => c !== idIng) : [...choisis, idIng]
    );
  }

  // Quand l'utilisateur choisit une photo : on la réduit puis on l'affiche
  async function choisirPhoto(e) {
    const fichier = e.target.files[0];
    if (!fichier) return;
    try {
      setPhoto(await reduireImage(fichier));
      setMessage('');
    } catch (erreur) {
      setMessage('❌ ' + erreur.message);
    }
  }

  // Enlève la photo
  function retirerPhoto() {
    setPhoto('');
    setCleFichier(cleFichier + 1); // change la clé : le champ fichier se vide
  }

  // Clic sur "Enregistrer"
  function envoyer(e) {
    e.preventDefault();

    if (choisis.length === 0) {
      setMessage('⚠️ Choisissez au moins un ingrédient.');
      return;
    }

    // Les données de la recette (une étape par ligne dans la zone de texte)
    const donnees = {
      titre,
      description,
      image: photo || null,
      tempsPreparation: Number(temps),
      etapes: etapes.split('\n').filter((ligne) => ligne.trim() !== ''),
      ingredientIds: choisis,
    };

    // Plus tard : ici on appellera les mutations GraphQL
    // "ajouterRecette" ou "modifierRecette"
    const ok = modeModif ? modifierRecette(aModifier.id, donnees) : ajouterRecette(donnees);

    if (!ok) {
      setMessage('⚠️ Le navigateur n\'a plus de place : essayez avec une photo plus petite.');
      return;
    }

    navigate('/recettes'); // on retourne voir la liste
  }

  return (
    <section className="section">
      <h2>{modeModif ? 'Modifier la recette' : 'Ajouter une recette'}</h2>

      <form className="form-carte" onSubmit={envoyer}>
        {message && <div className="message">{message}</div>}

        <label>Titre</label>
        <input value={titre} onChange={(e) => setTitre(e.target.value)}
               placeholder="Ex : Omelette aux tomates" required />

        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)}
               placeholder="Une phrase pour donner envie" />

        <label>Temps de préparation (minutes)</label>
        <input type="number" min="1" value={temps}
               onChange={(e) => setTemps(e.target.value)} placeholder="15" required />

        <label>Photo de la recette (facultatif)</label>
        <input key={cleFichier} type="file" accept="image/*" onChange={choisirPhoto} />

        {/* Aperçu de la photo, avec un bouton pour la retirer */}
        {photo && (
          <div className="apercu-photo">
            <img src={photo} alt="Aperçu" className="detail-banniere" style={{ height: 160 }} />
            <button type="button" onClick={retirerPhoto} className="btn-retirer">
              ✕ Retirer la photo
            </button>
          </div>
        )}

        <label>Ingrédients</label>
        <div className="puces">
          {ingredients.map((ing) => (
            <button
              type="button"
              key={ing.id}
              onClick={() => basculer(ing.id)}
              className={choisis.includes(ing.id) ? 'puce actif' : 'puce'}
            >
              {ing.emoji} {ing.nom}
            </button>
          ))}
        </div>

        <label>Étapes (une par ligne)</label>
        <textarea value={etapes} onChange={(e) => setEtapes(e.target.value)} rows="6"
                  placeholder={'Coupez les légumes.\nFaites-les revenir.\nServez chaud.'} required />

        <button type="submit" className="btn btn-principal btn-plein">
          {modeModif ? 'Enregistrer les modifications' : 'Enregistrer la recette'}
        </button>
      </form>
    </section>
  );
}