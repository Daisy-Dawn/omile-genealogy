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
    <section className="relative flex flex-col items-center px-4">
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-playfair leading-tight text-brown-gradient-main text-[28px] md:text-[50px] font-medium">
          Tracing Our Roots: The Omile Family Heritage.
        </h2>
        <p className="md:text-[17px] text-[14px] w-[90%] md:w-[80%] mx-auto">
          Seven generations of legacy, unity, and tradition spanning across
          decades of Omile family history.
        </p>
      </div>

      {/* FAMILY TREE SECTION */}
      <div
        className="relative w-full max-w-[600px] aspect-square mt-6 bg-contain bg-center bg-no-repeat"
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
              className="absolute border-4 border-white rounded-full overflow-hidden cursor-pointer transition-transform transform hover:scale-110 
              flex items-start w-10 h-10 md:w-20 md:h-20" // Ensuring proper fitting
              style={getProfilePosition(index)}
            >
              <Image
                src={profile.image}
                alt={profile.name}
                width={80}
                height={80}
                className="w-full h-full object-cover object-top rounded-full" // Fixes cropping issue
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
    { top: "10%", left: "45%" },
    { top: "25%", left: "20%" },
    { top: "25%", left: "70%" },
    { top: "40%", left: "10%" },
    { top: "40%", left: "80%" },
    { top: "60%", left: "30%" },
    { top: "60%", left: "65%" },
  ];
  return positions[index] || {};
}
