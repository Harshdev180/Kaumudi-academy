import { ChevronDown, PlayCircle, FileText, ClipboardList, Lock } from "lucide-react";
import { useState } from "react";

interface CurriculumItem {
  icon: "video" | "document" | "assessment";
  title: string;
}

interface CurriculumModule {
  week: string;
  title: string;
  items?: CurriculumItem[];
  isLocked?: boolean;
}

const CourseCurriculum = () => {
  const [openModules, setOpenModules] = useState<number[]>([0]);

  const modules: CurriculumModule[] = [
    {
      week: "Week 1-3",
      title: "Foundations of Paninian Logic",
      items: [
        { icon: "video", title: "Introduction to Maheshwara Sutras" },
        { icon: "document", title: "Decoding the Pratyahara Technique" },
        { icon: "assessment", title: "Module 1 Assessment: Phonetic Structures" },
      ],
    },
    {
      week: "Week 4-8",
      title: "Morphology & Sandhi Rules",
      items: [
        { icon: "video", title: "Understanding Word Formation" },
        { icon: "document", title: "Sandhi Rules Deep Dive" },
        { icon: "assessment", title: "Module 2 Assessment" },
      ],
    },
    {
      week: "Week 9-12",
      title: "Karakas and Advanced Syntax",
      isLocked: true,
    },
  ];

  const toggleModule = (index: number) => {
    if (modules[index].isLocked) return;
    setOpenModules((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const getIcon = (type: CurriculumItem["icon"]) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4 text-primary" />;
      case "document":
        return <FileText className="w-4 h-4 text-muted-foreground" />;
      case "assessment":
        return <ClipboardList className="w-4 h-4 text-amber" />;
    }
  };

  return (
    <section className="mt-8">
      <div className="mb-2">
        <span className="text-primary font-serif text-lg">२.</span>
      </div>
      <h2 className="text-2xl font-serif font-semibold text-foreground italic mb-4">
        Curriculum
      </h2>

      <div className="space-y-3">
        {modules.map((module, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleModule(index)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
              disabled={module.isLocked}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">{module.week}</span>
                <span className="text-sm font-semibold text-foreground">{module.title}</span>
              </div>
              {module.isLocked ? (
                <Lock className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openModules.includes(index) ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {openModules.includes(index) && module.items && (
              <div className="px-4 pb-4 space-y-2">
                {module.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-3 py-2 text-sm text-muted-foreground"
                  >
                    {getIcon(item.icon)}
                    {item.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseCurriculum;
