import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";


function App() {
  const [prompts, setPrompts] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    descripcio: '',
    categoria: '',
    einaIA: '',
    puntuacio: '',
    etiquetes: '',
    textPrompt: ''
  });
  // Afegir aquests estats al component principal
  const [adminLogged, setAdminLogged] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const ADMIN_PASSWORD = "Sebas_2025!";

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Referència a la col·lecció de Firestore
  const promptsCollection = collection(db, "prompts");

  // Carregar els prompts de Firestore
  const fetchPrompts = async () => {
    try {
      // Opcional: afegir un ordre, per exemple, per data o per nom
      const q = query(promptsCollection, orderBy("nom"));
      const querySnapshot = await getDocs(q);
      const promptsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrompts(promptsList);
    } catch (error) {
      console.error("Error carregant els prompts:", error);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  // Manejar canvis al formulari
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (promptId) => {
    if (!window.confirm("Estàs segur que vols esborrar aquest prompt?")) return;
    try {
      await deleteDoc(doc(db, "prompts", promptId));
      fetchPrompts(); // Refresca la llista
    } catch (error) {
      console.error("Error esborrant el prompt:", error);
    }
  };
  

  // Funció per afegir o actualitzar un prompt
  const handleSubmit = async (e) => {
    e.preventDefault();
    const promptData = {
      nom: formData.nom.trim(),
      descripcio: formData.descripcio.trim(),
      categoria: formData.categoria.trim(),
      einaIA: formData.einaIA.trim(),
      puntuacio: Number(formData.puntuacio),
      etiquetes: formData.etiquetes.split(',').map(tag => tag.trim()).filter(tag => tag),
      textPrompt: formData.textPrompt.trim(),
      timestamp: new Date()
    };

    try {
      if (editingId) {
        // Actualitzar el document existent
        const docRef = doc(db, "prompts", editingId);
        await updateDoc(docRef, promptData);
      } else {
        // Afegir un nou document
        await addDoc(promptsCollection, promptData);
      }
      // Refrescar la llista
      fetchPrompts();
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
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error afegint/actualitzant prompt:", error);
    }
  };

  // Funció per carregar un prompt existent al formulari per editar-lo
  const handleEdit = (prompt) => {
    setFormData({
      nom: prompt.nom,
      descripcio: prompt.descripcio,
      categoria: prompt.categoria,
      einaIA: prompt.einaIA,
      puntuacio: prompt.puntuacio,
      etiquetes: prompt.etiquetes.join(', '),
      textPrompt: prompt.textPrompt
    });
    setEditingId(prompt.id);
    setShowForm(true);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Prompt copiat al porta-retalls!");
    } catch (error) {
      console.error("Error copiant el prompt:", error);
      alert("Error copiant el prompt.");
    }
  };
  

  // Funció per filtrar prompts amb cerca global
  const filteredPrompts = prompts.filter(prompt => {
    const searchStr = globalSearch.trim().toLowerCase();
    if (searchStr === "") return true;
    const fields = [
      prompt.nom,
      prompt.descripcio,
      prompt.categoria,
      prompt.einaIA,
      String(prompt.puntuacio),
      prompt.textPrompt,
      prompt.etiquetes.join(' ')
    ];
    return fields.some(field => field.toLowerCase().includes(searchStr));
  });

  return (
    <div className="app">
      <header className="header">
        <h1>Biblioteca de Prompts</h1>
          <button className="add-btn" onClick={() => setShowForm(!showForm)} title="Afegir prompt">
            +
          </button>
          {/* Secció d'autenticació admin */}
          {!adminLogged && (
            <div className="admin-login">
              <input
                type="password"
                placeholder="Password admin"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
              />
              <button onClick={() => {
                if (adminPasswordInput === ADMIN_PASSWORD) {
                  setAdminLogged(true);
                  setAdminPasswordInput("");
                } else {
                  alert("Password incorrecte");
                }
              }}>
                Login
              </button>
            </div>
          )}
          {adminLogged && (
            <div className="admin-logged">
              <span>Admin actiu</span>
              <button onClick={() => setAdminLogged(false)}>Logout</button>
            </div>
          )}
      </header>

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

      {showForm && (
        <section className="form-container">
          <h2>{editingId ? 'Edita el Prompt' : 'Crear un Nou Prompt'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom:</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Descripció:</label>
              <textarea name="descripcio" rows="3" value={formData.descripcio} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Categoria:</label>
              <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Eina IA:</label>
              <input type="text" name="einaIA" value={formData.einaIA} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Puntuació:</label>
              <input type="number" name="puntuacio" value={formData.puntuacio} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Etiquetes (separades per comes):</label>
              <input type="text" name="etiquetes" value={formData.etiquetes} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Text del Prompt:</label>
              <textarea name="textPrompt" rows="30" value={formData.textPrompt} onChange={handleChange} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingId ? 'Guardar Canvis' : 'Crear Prompt'}
              </button>
              <button type="button" className="cancel-btn" onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                  nom: '',
                  descripcio: '',
                  categoria: '',
                  einaIA: '',
                  puntuacio: '',
                  etiquetes: '',
                  textPrompt: ''
                });
              }}>Cancel·lar</button>
            </div>
          </form>
        </section>
      )}

      <section className="prompt-list">
        <h2>Llista de Prompts</h2>
        {filteredPrompts.length === 0 ? (
          <p>No hi ha prompts que coincideixin amb el filtre.</p>
        ) : (
          <ul>
            {filteredPrompts.map(prompt => (
              <li key={prompt.id} className="prompt-item">
                <div><strong>Nom:</strong> {prompt.nom}</div>
                <div><strong>Descripció:</strong> {prompt.descripcio}</div>
                <div><strong>Categoria:</strong> {prompt.categoria}</div>
                <div><strong>Eina IA:</strong> {prompt.einaIA}</div>
                <div><strong>Puntuació:</strong> {prompt.puntuacio}</div>
                <div><strong>Etiquetes:</strong> {prompt.etiquetes.join(', ')}</div>
                <div><strong>Text del Prompt:</strong></div>
                <pre className="prompt-text">{prompt.textPrompt}</pre>
                
                {/* Botó per copiar el text del prompt */}
                <button onClick={() => handleCopy(prompt.textPrompt)} className="copy-btn">
                  Copia
                </button>
                
                {/* Botons d'edició i esborrat visibles només per l'administrador */}
                {adminLogged && (
                  <div className="admin-actions">
                    <button onClick={() => handleEdit(prompt)} className="edit-btn">Edita</button>
                    <button onClick={() => handleDelete(prompt.id)} className="delete-btn">Esborra</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        
        )}
      </section>
    </div>
  );
}

export default App;
