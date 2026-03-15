import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight, ExternalLink } from "lucide-react";

const categories = [
  {
    id: "tramites",
    label: "📋 Trámites esenciales",
    items: [
      { name: "Certificado electrónico", desc: "Obtén tu certificado digital para hacer trámites online.", url: "https://www.sede.fnmt.gob.es/certificados/persona-fisica" },
      { name: "Cl@ve", desc: "Sistema de identificación para acceder a servicios públicos.", url: "https://clave.gob.es/clave_Home/registro.html" },
      { name: "Tarjeta sanitaria", desc: "Solicita tu tarjeta sanitaria para acceder a la sanidad pública.", url: "https://www.comunidad.madrid/servicios/salud/tarjeta-sanitaria" },
    ],
  },
  {
    id: "empleo",
    label: "💼 Empleo y Seguridad Social",
    items: [
      { name: "Alta en Seguridad Social", desc: "Cómo darte de alta como trabajador.", url: "https://www.seg-social.es" },
      { name: "Alta en el SEPE", desc: "Inscríbete como demandante de empleo.", url: "https://www.sepe.es" },
      { name: "Import@ss", desc: "Portal de la Seguridad Social para gestionar tu vida laboral.", url: "https://portal.seg-social.gob.es/wps/portal/importass" },
    ],
  },
  {
    id: "apps",
    label: "📱 Apps y portales útiles",
    items: [
      { name: "Mi Carpeta Ciudadana", desc: "Consulta tus datos, notificaciones y trámites con la administración.", url: "https://sede.administracion.gob.es/carpeta/cid/MiCarpetaCiudadana" },
      { name: "Nota APP", desc: "App de notificaciones de la administración.", url: "https://notifica.gob.es" },
      { name: "Cuenta Digital Madrid", desc: "Accede a servicios digitales del Ayuntamiento de Madrid.", url: "https://sede.madrid.es" },
      { name: "Oficina Virtual Seg. Social", desc: "Gestiona prestaciones y consultas de la Seguridad Social.", url: "https://portal.seg-social.gob.es" },
    ],
  },
];

const ResolucionFavorableDialog = () => {
  const [activeTab, setActiveTab] = useState("tramites");
  const activeCategory = categories.find((c) => c.id === activeTab)!;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:shadow-lg active:scale-[0.98] shadow-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-green-500/10 flex items-center justify-center shrink-0">
            <span className="text-2xl">✅</span>
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-foreground text-base">Resolución favorable</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">¿Tienes tu favorable? Descubre qué hacer ahora.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground/50 shrink-0" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold">✅ Resolución favorable</DialogTitle>
          <p className="text-sm text-muted-foreground">Todo lo que necesitas hacer ahora que tienes tu favorable.</p>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border pb-0 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition-all ${
                activeTab === cat.id
                  ? "bg-card text-primary border border-border border-b-card -mb-px relative z-[1]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-2 pt-3 pb-1">
          {activeCategory.items.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:shadow-md hover:border-primary/30 group"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=64`}
                alt=""
                className="w-8 h-8 rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResolucionFavorableDialog;
