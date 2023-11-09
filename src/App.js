import { useState } from "react";
import { db } from "./firebaseConnection";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import "./app.css";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [posts, setPosts] = useState("");
  const [idPost, setIdPost] = useState("");

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

  async function editPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, { title, author })
      .then(() => {
        console.log("Post atualizado com sucesso!");
        setIdPost("");
        setTitle("");
        setAuthor("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function deletePost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef).then(() => alert("Post deletado com sucesso"));
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>

      <div className="container">
        <label>ID do Post:</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />

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
        <button onClick={getPosts}>Buscar posts</button>
        <br />
        <button onClick={editPost}>Atualizar post</button>

        <ul>
          {posts.length > 0 &&
            posts?.map((post) => (
              <li key={post.id}>
                <strong>{post.id}</strong>
                <br />
                <span>Título: {post.title}</span>
                <br />
                <span>Autor: {post.author}</span>
                <br />
                <button onClick={() => deletePost(post.id)}>Excluir</button>
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
