import {useState} from "react";
import "../../App.css";

function TreeNode({ name, node }) {
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
                <span className={`arrow ${isOpen ? "open" : ""}`}>›</span>
                <span className="folder-icon"></span>
                <span>{name}</span>
            </div>

            {isOpen && (
                <ul className="tree-list nested">
                    {Object.entries(node.children).map(([childName, childNode]) => (
                        <TreeNode key={childName} name={childName} node={childNode} />
                    ))}
                </ul>
            )}
        </li>
    );
}

export default TreeNode;