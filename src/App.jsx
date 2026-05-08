import {useEffect, useMemo, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import './App.css'
import TreeNode from "./components/TreeNode/TreeNode";

const getPathParts = (path = "") => {
  return path
      .split("/")
      .filter(Boolean)
};

const getNodeByPath = (data, pathParts) => {
  let currentChildren = data;

  for (const part of pathParts) {
    const nextNode = currentChildren?.[part];

    if (!nextNode || nextNode.type !== "folder") {
      return data;
    }

    currentChildren = nextNode.children;
  }

  return currentChildren;
};

function App() {

  const [data, setData] = useState({});
  const params = useParams();
  const currentPath = params["*"] ?? "";
  const pathParts = useMemo(() => getPathParts(currentPath), [currentPath]);

  useEffect(() => {
    fetch("http://localhost:3001/root")
        .then((res) => res.json())
        .then((data) => setData(data));
  }, []);

  const visibleData = useMemo(() => {
    return getNodeByPath(data, pathParts);
  }, [data, pathParts]);

  const getFolderLink = (nextPathParts) => {
    return `/${nextPathParts.map(encodeURIComponent).join("/")}`;
  };

  return (

      <div className="app">
        <nav className="breadcrumbs" aria-label="Current folder">
          <Link to="/">root</Link>
          {pathParts.map((part, index) => {
            const breadcrumbPath = pathParts.slice(0, index + 1);

            return (
                <span className="breadcrumb-item" key={breadcrumbPath.join("/")}>
                  <span className="breadcrumb-separator">/</span>
                  <Link to={getFolderLink(breadcrumbPath)}>{part}</Link>
                </span>
            );
          })}
        </nav>

        <ul className="tree-list">
          {Object.entries(visibleData).map(([name, node]) => (
              <TreeNode
                  key={name}
                  name={name}
                  node={node}
                  pathParts={[...pathParts, name]}
                  getFolderLink={getFolderLink}
              />
          ))}
        </ul>
      </div>
  );
}

export default App
