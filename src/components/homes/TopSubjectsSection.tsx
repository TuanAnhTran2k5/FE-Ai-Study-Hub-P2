import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import DocumentCarousel from "@/components/documents/DocumentCarousel";
import { ROUTE } from "@/models/routePath";
import { searchPublicDocuments } from "@/services/documentService";

function TopSubjectsSection() {
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topSubjectDocuments"],
    queryFn: () => searchPublicDocuments("a"),
  });

  const topSubjectDocuments = useMemo(() => {
    const subjectMap = new Map<number, (typeof documents)[number]>();

    documents.forEach((document) => {
      if (!subjectMap.has(document.subjectId)) {
        subjectMap.set(document.subjectId, document);
      }
    });

    return Array.from(subjectMap.values()).slice(0, 6);
  }, [documents]);

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 text-muted-foreground">
          Loading top subjects...
        </div>
      </section>
    );
  }

  if (isError || topSubjectDocuments.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-card-foreground">
              Top Subjects
            </h2>

            <p className="mt-2 text-muted-foreground">
              Explore popular study materials by subject.
            </p>
          </div>

          <Link
            to={ROUTE.COMMUNITY}
            className="font-semibold text-link hover:text-link-hover"
          >
            View all →
          </Link>
        </div>

        <DocumentCarousel documents={topSubjectDocuments} />
      </div>
    </section>
  );
}

export default TopSubjectsSection;