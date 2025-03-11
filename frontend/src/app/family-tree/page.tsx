"use client";

import { useState } from "react";
import "@/styles/genealogy.css";
import { members } from "@/components/db/familytreedata";
import { LuSearch } from "react-icons/lu"; // Import search icon

// Fallback Image
const defaultImage = "/images/home/blankprofile.png";

// Tree Node Component
const TreeNode = ({ member, isRootChild = false }) => {
  const [isOpen, setIsOpen] = useState(isRootChild ? true : false);

  return (
    <li>
      <a className="member-btn" onClick={() => setIsOpen(!isOpen)}>
        <div className="member-view-box">
          <div className="member-image">
            <img src={member.image || defaultImage} alt={member.name} />
            <div className="member-details">
              <h3>{member.name}</h3>
            </div>
          </div>
        </div>
      </a>
      {member.children && isOpen && (
        <ul className="active">
          {member.children.map((child, idx) => (
            <TreeNode key={idx} member={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// Genealogy Tree Component
const GenealogyTree = () => {
  return (
    <div className="body genealogy-body genealogy-scroll">
      {/* HEADER SECTION */}
      <div className="flex justify-center mx-[1rem] lg:mx-0">
        <div className="xl:w-1/2 lg:w-2/3 w-full flex flex-col items-center gap-2">
          {/* Header */}
          <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
            Family Tree
          </h2>

          {/* Search Bar */}
          <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
            <LuSearch
              size={22}
              className="text-appBrown2 cursor-pointer"
              // onClick={handleSearchSubmit} // Trigger search on click
            />
            <input
              // value={searchTerm}
              // onChange={handleSearchInput}
              // onKeyDown={handleKeyPress} // Trigger search on Enter
              placeholder="Search family members"
              className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
            />
          </div>
        </div>
      </div>

      {/* GENEALOGY TREE */}
      <div className="genealogy-tree">
        <ul>
          {members.map((member, index) => (
            <TreeNode key={index} member={member} isRootChild={true} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenealogyTree;
