import React from 'react'
import './Menu.css'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";

function Menu() {
  return (
    <div className="mt-28 px-4 pb-28 sm:px-6 lg:px-24">
      <div className='flex justify-center items-center mb-10'>
        <h2 className="aisle-heading">Aisle 4 · Menu</h2>
      </div>
    </div>
  )
}

export default Menu
