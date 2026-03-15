import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

const categories = [
  {
    id: "tramites",
    label: "📋 Trámites",
    items: [
      { name: "Certificado electrónico", desc: "Obtén tu certificado digital para hacer trámites online.", url: "https://www.sede.fnmt.gob.es/certificados/persona-fisica" },
      { name: "Cl@ve", desc: "Sistema de identificación para acceder a servicios públicos.", url: "https://clave.gob.es/clave_Home/registro.html" },
      { name: "Tarjeta sanitaria", desc: "Solicita tu tarjeta sanitaria para acceder a la sanidad pública.", url: "https://www.comunidad.madrid/servicios/salud/tarjeta-sanitaria" },
    ],
  },
  {
    id: "empleo",
    label: "💼 Empleo y SS",
    items: [
      { name: "Alta en Seguridad Social", desc: "Cómo darte de alta como trabajador.", url: "https://www.seg-social.es" },
      { name: "Alta en el SEPE", desc: "Inscríbete como demandante de empleo.", url: "https://www.sepe.es" },
      { name: "Import@ss", desc: "Portal de la Seguridad Social para gestionar tu vida laboral.", url: "https://portal.seg-social.gob.es/wps/portal/importass" },
    ],
  },
  {
    id: "apps",
    label: "📱 Apps y portales",
    items: [
      { name: "Mi Carpeta Ciudadana", desc: "Consulta tus datos, notificaciones y trámites con la administración.", url: "https://sede.administracion.gob.es/carpeta/cid/MiCarpetaCiudadana" },
      { name: "Nota APP", desc: "App de notificaciones de la administración.", url: "https://notifica.gob.es" },
      { name: "Cuenta Digital Madrid", desc: "Accede a servicios digitales del Ayuntamiento de Madrid.", url: "https://sede.madrid.es" },
      { name: "Oficina Virtual Seg. Social", desc: "Gestiona prestaciones y consultas de la Seguridad Social.", url: "https://portal.seg-social.gob.es" },
    ],
  },
];

interface ResolucionFavorableTabProps {
  onBack: () => void;
}

const ResolucionFavorableTab = ({ onBack }: ResolucionFavorableTabProps) => {
  const [activeTab, setActiveTab] = useState("tramites");
  const activeCategory = categories.find((c) => c.id === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div>
          <h1 className="font-heading text-xl font-extrabold text-foreground">✅ Resolución favorable</h1>
          <p className="text-sm text-muted-foreground">Todo lo que necesitas hacer ahora.</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border pb-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all ${
              activeTab === cat.id
                ? "bg-card text-primary border border-border/60 border-b-card -mb-px relative z-[1] shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Resource cards */}
      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {activeCategory.items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 border border-border/50 p-2">
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=64`}
                alt=""
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResolucionFavorableTab;
