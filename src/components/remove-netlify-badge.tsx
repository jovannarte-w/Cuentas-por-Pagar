"use client";

import { useEffect } from "react";

export function RemoveNetlifyBadge() {
  useEffect(() => {
    // Remover el badge de Netlify cuando la página cargue
    const removeNetlifyBadge = () => {
      // Buscar por diferentes selectores que Netlify podría usar
      const selectors = [
        '[data-netlify-badge]',
        '.netlify-badge',
        'a[href*="netlify"]',
        'div[class*="netlify"]',
        'iframe[style*="netlify"]',
        '[class*="powered-by-netlify"]',
        'a[rel="noopener noreferrer"][href*="netlify"]',
      ];

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          // Verificar si el elemento contiene "Netlify"
          if (el.textContent?.includes("Netlify")) {
            el.remove();
          }
        });
      });

      // Buscar en iframes también
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        if (iframe.src?.includes("netlify") || iframe.style.toString().includes("netlify")) {
          iframe.remove();
        }
      });
    };

    // Ejecutar inmediatamente
    removeNetlifyBadge();

    // Ejecutar también después de un pequeño delay por si el badge se carga después
    const timer = setTimeout(removeNetlifyBadge, 500);
    const timer2 = setTimeout(removeNetlifyBadge, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return null;
}
