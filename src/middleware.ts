import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { url, preferredLocale } = context;

  // Nur auf der Root-URL '/' eine Weiterleitung durchführen
  if (url.pathname === '/') {
    // Unsere unterstützten Sprachen sind ['de', 'en']
    const supportedLocales = ['de', 'en'];

    // Wenn die bevorzugte Sprache des Browsers unterstützt wird und NICHT die Standardsprache ('en') ist
    if (preferredLocale && supportedLocales.includes(preferredLocale) && preferredLocale !== 'en') {
      // Weiterleitung zur lokalisierten Root-URL, z. B. /de/
      return context.redirect(`/${preferredLocale}/`);
    }
  }

  return next();
});
