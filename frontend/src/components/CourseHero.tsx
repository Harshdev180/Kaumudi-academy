import { Clock, MonitorPlay, BarChart3, Languages } from "lucide-react";
import manuscriptImage from "../assets/image.png";

const CourseHero = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      {/* Hero Image with Overlay */}
      <div className="relative h-64 md:h-72">
        <img
          src={manuscriptImage}
          alt="Sanskrit Manuscript"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-foreground text-background text-xs font-medium px-2.5 py-1 rounded">ADVANCED</span>
          <span className="bg-success-light text-success text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0L7.5 4.5H12L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5H4.5L6 0Z"/>
            </svg>
            VERIFIED CERTIFICATE
          </span>
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
            Mastering Paninian Grammar: The Ashtadhyayi Framework
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            A comprehensive journey through the structural brilliance of classical Sanskrit linguistics.
          </p>
        </div>
      </div>

      {/* Course Metadata */}
      <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
            <p className="text-sm font-semibold text-foreground">12 Weeks</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <MonitorPlay className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Mode</p>
            <p className="text-sm font-semibold text-foreground">Live + Recorded</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Level</p>
            <p className="text-sm font-semibold text-foreground">Advanced</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Languages className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Language</p>
            <p className="text-sm font-semibold text-foreground">Sanskrit & English</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;
