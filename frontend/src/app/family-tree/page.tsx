"use client";
import { useState, useEffect } from "react";
import "@/styles/genealogy.css";
import { CircularProgress } from "@mui/material";

const defaultImage = "/images/home/blankprofile.png";

// Hardcoded 7 Children of Okonkwo
const childrenOfOkonkwo = [
  { _id: "678ba753f0da3723bf62162b", name: "Child 1" },
  { _id: "678ba7f7f0da3723bf62162e", name: "Child 2" },
  { _id: "678c6a78692c5f6ca81f8041", name: "Child 3" },
  { _id: "678c5db3692c5f6ca81f7fd3", name: "Child 4" },
  { _id: "678bc6464ee74cfa3fc94b77", name: "Child 5" },
  { _id: "678cf5c9e8614fb5b9e4232f", name: "Child 6" },
  { _id: "678cf871e8614fb5b9e4235a", name: "Child 7" },
];

const TreeNode = ({ member, fetchChildren }) => {
  if (!member) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState(member.children || []);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && children.length === 0) {
      setLoading(true);
      const newChildren = await fetchChildren(member.name);
      setChildren(newChildren);
      setLoading(false);
    }
  };

  return (
    <li>
      <a className="member-btn" onClick={handleExpand}>
        <div className="member-view-box">
          <div className="member-image">
            <img src={member.image} alt={member.name} />
            <div className="member-details">
              <h3>{member.name}</h3>
            </div>
          </div>
        </div>
      </a>
      {isOpen && (
        <ul className="active">
          {loading ? (
            <p className="text-gray-500">
              Loading{" "}
              <CircularProgress size={15} color="success"></CircularProgress>
            </p>
          ) : (
            children.map((child, idx) => (
              <TreeNode
                key={idx}
                member={child}
                fetchChildren={fetchChildren}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
};

const GenealogyTree = () => {
  const [familyTree, setFamilyTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialTree = async () => {
      try {
        const response = await fetch(
          "https://omile-genealogy-1.onrender.com/api/family"
        );
        const data = await response.json();
        console.log(data);
        const okonkwo = data.data.find(
          (member) => member.name === "Okonkwo Ndichie Omile"
        );
        if (!okonkwo) throw new Error("Okonkwo Omile not found.");

        const okonkwoChildren = childrenOfOkonkwo.map((child) => {
          const apiChild = data.data.find((m) => m._id === child._id);
          return {
            name: apiChild ? apiChild.name : child.name,
            image: apiChild ? apiChild.picture || defaultImage : defaultImage,
            children: [],
          };
        });

        setFamilyTree({
          name: okonkwo.name,
          image: okonkwo.picture || defaultImage,
          children: okonkwoChildren,
        });
      } catch (error) {
        console.error("Error fetching initial tree:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialTree();
  }, []);

  const fetchChildren = async (name) => {
    try {
      const response = await fetch(
        `https://omile-genealogy-1.onrender.com/api/family?name=${encodeURIComponent(
          name
        )}`
      );
      const data = await response.json();
      return (
        data.data[0]?.descendants?.children.map((child) => ({
          name: child.name,
          image: child.picture || defaultImage,
          children: [],
        })) || []
      );
    } catch (error) {
      console.error(`Error fetching descendants for ${name}:`, error);
      return [];
    }
  };

  return (
    <div className="body genealogy-body genealogy-scroll">
      <div className="flex justify-center mx-[1rem] lg:mx-0"></div>
      <div className="genealogy-tree">
        {loading ? (
          <p className="text-center text-gray-500 padding-top">
            <br />
            🌳 Please wait while I fetch Family Tree Data{" "}
            <CircularProgress size={22} color="success"></CircularProgress>
          </p>
        ) : (
          <ul>
            {familyTree && (
              <TreeNode member={familyTree} fetchChildren={fetchChildren} />
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GenealogyTree;
