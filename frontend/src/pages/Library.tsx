import Header from "../components/Header";
import Footer from "../components/Footer";

const Courses = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
          Our Library
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore structured Sanskrit programs ranging from beginner to advanced,
          crafted with traditional precision and modern pedagogy.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default Courses;
