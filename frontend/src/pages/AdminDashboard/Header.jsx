import { Bell, Filter, Menu, Plus, Search, Settings, Sun } from 'lucide-react'
import React from 'react'

function Header({ sidebarCollapsed, onToggleSidebar }) {
    return (
        <div className='bg-[#74271E]  backdrop-blur-xl border-b border-slate-300 px-6 py-4'>
            <div className='flex items-center justify-between'>
                {/* Left Section */}
                <div className='flex items-center space-x-4'>
                    <button className='p-2 rounded-lg text-white hover:bg-[#D4AF37] hover:text-[#74271E] transition-colors border hover:border-black'
                        onClick={onToggleSidebar}>
                        <Menu className='w-5 h-5' />
                    </button>

                    <div className='hidden md:block'>
                        <h1 className='text-2xl font-black text-white '>Dashboard</h1>
                    </div>
                </div>
                {/* Center */}
                <div className='flex-1 max-w-md mx-8'>
                    <div className='relative'>
                        <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400' />
                        <input type="text" placeholder='Search Anything' className='w-full pl-10 pr-4 py-2.5 bg-slate-100 border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' />
                        <button className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600'>
                            <Filter />
                        </button>
                    </div>
                </div>

                {/* Right */}
                <div className='flex items-center space-x-3'>
                    {/* Quick Action */}
                    {/* <button className="hidden md:flex items-center space-x-2 py-2 px-4 bg-[#D4AF37] text-[#74271E] rounded-xl  transition-all">
                        <Plus className='w-4 h-4' />
                        <span className='text-sm font-medium'>New</span>
                    </button> */}
                    {/* Notification */}
                    <button className='relative p-2.5 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#74271E] transition-colors'>
                        <Bell className='w-5 h-5' />
                        <span className='absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex item-center justify-center'>3</span>
                    </button>
                    {/* Setting */}
                    <button className='p-2.5 rounded-xl text-[#D4AF37] hover-bg-slate-100 transition-colors'>
                        <Settings className='w-5 h-5' />
                    </button>


                </div>
            </div>
        </div>
    )
}

export default Header