// src/components/AdvancedCounter.jsx
import { useState, useEffect, useRef } from 'react';

export default function AdvancedCounter() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);
  const [step, setStep] = useState(1);
  const saveTimeout = useRef(null);

  // 1) History tracking
  useEffect(() => {
    if (history[history.length - 1] !== count) {
      setHistory(h => [...h, count]);
    }
  }, [count]);

  // 2) Auto-save (debounced)
  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      localStorage.setItem('advanced-counter', JSON.stringify({ count, history }));
      console.log('Saved!', { count, history });
    }, 500);
    return () => clearTimeout(saveTimeout.current);
  }, [count, history]);

  // 3) Keyboard listeners
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowUp') {
        setCount(c => c + step);
      } else if (e.key === 'ArrowDown') {
        setCount(c => c - step);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [step]);

  // Handlers
  const increment = () => setCount(c => c + step);
  const decrement = () => setCount(c => c - step);
  const resetAll = () => {
    setCount(0);
    setHistory([0]);
    localStorage.removeItem('advanced-counter');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Advanced Counter</h2>

      <div><strong>Current Count:</strong> {count}</div>
      <button onClick={decrement}>–{step}</button>
      <button onClick={increment}>+{step}</button>
      <button onClick={resetAll} style={{ marginLeft: 10 }}>Reset</button>

      <div style={{ marginTop: 10 }}>
        <label>
          Step Value:{' '}
          <input
            type="number"
            value={step}
            onChange={e => setStep(Number(e.target.value) || 1)}
            style={{ width: 50 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Count History:</h3>
        <ul>
          {history.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
    </div>
  );
}
