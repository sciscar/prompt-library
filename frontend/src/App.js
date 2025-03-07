import React, { useState, useEffect } from 'react';

function App() {
  // ESTAT PRINCIPAL
  const [prompts, setPrompts] = useState([]);
  const [formData, setFormData] = useState({
    categoria: '',
    einaIA: '',
    puntuacio: '',
    etiquetes: '',
    textPrompt: ''
  });

  // ESTAT PER A FILTRES
  const [searchTag, setSearchTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // CARREGAR PROMPTS DES DE localStorage
  useEffect(() => {
    const savedPrompts = JSON.parse(localStorage.getItem('prompts')) || [];
    setPrompts(savedPrompts);
  }, []);

  // GESTIÓ DE CANVIS AL FORMULARI
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // AFEGIR UN NOU PROMPT
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir puntuació a número i etiquetes a array
    const newPrompt = {
      categoria: formData.categoria.trim(),
      einaIA: formData.einaIA.trim(),
      puntuacio: Number(formData.puntuacio),
      etiquetes: formData.etiquetes
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== ''),
      textPrompt: formData.textPrompt.trim()
    };

    // Afegir el nou prompt a la llista
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));

    // Netejar el formulari
    setFormData({
      categoria: '',
      einaIA: '',
      puntuacio: '',
      etiquetes: '',
      textPrompt: ''
    });
  };

  // LLISTA DE CATEGORIES (extretes dels prompts)
  const categories = Array.from(new Set(prompts.map(p => p.categoria))).filter(cat => cat);

  // FILTRAR PROMPTS SEGONS EL TAG I LA CATEGORIA
  const filteredPrompts = prompts.filter(prompt => {
    // Filtre per etiqueta (searchTag)
    const matchTag = searchTag === '' 
      ? true 
      : prompt.etiquetes.includes(searchTag.trim());

    // Filtre per categoria (selectedCategory)
    const matchCategory = selectedCategory === '' 
      ? true 
      : prompt.categoria === selectedCategory;

    return matchTag && matchCategory;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Biblioteca de Prompts</h1>

      {/* FILTRE PER ETIQUETA */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="searchTag" style={{ marginRight: '10px' }}>Cerca per etiqueta:</label>
        <input
          type="text"
          id="searchTag"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          placeholder="Introdueix una etiqueta"
        />
      </div>

      {/* DESPLEGABLE DE CATEGORIES */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="categoryFilter" style={{ marginRight: '10px' }}>Filtra per categoria:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Totes</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* LLISTA DE PROMPTS */}
      <section>
        <h2>Llista de Prompts</h2>
        {filteredPrompts.length === 0 ? (
          <p>No hi ha prompts que coincideixin amb el filtre.</p>
        ) : (
          <ul>
            {filteredPrompts.map((prompt, index) => (
              <li key={index} style={{ marginBottom: '20px' }}>
                <div><strong>Categoria:</strong> {prompt.categoria}</div>
                <div><strong>Eina IA:</strong> {prompt.einaIA}</div>
                <div><strong>Puntuació:</strong> {prompt.puntuacio}</div>
                <div><strong>Etiquetes:</strong> {prompt.etiquetes.join(', ')}</div>
                <div><strong>Text del Prompt:</strong></div>
                <pre style={{ background: '#f4f4f4', padding: '10px' }}>
                  {prompt.textPrompt}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* FORMULARI PER AFEGIR UN NOU PROMPT */}
      <section style={{ marginTop: '40px' }}>
        <h2>Crear un Nou Prompt</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Categoria:</label><br/>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Eina IA:</label><br/>
            <input
              type="text"
              name="einaIA"
              value={formData.einaIA}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Puntuació:</label><br/>
            <input
              type="number"
              name="puntuacio"
              value={formData.puntuacio}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Etiquetes (separades per comes):</label><br/>
            <input
              type="text"
              name="etiquetes"
              value={formData.etiquetes}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Text del Prompt:</label><br/>
            <textarea
              name="textPrompt"
              rows="4"
              cols="50"
              value={formData.textPrompt}
              onChange={handleChange}
              placeholder="Escriu el contingut del prompt..."
            />
          </div>

          <button type="submit" style={{ marginTop: '10px' }}>Crear Prompt</button>
        </form>
      </section>
    </div>
  );
}

export default App;
