import {useState} from "react";
import {Link} from "react-router-dom";
import "../../App.css";

function TreeNode({ name, node, pathParts, getFolderLink }) {
    const [isOpen, setIsOpen] = useState(false);

    if (node.type === "file") {
        return (
            <li className="tree-item">
                <div className="tree-row file-row">
                    <span className="file-icon"></span>
                    <span>{name}</span>
                </div>
            </li>
        );
    }

    return (
        <li className="tree-item">
            <div className="tree-row folder-row" onClick={() => setIsOpen(!isOpen)}>
                <span className={`arrow ${isOpen ? "open" : ""}`}>{">"}</span>
                <span className="folder-icon"></span>
                <span className="node-name">{name}</span>
                <Link
                    className="open-folder-button"
                    aria-label={`Open ${name}`}
                    to={getFolderLink(pathParts)}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    {">"}
                </Link>
            </div>

            {isOpen && (
                <ul className="tree-list nested">
                    {Object.entries(node.children).map(([childName, childNode]) => (
                        <TreeNode
                            key={childName}
                            name={childName}
                            node={childNode}
                            pathParts={[...pathParts, childName]}
                            getFolderLink={getFolderLink}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export default TreeNode;
