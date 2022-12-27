import { useState, useEffect } from "react";
import "../Home/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    if (email !== "" && password !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
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
      <h1>Cadastra-se</h1>
      <span>Vamos criar sua conta.</span>
      <form className="form" onSubmit={handleRegister}>
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

        <button type="submit">Cadastrar</button>
      </form>
      <Link className="link-button" to="/">
        Já possue uma conta? Faça login.
      </Link>
    </div>
  );
}
