"use client"
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import heroBg from "./../../../public/images/hero9.png"; // substitua pelo nome da sua imagem

// const Hero = () => {
//   return (
//     <section className="relative flex items-center justify-center w-full h-screen overflow-hidden ">
      
//       {/* Imagem de fundo com blur */}
//       <div className="absolute inset-0 -z-10">
//         <Image
//           src={heroBg}
//           alt="Fundo PROMET"
//           fill
//           className="object-cover blur-sm"
//           priority
//         />
//       </div>

//       {/* <svg
//         className="absolute top-0 left-0 w-[28rem] h-[28rem] text-brand-main/30 dark:text-brand-main/40 blur-xl"
//         viewBox="0 0 200 200"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           fill="currentColor"
//           d="M40.3,-66.9C52.8,-59.8,65.1,-52.1,72.5,-40.6C79.9,-29.2,82.4,-14.6,80.1,-0.9C77.8,12.7,70.8,25.3,62.5,37.1C54.2,48.8,44.7,59.7,32.6,66.4C20.5,73.1,5.8,75.7,-8.7,77.2C-23.1,78.7,-46.2,79.2,-59.7,68.4C-73.2,57.6,-77.1,35.6,-77.8,15.6C-78.6,-4.3,-76.2,-22.4,-66.5,-35.2C-56.8,-48,-39.7,-55.5,-24.2,-62.9C-8.6,-70.4,5.4,-77.9,18.9,-77.2C32.4,-76.6,45.6,-67.9,40.3,-66.9Z"
//           transform="translate(100 100)"
//         />
//       </svg>

//       <svg
//         className="absolute bottom-0 right-0 w-[32rem] h-[32rem] text-brand-bgdark/20 dark:text-brand-main/30 blur-xl"
//         viewBox="0 0 200 200"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           fill="currentColor"
//           d="M38.9,-67.4C50.6,-58.2,61.1,-49.4,69.7,-37.9C78.4,-26.5,85.3,-13.2,84.9,-0.3C84.5,12.5,76.9,25.1,68.3,36.8C59.7,48.5,50.2,59.2,38.2,67.7C26.2,76.3,13.1,82.6,-0.9,83.9C-14.8,85.3,-29.7,81.7,-43.4,73.1C-57.1,64.5,-69.7,50.8,-75.6,34.5C-81.4,18.2,-80.5,-0.6,-75.3,-17.4C-70.1,-34.2,-60.6,-48.9,-47.3,-57.8C-34.1,-66.7,-17,-69.9,-1.1,-68.2C14.8,-66.6,29.6,-60.2,38.9,-67.4Z"
//           transform="translate(100 100)"
//         />
//       </svg> */}

//       {/* Conteúdo principal */}
//       <div className="text-center px-6 max-w-3xl relative z-10">
//         <h1 className="text-5xl sm:text-5xl font-extrabold tracking-tight text-brand-main dark:text-white leading-tight">
//           Amplie, <span className="text-transparent bg-clip-text bg-brand-lime">Desenvolva</span>, Conquiste
//         </h1>
//         <p className="mt-6 text-xs sm:text-xl leading-8 text-gray-500 dark:text-gray-300">
//           Programa de Melhoria de Empregabilidade e Trabalho
//         </p>
//         <div className="mt-10 flex justify-center">
//           <Link
//             href="/formulario"
//             className="relative rounded-lg bg-brand-main px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl "
//           >
//             Quero Participar
//           </Link>
//         </div>

//         <div className="mt-6 flex justify-center">
//           <div className="h-1 w-32 rounded-full bg-brand-main"></div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "./../../../public/images/hero.png";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden pl-20">
      <div className=" grid md:grid-cols-2 gap-10 items-center">
        
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-main dark:text-white leading-tight">
            Amplia, Fortaleça e Conquiste! <span className="text-brand-lime"> PROMET</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
            Cursos e formações criadas para transformar o seu futuro. Comece hoje e faça parte de uma comunidade de jovens inovadores.
          </p>
          <div className="flex gap-4">
            <Link
              href="/formulario"
              className="px-6 py-3 bg-brand-main text-white font-medium rounded-2xl shadow-md hover:bg-brand-lime transition"
            >
              Quero Participar
            </Link>
          </div>
        </div>

        <div className="flex justify-center w- bg-brand-lime rounded-tl-full mt-8">
          <div className="">
            {/* SVG moderno de aprendizado */}
            <Image src={logo} alt="HeroBg" />
          </div>
        </div>
      </div>

      {/* Background Elements */}
       <svg
        className="absolute top-10 left-10 w-72 h-72 text-purple-300 opacity-10 animate-float-slow z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M40.3,-66.9C52.8,-59.8,65.1,-52.1,72.5,-40.6C79.9,-29.2,82.4,-14.6,80.1,-0.9C77.8,12.7,70.8,25.3,62.5,37.1C54.2,48.8,44.7,59.7,32.6,66.4C20.5,73.1,5.8,75.7,-8.7,77.2C-23.1,78.7,-46.2,79.2,-59.7,68.4C-73.2,57.6,-77.1,35.6,-77.8,15.6C-78.6,-4.3,-76.2,-22.4,-66.5,-35.2C-56.8,-48,-39.7,-55.5,-24.2,-62.9C-8.6,-70.4,5.4,-77.9,18.9,-77.2C32.4,-76.6,45.6,-67.9,40.3,-66.9Z"
          transform="translate(100 100)"
        />
      </svg>


      <svg
        className="absolute bottom-20 left-1/4 w-60 h-60 text-brand-lime opacity-10 animate-float-fast z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M45.2,-58.4C59.5,-48.5,73.8,-36.8,77.7,-22.3C81.5,-7.7,75,10,64.1,23.9C53.2,37.7,37.8,47.8,22.1,55.9C6.4,64,-9.6,70.1,-24.2,65.4C-38.9,60.7,-52.1,45.1,-60.3,27.1C-68.5,9.1,-71.8,-11.4,-64.2,-27.6C-56.7,-43.8,-38.2,-55.8,-19.4,-64.4C-0.7,-73.1,18.5,-78.4,34.2,-71.8C50,-65.1,62.5,-46.3,45.2,-58.4Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Keyframes de animação */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(15deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 14s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;