// src/utils/erreurs.js

// Transforme une erreur en message simple pour l'utilisateur
export function messageErreur(e) {
  const message = e?.message || '';

  // Le serveur est éteint ou injoignable
  if (message.toLowerCase().includes('fetch') || message.includes('NetworkError')) {
    return 'Impossible de joindre le serveur. Le backend est-il démarré ?';
  }
  return message || 'Une erreur est survenue';
}