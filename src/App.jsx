import {useEffect, useMemo, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import './App.css'
import TreeNode from "./components/TreeNode/TreeNode";

const fetchData = async () => {
    const res = await fetch("http://localhost:3001/root");

    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }

    return res.json();
};

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

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const params = useParams();
    const currentPath = params["*"] ?? "";
    const pathParts = useMemo(() => getPathParts(currentPath), [currentPath]);

    useEffect(() => {

        fetchData()
            .then((data) => setData(data))
            .catch((error) => {
                if (error) {
                    return;
                }

                console.error("Error fetching data:", error);
                setData(null);
                setError("Something went wrong. Please try again later.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const visibleData = useMemo(() => {
        return getNodeByPath(data ?? {}, pathParts);
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

            {isLoading && (
                <div className="status-message" role="status" aria-live="polite">
                    <span className="loading-spinner" aria-hidden="true"></span>
                    <p>Loading...</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="status-message error-message" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && !error && (
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
            )}
        </div>
    );
}

export default App
