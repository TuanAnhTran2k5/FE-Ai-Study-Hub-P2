import type { DocumentResponse } from "@/types/document.type";
import DocumentCard from "./DocumentCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface DocumentCarouselProps {
  documents: DocumentResponse[];
  onView?: (document: DocumentResponse) => void;
}

function DocumentCarousel({ documents, onView }: DocumentCarouselProps) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-6">
        {documents.map((document) => (
          <CarouselItem
            key={document.id}
            className="pl-6 md:basis-1/2 xl:basis-1/3"
          >
            <DocumentCard document={document} onView={onView} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden border-border bg-card text-primary hover:bg-primary-bg-hover lg:flex" />
      <CarouselNext className="hidden border-border bg-card text-primary hover:bg-primary-bg-hover lg:flex" />
    </Carousel>
  );
}

export default DocumentCarousel;
