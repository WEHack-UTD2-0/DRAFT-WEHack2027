import React from 'react'
import './Button.css'

function Button({buttonText, link} : {buttonText : String, link : any}) {
  return (
      <a href={link} className="text-md mt-2" target="_blank">
        <button className="primary-btn bg-[#C6DBEC] text-[#282738] hover:bg-[#6e8d85] py-3 px-5 md:px-10">{buttonText}</button>
      </a>
  )
}

export default Button