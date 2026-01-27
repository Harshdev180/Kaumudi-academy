import Header from "../components/Header";
import BreadcrumbNav from "../components/BreadcrumbNav";
import CourseHero from "../components/CourseHero";
import CourseOverview from "../components/CourseOverview";
import CourseCurriculum from "../components/CourseCurriculum";
import PricingCard from "../components/PricingCard";
import Footer from "../components/Footer";

const Index = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Advanced Courses", href: "/courses" },
    { label: "Sanskrit Grammar Pro", isActive: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
      
      <Footer />
    </div>
  );
};

export default Index;
