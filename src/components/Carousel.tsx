import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

// Embla Context
interface EmblaContextType<T = unknown> {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  emblaApi: UseEmblaCarouselType[1];
  autoplay: boolean;
  loop: boolean;
  delay: number;
  data: T[];
  canScroll: boolean;
  slidesPerView?: number;
  selectedSlide: number;
}

const EmblaContext = createContext<EmblaContextType | null>(null);
export const useEmblaContext = () => {
  const context = useContext(EmblaContext);
  if (!context) {
    throw new Error("useEmblaContext must be used within an EmblaProvider");
  }
  return context;
};

interface EmblaProviderProps<T = unknown> {
  loop?: boolean;
  autoplay?: boolean;
  delay?: number;
  data?: T[];
  align?: "start" | "center" | "end";
  children: ReactNode;
  playOnInit?: boolean;
  stopOnLastSnap?: boolean;
  slidesPerView?: number;
}

export default function Embla({
  loop = true,
  autoplay = true,
  delay = 3000,
  data = [],
  align = "center",
  playOnInit = false,
  children,
  stopOnLastSnap = true,
  slidesPerView = 1,
}: EmblaProviderProps) {
  const autoplayRef = Autoplay({
    delay,
    stopOnInteraction: false,
    playOnInit: playOnInit,
    stopOnMouseEnter: true,
    stopOnFocusIn: true,
    stopOnLastSnap: stopOnLastSnap,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align }, [autoplayRef]);
  const [canScroll, setCanScroll] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);

  // Check if carousel can scroll based on container size vs content size
  useEffect(() => {
    if (!emblaApi) return;

    const handleSelectedSlide = () =>
      setSelectedSlide(emblaApi.selectedScrollSnap());

    emblaApi.on("select", handleSelectedSlide);

    const updateCanScroll = () => {
      const canScrollValue =
        emblaApi.canScrollNext() || emblaApi.canScrollPrev();
      setCanScroll(canScrollValue);
    };

    // Initial check
    updateCanScroll();

    // Listen for resize and select events to update scroll ability
    emblaApi.on("resize", updateCanScroll);
    emblaApi.on("select", updateCanScroll);
    emblaApi.on("reInit", updateCanScroll);

    return () => {
      emblaApi.off("resize", updateCanScroll);
      emblaApi.off("select", updateCanScroll);
      emblaApi.off("reInit", updateCanScroll);
    };
  }, [emblaApi]);

  return (
    <EmblaContext.Provider
      value={{
        emblaRef,
        emblaApi,
        autoplay,
        loop,
        delay,
        data,
        canScroll,
        slidesPerView,
        selectedSlide,
      }}
    >
      {children}
    </EmblaContext.Provider>
  );
}

// Carousel Container
function EmblaContainer({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  const { emblaRef } = useEmblaContext();
  return (
    <div className={cn("h-full")} ref={emblaRef} {...props}>
      <div
        className={cn("flex h-full -mx-6 cursor-grab items-stretch", className)}
      >
        {children}
      </div>
    </div>
  );
}

// Individual Slide
function EmblaSlide({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const { slidesPerView, selectedSlide } = useEmblaContext();
  const isActive = selectedSlide === index;

  return (
    <div
      className={cn(
        "shrink-0 grow-0 min-w-0 px-6 items-center justify-center flex",
        {
          "basis-full": slidesPerView === 1,
          "basis-full sm:basis-1/2": slidesPerView === 2,
          "basis-full md:basis-1/2 lg:basis-1/3": slidesPerView === 3,
          "basis-2/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4":
            slidesPerView === 4,
        }
      )}
    >
      <div
        className={cn(
          "transition-transform duration-300",
          isActive ? "scale-100" : "scale-85"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Navigation Controls
function NavigationControls({
  className,
}: {
  className?: string;
  hidden?: boolean;
}) {
  const { emblaApi } = useEmblaContext();
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const canScroll = emblaApi?.canScrollNext() || emblaApi?.canScrollPrev();
  if (!canScroll) return null;

  return (
    <div
      className={cn(
        "flex justify-between absolute -inset-x-0 top-1/2 -translate-y-1/2",
        className
      )}
    >
      <button
        className={cn(
          "transition-transform bg-gray-300 rounded-full p-1 cursor-pointer"
        )}
        onClick={scrollPrev}
      >
        <LucideChevronLeft size={16} />
      </button>
      <button
        className={cn(
          "transition-transform bg-gray-300 rounded-full p-1 cursor-pointer"
        )}
        onClick={scrollNext}
      >
        <LucideChevronRight size={16} />
      </button>
    </div>
  );
}

Embla.Container = EmblaContainer;
Embla.Slide = EmblaSlide;
Embla.NavigationControls = NavigationControls;
