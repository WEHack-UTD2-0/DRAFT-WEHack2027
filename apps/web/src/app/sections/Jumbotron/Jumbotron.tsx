"use client";
import React, { useEffect, useState } from 'react'
import './Jumbotron.css'

function Jumbotron() {
  return (
    <section className='jumbotron md:h-[80rem]' id="home">
      <div className='jumboText-container flex flex-col items-start text-left'>
        <div className='jumbo-group md:ml-[1rem] mt-16 md:mt-[5rem]'>
          <h4 className='jumbo-text font-thin text-[#F0D4E2] text-xs md:text-base lg:text-2xl'>WEHack 2027 Presents</h4>
          <h1 className='jumbo-title text-[#F0D4E2] text-3xl md:text-5xl lg:text-7xl animate-pulse'>WEHack 2027 Coming Soon</h1>
          <h2 className='jumbo-text font-thin text-[#C9D5E3] text-base sm:text-1xl md:1xl lg:text-4xl'>Spring 2027</h2>

                <div className='jumbo-buttons flex flex-row items-start space-x-4 mt-4 gap-1.3'>
                <a 
                  href="https://events.mlh.com/events/14391-wehack-2027" 
                  className="px-8 py-4 rounded-xl font-bold transition-all duration-200 text-[#1a1a1a] bg-[#F0D4E2] hover:bg-[#1F2A44] transform hover:scale-[1.02] shadow-xl text-lg inline-block"
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