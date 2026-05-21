/* ============================================================
   Peace and Love Studio PR — script.js
   Toda la lógica del sitio público usando JS puro + localStorage
   ============================================================ */

'use strict';

const EMAILJS_PUBLIC_KEY = 'W1xc7kSOTl9jfEb9d';
const EMAILJS_SERVICE_ID = 'service_kqo64in';
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_n20fzb4';
const EMAILJS_SUGGESTION_TEMPLATE_ID = 'template_vcm5vas';
const BUSINESS_EMAIL = 'peaceandlovestudiopr@gmail.com';
let emailJsReady = false;
const DEFAULT_PUBLIC_CONFIG = {
  name: 'Peace and Love Studio PR',
  phone: '787-228-4063',
  location: 'Barranquitas, Puerto Rico',
  email: '',
  instagram: 'https://www.instagram.com/peaceandlovestudiopr',
  facebook: 'https://www.facebook.com/share/1E9R9ckDog/'
};

function initEmailJs() {
  if (emailJsReady) return true;
  if (!window.emailjs || typeof window.emailjs.init !== 'function') {
    console.warn('EmailJS is not available on window.');
    return false;
  }
  window.emailjs.init(EMAILJS_PUBLIC_KEY);
  emailJsReady = true;
  return true;
}

function formatEmailTimestamp() {
  try {
    return new Date().toLocaleString('es-PR', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  } catch (error) {
    return new Date().toLocaleString();
  }
}

function getBusinessName() {
  const config = getData('pal_config', {});
  return config && config.name ? config.name : 'Peace and Love Studio PR';
}

function getPublicConfig() {
  const config = getData('pal_config', {});
  return Object.assign({}, DEFAULT_PUBLIC_CONFIG, config || {});
}

function formatContactPreferenceLabel(value) {
  if (value === 'whatsapp') return 'WhatsApp';
  if (value === 'call') return 'Llamada';
  if (value === 'email') return 'Correo';
  return value || '';
}

function sendEmailJs(templateId, params) {
  if (!initEmailJs()) {
    return Promise.reject(new Error('EmailJS is not initialized.'));
  }
  return window.emailjs.send(EMAILJS_SERVICE_ID, templateId, params, EMAILJS_PUBLIC_KEY);
}

function normalizeExternalUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^(https?:)?\/\//i.test(raw)) {
    return raw.indexOf('//') === 0 ? window.location.protocol + raw : raw;
  }
  return 'https://' + raw.replace(/^\/+/, '');
}

function sanitizePhoneForWhatsApp(value) {
  return String(value || '').replace(/\D+/g, '');
}

function buildWhatsAppUrl(phone, mode) {
  const sanitizedPhone = sanitizePhoneForWhatsApp(phone);
  let text = '';

  if (!sanitizedPhone) return '';
  if (mode === 'booking') {
    text = 'Hola, me gustaria reservar una cita en Peace and Love Studio PR.';
  } else if (mode === 'booking-info') {
    text = 'Hola, me gustaria reservar una cita en Peace and Love Studio PR. Quiero informacion sobre los servicios disponibles.';
  }

  return 'https://wa.me/' + sanitizedPhone + (text ? '?text=' + encodeURIComponent(text) : '');
}

/* ============================================================
   1. TRANSLATIONS (i18n)
   ============================================================ */
const TRANSLATIONS = {
  es: {
    'nav.home': 'Inicio', 'nav.services': 'Servicios', 'nav.book': 'Reservar cita',
    'nav.gallery': 'Galería', 'nav.reviews': 'Reseñas', 'nav.about': 'Sobre nosotros',
    'nav.faq': 'FAQ', 'nav.contact': 'Contacto',
    'header.bookBtn': 'Reservar',
    'menu.language': 'Idioma', 'menu.theme': 'Tema', 'menu.admin': 'Panel Admin',
    'hero.badge': '✦ Barranquitas, Puerto Rico ✦',
    'hero.subtitle': 'Belleza, cuidado y estilo en cada detalle',
    'hero.bookBtn': 'Reservar cita', 'hero.servicesBtn': 'Ver servicios',
    'services.tag': 'Nuestros Servicios', 'services.title': 'Arte y cuidado en cada detalle',
    'services.subtitle': 'Cada servicio es una experiencia diseñada para hacerte sentir hermosa y especial.',
    'services.bookBtn': 'Reservar este servicio',
    'booking.tag': 'Reserva tu cita', 'booking.title': '¿Lista para tu próxima cita?',
    'booking.desc': 'Completa el formulario y nos pondremos en contacto contigo para confirmar todos los detalles.',
    'booking.step1': 'Llena el formulario', 'booking.step2': 'Recibe confirmación', 'booking.step3': '¡Disfruta tu servicio!',
    'form.name': 'Nombre completo *', 'form.phone': 'Teléfono *', 'form.email': 'Correo electrónico *',
    'form.service': 'Servicio deseado *', 'form.selectService': '-- Selecciona un servicio --',
    'form.date': 'Fecha deseada *', 'form.time': 'Hora deseada *', 'form.selectTime': '-- Selecciona hora --',
    'form.comments': 'Comentarios adicionales', 'form.contactPref': 'Preferencia de contacto',
    'form.call': 'Llamada', 'form.emailLabel': 'Correo', 'form.submitBtn': 'Solicitar cita',
    'form.required': 'Este campo es obligatorio.',
    'form.emailInvalid': 'Ingresa un correo electrónico válido.',
    'form.phoneInvalid': 'Ingresa un número de teléfono válido.',
    'form.ratingRequired': 'Por favor selecciona una calificación.',
    'availability.available': '✓ Este espacio está disponible.',
    'availability.unavailable': '✗ Este espacio no está disponible. Por favor selecciona otra fecha u hora.',
    'services.note': 'Los precios pueden variar según el largo, diseño, condición natural y estilo solicitado. Para más información o disponibilidad, comunícate con Peace and Love Studio PR.',
    'services.whatsapp': 'Consultar por WhatsApp',
    'gallery.tag': 'Nuestro trabajo', 'gallery.title': 'Antes & Después',
    'gallery.subtitle': 'Desliza para descubrir la transformación.',
    'gallery.all': 'Todos', 'gallery.manicura': 'Uñas', 'gallery.gel': 'Gel',
    'gallery.acrilico': 'Acrílico', 'gallery.pestanas': 'Pestañas', 'gallery.pedicura': 'Pedicura',
    'gallery.before': 'Antes', 'gallery.after': 'Después', 'gallery.empty': 'No hay trabajos en la galería todavía.',
    'reviews.tag': 'Testimonios', 'reviews.title': 'Muro de Amor',
    'reviews.subtitle': 'Palabras reales de clientas que amamos.',
    'reviews.shareTitle': '¿Quieres compartir tu experiencia?',
    'reviews.rating': 'Calificación *', 'reviews.comment': 'Comentario *',
    'reviews.submitBtn': 'Enviar testimonio',
    'reviews.empty': 'Aún no hay testimonios aprobados. ¡Sé la primera!',
    'reviews.success': '¡Gracias por tu testimonio! Será revisado antes de publicarse.',
    'about.tag': 'Sobre nosotras', 'about.title': 'Más que un estudio,\nuna experiencia',
    'about.quote': 'Cada detalle importa, cada clienta es única.',
    'about.text': 'En Peace and Love Studio PR creemos que cada servicio es una experiencia de cuidado, belleza y confianza. Nuestro objetivo es que cada clienta se sienta cómoda, atendida y feliz con cada detalle, desde una manicura sencilla hasta un diseño más elaborado o unas extensiones de pestañas que resalten su mirada.',
    'about.text2': 'Estamos ubicados en Barranquitas, Puerto Rico, ofreciendo servicios de manicura, pedicura, gel, acrílico y extensiones de pestañas con dedicación, amor y atención personalizada.',
    'about.f1': 'Con amor', 'about.f2': 'Calidad premium', 'about.f3': 'Personalizado', 'about.f4': 'Barranquitas, PR',
    'faq.tag': 'FAQ', 'faq.title': 'Preguntas frecuentes',
    'suggestions.tag': 'Sugerencias', 'suggestions.title': 'Ayúdanos a mejorar',
    'suggestions.subtitle': 'Tu opinión nos importa y nos ayuda a crecer.',
    'suggestions.type': 'Tipo de sugerencia *', 'suggestions.message': 'Mensaje *',
    'suggestions.submit': 'Enviar sugerencia', 'suggestions.success': '¡Gracias! Tu sugerencia fue recibida.',
    'suggestions.typeService': 'Servicio', 'suggestions.typeWeb': 'Página web',
    'suggestions.typeService2': 'Atención', 'suggestions.typeAmbient': 'Ambiente', 'suggestions.typeOther': 'Otro',
    'suggestions.decoText': 'Cada sugerencia nos ayuda a brindarte el mejor servicio posible.',
    'contact.tag': 'Contacto', 'contact.title': 'Comunícate con nosotras',
    'contact.location': 'Ubicación', 'contact.schedule': 'Horario',
    'contact.waTitle': '¡Escríbenos ahora!', 'contact.waDesc': 'Reserva tu cita directamente por WhatsApp',
    'contact.waBtn': 'Enviar mensaje',
    'footer.desc': 'Estudio de uñas y belleza en Barranquitas, Puerto Rico. Belleza, cuidado y amor en cada servicio.',
    'footer.links': 'Enlances rápidos', 'footer.contact': 'Contacto', 'footer.rights': 'Todos los derechos reservados.',
    'wa.tooltip': '¡Escríbenos!',
    'booking.success': '¡Cita solicitada con éxito! Nos pondremos en contacto pronto.',
    'booking.noAvail': 'No hay horarios disponibles para esa fecha.',
  },
  en: {
    'nav.home': 'Home', 'nav.services': 'Services', 'nav.book': 'Book now',
    'nav.gallery': 'Gallery', 'nav.reviews': 'Reviews', 'nav.about': 'About us',
    'nav.faq': 'FAQ', 'nav.contact': 'Contact',
    'header.bookBtn': 'Book',
    'menu.language': 'Language', 'menu.theme': 'Theme', 'menu.admin': 'Admin Panel',
    'hero.badge': '✦ Barranquitas, Puerto Rico ✦',
    'hero.subtitle': 'Beauty, care and style in every detail',
    'hero.bookBtn': 'Book an appointment', 'hero.servicesBtn': 'Our services',
    'services.tag': 'Our Services', 'services.title': 'Art and care in every detail',
    'services.subtitle': 'Each service is an experience designed to make you feel beautiful and special.',
    'services.bookBtn': 'Book this service',
    'booking.tag': 'Book your appointment', 'booking.title': 'Ready for your next appointment?',
    'booking.desc': 'Fill in the form and we will contact you to confirm all the details.',
    'booking.step1': 'Fill the form', 'booking.step2': 'Receive confirmation', 'booking.step3': 'Enjoy your service!',
    'form.name': 'Full name *', 'form.phone': 'Phone *', 'form.email': 'Email address *',
    'form.service': 'Desired service *', 'form.selectService': '-- Select a service --',
    'form.date': 'Desired date *', 'form.time': 'Desired time *', 'form.selectTime': '-- Select time --',
    'form.comments': 'Additional comments', 'form.contactPref': 'Contact preference',
    'form.call': 'Call', 'form.emailLabel': 'Email', 'form.submitBtn': 'Request appointment',
    'form.required': 'This field is required.',
    'form.emailInvalid': 'Enter a valid email address.',
    'form.phoneInvalid': 'Enter a valid phone number.',
    'form.ratingRequired': 'Please select a rating.',
    'availability.available': '✓ This time slot is available.',
    'availability.unavailable': '✗ This time slot is not available. Please select a different date or time.',
    'services.note': 'Prices may vary depending on length, design, natural condition, and requested style. For more information or availability, contact Peace and Love Studio PR.',
    'services.whatsapp': 'Inquiry via WhatsApp',
    'gallery.tag': 'Our work', 'gallery.title': 'Before & After',
    'gallery.subtitle': 'Slide to discover the transformation.',
    'gallery.all': 'All', 'gallery.manicura': 'Nails', 'gallery.gel': 'Gel',
    'gallery.acrilico': 'Acrylic', 'gallery.pestanas': 'Lashes', 'gallery.pedicura': 'Pedicure',
    'gallery.before': 'Before', 'gallery.after': 'After', 'gallery.empty': 'No gallery items yet.',
    'reviews.tag': 'Testimonials', 'reviews.title': 'Love Wall',
    'reviews.subtitle': 'Real words from clients we love.',
    'reviews.shareTitle': 'Want to share your experience?',
    'reviews.rating': 'Rating *', 'reviews.comment': 'Comment *',
    'reviews.submitBtn': 'Submit review',
    'reviews.empty': 'No approved reviews yet. Be the first!',
    'reviews.success': 'Thank you for your review! It will be reviewed before publishing.',
    'about.tag': 'About us', 'about.title': 'More than a studio,\nan experience',
    'about.quote': 'Every detail matters, every client is unique.',
    'about.text': 'At Peace and Love Studio PR we believe every service is an experience of care, beauty and trust. Our goal is for every client to feel comfortable, attended and happy with every detail, from a simple manicure to a more elaborate design or lash extensions that enhance their look.',
    'about.text2': 'We are located in Barranquitas, Puerto Rico, offering manicure, pedicure, gel, acrylic and lash extension services with dedication, love and personalized attention.',
    'about.f1': 'With love', 'about.f2': 'Premium quality', 'about.f3': 'Personalized', 'about.f4': 'Barranquitas, PR',
    'faq.tag': 'FAQ', 'faq.title': 'Frequently asked questions',
    'suggestions.tag': 'Suggestions', 'suggestions.title': 'Help us improve',
    'suggestions.subtitle': 'Your opinion matters and helps us grow.',
    'suggestions.type': 'Suggestion type *', 'suggestions.message': 'Message *',
    'suggestions.submit': 'Send suggestion', 'suggestions.success': 'Thank you! Your suggestion was received.',
    'suggestions.typeService': 'Service', 'suggestions.typeWeb': 'Website',
    'suggestions.typeService2': 'Customer service', 'suggestions.typeAmbient': 'Ambiance', 'suggestions.typeOther': 'Other',
    'suggestions.decoText': 'Every suggestion helps us provide the best service possible.',
    'contact.tag': 'Contact', 'contact.title': 'Get in touch',
    'contact.location': 'Location', 'contact.schedule': 'Schedule',
    'contact.waTitle': 'Write to us now!', 'contact.waDesc': 'Book your appointment directly via WhatsApp',
    'contact.waBtn': 'Send message',
    'footer.desc': 'Nail and beauty studio in Barranquitas, Puerto Rico. Beauty, care and love in every service.',
    'footer.links': 'Quick links', 'footer.contact': 'Contact', 'footer.rights': 'All rights reserved.',
    'wa.tooltip': 'Message us!',
    'booking.success': 'Appointment requested! We will contact you soon.',
    'booking.noAvail': 'No time slots available for that date.',
  }
};

