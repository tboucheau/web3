import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // État de chargement
  const router = useRouter();

  useEffect(() => {
    const referer = document.referrer;
    if (!referer.includes('app.predai.io')) {
      router.replace('/access-denied'); // Redirige vers une page d'accès refusé
    } else {
      setLoading(false); // Termine le chargement si le referer est correct
    }
  }, []);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://nnbgvwnxn1.execute-api.eu-central-1.amazonaws.com/fr/sentiment-analysis', { data: inputValue });
      setResponseData(response.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  if (loading) {
    return null; // Retourne null pendant le chargement pour éviter le flash de la page d'accueil
  }

  return (
    <div className="container">
      <h1 className="mt-5">Ecrivez ce que vous voulez</h1>
      <p>l'IA vous dira si de que vous dites est positif ou négatif !! (valider avec la touche ↩️</p>
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Saisissez vos données" value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
      {responseData && (
        <div className="alert alert-info" role="alert">
          Ce que vous dites est {JSON.stringify(responseData, null, 2) === "\"NEGATIVE\"" ? "négatif 😥 !" :
            JSON.stringify(responseData, null, 2) === "\"POSITIVE\"" ? "positif 😃 !" :
            JSON.stringify(responseData, null, 2) === "\"NEUTRAL\"" ? "neutre 😐 !" : "inconnu"}
        </div>
      )}
      {error && <div className="alert alert-danger" role="alert">Error: {error.message}</div>}
    </div>
  );
};

export default IndexPage;
