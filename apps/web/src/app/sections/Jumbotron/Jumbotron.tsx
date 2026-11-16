"use client";
import React from 'react';
import './Jumbotron.css';

export default function Jumbotron() {
  return (
    <>
      {/* Asian brush display font CDN */}
      <link 
        rel="stylesheet" 
        href="https://fonts.cdnfonts.com/css/gang-of-three" 
      />
      {/* Zen Maru Gothic from Google Fonts */}
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&display=swap" 
      />

      <section className='jumbotron md:h-[80rem]' id="home">
        <div className='jumboText-container flex flex-col items-start text-left'>
          <div className='jumbo-group md:ml-[1rem] mt-10 md:mt-[2.5rem] flex flex-col items-start'>

            {/* Main Brush Title - Crisp White Outline + Subtle Glow */}
            <h1 
              className='text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider my-3'
              style={{ 
                fontFamily: "'Gang of Three', fantasy, cursive",
                color: "#00072D",
                textShadow: `
                  -2px -2px 0 #FFFFFF,
                  2px -2px 0 #FFFFFF,
                  -2px  2px 0 #FFFFFF,
                  2px  2px 0 #FFFFFF,
                  0px -2px 0 #FFFFFF,
                  0px  2px 0 #FFFFFF,
                  -2px  0px 0 #FFFFFF,
                  2px  0px 0 #FFFFFF,
                  0 0 18px rgba(255, 255, 255, 0.75)
                `
              }}
            >
              A Trip to WEMart
            </h1>

            {/* Bottom Subtitle ("April 3-4") */}
            <h2 
              className='text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-wider mt-1'
              style={{ 
                fontFamily: "'Gang of Three', fantasy, cursive",
                color: "#538FDD",
                fontWeight: 500,
                textShadow: `
                  -1px -1px 0 #FFFFFF,
                  1px -1px 0 #FFFFFF,
                  -1px  1px 0 #FFFFFF,
                  1px  1px 0 #FFFFFF,
                  0px -1px 0 #FFFFFF,
                  0px  1px 0 #FFFFFF,
                  -1px  0px 0 #FFFFFF,
                  1px  0px 0 #FFFFFF,
                  0 0 18px rgba(255, 255, 255, 0.75)
                `
              }}
            >
              April 3-4
            </h2>

          </div>
        </div>
      </section>
    </>
  );
}