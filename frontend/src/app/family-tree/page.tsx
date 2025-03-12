// "use client";

// import { useState } from "react";
// import "@/styles/genealogy.css";
// import { members } from "@/components/db/familytreedata";
// import { LuSearch } from "react-icons/lu"; // Import search icon

// // Fallback Image
// const defaultImage = "/images/home/blankprofile.png";

// // Tree Node Component
// const TreeNode = ({ member, isRootChild = false }) => {
//   const [isOpen, setIsOpen] = useState(isRootChild ? true : false);

//   return (
//     <li>
//       <a className="member-btn" onClick={() => setIsOpen(!isOpen)}>
//         <div className="member-view-box">
//           <div className="member-image">
//             <img src={member.image || defaultImage} alt={member.name} />
//             <div className="member-details">
//               <h3>{member.name}</h3>
//             </div>
//           </div>
//         </div>
//       </a>
//       {member.children && isOpen && (
//         <ul className="active">
//           {member.children.map((child, idx) => (
//             <TreeNode key={idx} member={child} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// // Genealogy Tree Component
// const GenealogyTree = () => {
//   return (
//     <div className="body genealogy-body genealogy-scroll">
//       {/* HEADER SECTION */}
//       <div className="flex justify-center mx-[1rem] lg:mx-0">
//         <div className="xl:w-1/2 lg:w-2/3 w-full flex flex-col items-center gap-2">
//           {/* Header */}
//           <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
//             Family Tree
//           </h2>

//           {/* Search Bar */}
//           <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
//             <LuSearch
//               size={22}
//               className="text-appBrown2 cursor-pointer"
//               // onClick={handleSearchSubmit} // Trigger search on click
//             />
//             <input
//               // value={searchTerm}
//               // onChange={handleSearchInput}
//               // onKeyDown={handleKeyPress} // Trigger search on Enter
//               placeholder="Click on a member to view descendants"
//               className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
//             />
//           </div>
//         </div>
//       </div>

//       {/* GENEALOGY TREE */}
//       <div className="genealogy-tree">
//         <ul>
//           {members.map((member, index) => (
//             <TreeNode key={index} member={member} isRootChild={true} />
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default GenealogyTree;

// "use client";

// import { useState, useEffect } from "react";
// import "@/styles/genealogy.css";
// import { LuSearch } from "react-icons/lu"; // Import search icon

// // Fallback Image
// const defaultImage = "/images/home/blankprofile.png";

// // Recursive function to build the family tree
// const buildFamilyTree = (member, allMembers) => {
//   if (!member) return null;

//   return {
//     name: member.name,
//     image: member.picture || defaultImage, // Use default image if empty
//     children: (member.descendants?.children || []).map((child) => {
//       // Find this child in the main API response
//       const childData = allMembers.find((m) => m.name === child.name);
//       return buildFamilyTree(childData || child, allMembers); // Ensure no null values
//     }),
//   };
// };

// // Tree Node Component
// const TreeNode = ({ member, isRootChild = false }) => {
//   if (!member) return null; // Prevent errors

//   const [isOpen, setIsOpen] = useState(isRootChild ? true : false);

//   return (
//     <li>
//       <a className="member-btn" onClick={() => setIsOpen(!isOpen)}>
//         <div className="member-view-box">
//           <div className="member-image">
//             <img src={member.image} alt={member.name} />
//             <div className="member-details">
//               <h3>{member.name}</h3>
//             </div>
//           </div>
//         </div>
//       </a>
//       {member.children.length > 0 && isOpen && (
//         <ul className="active">
//           {member.children.map((child, idx) => (
//             <TreeNode key={idx} member={child} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// // Genealogy Tree Component
// const GenealogyTree = () => {
//   const [familyTree, setFamilyTree] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFamilyTree = async () => {
//       try {
//         const response = await fetch(
//           "https://omile-genealogy-1.onrender.com/api/family"
//         );
//         const data = await response.json();
//         console.log("Hello here is the api response", data);

//         // Find Okonkwo Omile
//         const okonkwo = data.data.find(
//           (member) => member.name === "Okonkwo Ndichie Omile"
//         );
//         if (!okonkwo) throw new Error("Okonkwo Omile not found in API data.");

//         // Build the full family tree
//         const tree = buildFamilyTree(okonkwo, data.data);
//         setFamilyTree(tree);
//       } catch (error) {
//         console.error("Error fetching family tree:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFamilyTree();
//   }, []);

//   return (
//     <div className="body genealogy-body genealogy-scroll">
//       {/* HEADER SECTION */}
//       <div className="flex justify-center mx-[1rem] lg:mx-0">
//         <div className="xl:w-1/2 lg:w-2/3 w-full flex flex-col items-center gap-2">
//           {/* Header */}
//           <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
//             Family Tree
//           </h2>

