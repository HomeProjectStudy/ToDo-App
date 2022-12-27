import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./app.css";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(false);
  const [loggedUser, setLoggedUser] = useState("");
  const [detailUser, setDetailUser] = useState({});
  const [posts, setPosts] = useState([]);

  async function handleAdd() {
    await addDoc(collection(db, "posts"), {
      title,
      author,
    })
      .then(() => {
        setAuthor("");
        setTitle("");
      })
      .catch((error) => console.log("Error", error));
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
        console.log("erro ao buscar", error);
      });
  }

  async function updatePost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      title,
      author,
    })
      .then(() => {
        alert("Post updated successfully");
        setAuthor("");
        setTitle("");
        setIdPost("");
      })
      .catch((error) => console.log("Error updating post", error));
  }
  async function handleDeletePost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("Post deleted successfully");
      })
      .catch((error) => console.log("Error deleting post", error));
  }

  async function newUser() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((value) => {
        alert("User created successfully");
        setEmail("");
        setPassword("");
      })
      .catch((error) => console.log("Error creating user", error));
  }
  async function handleLogin() {
    await signInWithEmailAndPassword(auth, email, password)
      .then((value) => {
        alert("User logged in successfully");
        setEmail("");
        setPassword("");
        setDetailUser({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);
      })
      .catch((err) => console.log("error", err));
  }

  async function handleSingOut() {
    await signOut(auth);
    setEmail("");
    setPassword("");
    setUser(false);
    setDetailUser({});
  }

  useEffect(() => {
    async function loadPosts() {
      const unsubscribe = onSnapshot(db, "posts", (snapshot) => {
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

  useEffect(() => {
    async function loadUser() {
      // Stay user logged.
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true);
          setDetailUser({
            uid: user.uid,
            email: user.email,
          });
        } else {
          setUser(false);
          setDetailUser({});
        }
      });
    }
    loadUser();
  }, []);

  return (
    <div className="App">
      <h2>Usuários</h2>
      <div className="container">
        <label htmlFor="">Email</label>
        <input
          type="text"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Digite seu email"
        />
        <br />

        <label htmlFor="">Senha</label>
        <input
          type="text"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Informe sua senha"
        />
        <button onClick={newUser}>Cadastrar</button>
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
      <br />
      <br />

      <hr />
      {user && (
        <div className="container">
          <strong>Seja bem vindo: {detailUser.email}</strong>
          <h2>Posts</h2>
          <label htmlFor="">Id Post: </label>
          <input
            type="text"
            placeholder="Digite o IDPost"
            value={idPost}
            onChange={(event) => setIdPost(event.target.value)}
          />
          <br />

          <label htmlFor="">Title</label>
          <textarea
            placeholder="Digite um text"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label htmlFor="">Autor</label>
          <input
            type="text"
            placeholder="Autor do post"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />

          <br />
          <button onClick={handleAdd}>Cadastrar</button>
          <br />
          <button onClick={getPosts}>Buscar Posts</button>

          <br />
          <button onClick={updatePost}>Editar Posts</button>
          <br />

          <button onClick={handleSingOut}>Sair</button>
          <br />
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <strong>ID {post.id}</strong>
                <br />
                <span>Title: {post.title}</span>
                <br />
                <span>Author: {post.author}</span>
                <br />
                <button onClick={() => handleDeletePost(post.id)}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
