"use client";

import Image from "next/image";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function FamilyTree() {
  const profiles = [
    {
      image: "/images/home/1.jpg",
      name: "Muo Ndichie Omile (Nnaebue)",
      bio: "The First Son of Okonkwo Ndichie Omile",
    },
    {
      image: "/images/home/2.jpg",
      name: "Joackim Ibeachuzinam Omile (Akulueno)",
      bio: "The Second Son of Okonkwo Ndichie Omile",
    },
    {
      image: "/images/home/3.jpg",
      name: "Benjamin Orakwute (Okpokora)",
      bio: "The 3rd Son of Okonkwo Ndichie Omile",
    },
    {
      image: "/images/home/blankprofile.png",
      name: "Mgbafor Ikeli (Nne Omile)",
      bio: "The First Daughter and the Fourth Child of Okonkwo Ndichie Omile",
    },
    {
      image: "/images/home/7.png",

      name: "Roselin Udumelue Anyaeche (Nne Omile)",
      bio: "The 3rd daughter and the sixth child of Okonkwo Ndichie Omile",
    },
    {
      image: "/images/home/blankprofile.png",
      name: "Ayagha Okafor Egbochue (Nne Omile)",
      bio: "The Second daughter and the fifth child of Okonkwo Ndichie Omile",
    },
    {
      image: "/images/home/5th.png",

      name: "Grace Okuazanwa Akunne (Nne Omile)",
      bio: "The Last child of Okonkwo Ndichie Omile",
    },
  ];

  return (
    <section className="relative flex flex-col items-center">
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] font-medium">
          Tracing Our Roots: The Omile Family Heritage.
        </h2>
        <p className="md:text-[17px] text-[14px] w-[90%] md:w-[80%] mx-auto">
          Seven generations of legacy, unity, and tradition spanning across
          decades of Omile family history.
        </p>
      </div>

      {/* FAMILY TREE SECTION */}
      <div
        className="relative w-[600px] h-[600px] mt-6 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/tree.png)" }}
      >
        {/* Profiles with Tooltips */}
        {profiles.map((profile, index) => (
          <Tippy
            key={index}
            content={
              <span>
                <strong>{profile.name}</strong> <br />
                {profile.bio}
              </span>
            }
            placement="top"
            allowHTML={true}
          >
            <div
              className="absolute w-20 h-20 border-4 border-white-400 rounded-full overflow-hidden cursor-pointer transition-transform transform hover:scale-110"
              style={getProfilePosition(index)}
            >
              <Image
                src={profile.image}
                alt={profile.name}
                width={80}
                height={80}
                objectFit="cover"
              />
            </div>
          </Tippy>
        ))}
      </div>
    </section>
  );
}

// Function to set profile positions
function getProfilePosition(index: number) {
  const positions = [
    { top: "50px", left: "250px" },
    { top: "150px", left: "100px" },
    { top: "150px", left: "400px" },
    { top: "250px", left: "50px" },
    { top: "250px", left: "500px" },
    { top: "350px", left: "150px" },
    { top: "350px", left: "400px" },
  ];
  return positions[index] || {};
}