//           {/* Search Bar */}
//           <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
//             <LuSearch size={22} className="text-appBrown2 cursor-pointer" />
//             <input
//               placeholder="Click on a member to view descendants"
//               className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
//             />
//           </div>
//         </div>
//       </div>

//       {/* GENEALOGY TREE */}
//       <div className="genealogy-tree">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading Family Tree...</p>
//         ) : (
//           <ul>
//             {familyTree && <TreeNode member={familyTree} isRootChild={true} />}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GenealogyTree;

// "use client";

// import { useState, useEffect } from "react";
// import "@/styles/genealogy.css";
// import { LuSearch } from "react-icons/lu"; // Import search icon

// // Fallback Image
// const defaultImage = "/images/home/blankprofile.png";

// // Hardcoded children of Okonkwo (ensures completeness)
// const childrenOfOkonkwo = [
//   { _id: "678ba753f0da3723bf62162b" },
//   { _id: "678ba7f7f0da3723bf62162e" },
//   { _id: "678c6a78692c5f6ca81f8041" },
//   { _id: "678c5db3692c5f6ca81f7fd3" },
//   { _id: "678bc6464ee74cfa3fc94b77" },
//   { _id: "678ba945f0da3723bf62163a" },
//   { _id: "678cf871e8614fb5b9e4235a" },
// ];

// // Recursive function to build the family tree
// const buildFamilyTree = (member, allMembers) => {
//   if (!member) return null;

//   return {
//     name: member.name || "Unknown Member",
//     image: member.picture || defaultImage,
//     children: (member.descendants?.children || []).map((child) => {
//       // Find child in API response using `_id`
//       const childData = allMembers.find((m) => m._id === child._id);
//       return buildFamilyTree(childData || child, allMembers); // Ensure full lineage mapping
//     }),
//   };
// };

// // Tree Node Component
// const TreeNode = ({ member, isRootChild = false }) => {
//   if (!member) return null; // Prevent errors

//   const [isOpen, setIsOpen] = useState(isRootChild ? true : false);

//   return (
//     <li>
//       <a className="member-btn" onClick={() => setIsOpen(!isOpen)}>
//         <div className="member-view-box">
//           <div className="member-image">
//             <img src={member.image} alt={member.name} />
//             <div className="member-details">
//               <h3>{member.name}</h3>
//             </div>
//           </div>
//         </div>
//       </a>
//       {member.children.length > 0 && isOpen && (
//         <ul className="active">
//           {member.children.map((child, idx) => (
//             <TreeNode key={idx} member={child} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// // Genealogy Tree Component
// const GenealogyTree = () => {
//   const [familyTree, setFamilyTree] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFamilyTree = async () => {
//       try {
//         const response = await fetch(
//           "https://omile-genealogy-1.onrender.com/api/family"
//         );
//         const data = await response.json();

//         console.log("API Response:", data);

//         // Find Okonkwo Omile
//         const okonkwo = data.data.find(
//           (member) => member.name === "Okonkwo Ndichie Omile"
//         );
//         if (!okonkwo) throw new Error("Okonkwo Omile not found in API data.");

//         // Get Okonkwo's children using hardcoded data (ensuring correctness)
//         const okonkwoChildren = childrenOfOkonkwo.map(
//           (child) => data.data.find((m) => m._id === child._id) || child
//         );

//         // Build the full family tree recursively
//         const tree = {
//           name: okonkwo.name,
//           image: okonkwo.picture || defaultImage,
//           children: okonkwoChildren.map((child) =>
//             buildFamilyTree(child, data.data)
//           ),
//         };

//         setFamilyTree(tree);
//       } catch (error) {
//         console.error("Error fetching family tree:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFamilyTree();
//   }, []);

//   return (
//     <div className="body genealogy-body genealogy-scroll">
//       {/* HEADER SECTION */}
//       <div className="flex justify-center mx-[1rem] lg:mx-0">
//         <div className="xl:w-1/2 lg:w-2/3 w-full flex flex-col items-center gap-2">
//           {/* Header */}
//           <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
//             Family Tree
//           </h2>

//           {/* Search Bar */}
//           <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
//             <LuSearch size={22} className="text-appBrown2 cursor-pointer" />
//             <input
//               placeholder="Click on a member to view descendants"
//               className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
//             />
//           </div>
//         </div>
//       </div>

//       {/* GENEALOGY TREE */}
//       <div className="genealogy-tree">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading Family Tree...</p>
//         ) : (
//           <ul>
//             {familyTree && <TreeNode member={familyTree} isRootChild={true} />}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GenealogyTree;

"use client";

