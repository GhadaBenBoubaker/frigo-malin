// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

// Le "contexte" : une boîte partagée par toute l'app
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // L'utilisateur connecté (null = personne). On le relit au démarrage
  // pour rester connecté même après un rechargement de la page.
  const [user, setUser] = useState(() => {
    const sauvegarde = localStorage.getItem('user');
    return sauvegarde ? JSON.parse(sauvegarde) : null;
  });

  // Garde l'utilisateur en mémoire (état React + navigateur)
  function connecter(utilisateur) {
    setUser(utilisateur);
    localStorage.setItem('user', JSON.stringify(utilisateur));
  }

  // Crée un compte. Renvoie un message d'erreur, ou null si tout va bien.
  // (Plus tard : remplacé par la mutation GraphQL "inscription")
  function inscription(nom, email, motDePasse) {
    const comptes = JSON.parse(localStorage.getItem('comptes') || '[]');

    if (comptes.some((c) => c.email === email)) {
      return 'Cet email est déjà utilisé';
    }

    comptes.push({ nom, email, motDePasse });
    localStorage.setItem('comptes', JSON.stringify(comptes));
    connecter({ nom, email });
    return null;
  }

  // Se connecte. Renvoie un message d'erreur, ou null si tout va bien.
  // (Plus tard : remplacé par la mutation GraphQL "connexion")
  function connexion(email, motDePasse) {
    const comptes = JSON.parse(localStorage.getItem('comptes') || '[]');
    const compte = comptes.find(
      (c) => c.email === email && c.motDePasse === motDePasse
    );

    if (!compte) return 'Email ou mot de passe incorrect';

    connecter({ nom: compte.nom, email: compte.email });
    return null;
  }

  // Se déconnecte
  function deconnexion() {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, inscription, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

// Raccourci pour utiliser la boîte dans n'importe quel composant
export function useAuth() {
  return useContext(AuthContext);
}