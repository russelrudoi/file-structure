import {useEffect, useState} from 'react'
import './App.css'
import TreeNode from "./components/TreeNode/TreeNode";

function App() {

  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/root")
        .then((res) => res.json())
        .then((data) => setData(data));
  }, []);

  return (

      <div className="app">
        <ul className="tree-list">
          {Object.entries(data).map(([name, node]) => (
              <TreeNode key={name} name={name} node={node}/>
          ))}
        </ul>
      </div>
  );
}

export default App
