import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ESTATS PRINCIPALS
  const [prompts, setPrompts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoria: '',
    einaIA: '',
    puntuacio: '',
    etiquetes: '',
    textPrompt: ''
  });

  // ESTATS PER FILTRAR
  const [searchTag, setSearchTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Carregar els prompts des de localStorage
  useEffect(() => {
    const savedPrompts = JSON.parse(localStorage.getItem('prompts')) || [];
    setPrompts(savedPrompts);
  }, []);

  // Gestionar canvis als camps del formulari
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Enviar el formulari per afegir un nou prompt
  const handleSubmit = (e) => {
    e.preventDefault();

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

    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));

    // Netejar el formulari i tancar-lo
    setFormData({
      categoria: '',
      einaIA: '',
      puntuacio: '',
      etiquetes: '',
      textPrompt: ''
    });
    setShowForm(false);
  };

  // Obtenir categories úniques
  const categories = Array.from(new Set(prompts.map(p => p.categoria))).filter(cat => cat);

  // Filtrar prompts segons etiqueta i categoria, amb cerca parcial i sense distingir majúscules/minúscules
  const filteredPrompts = prompts.filter(prompt => {
    const matchTag =
      searchTag === ''
        ? true
        : prompt.etiquetes.some(tag =>
            tag.toLowerCase().includes(searchTag.trim().toLowerCase())
          );
    const matchCategory =
      selectedCategory === '' ? true : prompt.categoria === selectedCategory;
    return matchTag && matchCategory;
  });

  return (
    <div className="app">
      {/* Capçalera amb el botó "+" */}
      <header className="header">
        <h1>Biblioteca de Prompts</h1>
        <button 
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
          title="Afegir nou prompt"
        >
          +
        </button>
      </header>

      {/* Formulari per afegir nou prompt (situat a la part superior) */}
      {showForm && (
        <section className="form-container">
          <h2>Crear un Nou Prompt</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Categoria:</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Eina IA:</label>
              <input
                type="text"
                name="einaIA"
                value={formData.einaIA}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Puntuació:</label>
              <input
                type="number"
                name="puntuacio"
                value={formData.puntuacio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Etiquetes (separades per comes):</label>
              <input
                type="text"
                name="etiquetes"
                value={formData.etiquetes}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Text del Prompt:</label>
              <textarea
                name="textPrompt"
                rows="4"
                value={formData.textPrompt}
                onChange={handleChange}
                placeholder="Escriu el contingut del prompt..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Crear Prompt</button>
              <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                Cancel·lar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Secció de filtres */}
      <section className="filter-section">
        <div className="filter-group">
          <label htmlFor="searchTag">Cerca per etiqueta:</label>
          <input
            type="text"
            id="searchTag"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            placeholder="Introdueix una etiqueta"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="categoryFilter">Filtra per categoria:</label>
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
      </section>

      {/* Llista de Prompts */}
      <section className="prompt-list">
        <h2>Llista de Prompts</h2>
        {filteredPrompts.length === 0 ? (
          <p>No hi ha prompts que coincideixin amb el filtre.</p>
        ) : (
          <ul>
            {filteredPrompts.map((prompt, index) => (
              <li key={index} className="prompt-item">
                <div><strong>Categoria:</strong> {prompt.categoria}</div>
                <div><strong>Eina IA:</strong> {prompt.einaIA}</div>
                <div><strong>Puntuació:</strong> {prompt.puntuacio}</div>
                <div><strong>Etiquetes:</strong> {prompt.etiquetes.join(', ')}</div>
                <div><strong>Text del Prompt:</strong></div>
                <pre className="prompt-text">
                  {prompt.textPrompt}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
