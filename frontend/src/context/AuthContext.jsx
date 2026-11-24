// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { INSCRIPTION, CONNEXION } from '../graphql/mutations';
import { messageErreur } from '../utils/erreurs';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const client = useApolloClient(); // pour appeler le backend

  // L'utilisateur connecté. Il faut le profil ET le jeton pour être connecté.
  const [user, setUser] = useState(() => {
    const sauvegarde = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return sauvegarde && token ? JSON.parse(sauvegarde) : null;
  });

  // Garde le jeton et l'utilisateur (état React + navigateur)
  function connecter(token, utilisateur) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(utilisateur));
    setUser(utilisateur);
  }

  // Crée un compte. Renvoie un message d'erreur, ou null si tout va bien.
  async function inscription(nom, email, motDePasse) {
    try {
      const { data } = await client.mutate({
        mutation: INSCRIPTION,
        variables: { input: { nom, email, motDePasse } },
      });
      connecter(data.inscription.token, data.inscription.user);
      return null;
    } catch (e) {
      return messageErreur(e);
    }
  }

  // Se connecte. Renvoie un message d'erreur, ou null si tout va bien.
  async function connexion(email, motDePasse) {
    try {
      const { data } = await client.mutate({
        mutation: CONNEXION,
        variables: { input: { email, motDePasse } },
      });
      connecter(data.connexion.token, data.connexion.user);
      return null;
    } catch (e) {
      return messageErreur(e);
    }
  }

  // Se déconnecte
  function deconnexion() {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, inscription, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}