/* ============================================================
   2. DEFAULT DATA
   ============================================================ */
const DEFAULT_SERVICES = [
  // UÑAS EN GEL / HARD GEL
  { id: 's1', category: 'gel', name: 'Full Set Gel (Cortas)', nameEn: 'Gel Full Set (Short)', price: 45, icon: 'fas fa-hand-sparkles', active: true },
  { id: 's2', category: 'gel', name: 'Full Set Gel (Medianas)', nameEn: 'Gel Full Set (Medium)', price: 50, icon: 'fas fa-hand-sparkles', active: true },
  { id: 's3', category: 'gel', name: 'Full Set Gel (Largas)', nameEn: 'Gel Full Set (Long)', price: 55, icon: 'fas fa-hand-sparkles', active: true },
  { id: 's4', category: 'gel', name: 'Manicura Pro', nameEn: 'Pro Manicure', price: 35, icon: 'fas fa-hand-sparkles', active: true },
  { id: 's5', category: 'gel', name: 'Pedicura Jelly Spa', nameEn: 'Jelly Spa Pedicure', price: 60, icon: 'fas fa-spa', active: true },
  // EXTENSIONES DE PESTAÑAS
  { id: 's6', category: 'lashes', name: 'Extensiones YY', nameEn: 'YY Extensions', price: 125, icon: 'fas fa-eye', active: true },
  { id: 's7', category: 'lashes', name: 'Extensiones Fibras Tecnológicas', nameEn: 'Technological Fiber Extensions', price: 150, icon: 'fas fa-eye', active: true },
  // RETOQUES DE PESTAÑAS
  { id: 's8', category: 'refills', name: 'Retoque (2 semanas)', nameEn: 'Refill (2 weeks)', price: 80, icon: 'fas fa-clock', active: true },
  { id: 's9', category: 'refills', name: 'Retoque (3 semanas)', nameEn: 'Refill (3 weeks)', price: 90, icon: 'fas fa-clock', active: true },
  { id: 's10', category: 'refills', name: 'Retoque (4 semanas)', nameEn: 'Refill (4 weeks)', price: 0, icon: 'fas fa-clock', active: true, description: 'Full Set nuevo', descriptionEn: 'New Full Set' },
  // CEJAS Y DEPILACIÓN
  { id: 's11', category: 'brows', name: 'Depilación de cejas con cera', nameEn: 'Eyebrow Waxing', price: 15, icon: 'fas fa-eye-dropper', active: true },
  { id: 's12', category: 'brows', name: 'Depilación + Diseño + Tinte', nameEn: 'Wax + Design + Tint', price: 40, icon: 'fas fa-magic', active: true },
  { id: 's13', category: 'brows', name: 'Depilación, Diseño, Tinte y Lamination', nameEn: 'Wax, Design, Tint & Lamination', price: 80, icon: 'fas fa-sparkles', active: true },
  { id: 's14', category: 'brows', name: 'Diseño + Tinte', nameEn: 'Design + Tint', price: 35, icon: 'fas fa-paint-brush', active: true },
  { id: 's15', category: 'brows', name: 'Brow Lamination', nameEn: 'Brow Lamination', price: 100, icon: 'fas fa-arrows-alt-v', active: true },
  { id: 's16', category: 'brows', name: 'Lash Lifting', nameEn: 'Lash Lifting', price: 90, icon: 'fas fa-eye', active: true }
];

const DEFAULT_FAQS = [
  { id: 'f1', q: '¿Dónde están ubicados?', qEn: 'Where are you located?', a: 'Estamos en Barranquitas, Puerto Rico. Puedes contactarnos por WhatsApp al 787-228-4063 para obtener la dirección exacta.', aEn: 'We are in Barranquitas, Puerto Rico. Contact us via WhatsApp at 787-228-4063 for the exact address.', active: true },
  { id: 'f2', q: '¿Cómo puedo reservar una cita?', qEn: 'How can I book an appointment?', a: 'Puedes reservar directamente desde este formulario en nuestra página o contactarnos por WhatsApp, Instagram o Facebook.', aEn: 'You can book directly from the form on this page or contact us via WhatsApp, Instagram or Facebook.', active: true },
  { id: 'f3', q: '¿Puedo reservar por WhatsApp?', qEn: 'Can I book via WhatsApp?', a: '¡Por supuesto! Nuestro número es 787-228-4063. Puedes escribirnos en cualquier momento.', aEn: 'Of course! Our number is 787-228-4063. You can write to us at any time.', active: true },
  { id: 'f4', q: '¿Qué servicios ofrecen?', qEn: 'What services do you offer?', a: 'Ofrecemos manicura, pedicura, gel, acrílico y extensiones de pestañas. Cada servicio es realizado con dedicación y amor.', aEn: 'We offer manicure, pedicure, gel, acrylic and lash extensions. Each service is performed with dedication and love.', active: true },
  { id: 'f5', q: '¿Qué pasa si necesito cambiar mi cita?', qEn: 'What if I need to change my appointment?', a: 'Comunícate con nosotras por WhatsApp o redes sociales con al menos 24 horas de anticipación y con gusto reprogramamos.', aEn: 'Contact us via WhatsApp or social media at least 24 hours in advance and we will happily reschedule.', active: true },
  { id: 'f6', q: '¿Cuánto tiempo dura cada servicio?', qEn: 'How long does each service take?', a: 'Depende del servicio. En promedio: manicura 45 min, pedicura 60 min, gel 60-90 min, acrílico 90-120 min, pestañas 90-120 min.', aEn: 'Depends on the service. On average: manicure 45 min, pedicure 60 min, gel 60-90 min, acrylic 90-120 min, lashes 90-120 min.', active: true },
  { id: 'f7', q: '¿Puedo enviar una referencia del diseño que quiero?', qEn: 'Can I send a design reference?', a: '¡Sí! Puedes enviarnos fotos por WhatsApp o Instagram antes de tu cita para que podamos preparar el diseño ideal.', aEn: 'Yes! You can send us photos via WhatsApp or Instagram before your appointment so we can prepare the ideal design.', active: true },
  { id: 'f8', q: '¿Cómo sé si una hora está disponible?', qEn: 'How do I know if a time slot is available?', a: 'Puedes verificar disponibilidad directamente en el formulario de reservas de nuestra página. Al seleccionar fecha y hora, el sistema te indicará si está disponible.', aEn: 'You can check availability directly in the booking form. When you select a date and time, the system will tell you if it is available.', active: true },
  { id: 'f9', q: '¿Los testimonios aparecen automáticamente?', qEn: 'Do reviews appear automatically?', a: 'No. Todos los testimonios pasan por una revisión antes de publicarse en el Muro de Amor para asegurar su autenticidad.', aEn: 'No. All testimonials go through a review before being published on the Love Wall to ensure authenticity.', active: true },
  { id: 'f10', q: '¿Puedo cancelar una cita?', qEn: 'Can I cancel an appointment?', a: 'Sí. Te pedimos que nos avises con al menos 24 horas de anticipación por WhatsApp o redes sociales.', aEn: 'Yes. We ask that you notify us at least 24 hours in advance via WhatsApp or social media.', active: true },
];

