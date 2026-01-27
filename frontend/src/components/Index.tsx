import BreadcrumbNav from "../components/BreadcrumbNav";
import CourseHero from "../components/CourseHero";
import CourseOverview from "../components/CourseOverview";
import CourseCurriculum from "../components/CourseCurriculum";
import PricingCard from "../components/PricingCard";


const Index = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Advanced Courses", href: "/courses" },
    { label: "Sanskrit Grammar Pro", isActive: true },
  ];

  return (
    <div className="min-h-screen bg-background">
     
      
      <main className="container mx-auto px-4">
        <BreadcrumbNav items={breadcrumbs} />
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            <CourseHero />
            <CourseOverview />
            <CourseCurriculum />
          </div>
          
          {/* Right Column - Pricing */}
          <div className="lg:col-span-1">
            <PricingCard />
          </div>
        </div>
      </main>
      
     
    </div>
  );
};

export default Index;
