import React from 'react'

function ActivityFeed() {
    return (
        <>
            <div className='bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 '>
                <div className='p-6 border-b border-slate-200/50'>
                    <div>
                        <h3 className='text-lg font-bold text-[#6b1d14]'>Activity Feed</h3>
                        <p className='text-sm text-slate-500'>Recent System Activites</p>
                    </div>
                    <button className='text-[#6b1d14]/60 hover:text-[#6b1d14]/80'>
                        view All
                    </button>
                </div>
                <div className='p-6'>
                    <div className='space-y-4'>
                        <div className='flex items-start space-x-4 rounded-xl hover-bg -slate-50 transition-colors'>
                            <div className={`p-2 rounded-lg`}></div>
                            <div className='flex-1 min-w-0'>
                                <h4 className='text-sm font-semibold text-slate-800'>Activity Title</h4>
                                <p className='text-sm text-slate-600 truncate'>Activity Description</p>
                                <div className='flex items-center-safe space-x-1 mt-1'>
                                    {/* <Clock className="w-3 h-3 text-slate-400" /> */}
                                    <span className='text-xs text-slate-500'>Activity Time</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ActivityFeed