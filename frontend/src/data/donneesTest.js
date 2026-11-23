// src/data/donneesTest.js

// La liste de tous les ingrédients possibles
export const ingredients = [
  { id: 1, nom: 'Œufs', emoji: '🥚' },
  { id: 2, nom: 'Tomates', emoji: '🍅' },
  { id: 3, nom: 'Riz', emoji: '🍚' },
  { id: 4, nom: 'Fromage', emoji: '🧀' },
  { id: 5, nom: 'Pommes de terre', emoji: '🥔' },
  { id: 6, nom: 'Oignons', emoji: '🧅' },
  { id: 7, nom: 'Thon', emoji: '🐟' },
  { id: 8, nom: 'Lentilles', emoji: '🫘' },
  { id: 9, nom: 'Pâtes', emoji: '🍝' },
  { id: 10, nom: 'Carottes', emoji: '🥕' },
  { id: 11, nom: 'Poulet', emoji: '🍗' },
  { id: 12, nom: 'Laitue', emoji: '🥬' },
];

// Les recettes. "ingredientIds" = les numéros des ingrédients nécessaires
export const recettes = [
  {
    id: 1, emoji: '🍳', titre: 'Omelette aux tomates', tempsPreparation: 10,
    image: '/images/recettes/omelette.png',
    description: 'Une omelette moelleuse, prête en un clin d\'œil.',
    ingredientIds: [1, 2, 6],
    etapes: ['Coupez les oignons et les tomates en petits morceaux.', 'Faites-les revenir 3 minutes dans une poêle.', 'Battez les œufs, versez-les sur les légumes.', 'Laissez cuire 3 minutes, pliez et servez.'],
    avis: [{ id: 1, note: 5, commentaire: 'Simple et délicieux !' }],
  },
  {
    id: 2, emoji: '🍚', titre: 'Riz sauté aux œufs', tempsPreparation: 15,
        image: '/images/recettes/riz-aux-oeufs.png',

    description: 'Le plat parfait pour finir les restes de riz.',
    ingredientIds: [3, 1, 6, 10],
    etapes: ['Faites cuire le riz si besoin.', 'Faites revenir oignons et carottes coupés finement.', 'Ajoutez le riz, puis les œufs battus.', 'Mélangez jusqu\'à ce que les œufs soient cuits.'],
    avis: [{ id: 2, note: 4, commentaire: 'Très rapide.' }, { id: 3, note: 5, commentaire: 'Mon plat préféré du soir.' }],
  },
  {
    id: 3, emoji: '🥗', titre: 'Salade de thon', tempsPreparation: 5,
        image: '/images/recettes/salade_thon.png',

    description: 'Fraîche, légère et sans cuisson.',
    ingredientIds: [7, 2, 12],
    etapes: ['Lavez et découpez la laitue et les tomates.', 'Ajoutez le thon égoutté.', 'Assaisonnez avec huile, citron et sel.'],
    avis: [],
  },
  {
    id: 4, emoji: '🍲', titre: 'Soupe de lentilles', tempsPreparation: 35,
        image: '/images/recettes/Soupe_de_lentilles.png',

    description: 'Une soupe réconfortante pour les jours frais.',
    ingredientIds: [8, 6, 10, 5],
    etapes: ['Épluchez et coupez tous les légumes.', 'Mettez-les dans une casserole avec les lentilles.', 'Couvrez d\'eau et laissez cuire 30 minutes.', 'Mixez si vous aimez une soupe lisse.'],
    avis: [{ id: 4, note: 5, commentaire: 'Parfaite en hiver.' }],
  },
  {
    id: 5, emoji: '🍝', titre: 'Pâtes au fromage', tempsPreparation: 15,
    image: '/images/recettes/pates-fromage.png',
    description: 'Le classique qui sauve tous les soirs.',
    ingredientIds: [9, 4],
    etapes: ['Faites cuire les pâtes dans l\'eau salée.', 'Égouttez, puis ajoutez le fromage râpé.', 'Mélangez jusqu\'à ce qu\'il fonde.'],
    avis: [],
  },
  {
    id: 6, emoji: '🥘', titre: 'Gratin de pommes de terre', tempsPreparation: 40,
        image: '/images/recettes/Gratin_de_pommes_de_terre.png',

    description: 'Doré et fondant, idéal à partager.',
    ingredientIds: [5, 4, 6],
    etapes: ['Coupez les pommes de terre en rondelles.', 'Disposez-les dans un plat avec les oignons.', 'Couvrez de fromage râpé.', 'Enfournez 30 minutes à 180 °C.'],
    avis: [],
  },
];

// Petite fonction pratique : retrouve le nom d'un ingrédient à partir de son numéro
export function nomIngredient(id) {
  return ingredients.find((i) => i.id === id)?.nom ?? '';
}