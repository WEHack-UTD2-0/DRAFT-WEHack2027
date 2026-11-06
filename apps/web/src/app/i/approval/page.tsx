"use client";
import React from 'react';
import './Jumbotron.css';

function Jumbotron() {
  return (
    <section className='jumbotron md:h-[80rem]' id="home">
      <div className='jumboText-container flex flex-col items-start text-left'>
        <div className='jumbo-group md:ml-[1rem] mt-16 md:mt-[5rem] flex flex-col items-start'>
          
          {/* Subtitle / Header Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-[0.35em] text-[#D09C51] font-mono">
              ― ２０２７年開催 ―
            </span>
            <span className="text-xs md:text-sm text-[#FFE9D7]/80 uppercase tracking-widest font-mono">
              WEHack Presents
            </span>
          </div>

          {/* Japanese Display Title */}
          <h1 className='font-shojumaru text-[#FFE9D7] text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.2em] drop-shadow-[0_4px_16px_rgba(208,156,81,0.3)] my-2'>
            『 ＷＥＨＡＣＫ ２０２７ 』
          </h1>

          {/* Subheader / Tagline */}
          <div className="flex items-center gap-3 my-2">
            <span className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#C9D5E3]/80 font-mono">
              [ COMING SOON ]
            </span>
            <span className="text-sm md:text-xl text-[#C9D5E3] font-light">
              • Spring 2027
            </span>
          </div>

          {/* Action Button */}
          <div className='jumbo-buttons flex flex-row items-start space-x-4 mt-6'>
            <a 
              href="https://events.mlh.com/events/14391-wehack-2027" 
              className="px-8 py-4 rounded-xl font-bold transition-all duration-200 text-[#1a1a1a] bg-[#FFE9D7] hover:bg-[#CCBA97] transform hover:scale-[1.02] shadow-xl text-lg inline-block"
              target="_blank" 
              rel="noreferrer"
            >
              Fill out our Interest Form!
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Jumbotron;
