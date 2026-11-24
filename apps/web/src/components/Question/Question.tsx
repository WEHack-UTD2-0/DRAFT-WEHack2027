'use client';

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import './Question.css'

function Question({number, question, answer} : {number: number, question : String, answer : String}) {
  const[open, setOpen] = React.useState(false);

  return (
    <div 
      className={`question w-full lg:w-10/12 relative overflow-hidden shadow-md transition-all duration-300`}
    >
        
        <details 
          className="bg-[#F0B6D6] relative overflow-hidden"
          open={open} 
          onToggle={() => setOpen(!open)}
        >

            <summary className='flex flex-wrap justify-between list-none w-full bg-[#F0B6D6] text-[#1F2A44] p-2 text-[14px] md:text-base lg:text-base'>
              <div className = 'flex items-center gap-3'>
                <span className='number-circle flex items-center justify-center w-10 h-10 text-lg md:text-lg font-bold text-white bg-[#002366] rounded-full mr-3'>
                  {number}
                </span>
                <span className="font-bold text-lg md:text-xl lg:text-2xl">{question}</span>
              </div>
            </summary>


            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="panel text-sm lg:text-base overflow-hidden"
                >

                  <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10"></div>

              
                  <div className="relative z-20 px-4 py-2 md:px-10">
                    {answer}
                  </div>

                  {/* <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10"></div> */}

                </motion.div>
              )}
            </AnimatePresence>
                

                {/* <div className="panel text-sm lg:text-base">
                    {answer}
                </div> */}
        </details>
    </div>
  )
}

export default Question