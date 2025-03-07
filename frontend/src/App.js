import React, { useState, useEffect } from 'react';

function App() {
  const [prompts, setPrompts] = useState([]);
  const [formData, setFormData] = useState({
    categoria: '',
    einaIA: '',
    puntuacio: '',
    etiquetes: ''
  });

  // Obtenir prompts des del backend
  useEffect(() => {
    fetch('http://localhost:3000/api/prompts')
      .then(response => response.json())
      .then(data => setPrompts(data))
      .catch(err => console.error('Error:', err));
  }, []);

  // Maneig del canvi en els camps del formulari
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Maneig del submit del formulari
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir puntuació a número i etiquetes a array (separant per comes)
    const prompt = {
      categoria: formData.categoria,
      einaIA: formData.einaIA,
      puntuacio: Number(formData.puntuacio),
      etiquetes: formData.etiquetes.split(',').map(tag => tag.trim())
    };

    fetch('http://localhost:3000/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt)
    })
      .then(response => response.json())
      .then(data => {
        // Afegir el nou prompt a la llista
        setPrompts([...prompts, data.prompt]);
        // Netejar el formulari
        setFormData({
          categoria: '',
          einaIA: '',
          puntuacio: '',
          etiquetes: ''
        });
      })
      .catch(err => console.error('Error:', err));
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
