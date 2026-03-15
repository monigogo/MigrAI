import globeImg from "@/assets/globe-color.png";

const AnimatedGlobe = () => {
  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 shrink-0 -mt-2 relative" style={{ perspective: "400px" }}>
      <div
        className="w-full h-full animate-spin-slow"
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          src={globeImg}
          alt="Globo terráqueo colorido"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default AnimatedGlobe;
