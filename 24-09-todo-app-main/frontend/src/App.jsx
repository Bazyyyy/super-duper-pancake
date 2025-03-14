import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Lade die Aufgaben bei der Initialisierung
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error("Fehler beim Abrufen der Aufgaben:", err));
  }, []);

  // Hinzufügen einer neuen Aufgabe
  const itemHinzufuegen = () => {
    // Eingabefeld checken
    if (!title) {
      return;
    }

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title }),
    })
    .then((res) => res.json())
    .then((neueAufgabe) => {
      // Neue Aufgabe zur Liste hinzufügen
      setTasks((prevTasks) => [...prevTasks, neueAufgabe[0]]);
    });

    setTitle(""); // Eingabefeld nach dem Hinzufügen leeren
  };

  // Löschen einer Aufgabe
  const itemLoeschen = (id_nummer) => {
    fetch(`http://localhost:3050/delete/${id_nummer}`, {
      method: "DELETE",
    })
    .then(() => {
      // Aufgabe aus der Liste im Frontend entfernen
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id_nummer));
    })
    .catch((err) => console.error("Fehler beim Löschen:", err));
  };

  return (
    <>
      <h1>To-Do List</h1>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <button 
        disabled={!title.trim()} 
        onClick={itemHinzufuegen}
      >
        Add
      </button>

      <ul>
        {tasks.map(({ id, title, completed }) => (
          <li key={id}>
            <input type="checkbox" checked={completed} />
            {title}
            <button onClick={() => itemLoeschen(id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
