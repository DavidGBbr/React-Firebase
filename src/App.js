import { useState } from "react";
import { db } from "./firebaseConnection";
import { doc, collection, addDoc, getDoc } from "firebase/firestore";

import "./app.css";

function App() {
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();

  async function handleAdd() {
    await addDoc(collection(db, "posts"), { title, author })
      .then(() => {
        console.log("DADOS CADASTRADOS COM SUCESSO!");
        setTitle("");
        setAuthor("");
      })
      .catch((error) => console.log("GEROU ERRO " + error));
  }

  async function getPost() {
    const postRef = doc(db, "posts", "12345");

    await getDoc(postRef)
      .then((snapshot) => {
        setAuthor(snapshot.data().author);
        setTitle(snapshot.data().title);
      })
      .catch((error) => {
        console.log("Erro ao buscar ", error);
      });
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>

      <div className="container">
        <label>Título:</label>
        <textarea
          type="text"
          placeholder="Digite o titulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Autor:</label>
        <textarea
          type="text"
          placeholder="Autor do post"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={getPost}>Buscar post</button>
      </div>
    </div>
  );
}

export default App;
