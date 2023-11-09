import { useState } from "react";
import { db } from "./firebaseConnection";
import { collection, addDoc, getDocs } from "firebase/firestore";

import "./app.css";

function App() {
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();
  const [posts, setPosts] = useState();

  async function handleAdd() {
    await addDoc(collection(db, "posts"), { title, author })
      .then(() => {
        console.log("DADOS CADASTRADOS COM SUCESSO!");
        setTitle("");
        setAuthor("");
      })
      .catch((error) => console.log("GEROU ERRO " + error));
  }

  async function getPosts() {
    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let list = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            title: doc.data().title,
            author: doc.data().author,
          });
        });

        setPosts(list);
      })
      .catch((error) => {
        console.log("Deu algum erro ao buscar os itens da collection");
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
        <button onClick={getPosts}>Buscar post</button>

        <ul>
          {posts?.map((post) => (
            <li key={post.id}>
              <span>Título: {post.title}</span>
              <br />
              <span>Autor: {post.author}</span>
              <br />
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
