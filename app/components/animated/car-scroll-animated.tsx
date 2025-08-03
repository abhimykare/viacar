import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PointingIcon from "../icons/pointing-icon";

gsap.registerPlugin(ScrollTrigger);

const CarScrollAnimated = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const arrowRefs = useRef<SVGSVGElement[]>([]);

  useEffect(() => {
    if (!imgRef.current) return;

    gsap.fromTo(
      imgRef.current,
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      arrowRefs.current,
      { x: (i) => (i % 2 === 0 ? 100 : -100), opacity: 0 },
      {
        x: 0,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 50%",
          end: "top 20%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <>
      <img
        ref={imgRef}
        className="lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3 size-full object-cover z-[1]"
        src="/assets/suv.png"
        alt="SUV"
      />

      {[
        "rotate-180 col-start-2 col-end-3 row-start-1 row-end-2 mt-[100px] max-lg:hidden",
        "col-start-2 col-end-3 row-start-1 row-end-2 mt-[100px] ml-auto max-lg:hidden",
        "rotate-180 col-start-2 col-end-3 row-start-2 row-end-3 mt-[100px] max-lg:hidden",
        "col-start-2 col-end-3 row-start-2 row-end-3 mt-[100px] ml-auto max-lg:hidden",
      ].map((className, i) => (
        <PointingIcon
          key={i}
          ref={(el) => {
            if (el) arrowRefs.current[i] = el;
          }}
          className={className}
        />
      ))}
    </>
  );
};

export default CarScrollAnimated;
