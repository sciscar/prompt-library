import React, { useState, useEffect } from 'react';

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Capçalera amb el botó "+" */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Biblioteca de Prompts</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            fontSize: '24px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
          title="Afegir nou prompt"
        >
          +
        </button>
      </header>

      {/* Formulari per afegir nou prompt, ara situat a la part superior */}
      {showForm && (
        <section style={{ marginTop: '20px', marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h2>Crear un Nou Prompt</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Categoria:</label><br/>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Eina IA:</label><br/>
              <input
                type="text"
                name="einaIA"
                value={formData.einaIA}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Puntuació:</label><br/>
              <input
                type="number"
                name="puntuacio"
                value={formData.puntuacio}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Etiquetes (separades per comes):</label><br/>
              <input
                type="text"
                name="etiquetes"
                value={formData.etiquetes}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
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

            <button type="submit" style={{ marginRight: '10px' }}>Crear Prompt</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel·lar
            </button>
          </form>
        </section>
      )}

      {/* Secció de filtres */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="searchTag" style={{ marginRight: '10px' }}>Cerca per etiqueta:</label>
          <input
            type="text"
            id="searchTag"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            placeholder="Introdueix una etiqueta"
          />
        </div>
        <div>
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
      </div>

      {/* Llista de Prompts */}
      <section>
        <h2>Llista de Prompts</h2>
        {filteredPrompts.length === 0 ? (
          <p>No hi ha prompts que coincideixin amb el filtre.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredPrompts.map((prompt, index) => (
              <li key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
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
    </div>
  );
}

export default App;