const DEFAULT_SCHEDULE = [
  { day: 'Lunes – Viernes', dayEn: 'Monday – Friday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Sábado',         dayEn: 'Saturday',         hours: '9:00 AM – 2:00 PM' },
  { day: 'Domingo',        dayEn: 'Sunday',            hours: 'Cerrado / Closed' },
];

const ALL_BUSINESS_HOURS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];

const DEFAULT_AVAILABILITY = {
  weeklyHours: ALL_BUSINESS_HOURS.slice(),
  unavailableWeekdays: [0],
  blockedDates: [],
  blockedSlots: {},
  blockedRules: [],
};

const LEGACY_DEFAULT_SCHEDULE = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
const LEGACY_BUSINESS_HOURS = ALL_BUSINESS_HOURS.slice();
const PREVIOUS_DEFAULT_SCHEDULE = [
  { day: 'Lunes', dayEn: 'Monday', hours: '7:00 AM - 4:00 PM' },
  { day: 'Martes', dayEn: 'Tuesday', hours: 'Cerrado / Closed' },
  { day: 'Miercoles', dayEn: 'Wednesday', hours: '7:00 AM - 4:00 PM' },
  { day: 'Jueves', dayEn: 'Thursday', hours: 'Cerrado / Closed' },
  { day: 'Viernes', dayEn: 'Friday', hours: '7:00 AM - 4:00 PM' },
  { day: 'Sabado', dayEn: 'Saturday', hours: '7:00 AM - 4:00 PM' },
  { day: 'Domingo', dayEn: 'Sunday', hours: 'Cerrado / Closed' }
];

DEFAULT_SCHEDULE.splice(0, DEFAULT_SCHEDULE.length,
  { day: 'Lunes', dayEn: 'Monday', hours: '9:00 AM - 4:00 PM' },
  { day: 'Martes', dayEn: 'Tuesday', hours: 'Cerrado / Closed' },
  { day: 'Miercoles', dayEn: 'Wednesday', hours: '9:00 AM - 4:00 PM' },
  { day: 'Jueves', dayEn: 'Thursday', hours: 'Cerrado / Closed' },
  { day: 'Viernes', dayEn: 'Friday', hours: '9:00 AM - 4:00 PM' },
  { day: 'Sabado', dayEn: 'Saturday', hours: '7:00 AM - 4:00 PM' },
  { day: 'Domingo', dayEn: 'Sunday', hours: 'Cerrado / Closed' }
);

ALL_BUSINESS_HOURS.splice(0, ALL_BUSINESS_HOURS.length,
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
);

DEFAULT_AVAILABILITY.weeklyHours = ALL_BUSINESS_HOURS.slice();
DEFAULT_AVAILABILITY.unavailableWeekdays = [0, 2, 4];
DEFAULT_AVAILABILITY.blockedRules = [
  { day: 'lunes', date: '', time: '7:00 AM', type: 'day-time' },
  { day: 'lunes', date: '', time: '8:00 AM', type: 'day-time' },
  { day: 'miercoles', date: '', time: '7:00 AM', type: 'day-time' },
  { day: 'miercoles', date: '', time: '8:00 AM', type: 'day-time' },
  { day: 'viernes', date: '', time: '7:00 AM', type: 'day-time' },
  { day: 'viernes', date: '', time: '8:00 AM', type: 'day-time' }
];

function isSameSchedule(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

function normalizeHoursList(hours) {
  return Array.isArray(hours) ? hours.slice() : [];
}

function shouldMigrateSchedule(schedule) {
  return !Array.isArray(schedule) || schedule.length === 0 || isSameSchedule(schedule, LEGACY_DEFAULT_SCHEDULE) || isSameSchedule(schedule, PREVIOUS_DEFAULT_SCHEDULE);
}

function shouldMigrateAvailability(availability) {
  if (!availability || typeof availability !== 'object') return true;
  const weeklyHours = normalizeHoursList(availability.weeklyHours);
  const unavailableWeekdays = Array.isArray(availability.unavailableWeekdays) ? availability.unavailableWeekdays.slice().sort() : [];
  const rules = Array.isArray(availability.blockedRules) ? availability.blockedRules : [];
  const hasLegacyHours = JSON.stringify(weeklyHours) === JSON.stringify(LEGACY_BUSINESS_HOURS);
  const hasLegacyWeekdays = JSON.stringify(unavailableWeekdays) === JSON.stringify([0]);
  const hasCurrentWeekdays = JSON.stringify(unavailableWeekdays) === JSON.stringify([0, 2, 4]);
  const hasCurrentHours = JSON.stringify(weeklyHours) === JSON.stringify(ALL_BUSINESS_HOURS);

  if (!rules.length && hasLegacyHours && hasLegacyWeekdays) return true;
  if (!rules.length && hasCurrentHours && hasCurrentWeekdays) return true;
  if (!rules.length && weeklyHours.length === 0 && !hasCurrentWeekdays) return true;
  return false;
}

function normalizeAvailability(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    weeklyHours: Array.isArray(source.weeklyHours) ? source.weeklyHours.slice() : ALL_BUSINESS_HOURS.slice(),
    unavailableWeekdays: Array.isArray(source.unavailableWeekdays) ? source.unavailableWeekdays : DEFAULT_AVAILABILITY.unavailableWeekdays.slice(),
    blockedDates: Array.isArray(source.blockedDates) ? source.blockedDates : [],
    blockedSlots: source.blockedSlots && typeof source.blockedSlots === 'object' ? source.blockedSlots : {},
    blockedRules: normalizeBlockedRules(Array.isArray(source.blockedRules) ? source.blockedRules : [])
  };
}

const GALLERY_IMAGE_FILES = [
  'image1-antes.jpg',
  'image1-despues.jpg',
  'image2-antes.jpg',
  'image2-despues-rubberbase.jpg',
  'image3-antes.jpg',
  'image3-despues.jpg',
  'image4-antes.jpg',
  'image4-despues.jpg'
];

function toTitleCase(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function buildGalleryFromFiles(files) {
  const groups = new Map();

  files.forEach(file => {
    const match = /^image(\d+)-(antes|despues)(?:-([a-z0-9-]+))?\.(jpg|jpeg|png|webp)$/i.exec(file);
    if (!match) return;

    const number = Number(match[1]);
    const type = match[2] || '';
    const extraSlug = match[3] || '';
    const src = `galeria/${file}`;
    const key = `gallery-${number}`;

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        order: number,
        category: 'pestanas',
        active: true,
        type: 'comparison',
        title: '',
        titleEn: '',
        desc: 'Resultados reales con acabados limpios, elegantes y profesionales.',
        descEn: 'Real results with clean, elegant, professional finishes.',
        beforeImg: '',
        afterImg: '',
        singleImg: ''
      });
    }

    const item = groups.get(key);

    if (type === 'antes') {
      item.type = 'comparison';
      item.beforeImg = src;
      item.title = 'Antes / Después';
      item.titleEn = 'Before / After';
      item.desc = 'Antes y Después';
      item.descEn = 'Before and After';
      return;
    }

    if (type === 'despues') {
      item.type = 'comparison';
      item.afterImg = src;
      item.title = 'Antes / Después';
      item.titleEn = 'Before / After';
      item.desc = 'Antes y Después';
      item.descEn = 'Before and After';
      return;
    }

    item.singleImg = src;
    item.afterImg = src;

    if (extraSlug) {
      const formatted = toTitleCase(extraSlug.replace(/-/g, ' '));
      item.type = 'single_titled';
      item.title = formatted;
      item.titleEn = formatted;
      item.desc = `Resultado del servicio ${formatted} en pestanas.`;
      item.descEn = `${formatted} lash service result.`;
    } else {
      item.desc = 'Resultado final del servicio de pestanas.';
      item.descEn = 'Final result of the lash service.';
    }
  });

  return Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...item }) => item);
}

function buildComparisonGalleryFromFiles(files) {
  const groups = new Map();

  files.forEach(file => {
    const match = /^image(\d+)-(antes|despues)(?:-([a-z0-9-]+))?\.(jpg|jpeg|png|webp)$/i.exec(file);
    if (!match) return;

    const number = Number(match[1]);
    const kind = match[2];
    const extraSlug = match[3] || '';
    const key = `gallery-${number}`;

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        order: number,
        category: 'pestanas',
        active: true,
        type: 'comparison',
        title: '',
        titleEn: '',
        desc: 'Resultados reales con acabados limpios, elegantes y profesionales.',
        descEn: 'Real results with clean, elegant, professional finishes.',
        beforeImg: '',
        afterImg: '',
        singleImg: ''
      });
    }

    const item = groups.get(key);
    if (kind === 'antes') {
      item.beforeImg = `galeria/${file}`;
      return;
    }

    item.afterImg = `galeria/${file}`;
    if (extraSlug) {
      const formatted = toTitleCase(extraSlug.replace(/-/g, ' '));
      item.title = formatted;
      item.titleEn = formatted;
    }
  });

  return Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .filter(item => item.beforeImg && item.afterImg)
    .map(({ order, ...item }) => item);
}

const AUTO_GALLERY_ITEMS = buildComparisonGalleryFromFiles(GALLERY_IMAGE_FILES);

