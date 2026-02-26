import React, { useState } from 'react';
import { Bell, Check, CheckCircle, Search, Calendar, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Exam Result: Pravesha", msg: "You have scored 92% in your final grammar exam. Certificate generated.", date: "Feb 24, 2026", type: "Academic", unread: true },
    { id: 2, title: "Acharya Ram is live!", msg: "Join the live session on 'Patanjali Yoga Sutras' now.", date: "Feb 23, 2026", type: "Live", unread: false },
    { id: 3, title: "Library Due Date", msg: "The book 'Sanskrit Made Easy' is due in 2 days.", date: "Feb 20, 2026", type: "Alert", unread: true },
    { id: 4, title: "Fee Receipt Generated", msg: "Your payment for 'Level 2: Madhyama' has been processed successfully.", date: "Feb 18, 2026", type: "Payment", unread: false },
  ]);

  // Logic to toggle individual notification read status
  const toggleReadStatus = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: !n.unread } : n
    ));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.msg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || (activeTab === "Unread" && n.unread);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-4xl mx-auto antialiased">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
        <div className="space-y-1">
          {/* <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">Updates</h1> */}
          {/* <p className="text-gray-500 font-medium">Keep track of your learning journey and academy news.</p> */}
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#74271E] bg-[#74271E]/5 hover:bg-[#74271E]/10 rounded-xl transition-all active:scale-95"
        >
          <CheckCircle size={18} /> Mark all read
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
        <div className="flex bg-white/50 backdrop-blur-sm border border-gray-200 p-1.5 rounded-2xl w-full sm:w-auto shadow-sm">
          {["All", "Unread"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === tab 
                ? "bg-[#74271E] text-white shadow-md shadow-[#74271E]/20" 
                : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c9a050] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search updates..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#c9a050]/10 focus:border-[#c9a050] transition-all text-sm shadow-sm font-medium"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((notif, idx) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`group flex items-start gap-5 p-6 transition-all relative ${
                  idx !== filtered.length - 1 ? "border-b border-gray-50" : ""
                } ${notif.unread ? "bg-[#c9a050]/5" : "hover:bg-gray-50/80"}`}
              >
                {/* Vertical Accent for Unread */}
                {notif.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c9a050] rounded-r-full" />
                )}

                <div className={`mt-1 p-3 rounded-2xl shrink-0 transition-all duration-500 ${
                  notif.unread 
                    ? "bg-[#74271E] text-white shadow-lg shadow-[#74271E]/20" 
                    : "bg-gray-100 text-gray-400 rotate-0"
                }`}>
                  <Bell size={22} className={notif.unread ? "animate-pulse" : ""} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#c9a050]">
                        {notif.type}
                      </span>
                      <h3 className={`text-lg font-bold leading-snug transition-colors ${notif.unread ? "text-[#74271E]" : "text-gray-800"}`}>
                        {notif.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 mt-1">
                      <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                        <Calendar size={12} className="text-gray-300" /> 
                        {notif.date}
                      </div>
                      
                      {/* MARK AS READ BUTTON */}
                      <button 
                        onClick={() => toggleReadStatus(notif.id)}
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          notif.unread 
                            ? "text-[#c9a050] hover:bg-[#c9a050] hover:text-white" 
                            : "text-green-500 bg-green-50"
                        }`}
                        title={notif.unread ? "Mark as read" : "Already read"}
                      >
                        {notif.unread ? <Check size={20} /> : <CheckCircle size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-2 leading-relaxed max-w-[90%] transition-colors ${notif.unread ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                    {notif.msg}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center px-6"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-4">
                <Inbox size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
              <p className="text-gray-500 mt-1 max-w-xs font-medium">No notifications found matching your current filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;