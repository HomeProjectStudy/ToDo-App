import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

import "./styles.css";

export function Admin() {
  const [task, setTask] = useState("");
  const [user, setUser] = useState({});
  const [updateTask, setUpdateTask] = useState({});
  const [tasksDatabase, setTasksDatabase] = useState([]);

  async function handleRegisterTask(event) {
    event.preventDefault();
    if (task === "") {
      alert("Digite uma tarefa");
      return;
    }

    if (updateTask?.id) {
      handleUpdateTask();
      return;
    }
    await addDoc(collection(db, "tarefa"), {
      tarefa: task,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        toast.success("Tarefa adicionada com sucesso.", {
          icon: "🍕",
        });
        setTask("");
      })
      .catch((error) => console.log(error));
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleDeleteTask(id) {
    const docRef = doc(db, "tarefa", id);
    await deleteDoc(docRef);
    toast.warn("Tarefa removida com sucesso", {
      icon: "✅",
    });
  }
  function handleUpdatedTask(taskDatabase) {
    setTask(taskDatabase.tarefa);
    setUpdateTask(taskDatabase);
  }

  async function handleUpdateTask() {
    const docRef = doc(db, "tarefa", updateTask?.id);
    await updateDoc(docRef, {
      tarefa: task,
    })
      .then(() => {
        alert("Tarefa atualizada com Sucesso");
        setTask("");
        setUpdateTask({});
      })
      .catch((error) => {
        console.log("Error update task", error);
        setTask("");
        setUpdateTask({});
      });
  }
  useEffect(() => {
    async function loadTasks() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));
      if (userDetail) {
        const data = JSON.parse(userDetail);
        const task = collection(db, "tarefa");
        const querySort = query(
          task,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );
        onSnapshot(querySort, (snapshot) => {
          let list = [];
          snapshot.forEach((doc) => {
            list.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            });
          });
          setTasksDatabase(list);
        });
      }
    }
    loadTasks();
  }, []);

  return (
    <div className="admin-container">
      <h1>Minhas tarefas</h1>
      <form className="form" onSubmit={handleRegisterTask}>
        <textarea
          placeholder="Digite sua tarefa"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />

        {Object.keys(updateTask).length > 0 ? (
          <button type="submit" className="button-register">
            ATUALIZAR TAREFA
          </button>
        ) : (
          <button type="submit" className="button-register">
            REGISTRAR TAREFA
          </button>
        )}
      </form>
      {tasksDatabase.map((taskDatabase) => (
        <article className="list-items" key={taskDatabase.id}>
          <p>{taskDatabase.tarefa}</p>
          <div>
            <button onClick={() => handleUpdatedTask(taskDatabase)}>
              Editar
            </button>
            <button
              className="button-trash"
              onClick={() => handleDeleteTask(taskDatabase.id)}
            >
              Concluir
            </button>
          </div>
        </article>
      ))}

      <button className="logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
