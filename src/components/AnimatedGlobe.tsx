import globeImg from "@/assets/globe-color.png";

const AnimatedGlobe = () => {
  return (
    <div className="w-36 h-36 shrink-0 -mt-2 relative">
      <div className="w-full h-full rounded-full overflow-hidden relative animate-spin-slow">
        <img
          src={globeImg}
          alt="Globo terráqueo colorido"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
      {/* Soft shadow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-foreground/10 rounded-full blur-sm" />
    </div>
  );
};

export default AnimatedGlobe;
