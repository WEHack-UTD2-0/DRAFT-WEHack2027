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
          <div className='jumbo-group md:ml-[1rem] mt-16 md:mt-[5rem] flex flex-col items-start'>
            
            {/* Top Subtitle - Soft Blue */}
            <h4 
              className='text-xs md:text-base lg:text-2xl tracking-wider'
              style={{ 
                fontFamily: "'Zen Maru Gothic', sans-serif",
                color: "#C5D9EB" 
              }}
            >
              WEHack 2027 Presents
            </h4>

            {/* Main Brush Title - Focal Pink */}
            <h1 
              className='text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider my-3'
              style={{ 
                fontFamily: "'Gang of Three', fantasy, cursive",
                color: "#EFB5D5",
                textShadow: '0 0 25px rgba(239, 181, 213, 0.4), 0 3px 10px rgba(0, 0, 0, 0.9)'
              }}
            >
              A Trip to WEMart
            </h1>

            {/* Bottom Subtitle - Saturated Blue */}
            <h2 
              className='text-base sm:text-xl md:text-2xl lg:text-4xl tracking-wide'
              style={{ 
                fontFamily: "'Zen Maru Gothic', sans-serif",
                color: "#C5D9EB",
                fontWeight: 700 
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