import Table from './../../components/Table'
import Navbar from './../../components/Navbar'
import React from 'react'

export default function page() {
  return (
    <div>
      <div className='p-6 max-w-7xl mx-auto'>
        <Navbar />
        <Table />
      </div>
    </div>
  )
}