const DEFAULT_GALLERY = [
  { id: 'g1', title: 'Diseño floral primavera', titleEn: 'Spring floral design', desc: 'Gel con diseño floral en tonos rosas y lavanda.', descEn: 'Gel with floral design in pink and lavender tones.', category: 'gel', beforeImg: '', afterImg: '', active: true },
  { id: 'g2', title: 'Uñas acrílicas coffin', titleEn: 'Coffin acrylic nails', desc: 'Extensiones acrílicas forma coffin con efecto mármol.', descEn: 'Coffin-shaped acrylic extensions with marble effect.', category: 'acrilico', beforeImg: '', afterImg: '', active: true },
  { id: 'g3', title: 'Pestañas volumen ruso', titleEn: 'Russian volume lashes', desc: 'Extensiones de pestañas volumen ruso para una mirada glamurosa.', descEn: 'Russian volume lash extensions for a glamorous look.', category: 'pestanas', beforeImg: '', afterImg: '', active: true },
];

const DEFAULT_TESTIMONIALS = [
  { id: 't1', name: 'María González', service: 'Gel', rating: 5, comment: '¡Me encantó el servicio! Mis uñas quedaron perfectas y el ambiente del estudio es súper relajante. 100% recomendado.', date: '2025-01-15', status: 'aprobado' },
  { id: 't2', name: 'Carmen Rivera', service: 'Extensiones de pestañas', rating: 5, comment: 'Las mejores pestañas que me han hecho en mi vida. Se ven naturales y duraron muchísimo tiempo.', date: '2025-01-20', status: 'aprobado' },
  { id: 't3', name: 'Sofía Torres', service: 'Acrílico', rating: 4, comment: 'Excelente trabajo y muy profesionales. Los diseños son únicos y el trato es maravilloso.', date: '2025-02-01', status: 'aprobado' },
  { id: 't4', name: 'Valeria Díaz', service: 'Manicura', rating: 5, comment: 'Un lugar lleno de paz y amor, tal como su nombre. Siempre salgo feliz.', date: '2025-02-14', status: 'pendiente' },
];

const DEFAULT_APPOINTMENTS = [
  { id: 'a1', name: 'Lucía Pérez', phone: '787-555-1001', email: 'lucia@email.com', service: 'Gel', date: '2025-03-10', time: '10:00 AM', comments: 'Quiero un diseño floral', contactPref: 'whatsapp', status: 'realizada', createdAt: '2025-03-01' },
  { id: 'a2', name: 'Ana Martínez', phone: '787-555-1002', email: 'ana@email.com', service: 'Acrílico', date: '2025-03-15', time: '2:00 PM', comments: '', contactPref: 'call', status: 'pendiente', createdAt: '2025-03-05' },
  { id: 'a3', name: 'Rosa Jiménez', phone: '787-555-1003', email: 'rosa@email.com', service: 'Extensiones de pestañas', date: '2025-03-20', time: '11:00 AM', comments: 'Volumen ruso por favor', contactPref: 'email', status: 'en proceso', createdAt: '2025-03-08' },
];

const DEFAULT_SUGGESTIONS = [
  { id: 'sug1', name: 'Cliente Anónima', email: '', type: 'servicio', message: 'Sería genial que ofrecieran servicio de cejas también.', date: '2025-02-10', status: 'nueva' },
  { id: 'sug2', name: 'Gabriela López', email: 'gabi@email.com', type: 'pagina', message: 'La página se ve muy bonita, pero estaría bueno agregar galería de videos.', date: '2025-02-15', status: 'revisada' },
  { id: 'sug3', name: 'Daniela Cruz', email: '', type: 'atencion', message: 'Excelente atención al cliente. Siempre muy amables.', date: '2025-02-20', status: 'nueva' },
];

/* ============================================================
   3. DATA ACCESS HELPERS
   ============================================================ */
function getData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function setData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch(e) {
    console.warn('localStorage error', e);
  }
  if (window.PalSupabaseSync) {
    window.PalSupabaseSync.queueSync(key, val);
  }
}

function mergeDefaultServices(storedServices) {
  const incoming = Array.isArray(storedServices) ? storedServices : [];
  const mergedMap = new Map();
  const defaultOrder = new Map(DEFAULT_SERVICES.map((service, index) => [service.id, index]));

  incoming.forEach(service => {
    if (!service || !service.id) return;
    mergedMap.set(service.id, { ...service });
  });

  DEFAULT_SERVICES.forEach(service => {
    if (!mergedMap.has(service.id)) {
      mergedMap.set(service.id, { ...service, active: true });
      return;
    }

    const existing = mergedMap.get(service.id);
    if (!existing) return;

    existing.category = existing.category || service.category;
    existing.icon = existing.icon || service.icon;
    existing.name = existing.name || service.name;
    existing.nameEn = existing.nameEn || service.nameEn;
    existing.active = true;
    existing.description = existing.description || service.description;
    existing.descriptionEn = existing.descriptionEn || service.descriptionEn;
  });

  return Array.from(mergedMap.values()).sort((a, b) => {
    const aIndex = defaultOrder.has(a.id) ? defaultOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bIndex = defaultOrder.has(b.id) ? defaultOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

function getServicesData() {
  const services = mergeDefaultServices(getData('pal_services', DEFAULT_SERVICES));
  setData('pal_services', services);
  return services;
}

function getGalleryData() {
  const storedGallery = getData('pal_gallery', null);
  const gallery = Array.isArray(storedGallery) && storedGallery.length ? storedGallery : AUTO_GALLERY_ITEMS;
  setData('pal_gallery', gallery);
  return gallery;
}

function initDemo() {
  if (!getData('pal_init')) {
    setData('pal_services', DEFAULT_SERVICES);
    setData('pal_faqs', DEFAULT_FAQS);
    setData('pal_schedule', DEFAULT_SCHEDULE);
    setData('pal_availability', DEFAULT_AVAILABILITY);
    setData('pal_gallery', AUTO_GALLERY_ITEMS);
    setData('pal_testimonials', DEFAULT_TESTIMONIALS);
    setData('pal_appointments', DEFAULT_APPOINTMENTS);
    setData('pal_suggestions', DEFAULT_SUGGESTIONS);
    setData('pal_init', true);
    return;
  }

  setData('pal_services', mergeDefaultServices(getData('pal_services', DEFAULT_SERVICES)));
  const storedSchedule = getData('pal_schedule', DEFAULT_SCHEDULE);
  if (shouldMigrateSchedule(storedSchedule)) {
    setData('pal_schedule', DEFAULT_SCHEDULE);
  }
  const storedAvailability = getData('pal_availability', DEFAULT_AVAILABILITY);
  if (shouldMigrateAvailability(storedAvailability)) {
    setData('pal_availability', DEFAULT_AVAILABILITY);
  }
  getGalleryData();
}

// Merge default items into existing localStorage collection by `id` (non-destructive)
function mergeDefaultsInto(key, defaults) {
  const existing = getData(key, null);
  if (!Array.isArray(defaults)) return;
  if (!existing) { setData(key, defaults); return; }
  const map = {};
  existing.forEach(item => { if (item && item.id) map[item.id] = item; });
  let changed = false;
  defaults.forEach(d => {
    if (!d || !d.id) return;
    if (!map[d.id]) { existing.push(d); changed = true; }
  });
  if (changed) setData(key, existing);
}

/* ============================================================
   4. i18n ENGINE
   ============================================================ */
let currentLang = localStorage.getItem('pal_lang') || 'es';

function t(key) { return TRANSLATIONS[currentLang][key] || TRANSLATIONS['es'][key] || key; }

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.documentElement.lang = currentLang;
}

function applyGallerySectionCopy() {
  const tag = document.querySelector('#galeria .section-tag');
  const title = document.querySelector('#galeria .section-header h2');
  const subtitle = document.querySelector('#galeria .section-header p');
  if (tag) tag.textContent = currentLang === 'en' ? 'Transformation Gallery' : 'Galeria de Transformaciones';
  if (title) title.textContent = currentLang === 'en' ? 'Transformation Gallery' : 'Galeria de Transformaciones';
  if (subtitle) subtitle.textContent = currentLang === 'en'
    ? 'Real results with clean, elegant, professional finishes.'
    : 'Resultados reales con acabados limpios, elegantes y profesionales.';
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('pal_lang', lang);
  document.body.setAttribute('data-lang', lang);
  applyTranslations();
  applyGallerySectionCopy();
  renderServices();
  renderFAQ();
  renderSchedule();
  populateServiceSelects();
  renderLoveWall();
  renderGallery(currentCat);
  document.getElementById('lang-es').classList.toggle('active', lang === 'es');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

/* ============================================================
   5. THEME ENGINE
   ============================================================ */
let darkMode = localStorage.getItem('pal_theme') === 'dark';

function applyTheme() {
  document.body.classList.toggle('dark-mode', darkMode);
  document.body.classList.toggle('light-mode', !darkMode);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.checked = darkMode;
}

function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem('pal_theme', darkMode ? 'dark' : 'light');
  applyTheme();
}

/* ============================================================
   6. TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  toast.innerHTML = `<strong>${icon}</strong> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4200);
}

/* ============================================================
   7. HEADER BEHAVIOR
   ============================================================ */
function initHeader() {
  const header = document.getElementById('main-header');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = document.getElementById('drawer-close');
  const langEs = document.getElementById('lang-es');
  const langEn = document.getElementById('lang-en');
  const themeToggle = document.getElementById('theme-toggle');

  // Move drawer layers to body so they are not trapped by the header stacking context.
  if (drawer && drawer.parentElement !== document.body) document.body.appendChild(drawer);
  if (overlay && overlay.parentElement !== document.body) document.body.appendChild(overlay);

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  };

  if (hamburger && drawer) hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (drawer) drawer.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));

  if (langEs) langEs.addEventListener('click', () => setLang('es'));
  if (langEn) langEn.addEventListener('click', () => setLang('en'));
  if (themeToggle) themeToggle.addEventListener('change', toggleTheme);

  // Active state toggle buttons
  if (langEs) langEs.classList.toggle('active', currentLang === 'es');
  if (langEn) langEn.classList.toggle('active', currentLang === 'en');

  // Back to top
  const btt = document.getElementById('back-to-top');
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   8. SERVICES
   ============================================================ */
