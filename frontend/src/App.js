import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ESTATS PRINCIPALS
  const [prompts, setPrompts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    descripcio: '',
    categoria: '',
    einaIA: '',
    puntuacio: '',
    etiquetes: '',
    textPrompt: ''
  });

  // ESTATS PER FILTRAR
  const [globalSearch, setGlobalSearch] = useState('');
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

  // Enviar el formulari per afegir o editar un prompt
  const handleSubmit = (e) => {
    e.preventDefault();

    const newPrompt = {
      nom: formData.nom.trim(),
      descripcio: formData.descripcio.trim(),
      categoria: formData.categoria.trim(),
      einaIA: formData.einaIA.trim(),
      puntuacio: Number(formData.puntuacio),
      etiquetes: formData.etiquetes
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== ''),
      textPrompt: formData.textPrompt.trim()
    };

    let updatedPrompts;
    // Si s'està editant, actualitzar el prompt existent
    if (editingIndex !== null) {
      updatedPrompts = prompts.map((prompt, index) =>
        index === editingIndex ? newPrompt : prompt
      );
    } else {
      // Sino, afegir com a nou prompt
      updatedPrompts = [...prompts, newPrompt];
    }
    setPrompts(updatedPrompts);
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));

    // Netejar el formulari i tancar-lo
    setFormData({
      nom: '',
      descripcio: '',
      categoria: '',
      einaIA: '',
      puntuacio: '',
      etiquetes: '',
      textPrompt: ''
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  // Funció per carregar un prompt existent en el formulari per editar-lo
  const handleEdit = (index) => {
    const promptToEdit = prompts[index];
    setFormData({
      nom: promptToEdit.nom,
      descripcio: promptToEdit.descripcio,
      categoria: promptToEdit.categoria,
      einaIA: promptToEdit.einaIA,
      puntuacio: promptToEdit.puntuacio,
      etiquetes: promptToEdit.etiquetes.join(', '),
      textPrompt: promptToEdit.textPrompt
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  // Obtenir categories úniques
  const categories = Array.from(new Set(prompts.map(p => p.categoria))).filter(cat => cat);

  // Funció auxiliar que comprova si un prompt conté la cadena de cerca en qualsevol camp
  const containsSearch = (prompt, search) => {
    const searchStr = search.trim().toLowerCase();
    if (searchStr === '') return true;
    
    // Convertim tots els camps a string (i si són undefined, els posem a '')
    const fields = [
      prompt.nom || '',
      prompt.descripcio || '',
      prompt.categoria || '',
      prompt.einaIA || '',
      prompt.puntuacio != null ? String(prompt.puntuacio) : '',
      prompt.textPrompt || '',
      (prompt.etiquetes || []).join(' ')
    ];
  
    // Ara cada camp és, com a mínim, una cadena buida
    return fields.some(field =>
      field.toLowerCase().includes(searchStr)
    );
  };
  
  

  // Filtrar prompts segons el buscador global, etiqueta i categoria
  const filteredPrompts = prompts.filter(prompt => {
    const globalMatch = containsSearch(prompt, globalSearch);
    const matchTag =
      searchTag === ''
        ? true
        : prompt.etiquetes.some(tag =>
            tag.toLowerCase().includes(searchTag.trim().toLowerCase())
          );
    const matchCategory =
      selectedCategory === '' ? true : prompt.categoria === selectedCategory;
    return globalMatch && matchTag && matchCategory;
  });

  return (
    <div className="app">
      {/* Capçalera amb el botó "+" */}
      <header className="header">
        <h1>Biblioteca de Prompts</h1>
        <button 
          className="add-btn"
          onClick={() => {
            // Si es tanca el formulari d'edició, també cancel·la l'edició
            setShowForm(!showForm);
            if (showForm) {
              setEditingIndex(null);
              setFormData({
                nom: '',
                descripcio: '',
                categoria: '',
                einaIA: '',
                puntuacio: '',
                etiquetes: '',
                textPrompt: ''
              });
            }
          }}
          title="Afegir o Editar prompt"
        >
          +
        </button>
      </header>

      {/* Buscador Global */}
      <section className="global-search-section">
        <label htmlFor="globalSearch">Cerca global:</label>
        <input
          type="text"
          id="globalSearch"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Cerca en tots els camps..."
        />
      </section>

      {/* Formulari per afegir o editar prompt, situat a la part superior */}
      {showForm && (
        <section className="form-container">
          <h2>{editingIndex !== null ? 'Edita el Prompt' : 'Crear un Nou Prompt'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripció:</label>
              <textarea
                name="descripcio"
                rows="3"
                value={formData.descripcio}
                onChange={handleChange}
                placeholder="Escriu una breu descripció..."
                required
              />
            </div>

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
              <button type="submit" className="submit-btn">
                {editingIndex !== null ? 'Guardar Canvis' : 'Crear Prompt'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingIndex(null);
                  setFormData({
                    nom: '',
                    descripcio: '',
                    categoria: '',
                    einaIA: '',
                    puntuacio: '',
                    etiquetes: '',
                    textPrompt: ''
                  });
                }}
                className="cancel-btn"
              >
                Cancel·lar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Secció de filtres específics */}
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
                <div><strong>Nom:</strong> {prompt.nom}</div>
                <div><strong>Descripció:</strong> {prompt.descripcio}</div>
                <div><strong>Categoria:</strong> {prompt.categoria}</div>
                <div><strong>Eina IA:</strong> {prompt.einaIA}</div>
                <div><strong>Puntuació:</strong> {prompt.puntuacio}</div>
                <div><strong>Etiquetes:</strong> {prompt.etiquetes.join(', ')}</div>
                <div><strong>Text del Prompt:</strong></div>
                <pre className="prompt-text">{prompt.textPrompt}</pre>
                <button onClick={() => handleEdit(index)} className="edit-btn">Edita</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
