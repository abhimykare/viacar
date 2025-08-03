import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useEffect } from "react";

gsap.registerPlugin(MotionPathPlugin);

const CarAnimation: React.FC = () => {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    tl.set("#movingImage", { rotation: 0 });

    tl.to("#movingImage", {
      duration: 20,
      motionPath: {
        path: "#path",
        align: "#path",
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
      },
      ease: "sine.inOut",
    });

    tl.to("#movingImage", {
      duration: 1,
      rotation: "+=180",
      ease: "power1.inOut",
    });

    tl.to("#movingImage", {
      duration: 20,
      motionPath: {
        path: "#path",
        align: "#path",
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
        start: 1,
        end: 0,
      },
      ease: "sine.inOut",
    });

    tl.to("#movingImage", {
      duration: 1,
      rotation: "+=180",
      ease: "power1.inOut",
    });
  }, []);

  return (
    <svg
      className="w-full"
      width="900"
      height="100"
      viewBox="0 0 920 100"
      style={{ overflow: "visible" }}
      fill="none"
    >
      <path
        style={{ display: "none" }}
        id="path"
        d="M13.5762 46.7641L41.3568 85.9106C49.623 97.5588 64.9551 101.764 78.0071 95.9626L107.67 82.7782L134.883 71.1442C137.635 69.9676 140.548 69.2096 143.524 68.8951L256.692 56.9397L457.409 58.2639L490.458 58.2638L582.748 58.4783C589.495 58.494 596.051 56.2347 601.356 52.0653L601.94 51.6059C607.677 47.0968 614.861 44.8333 622.147 45.2392L757.589 52.7847C765.986 53.2525 773.798 57.2341 779.111 63.7538V63.7538C784.87 70.8227 793.541 74.8777 802.658 74.767L835.987 74.3625C845.573 74.2461 854.526 69.5554 860.078 61.7405L893.024 15.3711"
        stroke="white"
        strokeWidth="5.18914"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5762 46.7641L55.568 105.936L107.67 82.7782L139.035 69.3694L256.692 56.9397L457.409 58.2639L490.458 58.2638L593.165 58.5025L610.842 44.6094L770.771 53.5191L788.227 74.9421L851.242 74.1773L893.024 15.3711"
        stroke="white"
        strokeWidth="5.18914"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.7038 57.5774C23.3089 54.9234 24.8905 49.0387 22.2365 44.4336C19.5824 39.8285 13.6977 38.2469 9.09263 40.9009C4.48755 43.555 2.90594 49.4397 5.56 54.0448C8.21407 58.6499 14.0988 60.2315 18.7038 57.5774Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M899.691 19.6386C903.692 17.3329 905.066 12.2205 902.76 8.21978C900.454 4.21907 895.342 2.84504 891.341 5.15078C887.34 7.45653 885.966 12.5689 888.272 16.5696C890.578 20.5703 895.69 21.9444 899.691 19.6386Z"
        fill="#FFD8A3"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="2.52608"
      />
      <image
        className="size-[70px]"
        id="movingImage"
        href="/assets/car.png"
        width="40"
        height="40"
      />
    </svg>
  );
};

export default CarAnimation;
