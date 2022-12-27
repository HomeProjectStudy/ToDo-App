import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";

export function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/admin", {
            replace: true,
          });
        })
        .catch((error) => console.log("Error ao fazer login", error));
    } else {
      alert("preencha todos os campos");
    }
  }
  return (
    <div className="home-container">
      <h1>Lista de tarefas</h1>
      <span>Gerencie sua agenda de forma fácil.</span>
      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Acessar</button>
      </form>
      <Link className="link-button" to="/register">
        Não possue uma conta? cadastre-se.
      </Link>
    </div>
  );
}
