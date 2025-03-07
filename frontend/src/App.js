import React, { useState, useEffect } from 'react';

function App() {
  const [prompts, setPrompts] = useState([]);
  const [formData, setFormData] = useState({
    categoria: '',
    einaIA: '',
    puntuacio: '',
    etiquetes: ''
  });

  // Carregar els prompts des de localStorage al muntar el component
  useEffect(() => {
    const savedPrompts = JSON.parse(localStorage.getItem('prompts')) || [];
    setPrompts(savedPrompts);
  }, []);

  // Gestionar els canvis en els camps del formulari
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Gestionar l'enviament del formulari
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir la puntuació a número i les etiquetes a un array (separades per comes)
    const newPrompt = {
      categoria: formData.categoria,
      einaIA: formData.einaIA,
      puntuacio: Number(formData.puntuacio),
      etiquetes: formData.etiquetes.split(',').map(tag => tag.trim())
    };

    // Afegir el nou prompt a la llista existent
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));

    // Netejar el formulari
    setFormData({
      categoria: '',
      einaIA: '',
      puntuacio: '',
      etiquetes: ''
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Biblioteca de Prompts</h1>
      
      {/* Llista de Prompts */}
      <section>
        <h2>Llista de Prompts</h2>
        <ul>
          {prompts.map((prompt, index) => (
            <li key={index}>
              <strong>{prompt.categoria}</strong> - {prompt.einaIA} - Puntuació: {prompt.puntuacio} - Etiquetes: {prompt.etiquetes.join(', ')}
            </li>
          ))}
        </ul>
      </section>

      {/* Formulari per afegir un nou prompt */}
      <section style={{ marginTop: '40px' }}>
        <h2>Crear un Nou Prompt</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Categoria:</label>
            <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required />
          </div>
          <div>
            <label>Eina IA:</label>
            <input type="text" name="einaIA" value={formData.einaIA} onChange={handleChange} required />
          </div>
          <div>
            <label>Puntuació:</label>
            <input type="number" name="puntuacio" value={formData.puntuacio} onChange={handleChange} required />
          </div>
          <div>
            <label>Etiquetes (separades per comes):</label>
            <input type="text" name="etiquetes" value={formData.etiquetes} onChange={handleChange} required />
          </div>
          <button type="submit">Crear Prompt</button>
        </form>
      </section>
    </div>
  );
}

export default App;
