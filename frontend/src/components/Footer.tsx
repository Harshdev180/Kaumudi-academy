const Footer = () => {
  return (
    <footer className="border-t border-border mt-16 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-8 mb-6">
          <div className="h-0.5 w-16 bg-border" />
          <div className="w-3 h-3 rounded-full bg-muted" />
          <div className="h-0.5 w-16 bg-border" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © 2024 Kaumudi Sanskrit Academy. Preserving Heritage Through Precision.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