function renderServices() {
  const grid = document.getElementById('services-grid');
  const services = getServicesData().filter(s => s.active);
  if (!grid) return;
  
  const categoryTitles = {
    'gel': currentLang === 'en' ? 'GEL NAILS / HARD GEL' : 'UÑAS EN GEL / HARD GEL',
    'lashes': currentLang === 'en' ? 'EYELASH EXTENSIONS' : 'EXTENSIONES DE PESTAÑAS',
    'refills': currentLang === 'en' ? 'LASH RETOUCH' : 'RETOQUES DE PESTAÑAS',
    'brows': currentLang === 'en' ? 'BROWS & WAXING' : 'CEJAS Y DEPILACIÓN'
  };

  const grouped = {};
  services.forEach(s => {
    const cat = s.category || 'gel';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  });

  if (services.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-hand-sparkles"></i><p>No hay servicios disponibles.</p></div>`;
    return;
  }

  let html = '';
  for (const cat in grouped) {
    html += `
      <div class="service-category-group" style="grid-column: 1/-1; margin-top: 3rem; margin-bottom: 1rem;">
        <h3 style="font-family: var(--font-display); font-size: 2.2rem; color: var(--primary); border-bottom: 1px solid var(--line-strong); padding-bottom: 0.5rem;">${categoryTitles[cat] || cat.toUpperCase()}</h3>
      </div>`;
    
    html += grouped[cat].map(s => {
      const name = currentLang === 'en' && s.nameEn ? s.nameEn : s.name;
      const desc = currentLang === 'en' && s.descriptionEn ? s.descriptionEn : s.description || '';
      const priceDisplay = s.id === 's10'
        ? (currentLang === 'en' ? 'New Full Set' : 'Full Set nuevo')
        : `$${s.price}`;
      return `
        <div class="service-card" data-service="${s.name}">
          <div class="service-icon"><i class="${s.icon || 'fas fa-hand-sparkles'}"></i></div>
          <div class="service-price" style="font-weight: 700; color: var(--primary); font-size: 1.4rem; margin-bottom: 5px;">${priceDisplay}</div>
          <h3 style="margin-bottom: 15px;">${name}</h3>
          ${desc ? `<p class="service-desc" style="margin-bottom:12px; opacity:0.85">${desc}</p>` : ''}
          <button class="btn-book-service" onclick="selectService('${s.name}')">
            <i class="fas fa-calendar-plus"></i> ${t('services.bookBtn')}
          </button>
        </div>`;
    }).join('');
  }

  html += `
    <div class="services-footer-note" style="grid-column: 1/-1; margin-top: 4rem; text-align: center; font-style: italic; opacity: 0.8; padding: 20px; border-top: 1px dashed var(--line);">
      <p>${t('services.note')}</p>
    </div>`;

  grid.innerHTML = html;
  syncServiceCardReveal();
}

function syncServiceCardReveal() {
  const cards = document.querySelectorAll('#services-grid .service-card');
  if (!cards.length) return;

  const isMobile = window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
  const revealReady = document.body && document.body.dataset.scrollRevealReady === 'true';

  cards.forEach((card, index) => {
    if (isMobile) {
      card.classList.add('revealed');
      card.classList.remove('scroll-reveal', 'reveal-up');
      card.style.removeProperty('--reveal-delay');
      return;
    }

    if (revealReady) {
      card.classList.add('scroll-reveal', 'reveal-up', 'revealed');
      card.style.setProperty('--reveal-delay', `${Math.min(index * 90, 420)}ms`);
    }
  });
}

function selectService(name) {
  const select = document.getElementById('b-service');
  if (select) {
    Array.from(select.options).forEach(option => {
      option.selected = option.value === name;
    });
    renderBookingServiceChoices();
    closeBookingServicePicker();
    document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
  }
}

function populateServiceSelects() {
  const services = getServicesData().filter(s => s.active);
  const selects = ['b-service', 't-service'];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const placeholder = id === 'b-service' ? t('form.selectService') : '-- Selecciona --';
    sel.innerHTML = `<option value="">${placeholder}</option>` +
      services.map(s => {
        const name = currentLang === 'en' && s.nameEn ? s.nameEn : s.name;
        return `<option value="${s.name}">${name}</option>`;
      }).join('');
  });
  renderBookingServiceChoices();
}

function getBookingServicePickerCopy() {
  return currentLang === 'en'
    ? {
        placeholder: 'Select one or more services',
        selectedSingle: '1 service selected',
        selectedMany: count => `${count} services selected`,
        estimate: 'Approximate',
        quoted: 'quoted separately'
      }
    : {
        placeholder: 'Selecciona uno o varios servicios',
        selectedSingle: '1 servicio seleccionado',
        selectedMany: count => `${count} servicios seleccionados`,
        estimate: 'Aproximado',
        quoted: 'cotización aparte'
      };
}

function getSelectedBookingServices() {
  const select = document.getElementById('b-service');
  const services = getServicesData();
  const selectedValues = select
    ? Array.from(select.selectedOptions).map(option => option.value).filter(Boolean)
    : [];
  return selectedValues
    .map(value => services.find(service => service.name === value))
    .filter(Boolean);
}

function updateBookingServiceEstimate() {
  const estimateEl = document.getElementById('b-service-estimate');
  const trigger = document.getElementById('b-service-trigger');
  if (!estimateEl || !trigger) return;

  const copy = getBookingServicePickerCopy();
  const selectedServices = getSelectedBookingServices();
  const selectedCount = selectedServices.length;
  const titledSelections = selectedServices.map(service => currentLang === 'en' && service.nameEn ? service.nameEn : service.name);
  const knownTotal = selectedServices.reduce((total, service) => total + (Number(service.price) || 0), 0);
  const hasQuotedService = selectedServices.some(service => !Number(service.price));

  if (selectedCount === 0) {
    trigger.childNodes[0].nodeValue = `${copy.placeholder} `;
    estimateEl.textContent = `${copy.estimate}: $0.00`;
    return;
  }

  const summary = titledSelections.length <= 2
    ? titledSelections.join(', ')
    : copy.selectedMany(selectedCount);
  trigger.childNodes[0].nodeValue = `${summary} `;

  estimateEl.textContent = hasQuotedService
    ? `${copy.estimate}: $${knownTotal.toFixed(2)} + ${copy.quoted}`
    : `${copy.estimate}: $${knownTotal.toFixed(2)}`;
}

function openBookingServicePicker() {
  const picker = document.getElementById('b-service-picker');
  const trigger = document.getElementById('b-service-trigger');
  const dropdown = document.getElementById('b-service-dropdown');
  if (!picker || !trigger || !dropdown) return;
  picker.classList.add('open');
  trigger.setAttribute('aria-expanded', 'true');
  dropdown.hidden = false;
}

function closeBookingServicePicker() {
  const picker = document.getElementById('b-service-picker');
  const trigger = document.getElementById('b-service-trigger');
  const dropdown = document.getElementById('b-service-dropdown');
  if (!picker || !trigger || !dropdown) return;
  picker.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
  dropdown.hidden = true;
}

function initBookingServicePicker() {
  const picker = document.getElementById('b-service-picker');
  const trigger = document.getElementById('b-service-trigger');
  if (!picker || !trigger || picker.dataset.ready === 'true') return;

  trigger.addEventListener('click', () => {
    if (picker.classList.contains('open')) closeBookingServicePicker();
    else openBookingServicePicker();
  });

  document.addEventListener('click', e => {
    if (!picker.contains(e.target)) closeBookingServicePicker();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBookingServicePicker();
  });

  picker.dataset.ready = 'true';
}

function renderBookingServiceChoices() {
  const select = document.getElementById('b-service');
  const container = document.getElementById('b-service-options');
  if (!select || !container) return;

  initBookingServicePicker();

  const options = Array.from(select.options).filter(option => option.value);
  container.innerHTML = options.map(option => `
    <label class="service-choice-item">
      <input type="checkbox" value="${option.value}" ${option.selected ? 'checked' : ''} />
      <div><strong>${option.textContent}</strong></div>
    </label>
  `).join('');

  container.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      const values = Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);
      Array.from(select.options).forEach(option => {
        option.selected = values.includes(option.value);
      });
      updateBookingServiceEstimate();
    });
  });

  updateBookingServiceEstimate();
}

/* ============================================================
   9. MINI CALENDAR
   ============================================================ */
let calDate = new Date();
calDate.setDate(1);

function getDayNameFromIndex(index) {
  return ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][Number(index)] || '';
}

function getDayNameFromDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return getDayNameFromIndex(new Date(parts[0], parts[1] - 1, parts[2]).getDay());
}

function normalizeBlockedRule(rule) {
  const source = rule && typeof rule === 'object' ? rule : {};
  let day = source.day ? String(source.day).toLowerCase() : '';
  const date = source.date || '';
  const time = source.time || source.hour || '';
  let type = source.type || '';

  if (!day && source.weekday !== '' && source.weekday !== null && source.weekday !== undefined) {
    day = getDayNameFromIndex(source.weekday);
  }
  if (!day && date) {
    day = getDayNameFromDate(date);
  }
  if (!type) {
    if (date && time) type = 'date-time';
    else if (date) type = 'date-full';
    else if (day && time) type = 'day-time';
    else if (day) type = 'day-full';
  }

  return { id: source.id || `rule-${Date.now()}`, day, date, time, type };
}

function normalizeBlockedRules(rules) {
  return Array.isArray(rules) ? rules.map(normalizeBlockedRule).filter(rule => rule.type) : [];
}

function isBlockedByType(selectedDate, selectedDay, selectedTime, blocks) {
  return (blocks || []).some(block => {
    if (block.type === 'date-time') {
      return block.date === selectedDate && block.time === selectedTime;
    }
    if (block.type === 'day-time') {
      return block.day === selectedDay && block.time === selectedTime;
    }
    if (block.type === 'date-full') {
      return block.date === selectedDate;
    }
    if (block.type === 'day-full') {
      return block.day === selectedDay;
    }
    return false;
  });
}

function getConfiguredHoursForDate(dateStr, avail = null) {
  if (!dateStr) return [];
  const parts = dateStr.split('-');
  const weekday = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
  const weekdayHours = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const saturdayHours = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  if ([0, 2, 4].includes(weekday)) return [];
  if ([1, 3, 5].includes(weekday)) {
    return weekdayHours.slice();
  }
  if (weekday === 6) {
    return saturdayHours.slice();
  }
  return [];
}