import { useState, useEffect } from "react";
import "@/styles/genealogy.css";
import { LuSearch } from "react-icons/lu";

// Fallback Image
const defaultImage = "/images/home/blankprofile.png";

// Hardcoded children of Okonkwo
const childrenOfOkonkwo = [
  { _id: "678ba753f0da3723bf62162b" },
  { _id: "678ba7f7f0da3723bf62162e" },
  { _id: "678c6a78692c5f6ca81f8041" },
  { _id: "678c5db3692c5f6ca81f7fd3" },
  { _id: "678bc6464ee74cfa3fc94b77" },
  { _id: "678ba945f0da3723bf62163a" },
  { _id: "678cf871e8614fb5b9e4235a" },
];

// **Recursive function to build the family tree**
const buildFamilyTree = (member, allMembers) => {
  if (!member) return null;

  console.log("Processing Member:", member.name, "ID:", member._id);

  // **Manual ID Switching**
  if (member._id === "679d9b198be57f335b496519") {
    console.log(member.name, "Switching to new ID: 678bad9f4ee74cfa3fc94a57");

    // Find the new member
    const newMember = allMembers.find(
      (m) => m._id === "678bad9f4ee74cfa3fc94a57"
    );

    if (newMember) {
      console.log("✅ Found new member:", newMember.name, "ID:", newMember._id);
      console.log("New Member Data:", JSON.stringify(newMember, null, 2));

      // Check descendants in `descendants.children`
      let descendants = newMember.descendants?.children || [];
      console.log("Descendants Field:", JSON.stringify(descendants, null, 2));

      if (!descendants.length) {
        console.warn(
          "⚠️ No direct descendants found in 'descendants.children'. Searching manually..."
        );
        descendants = allMembers.filter((m) => m.parentId === newMember._id);
        console.log(
          "✅ Manually found descendants:",
          descendants.length,
          "entries."
        );
      }

      return {
        name: newMember.name,
        image: newMember.picture || defaultImage,
        children: descendants.map((child) =>
          buildFamilyTree(child, allMembers)
        ),
      };
    } else {
      console.error(
        "❌ ERROR: New member with ID 678bad9f4ee74cfa3fc94a57 not found in API response!"
      );
      return null;
    }
  }

  return {
    name: member.name || "Unknown Member",
    image: member.picture || defaultImage,
    children: (member.descendants?.children || []).map((child) => {
      const childData = allMembers.find((m) => m._id === child._id);
      return buildFamilyTree(childData || child, allMembers);
    }),
  };
};

// **Tree Node Component**
const TreeNode = ({ member, isRootChild = false }) => {
  if (!member) return null; // Prevent errors

  const [isOpen, setIsOpen] = useState(isRootChild ? true : false);

  return (
    <li>
      <a className="member-btn" onClick={() => setIsOpen(!isOpen)}>
        <div className="member-view-box">
          <div className="member-image">
            <img src={member.image} alt={member.name} />
            <div className="member-details">
              <h3>{member.name}</h3>
            </div>
          </div>
        </div>
      </a>
      {member.children.length > 0 && isOpen && (
        <ul className="active">
          {member.children.map((child, idx) => (
            <TreeNode key={idx} member={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// **Genealogy Tree Component**
const GenealogyTree = () => {
  const [familyTree, setFamilyTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyTree = async () => {
      try {
        const response = await fetch(
          "https://omile-genealogy-1.onrender.com/api/family"
        );
        const data = await response.json();

        console.log("✅ API Response:", data);

        // Find Okonkwo Omile
        const okonkwo = data.data.find(
          (member) => member.name === "Okonkwo Ndichie Omile"
        );
        if (!okonkwo)
          throw new Error("❌ Okonkwo Omile not found in API data.");

        // Get Okonkwo's children using hardcoded data
        const okonkwoChildren = childrenOfOkonkwo.map(
          (child) => data.data.find((m) => m._id === child._id) || child
        );

        // Build the full family tree recursively
        const tree = {
          name: okonkwo.name,
          image: okonkwo.picture || defaultImage,
          children: okonkwoChildren.map((child) =>
            buildFamilyTree(child, data.data)
          ),
        };

        setFamilyTree(tree);
      } catch (error) {
        console.error("❌ Error fetching family tree:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyTree();
  }, []);

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
            <LuSearch size={22} className="text-appBrown2 cursor-pointer" />
            <input
              placeholder="Click on a member to view descendants"
              className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
            />
          </div>
        </div>
      </div>

      {/* GENEALOGY TREE */}
      <div className="genealogy-tree">
        {loading ? (
          <p className="text-center text-gray-500">Loading Family Tree...</p>
        ) : (
          <ul>
            {familyTree && <TreeNode member={familyTree} isRootChild={true} />}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GenealogyTree;
