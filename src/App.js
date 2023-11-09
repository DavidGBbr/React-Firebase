import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import "./app.css";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [posts, setPosts] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let list = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            title: doc.data().title,
            author: doc.data().author,
          });
        });

        setPosts(list);
      });
    }
    loadPosts();
  }, []);

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

  async function newUser() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((value) => {
        console.log("Cadastrado com sucesso!");
        console.log(value);
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca.");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já existe");
        }
      });
  }

  async function loginUser() {
    await signInWithEmailAndPassword(auth, email, password)
      .then((value) => {
        console.log("Login feito com sucesso!");
        console.log(value);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);

        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.log("Erro ", error);
      });
  }

  async function logout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado!)</strong>
          <br />
          <span>
            ID: {userDetail.uid} - Email: {userDetail.email}
          </span>
          <br />
          <button onClick={logout}>Sair da conta</button>
          <br />
          <br />
        </div>
      )}

      <div className="container">
        <h2>Usuários</h2>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email"
        />
        <br />
        <label>Senha</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Informe sua senha"
        />
        <button onClick={newUser}>Cadastrar</button>
        <button onClick={loginUser}>Logar</button>
        <br />
      </div>
      <br />
      <br />
      <hr />

      <div className="container">
        <h2>Posts</h2>

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