function isDateUnavailable(dateStr, avail = null) {
  const availability = normalizeAvailability(avail || getData('pal_availability', DEFAULT_AVAILABILITY));
  const dayName = getDayNameFromDate(dateStr);
  const parts = dateStr.split('-');
  const configuredHours = getConfiguredHoursForDate(dateStr, availability);
  const blockedLegacyWeekday = Array.isArray(availability.unavailableWeekdays) && availability.unavailableWeekdays.includes(new Date(parts[0], parts[1] - 1, parts[2]).getDay());
  const blockedLegacyDate = Array.isArray(availability.blockedDates) && availability.blockedDates.includes(dateStr);
  const fullDayBlocked = isBlockedByType(dateStr, dayName, '', availability.blockedRules || []);
  const allHoursBlocked = configuredHours.length > 0 && configuredHours.every(hour => isTimeUnavailable(dateStr, hour, availability));
  return blockedLegacyWeekday || blockedLegacyDate || fullDayBlocked || configuredHours.length === 0 || allHoursBlocked;
}

function isTimeUnavailable(dateStr, time, avail = null) {
  const availability = normalizeAvailability(avail || getData('pal_availability', DEFAULT_AVAILABILITY));
  const dayName = getDayNameFromDate(dateStr);
  const configuredHours = getConfiguredHoursForDate(dateStr, availability);
  const blockedLegacy = (availability.blockedSlots && availability.blockedSlots[dateStr] && availability.blockedSlots[dateStr].includes(time)) || false;
  return configuredHours.indexOf(time) === -1 || blockedLegacy || isBlockedByType(dateStr, dayName, time, availability.blockedRules || []);
}

function renderMiniCalendar() {
  const wrap = document.getElementById('booking-calendar');
  if (!wrap) return;

  const avail = normalizeAvailability(getData('pal_availability', DEFAULT_AVAILABILITY));
  const appointments = getData('pal_appointments', []);

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const today = new Date(); today.setHours(0,0,0,0);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const monthNamesEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dow = ['Do','Lu','Ma','Mi','Ju','Vi','Sa'];
  const dowEn = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const monthLabel = currentLang === 'en' ? monthNamesEn[month] : monthNames[month];
  const dowLabels = currentLang === 'en' ? dowEn : dow;

  // Get booked slots per date
  const bookedSlots = {};
  appointments.filter(a => a.status !== 'cancelada').forEach(a => {
    if (!bookedSlots[a.date]) bookedSlots[a.date] = [];
    bookedSlots[a.date].push(a.time);
  });

  let html = `
    <div class="mini-cal-header">
      <button class="mini-cal-nav" id="cal-prev" aria-label="Mes anterior"><i class="fas fa-chevron-left"></i></button>
      <h4>${monthLabel} ${year}</h4>
      <button class="mini-cal-nav" id="cal-next" aria-label="Mes siguiente"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div class="mini-cal-grid">
      ${dowLabels.map(d => `<div class="cal-dow">${d}</div>`).join('')}
      ${Array(firstDay).fill('<div class="cal-day empty"></div>').join('')}`;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dateObj = new Date(year, month, d);
    const isPast = dateObj < today;
    const isToday = dateObj.getTime() === today.getTime();
    const isBlocked = isDateUnavailable(dateStr, avail);
    const dayOfWeek = dateObj.getDay();
    const isSat = dayOfWeek === 6;
    const allSlots = getConfiguredHoursForDate(dateStr, avail);
    const booked = bookedSlots[dateStr] || [];
    const availableCount = allSlots.filter(h => !isTimeUnavailable(dateStr, h, avail) && !booked.includes(h)).length;
    const isFull = !isBlocked && availableCount === 0 && allSlots.length > 0;

    let cls = 'cal-day';
    if (isPast) cls += ' past';
    else if (isBlocked) cls += ' full';
    else if (isFull) cls += ' full';
    else if (isSat && allSlots.length > 0) cls += ' available';
    else cls += ' available';
    if (isToday) cls += ' today';

    html += `<div class="${cls}" data-date="${dateStr}" title="${dateStr}" onclick="calDayClick('${dateStr}')">${d}</div>`;
  }
  html += '</div>';
  wrap.innerHTML = html;

  document.getElementById('cal-prev').addEventListener('click', () => { calDate.setMonth(calDate.getMonth()-1); renderMiniCalendar(); });
  document.getElementById('cal-next').addEventListener('click', () => { calDate.setMonth(calDate.getMonth()+1); renderMiniCalendar(); });
}

function calDayClick(dateStr) {
  if (isDateUnavailable(dateStr)) return;
  const dateInput = document.getElementById('b-date');
  if (dateInput) {
    dateInput.value = dateStr;
    dateInput.dispatchEvent(new Event('change'));
    document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    const el = document.querySelector(`.cal-day[data-date="${dateStr}"]`);
    if (el) el.classList.add('selected');
  }
}

/* ============================================================
   10. BOOKING FORM
   ============================================================ */
function initBookingForm() {
  const dateInput = document.getElementById('b-date');
  const timeSelect = document.getElementById('b-time');
  const availMsg = document.getElementById('availability-msg');

  // Set min date = today (local)
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  dateInput.min = today;

  dateInput.addEventListener('change', () => {
    updateTimeSlots();
    checkAvailability();
    renderMiniCalendar();
  });
  timeSelect.addEventListener('change', checkAvailability);

  function updateTimeSlots() {
    const dateStr = dateInput.value;
    if (!dateStr) { timeSelect.innerHTML = `<option value="">${t('form.selectTime')}</option>`; return; }

    const avail = normalizeAvailability(getData('pal_availability', DEFAULT_AVAILABILITY));
    if (isDateUnavailable(dateStr, avail)) {
      timeSelect.innerHTML = `<option value="">${t('booking.noAvail')}</option>`;
      return;
    }

    // Obtener citas existentes para filtrar lo que ya está ocupado
    const appointments = getData('pal_appointments', []);
    const booked = appointments.filter(a => a.date === dateStr && a.status !== 'cancelada').map(a => a.time);

    // Mostrar todas las horas configuradas MENOS las bloqueadas por el admin y las ya reservadas
    const availableHours = getConfiguredHoursForDate(dateStr, avail).filter(h => !isTimeUnavailable(dateStr, h, avail) && !booked.includes(h));

    if (availableHours.length === 0) {
      timeSelect.innerHTML = `<option value="">${t('booking.noAvail')}</option>`;
    } else {
      timeSelect.innerHTML = `<option value="">${t('form.selectTime')}</option>` +
        availableHours.map(h => `<option value="${h}">${h}</option>`).join('');
    }
  }

  function checkAvailability() {
    const date = dateInput.value;
    const time = timeSelect.value;
    if (!date || !time) { availMsg.className = 'availability-msg'; availMsg.textContent = ''; availMsg.style.display = 'none'; return; }

    const appointments = getData('pal_appointments', []);
    const taken = appointments.some(a => a.date === date && a.time === time && a.status !== 'cancelada');
    const avail = normalizeAvailability(getData('pal_availability', DEFAULT_AVAILABILITY));
    const blocked = isTimeUnavailable(date, time, avail);

    if (taken || blocked) {
      availMsg.className = 'availability-msg unavailable';
      availMsg.textContent = t('availability.unavailable');
    } else {
      availMsg.className = 'availability-msg available';
      availMsg.textContent = t('availability.available');
    }
  }

  document.getElementById('booking-form').addEventListener('submit', submitBooking);
}

function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const selectedServices = Array.from(form.service.selectedOptions).map(option => option.value).filter(Boolean);
  const service = selectedServices.join(', ');
  const date = form.date.value;
  const time = form.time.value;
  const comments = form.comments.value.trim();
  const contactPref = form.contactPref.value;
  let valid = true;

  const clearErrors = () => ['name','phone','email','service','date','time'].forEach(f => {
    const el = document.getElementById(`err-${f}`);
    if (el) el.textContent = '';
  });
  clearErrors();

  if (!name) { document.getElementById('err-name').textContent = t('form.required'); valid = false; }
  if (!phone || phone.length < 7) { document.getElementById('err-phone').textContent = t('form.phoneInvalid'); valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('err-email').textContent = t('form.emailInvalid'); valid = false; }
  if (selectedServices.length === 0) { document.getElementById('err-service').textContent = t('form.required'); valid = false; }
  if (!date) { document.getElementById('err-date').textContent = t('form.required'); valid = false; }
  if (!time) { document.getElementById('err-time').textContent = t('form.required'); valid = false; }
  if (date && isDateUnavailable(date)) {
    document.getElementById('err-date').textContent = t('availability.unavailable');
    valid = false;
  }
  if (date && time && isTimeUnavailable(date, time)) {
    document.getElementById('err-time').textContent = t('availability.unavailable');
    valid = false;
  }
  if (!valid) return;

  // Check availability one more time
  const appointments = getData('pal_appointments', []);
  const taken = appointments.some(a => a.date === date && a.time === time && a.status !== 'cancelada');
  if (taken || isTimeUnavailable(date, time)) {
    document.getElementById('err-time').textContent = t('availability.unavailable');
    return;
  }

  const newAppt = {
    id: 'a' + Date.now(),
    name, phone, email, service, date, time, comments, contactPref,
    status: 'pendiente',
    createdAt: new Date().toISOString().split('T')[0]
  };
  appointments.push(newAppt);
  setData('pal_appointments', appointments);

  // Update clients
  updateClients(newAppt);

  const bookingEmailParams = {
    name: name,
    phone: phone,
    email: email,
    to_email: BUSINESS_EMAIL,
    service: service,
    date: date,
    time: time,
    contactPref: formatContactPreferenceLabel(contactPref),
    comments: comments || 'Sin comentarios',
    business_name: getBusinessName(),
    business_email: BUSINESS_EMAIL,
    submitted_at: formatEmailTimestamp(),
    subject_emoji: '💅',
    email_subject: 'Nueva solicitud de cita',
    heading_title: 'Nueva Solicitud de Cita',
    intro_text: 'Recibiste una nueva solicitud de cita desde la pagina web.',
    status_label: 'Pendiente de confirmacion',
    confirmation_message: 'Hemos recibido tu solicitud y ahora mismo esta en espera de confirmacion por parte de nuestro equipo.',
    next_step: 'Te estaremos contactando pronto para confirmar tu cita y cualquier detalle adicional.',
    closing_text: 'Revisa los detalles y confirma la disponibilidad con la clienta.',
    recipient_role: 'admin'
  };

  const clientConfirmationParams = {
    name: name,
    phone: phone,
    email: email,
    to_email: email,
    service: service,
    date: date,
    time: time,
    contactPref: formatContactPreferenceLabel(contactPref),
    comments: comments || 'Sin comentarios',
    business_name: getBusinessName(),
    business_email: BUSINESS_EMAIL,
    submitted_at: formatEmailTimestamp(),
    subject_emoji: '✨',
    email_subject: 'Recibimos tu solicitud de cita',
    heading_title: 'Tu solicitud fue recibida',
    intro_text: 'Gracias por comunicarte con nosotras. Hemos recibido tu solicitud de cita correctamente.',
    status_label: 'En espera',
    confirmation_message: 'Tu solicitud fue registrada con exito y se encuentra pendiente de revision y confirmacion.',
    next_step: 'Nuestro equipo se comunicara contigo pronto para confirmar disponibilidad y cualquier detalle adicional.',
    closing_text: 'Si necesitas hacer algun cambio, puedes responder este correo o escribirnos directamente.',
    recipient_role: 'client'
  };

  sendEmailJs(EMAILJS_BOOKING_TEMPLATE_ID, bookingEmailParams)
    .catch(err => {
      console.warn('EmailJS booking send failed:', err);
      showToast('La cita se guardo, pero el correo al negocio no se pudo enviar.', 'error');
    });

  sendEmailJs(EMAILJS_BOOKING_TEMPLATE_ID, clientConfirmationParams)
    .catch(err => {
      console.warn('EmailJS client confirmation failed:', err);
      showToast('La cita se guardo, pero el correo de confirmacion al cliente no se pudo enviar.', 'error');
    });

  showToast(t('booking.success'), 'success');
  form.reset();
  renderBookingServiceChoices();
  closeBookingServicePicker();
  document.getElementById('availability-msg').className = 'availability-msg';
  document.getElementById('availability-msg').textContent = '';
  renderMiniCalendar();

  /* ============================================================
     EmailJS Integration — Configure below:
     1. Sign up at https://www.emailjs.com
     2. Create a service and email template
     3. Replace the values below with your actual IDs

     emailjs.send(
       'YOUR_SERVICE_ID',      // e.g. 'service_abc123'
       'YOUR_TEMPLATE_ID',     // e.g. 'template_xyz789'
       {
         to_name: name,
         to_email: email,
         service: service,
         date: date,
         time: time,
         phone: phone,
       },
       'YOUR_PUBLIC_KEY'       // e.g. 'user_XXXXXXXX'
     ).then(() => showToast('Correo enviado', 'info'))
      .catch(err => console.warn('EmailJS error:', err));
     ============================================================ */
}

