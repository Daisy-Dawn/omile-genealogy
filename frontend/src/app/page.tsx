"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function FamilyTree() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // NEW STATE
  const correctPassword = "omiletogether";
  const loginBoxRef = useRef(null);

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
      image: "/images/home/3rd.jpg",
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

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("auth");
      const lastLogin = localStorage.getItem("lastLogin");
  
      if (storedAuth === "true" && lastLogin) {
        const lastLoginDate = new Date(parseInt(lastLogin));
        const today = new Date();
  
        if (
          today.getFullYear() === lastLoginDate.getFullYear() &&
          today.getMonth() === lastLoginDate.getMonth() &&
          today.getDate() === lastLoginDate.getDate()
        ) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("auth");
          localStorage.removeItem("lastLogin");
          setIsAuthenticated(false); // 🔥 Ensure state updates
        }
      } else {
        setIsAuthenticated(false); // 🔥 Ensure it correctly logs out
      }
  
      setIsLoading(false);
    };
  
    checkAuth(); // Run on mount
  
    // 🔥 Listen for localStorage changes
    const handleStorageChange = (event) => {
      if (event.key === "auth") {
        checkAuth(); // Recheck authentication instantly
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  



  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      localStorage.setItem("lastLogin", Date.now().toString());
  
      window.dispatchEvent(new Event("storage")); // 🔥 Notify other components about auth change
    } else {
      if (loginBoxRef.current) {
        loginBoxRef.current.classList.add("shake");
        setTimeout(() => loginBoxRef.current.classList.remove("shake"), 300);
      }
    }
  };
  

  if (isLoading) return null;

  return (
    <div className="relative min-h-screen bg-cover bg-center">
      {!isAuthenticated ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={loginBoxRef}
            className="bg-black bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg w-80 text-center"
          >
            <h2 className="text-white text-lg font-semibold">Omile Family</h2>

            {/* PASSWORD INPUT FIELD WITH TOGGLE ICON */}
            <div className="relative mt-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded text-center pr-10"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {/* Eye Icon Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? <VisibilityOff className="text-gray-500" /> : <Visibility className="text-gray-500" />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="mt-4 w-full bg-appBrown2 text-white py-2 rounded hover:bg-appBrown"
            >
              Enter
            </button>
          </div>
        </div>
      ) : (
        <section className="relative flex flex-col items-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-playfair leading-tight text-brown-gradient-main text-[28px] md:text-[50px] font-medium">
              Tracing Our Roots: The Omile Family Heritage.
            </h2>
            <p className="md:text-[17px] text-[14px] w-[90%] md:w-[80%] mx-auto">
              Seven generations of legacy, unity, and tradition spanning across
              decades of Omile family history.
            </p>
          </div>
          <div
            className="relative w-full max-w-[600px] aspect-square mt-6 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/home/tree.png)" }}
          >
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
                  flex items-start w-10 h-10 md:w-20 md:h-20"
                  style={getProfilePosition(index)}
                >
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
              </Tippy>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function getProfilePosition(index) {
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
