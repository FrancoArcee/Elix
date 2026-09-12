"use client";

import { useEffect } from "react";
import { useLegalStore } from "@/context/useLegalStore";

export default function LegalDrawer() {
  const { isOpen, activeTab, closeModal, setActiveTab } = useLegalStore();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen
        ? "pointer-events-auto opacity-100"
        : "pointer-events-none opacity-0"
        }`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <aside
        className={`absolute bottom-0 right-0 top-0 flex h-full w-full max-w-full flex-col bg-background shadow-2xl transition-transform duration-300 ease-out md:max-w-[560px] ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="font-serif text-[18px] font-bold tracking-[4px] text-ink">
              ELIX
            </span>
            <span className="text-[11px] uppercase tracking-[1.5px] text-muted">
              Información legal
            </span>
          </div>

          <button
            type="button"
            onClick={closeModal}
            aria-label="Cerrar panel legal"
            className="flex size-9 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:bg-ink hover:text-background"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-ink/10 bg-background px-6">
          <button
            type="button"
            onClick={() => setActiveTab("terminos")}
            className={`border-b-2 pb-3.5 pt-4 text-[13px] font-medium tracking-[0.5px] transition-colors ${activeTab === "terminos"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
              }`}
          >
            Términos y condiciones
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("privacidad")}
            className={`ml-6 border-b-2 pb-3.5 pt-4 text-[13px] font-medium tracking-[0.5px] transition-colors ${activeTab === "privacidad"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
              }`}
          >
            Política de privacidad
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {activeTab === "terminos" ? (
            <div className="space-y-6 text-[14px] leading-[23px] text-ink/80">
              <header>
                <h2
                  id="legal-drawer-title"
                  className="font-serif text-[24px] font-bold leading-tight text-ink md:text-[28px]"
                >
                  Términos y Condiciones
                </h2>
                <p className="mt-1 text-[12px] text-muted">
                  Última actualización: Septiembre 2026
                </p>
              </header>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  1. Naturaleza del servicio
                </h3>
                <p>
                  ELIX opera como un catálogo digital interactivo de perfumería
                  árabe y fragancias exclusivas en la República Argentina. El
                  acceso y la navegación en este sitio web implican la aceptación
                  plena de los presentes términos de uso.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  2. Modalidad de compra y consultas
                </h3>
                <p>
                  El sitio web funciona como catálogo de exhibición y consulta.
                  Las operaciones de compra, confirmación de disponibilidad,
                  asesoramiento personalizado y coordinación de pago y entrega
                  se canalizan de forma directa y personalizada a través de
                  nuestros medios de contacto oficiales (como Instagram).
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  3. Precios y disponibilidad de stock
                </h3>
                <p>
                  Los valores y productos que pueden estar exhibidos en la plataforma son
                  referenciales y están expresados en pesos argentinos (ARS).
                  Nos reservamos el derecho de actualizar precios y stock sin
                  aviso previo. El precio final y la reserva del producto quedan
                  formalmente ratificados al momento de la confirmación directa.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  4. Envíos y entregas
                </h3>
                <p>
                  Los métodos de entrega y puntos de retiro se convienen puntualmente con cada cliente al momento de
                  concretar la orden.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  5. Propiedad intelectual y marcas registradas
                </h3>
                <p>
                  Todos los nombres de fragancias, casas de diseño y logotipos de
                  fabricantes de Oriente Medio u otras regiones pertenecen a sus
                  respectivos titulares legítimos. ELIX distribuye productos
                  auténticos y utiliza dichas referencias con carácter
                  estrictamente descriptivo e informativo.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  6. Uso correcto de la plataforma
                </h3>
                <p>
                  El usuario se compromete a navegar de manera ética y
                  responsable, absteniéndose de realizar maniobras que puedan
                  dañar, sobrecargar o alterar el funcionamiento normal del
                  sitio web.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-[14px] leading-[23px] text-ink/80">
              <header>
                <h2
                  id="legal-drawer-title"
                  className="font-serif text-[24px] font-bold leading-tight text-ink md:text-[28px]"
                >
                  Política de Privacidad
                </h2>
                <p className="mt-1 text-[12px] text-muted">
                  Última actualización: Septiembre 2026
                </p>
              </header>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  1. Compromiso y alcance
                </h3>
                <p>
                  En ELIX respetamos la privacidad y la tranquilidad de cada
                  visitante. Esta política describe cómo se maneja la información
                  en el sitio en cumplimiento con los lineamientos de la Ley N°
                  25.326 de Protección de los Datos Personales de la República
                  Argentina.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  2. Ausencia de recolección de datos personales
                </h3>
                <p>
                  Para navegar y descubrir el catálogo de ELIX no es necesario
                  crear una cuenta de usuario ni completar formularios con datos
                  personales sensibles. Nuestro sitio web no recopila ni almacena
                  nombres, correos de clientes, domicilios ni datos de tarjetas en
                  bases de datos propias a través de la navegación pública.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  3. Contacto voluntario mediante canales externos
                </h3>
                <p>
                  Cuando decidís comunicarte con ELIX a través de Instagram o
                  redes sociales para solicitar información o coordinar una
                  entrega, facilitás tus datos de contacto de manera libre y
                  voluntaria. Dicha información se emplea con el único fin de
                  brindarte asesoramiento y cumplir con la entrega requerida.
                </p>|
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  4. Cookies y almacenamiento técnico
                </h3>
                <p>
                  El sitio no emplea tecnologías de seguimiento publicitario ni
                  comparte perfiles de navegación con plataformas externas de
                  anuncios. Solo se utilizan elementos de almacenamiento local en
                  el navegador estrictamente necesarios para la agilidad técnica
                  y seguridad de la plataforma.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  5. Derechos de acceso y cancelación
                </h3>
                <p>
                  De conformidad con la Ley 25.326, podés solicitar en cualquier
                  momento la supresión o actualización de tus datos de
                  comunicación en nuestros canales de mensajería comunicándote
                  directamente por la misma vía.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-[16px] font-semibold text-ink">
                  6. Canales de consulta
                </h3>
                <p>
                  Ante cualquier inquietud referida a estas políticas o al uso
                  del catálogo, podés escribirnos a través de los canales de
                  contacto indicados en el pie de página de ELIX.
                </p>
              </section>
            </div>
          )}
        </div>

        <div className="border-t border-ink/10 bg-background/50 px-6 py-4">
          <button
            type="button"
            onClick={closeModal}
            className="flex h-[42px] w-full items-center justify-center bg-ink text-[11px] font-medium uppercase tracking-[2px] text-background transition-colors hover:bg-ink/90"
          >
            Entendido
          </button>
        </div>
      </aside>
    </div>
  );
}
