const { useState } = React;

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Maquette de test</h1>
      <p>Compteur : {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrémenter</button>
    </div>
  );
}
