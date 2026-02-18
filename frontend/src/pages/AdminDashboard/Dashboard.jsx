import React from 'react'
import StatsGrid from './StatsGrid'
import ChartSection from './ChartSection'
import TableSection from './TableSection'
import ActivityFeed from './ActivityFeed'

function Dashboard() {
    return (
        <div className='space-y-6'>

            {/* Stats */}
            <StatsGrid />

            {/* Charts */}
            <ChartSection />

            {/* TOP COURSES + INQUIRIES */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT — TOP COURSES */}
                <div className="xl:col-span-2">
                    <TableSection type="top" />
                </div>

                {/* RIGHT — INQUIRY */}
                <ActivityFeed />

            </div>

            {/* RECENT ORDERS FULL WIDTH */}
            <TableSection type="orders" />

        </div>
    )
}

export default Dashboard