function updateClients(appt) {
  let clients = getData('pal_clients', []);
  const idx = clients.findIndex(c => c.email === appt.email || c.phone === appt.phone);
  if (idx >= 0) {
    clients[idx].appointments++;
    clients[idx].lastAppt = appt.date;
    if (!clients[idx].services.includes(appt.service)) clients[idx].services.push(appt.service);
  } else {
    clients.push({
      id: 'c' + Date.now(),
      name: appt.name, phone: appt.phone, email: appt.email,
      appointments: 1, services: [appt.service], lastAppt: appt.date
    });
  }
  setData('pal_clients', clients);
}

/* ============================================================
   11. GALLERY
   ============================================================ */
let currentCat = 'all';
let currentGallerySlide = 0;
let currentGalleryItems = [];

function renderGallery(cat = 'all') {
  currentCat = cat;
  const grid = document.getElementById('gallery-grid');
  const items = getGalleryData().filter(g => g.active && (cat === 'all' || g.category === cat));
  currentGalleryItems = items;
  if (currentGallerySlide >= items.length) currentGallerySlide = 0;

  if (!grid) return;
  if (items.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-images"></i><p>${t('gallery.empty')}</p></div>`;
    return;
  }

  grid.innerHTML = `
    <div class="gallery-slideshow-shell">
      <button class="gallery-slide-nav prev" type="button" aria-label="Anterior" onclick="changeGallerySlide(-1)">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="gallery-slides-track">
        ${items.map((g, index) => {
          const title = currentLang === 'en' && g.titleEn ? g.titleEn : g.title;
          const desc = currentLang === 'en' && g.descEn ? g.descEn : g.desc;
          return `
            <article class="gallery-slide ${index === currentGallerySlide ? 'active' : ''}">
              <article class="gallery-item gallery-comparison-card" onclick="openGalleryModal('${g.id}')">
                <div class="gallery-comparison-media">
                  <div class="gallery-compare-side">
                    <img class="gallery-thumb-img" src="${g.beforeImg}" alt="Antes" loading="lazy" />
                    <span class="gallery-compare-label">Antes</span>
                  </div>
                  <div class="gallery-compare-side">
                    <img class="gallery-thumb-img" src="${g.afterImg}" alt="Después" loading="lazy" />
                    <span class="gallery-compare-label">Después</span>
                  </div>
                  <div class="gallery-overlay"><i class="fas fa-expand gallery-overlay-icon"></i></div>
                </div>
                <div class="gallery-comparison-copy">
                  ${title ? `<h4>${title}</h4>` : `<h4>Antes / Después</h4>`}
                  <p>${desc}</p>
                </div>
              </article>
            </article>`;
        }).join('')}
      </div>
      <button class="gallery-slide-nav next" type="button" aria-label="Siguiente" onclick="changeGallerySlide(1)">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="gallery-slide-dots">
        ${items.map((_, index) => `
          <button
            type="button"
            class="gallery-slide-dot ${index === currentGallerySlide ? 'active' : ''}"
            aria-label="Ir a slide ${index + 1}"
            onclick="setGallerySlide(${index})"></button>
        `).join('')}
      </div>
    </div>`;
}

function setGallerySlide(index) {
  if (!currentGalleryItems.length) return;
  currentGallerySlide = (index + currentGalleryItems.length) % currentGalleryItems.length;
  renderGallery(currentCat);
}

function changeGallerySlide(step) {
  setGallerySlide(currentGallerySlide + step);
}

function initGalleryFilters() {
  const filters = document.getElementById('gallery-filters');
  const availableCategories = new Set(getGalleryData().map(item => item.category));
  filters.querySelectorAll('.filter-btn').forEach(btn => {
    const cat = btn.dataset.cat;
    btn.style.display = cat === 'all' || availableCategories.has(cat) ? 'inline-flex' : 'none';
  });

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentGallerySlide = 0;
    renderGallery(btn.dataset.cat);
  });
}

function openGalleryModal(id) {
  const items = getGalleryData();
  const item = items.find(g => g.id === id);
  if (!item) return;
  const modal = document.getElementById('gallery-modal');
  const title = currentLang === 'en' && item.titleEn ? item.titleEn : item.title;
  const desc  = currentLang === 'en' && item.descEn  ? item.descEn  : item.desc;

  document.getElementById('ba-title').textContent = title || '';
  document.getElementById('ba-desc').textContent = desc || '';

  const beforeEl = document.getElementById('ba-before');
  const afterEl  = document.getElementById('ba-after');
  const container = document.getElementById('ba-container');
  const slider = document.getElementById('ba-slider');
  const beforeLabel = document.querySelector('.ba-label-before');
  const afterLabel = document.querySelector('.ba-label-after');

  if (item.beforeImg) { beforeEl.src = item.beforeImg; beforeEl.style.display = 'block'; }
  else { beforeEl.style.display = 'none'; }
  if (item.afterImg || item.singleImg)  { afterEl.src  = item.afterImg || item.singleImg;  afterEl.style.display  = 'block'; }
  else { afterEl.style.display = 'none'; }

  if (item.beforeImg && (item.afterImg || item.singleImg)) {
    slider.style.display = 'block';
    container.classList.remove('single-view');
    if (beforeLabel) beforeLabel.style.display = 'inline-flex';
    if (afterLabel) afterLabel.style.display = 'inline-flex';
    resetBASlider();
  } else {
    slider.style.display = 'none';
    container.classList.add('single-view');
    if (beforeLabel) beforeLabel.style.display = 'none';
    if (afterLabel) afterLabel.style.display = 'none';
    beforeEl.style.clipPath = 'none';
    afterEl.style.clipPath = 'none';
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (item.beforeImg && (item.afterImg || item.singleImg)) initBASlider();
}

function resetBASlider() {
  const slider = document.getElementById('ba-slider');
  const before = document.getElementById('ba-before');
  const after  = document.getElementById('ba-after');
  slider.style.left = '50%';
  before.style.clipPath = 'inset(0 50% 0 0)';
  after.style.clipPath  = 'inset(0 0 0 50%)';
}

function initBASlider() {
  const container = document.getElementById('ba-container');
  const slider    = document.getElementById('ba-slider');
  const before    = document.getElementById('ba-before');
  const after     = document.getElementById('ba-after');
  let dragging = false;

  const move = (x) => {
    const rect = container.getBoundingClientRect();
    let pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
    slider.style.left = pct + '%';
    before.style.clipPath = `inset(0 ${100-pct}% 0 0)`;
    after.style.clipPath  = `inset(0 0 0 ${pct}%)`;
  };

  slider.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  slider.addEventListener('touchstart', e => { dragging = true; }, { passive: true });
  document.addEventListener('mousemove', e => { if (dragging) move(e.clientX); });
  document.addEventListener('touchmove', e => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mouseup',  () => dragging = false);
  document.addEventListener('touchend', () => dragging = false);
  container.addEventListener('click', e => move(e.clientX));
}

function initGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  document.getElementById('gallery-modal-close').addEventListener('click', closeGalleryModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeGalleryModal(); });
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

window.setGallerySlide = setGallerySlide;
window.changeGallerySlide = changeGallerySlide;


/* ============================================================
   12. LOVE WALL / REVIEWS
   ============================================================ */
function renderLoveWall() {
  const wall = document.getElementById('love-wall');
  const testimonials = getData('pal_testimonials', DEFAULT_TESTIMONIALS).filter(t => t.status === 'aprobado');
  if (!wall) return;
  if (testimonials.length === 0) {
    wall.innerHTML = `<div class="empty-state"><i class="fas fa-heart"></i><p>${t('reviews.empty')}</p></div>`;
    return;
  }
  wall.innerHTML = testimonials.map(item => {
    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
    const initials = item.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const date = new Date(item.date).toLocaleDateString(currentLang === 'es' ? 'es-PR' : 'en-US', { year:'numeric', month:'short', day:'numeric' });
    return `
      <div class="love-card">
        <div class="love-top">
          <div class="love-avatar">${initials}</div>
          <div class="love-stars">${stars}</div>
        </div>
        <span class="love-service">${item.service}</span>
        <p class="love-comment">${item.comment}</p>
        <div class="love-footer">
          <span class="love-name">${item.name}</span>
          <span class="love-date">${date}</span>
        </div>
      </div>`;
  }).join('');
}

function initTestimonyForm() {
  const stars = document.querySelectorAll('#star-rating .star');
  let rating = 0;
  stars.forEach((star, i) => {
    star.addEventListener('click', () => {
      rating = i + 1;
      document.getElementById('t-rating').value = rating;
      stars.forEach((s, j) => s.classList.toggle('active', j < rating));
    });
    star.addEventListener('mouseenter', () => stars.forEach((s, j) => s.classList.toggle('active', j <= i)));
    star.addEventListener('mouseleave', () => stars.forEach((s, j) => s.classList.toggle('active', j < rating)));
  });

  document.getElementById('testimony-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const name    = form.name.value.trim();
    const service = form.service.value;
    const comment = form.comment.value.trim();
    const r       = parseInt(document.getElementById('t-rating').value) || 0;

    if (!name || !service || !comment) { showToast(t('form.required'), 'error'); return; }
    if (r === 0) { showToast(t('form.ratingRequired'), 'error'); return; }

    const testimonials = getData('pal_testimonials', DEFAULT_TESTIMONIALS);
    testimonials.push({
      id: 'tc' + Date.now(), name, service, rating: r, comment,
      date: new Date().toISOString().split('T')[0], status: 'pendiente'
    });
    setData('pal_testimonials', testimonials);
    showToast(t('reviews.success'), 'success');
    form.reset();
    rating = 0;
    document.getElementById('t-rating').value = 0;
    document.querySelectorAll('#star-rating .star').forEach(s => s.classList.remove('active'));
  });
}

