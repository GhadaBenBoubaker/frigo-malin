// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from './context/AuthContext.jsx';
import { RecettesProvider } from './context/RecettesContext.jsx';
import App from './App.jsx';
import './index.css';

const lienHttp = new HttpLink({
  uri: 'http://localhost:8080/graphql',
  // Avant chaque requête, on ajoute le jeton s'il existe
  fetch: (uri, options) => {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };
    if (token) headers.authorization = `Bearer ${token}`;
    return fetch(uri, { ...options, headers });
  },
});

const client = new ApolloClient({
  link: lienHttp,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          {/* RecettesProvider est DANS AuthProvider : il connaît l'utilisateur */}
          <RecettesProvider>
            <App />
          </RecettesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);