/* ============================================================
   13. FAQ
   ============================================================ */
function renderFAQ() {
  const list = document.getElementById('faq-list');
  const faqs = getData('pal_faqs', DEFAULT_FAQS).filter(f => f.active);
  if (!list) return;
  list.innerHTML = faqs.map((f, i) => {
    const q = currentLang === 'en' && f.qEn ? f.qEn : f.q;
    const a = currentLang === 'en' && f.aEn ? f.aEn : f.a;
    return `
      <div class="faq-item" id="faq-${i}">
        <button class="faq-question" aria-expanded="false" onclick="toggleFAQ(${i})">
          ${q} <i class="fas fa-chevron-down faq-icon"></i>
        </button>
        <div class="faq-answer">${a}</div>
      </div>`;
  }).join('');
}

function toggleFAQ(i) {
  const item = document.getElementById(`faq-${i}`);
  if (!item) return;
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => { el.classList.remove('open'); el.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); });
  if (!open) { item.classList.add('open'); item.querySelector('.faq-question').setAttribute('aria-expanded', 'true'); }
}

/* ============================================================
   14. SCHEDULE
   ============================================================ */
function renderSchedule() {
  const el = document.getElementById('schedule-display');
  if (!el) return;
  const schedule = getData('pal_schedule', DEFAULT_SCHEDULE);
  el.innerHTML = schedule.map(row => {
    const day = currentLang === 'en' && row.dayEn ? row.dayEn : row.day;
    return `<div class="schedule-row"><span>${day}</span><span>${row.hours}</span></div>`;
  }).join('');
}

/* ============================================================
   15. SUGGESTIONS FORM
   ============================================================ */
function initSuggestionForm() {
  document.getElementById('suggestion-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const type    = form.type.value;
    const message = form.message.value.trim();
    if (!name || !type || !message) { showToast(t('form.required'), 'error'); return; }
    const suggestions = getData('pal_suggestions', DEFAULT_SUGGESTIONS);
    suggestions.push({
      id: 'sug' + Date.now(), name, email, type, message,
      date: new Date().toISOString().split('T')[0], status: 'nueva'
    });
    setData('pal_suggestions', suggestions);

    sendEmailJs(EMAILJS_SUGGESTION_TEMPLATE_ID, {
      name: name,
      email: email || 'No provisto',
      type: type,
      message: message,
      business_name: getBusinessName(),
      submitted_at: formatEmailTimestamp()
    }).catch(err => {
      console.warn('EmailJS suggestion send failed:', err);
      showToast('La sugerencia se guardo, pero el correo no se pudo enviar.', 'error');
    });

    showToast(t('suggestions.success'), 'success');
    form.reset();
  });
}

/* ============================================================
   16. SMOOTH SCROLL & ACTIVE NAV
   ============================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a, .drawer-inner nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   17. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  if (document.body) {
    document.body.dataset.scrollRevealReady = 'true';
  }

  const revealTargetsImmediately = () => {
    document.querySelectorAll('.scroll-reveal, section, .service-card, .gallery-item, .love-card, .faq-item, .contact-item, .feature, .booking-form-wrap, .booking-info, .testimony-form-wrap, .contact-wa-card, .about-content, .about-visual, .suggestions-deco, .suggestions-layout form, .schedule-box').forEach(el => {
      el.classList.add('revealed');
    });
  };

  if (!('IntersectionObserver' in window)) {
    revealTargetsImmediately();
    return;
  }

  if (window.matchMedia && window.matchMedia('(max-width: 860px)').matches) {
    revealTargetsImmediately();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.14,
    rootMargin: '0px 0px -70px 0px' 
  });

  // Secciones principales
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('scroll-reveal', 'reveal-soft');
    observer.observe(section);
  });

  // Grids con stagger elegante
  const staggerGroups = [
    '.service-card',
    '.gallery-item',
    '.love-card',
    '.faq-item',
    '.contact-item',
    '.feature'
  ];

  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('scroll-reveal', 'reveal-up');
      el.style.setProperty('--reveal-delay', `${Math.min(index * 90, 420)}ms`);
      observer.observe(el);
    });
  });

  // Bloques destacados
  const featureTargets = [
    ['.booking-form-wrap', 'reveal-right'],
    ['.booking-info', 'reveal-left'],
    ['.testimony-form-wrap', 'reveal-zoom'],
    ['.contact-wa-card', 'reveal-zoom'],
    ['.about-content', 'reveal-right'],
    ['.about-visual', 'reveal-left'],
    ['.suggestions-deco', 'reveal-zoom'],
    ['.suggestions-layout form', 'reveal-right'],
    ['.schedule-box', 'reveal-up']
  ];

  featureTargets.forEach(([selector, effect]) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('scroll-reveal', effect);
      observer.observe(el);
    });
  });

  window.setTimeout(revealTargetsImmediately, 1800);
}

/* ============================================================
   18. PAGE CONTENT OVERRIDE (from admin editor)
   ============================================================ */
function applyPageContent() {
  const content = getData('pal_page_content', null);
  if (!content) return;
  if (content.heroTitle)    { const el = document.getElementById('hero-title'); if (el) el.innerHTML = content.heroTitle; }
  if (content.heroSubtitle) { const el = document.getElementById('hero-subtitle'); if (el) el.textContent = content.heroSubtitle; }
  if (content.aboutTitle)   { const el = document.getElementById('about-title'); if (el) el.textContent = content.aboutTitle; }
  if (content.aboutText)    { const el = document.getElementById('about-text'); if (el) el.textContent = content.aboutText; }
  if (content.footerDesc)   { const el = document.getElementById('footer-desc'); if (el) el.textContent = content.footerDesc; }
}

function applyBusinessConfig() {
  const config = getPublicConfig();
  const instagramUrl = normalizeExternalUrl(config.instagram);
  const facebookUrl = normalizeExternalUrl(config.facebook);
  const phoneText = String(config.phone || DEFAULT_PUBLIC_CONFIG.phone || '').trim();

  document.querySelectorAll('[data-social-link]').forEach(link => {
    const kind = link.getAttribute('data-social-link');
    const mode = link.getAttribute('data-wa-mode') || '';
    let href = '';

    if (kind === 'instagram') {
      href = instagramUrl;
    } else if (kind === 'facebook') {
      href = facebookUrl;
    } else if (kind === 'whatsapp') {
      href = buildWhatsAppUrl(phoneText, mode);
    }

    if (!href) return;
    link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  document.querySelectorAll('[data-whatsapp-text]').forEach(el => {
    if (phoneText) el.textContent = phoneText;
  });
}

function enforceExternalLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const rawHref = link.getAttribute('href');
    let url;

    if (!rawHref || rawHref.charAt(0) === '#') return;
    if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

    try {
      url = new URL(rawHref, window.location.href);
    } catch (error) {
      return;
    }

    let pageOrigin;
    try {
      pageOrigin = window.location.origin;
    } catch (e) {
      pageOrigin = window.location.protocol + '//' + window.location.host;
    }

    if (url.origin !== pageOrigin) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');

      if (!link.dataset.externalBound) {
        link.addEventListener('click', function (event) {
          if (event.defaultPrevented) return;
          if (event.button !== 0) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

          event.preventDefault();
          var openedWindow = window.open(link.href, '_blank', 'noopener,noreferrer');
          if (openedWindow) {
            openedWindow.opener = null;
          }
        });
        link.dataset.externalBound = 'true';
      }
    }
  });
}

/* ============================================================
   19. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  if (window.PalSupabaseSync) {
    await window.PalSupabaseSync.hydrateLocalCache();
  }
  initDemo();
  // Ensure any new defaults added in code are merged into existing localStorage
  mergeDefaultsInto('pal_services', DEFAULT_SERVICES);
  mergeDefaultsInto('pal_faqs', DEFAULT_FAQS);
  applyTheme();
  applyTranslations();
  applyGallerySectionCopy();
  applyPageContent();
  applyBusinessConfig();
  enforceExternalLinks();

  initHeader();
  renderServices();
  populateServiceSelects();
  renderMiniCalendar();
  initBookingForm();
  renderGallery('all');
  initGalleryFilters();
  initGalleryModal();
  renderLoveWall();
  initTestimonyForm();
  renderFAQ();
  renderSchedule();
  initSuggestionForm();
  initActiveNav();
  initScrollReveal();

  // Lang buttons
  document.getElementById('lang-es').classList.toggle('active', currentLang === 'es');
  document.getElementById('lang-en').classList.toggle('active', currentLang === 'en');
});
