'use strict';

(function () {
  var ADMIN_SESSION_KEY = 'pal_admin_logged';
  var ALL_BUSINESS_HOURS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

  var DEFAULT_SERVICES = [
    { id: 's1', category: 'gel', name: 'Full Set Gel (Cortas)', nameEn: 'Gel Full Set (Short)', price: 45, icon: 'fas fa-hand-sparkles', active: true },
    { id: 's2', category: 'gel', name: 'Full Set Gel (Medianas)', nameEn: 'Gel Full Set (Medium)', price: 50, icon: 'fas fa-hand-sparkles', active: true },
    { id: 's3', category: 'gel', name: 'Full Set Gel (Largas)', nameEn: 'Gel Full Set (Long)', price: 55, icon: 'fas fa-hand-sparkles', active: true },
    { id: 's4', category: 'gel', name: 'Manicura Pro', nameEn: 'Pro Manicure', price: 35, icon: 'fas fa-hand-sparkles', active: true },
    { id: 's5', category: 'gel', name: 'Pedicura Jelly Spa', nameEn: 'Jelly Spa Pedicure', price: 60, icon: 'fas fa-spa', active: true },
    { id: 's6', category: 'lashes', name: 'Extensiones YY', nameEn: 'YY Extensions', price: 125, icon: 'fas fa-eye', active: true },
    { id: 's7', category: 'lashes', name: 'Extensiones Fibras Tecnológicas', nameEn: 'Technological Fiber Extensions', price: 150, icon: 'fas fa-eye', active: true },
    { id: 's8', category: 'refills', name: 'Retoque (2 semanas)', nameEn: 'Refill (2 weeks)', price: 80, icon: 'fas fa-clock', active: true },
    { id: 's9', category: 'refills', name: 'Retoque (3 semanas)', nameEn: 'Refill (3 weeks)', price: 90, icon: 'fas fa-clock', active: true },
    { id: 's10', category: 'refills', name: 'Retoque (4 semanas)', nameEn: 'Refill (4 weeks)', price: 0, icon: 'fas fa-clock', active: true, description: 'Full Set nuevo', descriptionEn: 'New Full Set' },
    { id: 's11', category: 'brows', name: 'Depilación de cejas con cera', nameEn: 'Eyebrow Waxing', price: 15, icon: 'fas fa-eye-dropper', active: true },
    { id: 's12', category: 'brows', name: 'Depilación + Diseño + Tinte', nameEn: 'Wax + Design + Tint', price: 40, icon: 'fas fa-magic', active: true },
    { id: 's13', category: 'brows', name: 'Depilación, Diseño, Tinte y Lamination', nameEn: 'Wax, Design, Tint & Lamination', price: 80, icon: 'fas fa-sparkles', active: true },
    { id: 's14', category: 'brows', name: 'Diseño + Tinte', nameEn: 'Design + Tint', price: 35, icon: 'fas fa-paint-brush', active: true },
    { id: 's15', category: 'brows', name: 'Brow Lamination', nameEn: 'Brow Lamination', price: 100, icon: 'fas fa-arrows-alt-v', active: true },
    { id: 's16', category: 'brows', name: 'Lash Lifting', nameEn: 'Lash Lifting', price: 90, icon: 'fas fa-eye', active: true }
  ];

  var DEFAULT_FAQS = [
    { id: 'f1', q: '¿Dónde están ubicados?', qEn: 'Where are you located?', a: 'Estamos en Barranquitas, Puerto Rico. Puedes contactarnos por WhatsApp al 787-228-4063 para obtener la dirección exacta.', aEn: 'We are in Barranquitas, Puerto Rico. Contact us via WhatsApp at 787-228-4063 for the exact address.', active: true },
    { id: 'f2', q: '¿Cómo puedo reservar una cita?', qEn: 'How can I book an appointment?', a: 'Puedes reservar directamente desde este formulario en nuestra página o contactarnos por WhatsApp, Instagram o Facebook.', aEn: 'You can book directly from the form on this page or contact us via WhatsApp, Instagram or Facebook.', active: true },
    { id: 'f3', q: '¿Puedo reservar por WhatsApp?', qEn: 'Can I book via WhatsApp?', a: '¡Por supuesto! Nuestro número es 787-228-4063. Puedes escribirnos en cualquier momento.', aEn: 'Of course! Our number is 787-228-4063. You can write to us at any time.', active: true },
    { id: 'f4', q: '¿Qué servicios ofrecen?', qEn: 'What services do you offer?', a: 'Ofrecemos manicura, pedicura, gel, acrílico y extensiones de pestañas. Cada servicio es realizado con dedicación y amor.', aEn: 'We offer manicure, pedicure, gel, acrylic and lash extensions. Each service is performed with dedication and love.', active: true },
    { id: 'f5', q: '¿Qué pasa si necesito cambiar mi cita?', qEn: 'What if I need to change my appointment?', a: 'Comunícate con nosotras por WhatsApp o redes sociales con al menos 24 horas de anticipación y con gusto reprogramamos.', aEn: 'Contact us via WhatsApp or social media at least 24 hours in advance and we will happily reschedule.', active: true },
    { id: 'f6', q: '¿Cuánto tiempo dura cada servicio?', qEn: 'How long does each service take?', a: 'Depende del servicio. En promedio: manicura 45 min, pedicura 60 min, gel 60-90 min, acrílico 90-120 min, pestañas 90-120 min.', aEn: 'Depends on the service. On average: manicure 45 min, pedicure 60 min, gel 60-90 min, acrylic 90-120 min, lashes 90-120 min.', active: true },
    { id: 'f7', q: '¿Puedo enviar una referencia del diseño que quiero?', qEn: 'Can I send a design reference?', a: '¡Sí! Puedes enviarnos fotos por WhatsApp o Instagram antes de tu cita para que podamos preparar el diseño ideal.', aEn: 'Yes! You can send us photos via WhatsApp or Instagram before your appointment so we can prepare the ideal design.', active: true },
    { id: 'f8', q: '¿Cómo sé si una hora está disponible?', qEn: 'How do I know if a time slot is available?', a: 'Puedes verificar disponibilidad directamente en el formulario de reservas de nuestra página. Al seleccionar fecha y hora, el sistema te indicará si está disponible.', aEn: 'You can check availability directly in the booking form. When you select a date and time, the system will tell you if it is available.', active: true },
    { id: 'f9', q: '¿Los testimonios aparecen automáticamente?', qEn: 'Do reviews appear automatically?', a: 'No. Todos los testimonios pasan por una revisión antes de publicarse en el Muro de Amor para asegurar su autenticidad.', aEn: 'No. All testimonials go through a review before being published on the Love Wall to ensure authenticity.', active: true },
    { id: 'f10', q: '¿Puedo cancelar una cita?', qEn: 'Can I cancel an appointment?', aEn: 'Yes. We ask that you notify us at least 24 hours in advance via WhatsApp or social media.', a: 'Sí. Te pedimos que nos avises con al menos 24 horas de anticipación por WhatsApp o redes sociales.', active: true }
  ];

  var DEFAULT_SCHEDULE = [
    { day: 'Lunes - Viernes', dayEn: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Sabado', dayEn: 'Saturday', hours: '9:00 AM - 2:00 PM' },
    { day: 'Domingo', dayEn: 'Sunday', hours: 'Cerrado / Closed' }
  ];

  var DEFAULT_AVAILABILITY = {
    weeklyHours: clone(ALL_BUSINESS_HOURS),
    unavailableWeekdays: [0],
    blockedDates: [],
    blockedSlots: {},
    blockedRules: []
  };

  var LEGACY_DEFAULT_SCHEDULE = clone(DEFAULT_SCHEDULE);
  var LEGACY_BUSINESS_HOURS = clone(ALL_BUSINESS_HOURS);
  var PREVIOUS_DEFAULT_SCHEDULE = [
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

  DEFAULT_AVAILABILITY.weeklyHours = clone(ALL_BUSINESS_HOURS);
  DEFAULT_AVAILABILITY.unavailableWeekdays = [0, 2, 4];
  DEFAULT_AVAILABILITY.blockedRules = [
    { day: 'lunes', date: '', time: '7:00 AM', type: 'day-time' },
    { day: 'lunes', date: '', time: '8:00 AM', type: 'day-time' },
    { day: 'miercoles', date: '', time: '7:00 AM', type: 'day-time' },
    { day: 'miercoles', date: '', time: '8:00 AM', type: 'day-time' },
    { day: 'viernes', date: '', time: '7:00 AM', type: 'day-time' },
    { day: 'viernes', date: '', time: '8:00 AM', type: 'day-time' }
  ];

  var DEFAULT_GALLERY = [
    { id: 'g1', title: 'Diseno floral primavera', titleEn: 'Spring floral design', desc: 'Gel con diseno floral en tonos rosas y lavanda.', descEn: 'Gel with floral design in pink and lavender tones.', category: 'gel', beforeImg: '', afterImg: '', active: true },
    { id: 'g2', title: 'Unas acrilicas coffin', titleEn: 'Coffin acrylic nails', desc: 'Extensiones acrilicas forma coffin con efecto marmol.', descEn: 'Coffin-shaped acrylic extensions with marble effect.', category: 'acrilico', beforeImg: '', afterImg: '', active: true }
  ];

  var DEFAULT_TESTIMONIALS = [
    { id: 't1', name: 'Maria Gonzalez', service: 'Gel', rating: 5, comment: 'Excelente servicio.', date: '2025-01-15', status: 'aprobado' },
    { id: 't2', name: 'Carmen Rivera', service: 'Extensiones de pestanas', rating: 5, comment: 'Muy buen trabajo y duracion.', date: '2025-01-20', status: 'aprobado' }
  ];

  var DEFAULT_APPOINTMENTS = [
    { id: 'a1', name: 'Lucia Perez', phone: '787-555-1001', email: 'lucia@email.com', service: 'Gel', date: '2025-03-10', time: '10:00 AM', comments: 'Quiero un diseno floral', contactPref: 'whatsapp', status: 'aprobada', createdAt: '2025-03-01' },
    { id: 'a2', name: 'Ana Martinez', phone: '787-555-1002', email: 'ana@email.com', service: 'Acrilico', date: '2025-03-15', time: '2:00 PM', comments: '', contactPref: 'call', status: 'pendiente', createdAt: '2025-03-05' },
    { id: 'a3', name: 'Rosa Jimenez', phone: '787-555-1003', email: 'rosa@email.com', service: 'Extensiones de pestanas', date: '2025-03-20', time: '11:00 AM', comments: 'Volumen ruso por favor', contactPref: 'email', status: 'en proceso', createdAt: '2025-03-08' }
  ];

  var DEFAULT_SUGGESTIONS = [
    { id: 'sug1', name: 'Cliente Anonima', email: '', type: 'servicio', message: 'Seria genial que ofrecieran servicio de cejas tambien.', date: '2025-02-10', status: 'nueva' },
    { id: 'sug2', name: 'Gabriela Lopez', email: 'gabi@email.com', type: 'pagina', message: 'La pagina se ve muy bonita, pero estaria bueno agregar galeria de videos.', date: '2025-02-15', status: 'revisada' }
  ];

  var DEFAULT_PAGE_CONTENT = {
    heroTitle: 'Peace and Love<br><em>Studio PR</em>',
    heroSubtitle: 'Belleza, cuidado y estilo en cada detalle',
    aboutTitle: 'Mas que un estudio,\nuna experiencia',
    aboutText: 'En Peace and Love Studio PR creemos que cada servicio es una experiencia de cuidado, belleza y confianza.',
    footerDesc: 'Estudio de unas y belleza en Barranquitas, Puerto Rico. Belleza, cuidado y amor en cada servicio.'
  };

  var DEFAULT_CONFIG = {
    name: 'Peace and Love Studio PR',
    phone: '787-228-4063',
    location: 'Barranquitas, Puerto Rico',
    email: '',
    instagram: 'https://www.instagram.com/peaceandlovestudiopr',
    facebook: 'https://www.facebook.com/share/1E9R9ckDog/',
    calendarEventDurationMinutes: 60,
    calendarWebhookUrl: '',
    calendarSecret: '',
    calendarId: 'primary',
    calendarTimezone: 'America/Puerto_Rico',
    lang: 'es',
    theme: 'light'
  };

  var chartInstances = {};
  var state = {
    editingAppointmentId: '',
    editingTestimonialId: '',
    editingServiceId: '',
    editingFAQId: '',
    editingGalleryId: '',
    editingReceiptId: '',
    adminCalDate: (function () { var d = new Date(); d.setDate(1); return d; })()
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function getData(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('localStorage error', error);
    }
    if (window.PalSupabaseSync) {
      window.PalSupabaseSync.queueSync(key, value);
    }
  }

  function normalizeAvailability(raw) {
    var source = raw && typeof raw === 'object' ? raw : {};
    return {
      weeklyHours: Array.isArray(source.weeklyHours) ? clone(source.weeklyHours) : clone(ALL_BUSINESS_HOURS),
      unavailableWeekdays: Array.isArray(source.unavailableWeekdays) ? source.unavailableWeekdays : clone(DEFAULT_AVAILABILITY.unavailableWeekdays),
      blockedDates: Array.isArray(source.blockedDates) ? source.blockedDates : [],
      blockedSlots: source.blockedSlots && typeof source.blockedSlots === 'object' ? source.blockedSlots : {},
      blockedRules: normalizeBlockedRules(source.blockedRules)
    };
  }

  function isSameSchedule(a, b) {
    return JSON.stringify(a || []) === JSON.stringify(b || []);
  }

  function normalizeHoursList(hours) {
    return Array.isArray(hours) ? clone(hours) : [];
  }

  function shouldMigrateSchedule(schedule) {
    return !Array.isArray(schedule) || schedule.length === 0 || isSameSchedule(schedule, LEGACY_DEFAULT_SCHEDULE) || isSameSchedule(schedule, PREVIOUS_DEFAULT_SCHEDULE);
  }

  function shouldMigrateAvailability(availability) {
    if (!availability || typeof availability !== 'object') return true;
    var weeklyHours = normalizeHoursList(availability.weeklyHours);
    var unavailableWeekdays = Array.isArray(availability.unavailableWeekdays) ? availability.unavailableWeekdays.slice().sort() : [];
    var rules = Array.isArray(availability.blockedRules) ? availability.blockedRules : [];
    var hasLegacyHours = JSON.stringify(weeklyHours) === JSON.stringify(LEGACY_BUSINESS_HOURS);
    var hasLegacyWeekdays = JSON.stringify(unavailableWeekdays) === JSON.stringify([0]);
    var hasCurrentWeekdays = JSON.stringify(unavailableWeekdays) === JSON.stringify([0, 2, 4]);
    var hasCurrentHours = JSON.stringify(weeklyHours) === JSON.stringify(ALL_BUSINESS_HOURS);

    if (!rules.length && hasLegacyHours && hasLegacyWeekdays) return true;
    if (!rules.length && hasCurrentHours && hasCurrentWeekdays) return true;
    if (!rules.length && weeklyHours.length === 0 && !hasCurrentWeekdays) return true;
    return false;
  }

  function getWeekdayLabel(index) {
    return ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][Number(index)] || '';
  }

  function getWeekdayNameByIndex(index) {
    return ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][Number(index)] || '';
  }

  function getWeekdayIndexByName(dayName) {
    return ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'].indexOf(String(dayName || '').toLowerCase());
  }

  function getDateWeekday(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]).getDay();
  }

  function parseAppointmentDateTime(dateStr, timeStr) {
    var dateParts;
    var timeMatch;
    var hours;
    var minutes;
    var meridiem;

    if (!dateStr || !timeStr) return null;
    dateParts = String(dateStr).split('-').map(Number);
    timeMatch = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch || dateParts.length !== 3) return null;

    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2]);
    meridiem = String(timeMatch[3] || '').toUpperCase();

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes, 0, 0);
  }

  function formatGoogleCalendarDate(date) {
    var year;
    var month;
    var day;
    var hours;
    var minutes;
    var seconds;

    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    year = String(date.getFullYear());
    month = String(date.getMonth() + 1).padStart(2, '0');
    day = String(date.getDate()).padStart(2, '0');
    hours = String(date.getHours()).padStart(2, '0');
    minutes = String(date.getMinutes()).padStart(2, '0');
    seconds = String(date.getSeconds()).padStart(2, '0');
    return year + month + day + 'T' + hours + minutes + seconds;
  }

  function getAppointmentDurationMinutes() {
    var config = getConfig();
    var value = Number(config && config.calendarEventDurationMinutes);
    return value > 0 ? value : 60;
  }

  function buildGoogleCalendarUrl(appointment) {
    var config = getConfig();
    var startDate = parseAppointmentDateTime(appointment.date, appointment.time);
    var endDate;
    var title;
    var details;
    var services = appointment.services && appointment.services.length ? appointment.services.join(', ') : appointment.service;
    var params;

    if (!startDate) return '';
    endDate = new Date(startDate.getTime() + (getAppointmentDurationMinutes() * 60 * 1000));
    title = 'Cita: ' + (appointment.name || 'Clienta') + ' - ' + (services || 'Servicio');
    details = [
      'Clienta: ' + (appointment.name || ''),
      'Servicio: ' + (services || ''),
      'Telefono: ' + (appointment.phone || ''),
      'Email: ' + (appointment.email || ''),
      'Preferencia de contacto: ' + (appointment.contactPref || ''),
      'Comentarios: ' + (appointment.comments || 'Sin comentarios')
    ].join('\n');

    params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: formatGoogleCalendarDate(startDate) + '/' + formatGoogleCalendarDate(endDate),
      details: details,
      location: config && config.location ? config.location : 'Barranquitas, Puerto Rico'
    });

    return 'https://calendar.google.com/calendar/render?' + params.toString();
  }

  function maybeOpenGoogleCalendarForApprovedAppointment(appointment, previousItem, popupRef) {
    var url;
    var wasApproved;

    if (!appointment || appointment.status !== 'aprobada') return false;
    wasApproved = previousItem && previousItem.status === 'aprobada';
    if (wasApproved) return false;

    url = buildGoogleCalendarUrl(appointment);
    if (!url) {
      showToast('La cita fue aprobada, pero faltan fecha u hora validas para Google Calendar.', 'error');
      return false;
    }

    if (popupRef && !popupRef.closed) {
      popupRef.location.href = url;
      return true;
    }

    window.open(url, '_blank', 'noopener');
    return true;
  }

  function openAppointmentInGoogleCalendar(id) {
    var appointment = getAppointments().find(function (item) { return item.id === id; });
    var url;
    if (!appointment) return;
    url = buildGoogleCalendarUrl(appointment);
    if (!url) {
      showToast('Esta cita aun no tiene una fecha u hora valida para Google Calendar.', 'error');
      return;
    }
    window.open(url, '_blank', 'noopener');
  }

  function getAppointmentCalendarPayload(appointment) {
    var config = getConfig();
    var startDate = parseAppointmentDateTime(appointment.date, appointment.time);
    var endDate;
    var services = appointment.services && appointment.services.length
      ? appointment.services.join(', ')
      : appointment.service;

    if (!startDate) return null;

    endDate = new Date(startDate.getTime() + (getAppointmentDurationMinutes() * 60 * 1000));

    return {
      secret: config.calendarSecret || 'peace-love-calendar-2026',
      calendarId: config.calendarId || 'primary',
      timezone: config.calendarTimezone || 'America/Puerto_Rico',
      appointmentId: appointment.id || '',
      title: 'Cita: ' + (appointment.name || 'Clienta') + ' - ' + (services || 'Servicio'),
      description: [
        'Clienta: ' + (appointment.name || ''),
        'Servicio: ' + (services || ''),
        'Telefono: ' + (appointment.phone || ''),
        'Email: ' + (appointment.email || ''),
        'Preferencia de contacto: ' + (appointment.contactPref || ''),
        'Comentarios: ' + (appointment.comments || 'Sin comentarios')
      ].join('\n'),
      location: config.location || 'Barranquitas, Puerto Rico',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      customer: {
        name: appointment.name || '',
        phone: appointment.phone || '',
        email: appointment.email || ''
      },
      service: services || '',
      status: appointment.status || 'aprobada'
    };
  }

  function buildCalendarWebhookUrl(url, payload) {
    var separator = url.indexOf('?') === -1 ? '?' : '&';
    return url + separator +
      'payload=' + encodeURIComponent(JSON.stringify(payload)) +
      '&t=' + Date.now();
  }

  function postToGoogleCalendarWebhook(url, payload) {
    if (!url) return Promise.resolve(false);

    if (url.indexOf('script.googleusercontent.com') !== -1) {
      console.error('URL incorrecta: no pegues la URL de script.googleusercontent.com. Usa la URL de Apps Script que empieza con https://script.google.com/macros/s/ y termina en /exec');
      return Promise.resolve(false);
    }

    if (url.indexOf('https://script.google.com/macros/s/') !== 0 || url.indexOf('/exec') === -1) {
      console.warn('La URL del webhook no parece ser la URL /exec correcta de Apps Script:', url);
    }

    var finalUrl = buildCalendarWebhookUrl(url, payload);

    return fetch(finalUrl, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store'
    })
      .then(function () {
        console.log('Solicitud GET enviada al webhook de Google Calendar.');
        return true;
      })
      .catch(function (error) {
        console.error('Google Calendar webhook error:', error);
        return false;
      });
  }

  async function syncAppointmentToGoogleCalendar(appointment) {
    var config = getConfig();
    var payload;
    var sent;

    if (!config.calendarWebhookUrl) {
      return { ok: false, reason: 'missing_webhook' };
    }

    payload = getAppointmentCalendarPayload(appointment);

    if (!payload) {
      return { ok: false, reason: 'invalid_datetime' };
    }

    try {
      sent = await postToGoogleCalendarWebhook(config.calendarWebhookUrl, payload);

      if (!sent) {
        return { ok: false, reason: 'network_error' };
      }

      return {
        ok: true,
        eventId: '',
        eventUrl: ''
      };

    } catch (error) {
      console.error('Calendar sync error:', error);

      return {
        ok: false,
        reason: 'network_error',
        error: error && error.message ? error.message : String(error)
      };
    }
  }

  function testCalendarWebhook() {
    var cfg = getConfig();
    var url = cfg.calendarWebhookUrl || '';
    var secret = cfg.calendarSecret || 'peace-love-calendar-2026';

    console.log('testCalendarWebhook start', {
      url: url,
      secretPresent: !!secret
    });

    if (!url) {
      showToast('Webhook no configurado. Ve a Ajustes y añade la URL del Apps Script.', 'error');
      return;
    }

    if (!secret) {
      showToast('Secreto compartido vacío. Añade el secreto en Ajustes.', 'error');
      return;
    }

    var start = new Date(Date.now() + 5 * 60 * 1000);
    var end = new Date(start.getTime() + (Number(cfg.calendarEventDurationMinutes || 60) * 60000));

    var payload = {
      secret: secret,
      title: 'Prueba: evento desde panel admin',
      description: 'Evento de prueba generado para verificar webhook y secret.',
      start: start.toISOString(),
      end: end.toISOString(),
      calendarId: cfg.calendarId || 'primary',
      timezone: cfg.calendarTimezone || 'America/Puerto_Rico',
      location: cfg.location || 'Barranquitas, Puerto Rico'
    };

    postToGoogleCalendarWebhook(url, payload).then(function (ok) {
      if (ok) {
        showToast('Payload de prueba enviado. Revisa Google Calendar y Apps Script > Ejecuciones.', 'success');
      } else {
        showToast('No se pudo enviar. Revisa que la URL empiece con script.google.com/macros/s/ y termine en /exec.', 'error');
      }
    });
  }

  async function handleApprovedAppointmentCalendarSync(appointment, previousItem) {
    var syncResult;

    if (!appointment || appointment.status !== 'aprobada') return;
    if (previousItem && previousItem.status === 'aprobada') return;

    syncResult = await syncAppointmentToGoogleCalendar(appointment);

    if (syncResult.ok) {
      appointment.calendarSynced = true;
      appointment.calendarEventId = syncResult.eventId || appointment.calendarEventId || '';
      appointment.calendarSyncedAt = new Date().toISOString();
      showToast('Cita aprobada y enviada automaticamente a Google Calendar.', 'success');
      return;
    }

    appointment.calendarSynced = false;
    appointment.calendarEventId = '';
    appointment.calendarSyncedAt = '';

    if (syncResult.reason === 'missing_webhook') {
      showToast('La cita fue aprobada, pero falta configurar el webhook de Google Calendar.', 'info');
    } else if (syncResult.reason === 'network_error') {
      showToast('La cita fue aprobada, pero no se pudo conectar con Google Calendar. Revisa la URL del webhook.', 'error');
    } else if (syncResult.reason === 'invalid_datetime') {
      showToast('La cita fue aprobada, pero la fecha u hora no son validas para Calendar.', 'error');
    } else {
      showToast('La cita fue aprobada, pero no se pudo enviar automaticamente a Google Calendar.', 'error');
    }
  }

  function normalizeBlockedRule(rule) {
    var source = rule && typeof rule === 'object' ? rule : {};
    var day = source.day ? String(source.day).toLowerCase() : '';
    var date = source.date || '';
    var time = source.time || source.hour || '';
    var type = source.type || '';

    if (!day && source.weekday !== '' && source.weekday !== null && source.weekday !== undefined) {
      day = getWeekdayNameByIndex(source.weekday);
    }
    if (!day && date) {
      day = getWeekdayNameByIndex(getDateWeekday(date));
    }

    if (!type) {
      if (date && time) type = 'date-time';
      else if (date) type = 'date-full';
      else if (day && time) type = 'day-time';
      else if (day) type = 'day-full';
    }

    return {
      id: source.id || uid('rule'),
      day: day,
      date: date,
      time: time,
      type: type,
      source: source.source || '',
      appointmentId: source.appointmentId || ''
    };
  }

  function normalizeBlockedRules(rules) {
    return Array.isArray(rules) ? rules.map(normalizeBlockedRule).filter(function (rule) { return rule.type; }) : [];
  }

  function isTimeBlocked(selectedDate, selectedDay, selectedTime, blocks) {
    return (blocks || []).some(function (block) {
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

  function isDateBlockedByRule(dateStr, availability) {
    var dayName = getWeekdayNameByIndex(getDateWeekday(dateStr));
    return isTimeBlocked(dateStr, dayName, '', availability.blockedRules || []);
  }

  function isTimeBlockedByRule(dateStr, hour, availability) {
    var dayName = getWeekdayNameByIndex(getDateWeekday(dateStr));
    return isTimeBlocked(dateStr, dayName, hour, availability.blockedRules || []);
  }

  function migrateAvailabilityRules(rawAvailability) {
    var availability = normalizeAvailability(rawAvailability);
    var rules = normalizeBlockedRules(availability.blockedRules);

    availability.unavailableWeekdays.forEach(function (weekday) {
      rules.push({
        id: uid('rule'),
        day: getWeekdayNameByIndex(weekday),
        date: '',
        time: '',
        type: 'day-full'
      });
    });

    availability.blockedDates.forEach(function (date) {
      rules.push({
        id: uid('rule'),
        day: getWeekdayNameByIndex(getDateWeekday(date)),
        date: date,
        time: '',
        type: 'date-full'
      });
    });

    Object.keys(availability.blockedSlots || {}).forEach(function (date) {
      (availability.blockedSlots[date] || []).forEach(function (hour) {
        rules.push({
          id: uid('rule'),
          day: getWeekdayNameByIndex(getDateWeekday(date)),
          date: date,
          time: hour,
          type: 'date-time'
        });
      });
    });

    availability.blockedRules = rules;
    availability.unavailableWeekdays = [];
    availability.blockedDates = [];
    availability.blockedSlots = {};
    return availability;
  }

  function uid(prefix) {
    return prefix + Date.now() + Math.floor(Math.random() * 1000);
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function normalizeAppointmentStatus(status) {
    if (status === 'realizada') return 'aprobada';
    if (status === 'cancelada') return 'rechazada';
    return status || 'pendiente';
  }

  function normalizeServiceItem(service, fallbackPrice) {
    var source = service && typeof service === 'object' ? clone(service) : {};
    source.price = Number(source.price != null ? source.price : fallbackPrice) || 0;
    return source;
  }

  function normalizeServices(items) {
    var fallbackMap = {};
    var incoming = Array.isArray(items) ? items : [];
    var normalizedMap = {};
    var normalized = [];
    var indexById = {};

    DEFAULT_SERVICES.forEach(function (service) {
      fallbackMap[service.id] = service.price;
    });

    incoming.forEach(function (service) {
      var normalizedService = normalizeServiceItem(service, 0);
      if (!normalizedService || !normalizedService.id) return;
      normalizedMap[normalizedService.id] = normalizedService;
    });

    DEFAULT_SERVICES.forEach(function (service) {
      if (!normalizedMap[service.id]) {
        normalizedMap[service.id] = clone(service);
        return;
      }

      normalizedMap[service.id] = normalizeServiceItem(normalizedMap[service.id], fallbackMap[service.id] || 0);
      normalizedMap[service.id].category = normalizedMap[service.id].category || service.category;
      normalizedMap[service.id].icon = normalizedMap[service.id].icon || service.icon;
      normalizedMap[service.id].name = normalizedMap[service.id].name || service.name;
      normalizedMap[service.id].nameEn = normalizedMap[service.id].nameEn || service.nameEn;
      normalizedMap[service.id].active = normalizedMap[service.id].active !== false;
      normalizedMap[service.id].description = normalizedMap[service.id].description || service.description;
      normalizedMap[service.id].descriptionEn = normalizedMap[service.id].descriptionEn || service.descriptionEn;
    });

    Object.keys(normalizedMap).forEach(function (id) {
      normalized.push(normalizedMap[id]);
    });

    normalized.forEach(function (service, index) {
      indexById[service.id] = index;
    });

    normalized.sort(function (a, b) {
      var aIndex = indexById[a.id];
      var bIndex = indexById[b.id];
      var aDefault = DEFAULT_SERVICES.findIndex(function (item) { return item.id === a.id; });
      var bDefault = DEFAULT_SERVICES.findIndex(function (item) { return item.id === b.id; });
      var aOrder = aDefault === -1 ? 9999 + aIndex : aDefault;
      var bOrder = bDefault === -1 ? 9999 + bIndex : bDefault;
      return aOrder - bOrder;
    });

    return normalized.length ? normalized : clone(DEFAULT_SERVICES);
  }

  function normalizeAppointments(items) {
    return Array.isArray(items) ? items.map(function (item) {
      var copy = clone(item);
      copy.status = normalizeAppointmentStatus(copy.status);
      copy.calendarSynced = copy.calendarSynced === true;
      copy.calendarEventId = copy.calendarEventId || '';
      copy.calendarSyncedAt = copy.calendarSyncedAt || '';
      return copy;
    }) : [];
  }

  function normalizeConfig(raw) {
    var source = raw && typeof raw === 'object' ? raw : {};
    var config = clone(DEFAULT_CONFIG);
    Object.keys(config).forEach(function (key) {
      if (source[key] !== undefined && source[key] !== null) config[key] = source[key];
    });
    config.calendarEventDurationMinutes = Number(config.calendarEventDurationMinutes) > 0 ? Number(config.calendarEventDurationMinutes) : DEFAULT_CONFIG.calendarEventDurationMinutes;
    return config;
  }

  function ensureDemoData() {
    if (!getData('pal_init', false)) {
      setData('pal_services', clone(DEFAULT_SERVICES));
      setData('pal_faqs', clone(DEFAULT_FAQS));
      setData('pal_schedule', clone(DEFAULT_SCHEDULE));
      setData('pal_availability', clone(DEFAULT_AVAILABILITY));
      setData('pal_gallery', clone(DEFAULT_GALLERY));
      setData('pal_testimonials', clone(DEFAULT_TESTIMONIALS));
      setData('pal_appointments', clone(DEFAULT_APPOINTMENTS));
      setData('pal_suggestions', clone(DEFAULT_SUGGESTIONS));
      setData('pal_page_content', clone(DEFAULT_PAGE_CONTENT));
      setData('pal_config', clone(DEFAULT_CONFIG));
      setData('pal_init', true);
    }

    // Ensure any new default services/faqs are merged into existing storage
    mergeDefaultsInto('pal_services', clone(DEFAULT_SERVICES));
    mergeDefaultsInto('pal_faqs', clone(DEFAULT_FAQS));
    if (shouldMigrateSchedule(getData('pal_schedule', clone(DEFAULT_SCHEDULE)))) {
      setSchedule(clone(DEFAULT_SCHEDULE));
    }
    if (shouldMigrateAvailability(getData('pal_availability', clone(DEFAULT_AVAILABILITY)))) {
      setAvailability(clone(DEFAULT_AVAILABILITY));
    }
    setAvailability(migrateAvailabilityRules(getData('pal_availability', clone(DEFAULT_AVAILABILITY))));
    setServices(normalizeServices(getData('pal_services', clone(DEFAULT_SERVICES))));
    setAppointments(normalizeAppointments(getData('pal_appointments', clone(DEFAULT_APPOINTMENTS))));

    if (!Array.isArray(getData('pal_clients', null))) {
      rebuildClients();
    }

    syncAllAppointmentBlockedSlots();
  }

  // Merge default items into existing localStorage collection by `id` (non-destructive)
  function mergeDefaultsInto(key, defaults) {
    var existing = getData(key, null);
    if (!Array.isArray(defaults)) return;
    if (!Array.isArray(existing)) { setData(key, defaults); return; }
    var map = {};
    existing.forEach(function (item) { if (item && item.id) map[item.id] = item; });
    var changed = false;
    defaults.forEach(function (d) {
      if (!d || !d.id) return;
      if (!map[d.id]) { existing.push(d); changed = true; }
    });
    if (changed) setData(key, existing);
  }

  function getServices() { return normalizeServices(getData('pal_services', clone(DEFAULT_SERVICES))); }
  function getFAQs() { return getData('pal_faqs', clone(DEFAULT_FAQS)); }
  function getSchedule() { return getData('pal_schedule', clone(DEFAULT_SCHEDULE)); }
  function getAvailability() { return normalizeAvailability(getData('pal_availability', clone(DEFAULT_AVAILABILITY))); }
  function getGallery() { return getData('pal_gallery', clone(DEFAULT_GALLERY)); }
  function getTestimonials() { return getData('pal_testimonials', clone(DEFAULT_TESTIMONIALS)); }
  function getAppointments() { return normalizeAppointments(getData('pal_appointments', clone(DEFAULT_APPOINTMENTS))); }
  function getSuggestions() { return getData('pal_suggestions', clone(DEFAULT_SUGGESTIONS)); }
  function getPageContent() { return getData('pal_page_content', clone(DEFAULT_PAGE_CONTENT)); }
  function getConfig() { return normalizeConfig(getData('pal_config', clone(DEFAULT_CONFIG))); }
  function getClients() { return getData('pal_clients', []); }
  function getReceipts() { return getData('pal_receipts', []); }

  function setServices(value) { setData('pal_services', value); }
  function setFAQs(value) { setData('pal_faqs', value); }
  function setSchedule(value) { setData('pal_schedule', value); }
  function setAvailability(value) { setData('pal_availability', value); }
  function setGallery(value) { setData('pal_gallery', value); }
  function setTestimonials(value) { setData('pal_testimonials', value); }
  function setAppointments(value) { setData('pal_appointments', value); }
  function setSuggestions(value) { setData('pal_suggestions', value); }
  function setPageContent(value) { setData('pal_page_content', value); }
  function setConfig(value) { setData('pal_config', normalizeConfig(value)); }
  function setClients(value) { setData('pal_clients', value); }
  function setReceipts(value) { setData('pal_receipts', value); }

  function getClientLookupKey(item) {
    return String((item && (item.email || item.phone || item.name)) || '').toLowerCase();
  }

  function rebuildClients() {
    var appointments = getAppointments();
    var existingClients = getClients();
    var map = {};
    var existingMap = {};

    existingClients.forEach(function (client) {
      existingMap[getClientLookupKey(client)] = client;
    });

    appointments.forEach(function (appt) {
      var key = appt.email || appt.phone || appt.name;
      if (!map[key]) {
        var existing = existingMap[String(key || '').toLowerCase()] || {};
        map[key] = {
          id: existing.id || uid('c'),
          name: appt.name,
          phone: appt.phone,
          email: appt.email,
          appointments: 0,
          services: [],
          lastAppt: appt.date,
          notes: existing.notes || ''
        };
      }
      map[key].appointments += 1;
      parseServiceList(appt.services && appt.services.length ? appt.services : appt.service).forEach(function (service) {
        if (map[key].services.indexOf(service) === -1) map[key].services.push(service);
      });
      if (!map[key].lastAppt || appt.date > map[key].lastAppt) map[key].lastAppt = appt.date;
    });
    setClients(Object.keys(map).map(function (key) { return map[key]; }));
  }

  function appointmentBlocksSlot(status) {
    return status === 'en proceso' || status === 'realizada' || status === 'aprobada';
  }

  function syncAppointmentBlockedSlot(appointment, previousAppointment) {
    var availability = getAvailability();
    var currentId = appointment && appointment.id ? appointment.id : '';
    var previousId = previousAppointment && previousAppointment.id ? previousAppointment.id : '';

    availability.blockedRules = normalizeBlockedRules(availability.blockedRules).filter(function (rule) {
      return !(rule.source === 'appointment' && rule.appointmentId && (rule.appointmentId === currentId || rule.appointmentId === previousId));
    });

    if (appointment && appointmentBlocksSlot(appointment.status) && appointment.date && appointment.time) {
      availability.blockedRules.push({
        id: uid('rule'),
        day: getWeekdayNameByIndex(getDateWeekday(appointment.date)),
        date: appointment.date,
        time: appointment.time,
        type: 'date-time',
        source: 'appointment',
        appointmentId: appointment.id
      });
    }

    setAvailability(availability);
  }

  function syncAllAppointmentBlockedSlots() {
    var availability = getAvailability();

    availability.blockedRules = normalizeBlockedRules(availability.blockedRules).filter(function (rule) {
      return rule.source !== 'appointment';
    });

    getAppointments().forEach(function (appointment) {
      if (!appointmentBlocksSlot(appointment.status) || !appointment.date || !appointment.time) return;
      availability.blockedRules.push({
        id: uid('rule'),
        day: getWeekdayNameByIndex(getDateWeekday(appointment.date)),
        date: appointment.date,
        time: appointment.time,
        type: 'date-time',
        source: 'appointment',
        appointmentId: appointment.id
      });
    });

    setAvailability(availability);
  }

  function showToast(message, type) {
    var container = document.getElementById('admin-toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    toast.textContent = message;
    if (!container) {
      alert(message);
      return;
    }
    container.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2800);
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'flex';
  }

  function closeModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'none';
  }

  function statusBadge(status) {
    var label = escapeHtml(status);
    return '<span class="badge ' + label.replace(/\s+/g, '-') + '">' + label + '</span>';
  }

  function parseServiceList(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value || '').split(',').map(function (entry) { return entry.trim(); }).filter(Boolean);
  }

  function getDateRangeValues() {
    var startInput = document.getElementById('report-start');
    var endInput = document.getElementById('report-end');
    return {
      start: startInput ? startInput.value : '',
      end: endInput ? endInput.value : ''
    };
  }

  function setReportRange(type) {
    var startInput = document.getElementById('report-start');
    var endInput = document.getElementById('report-end');
    var today = new Date();
    var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!startInput || !endInput) return;

    if (type === 'week') {
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    } else {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    startInput.value = startDate.toISOString().split('T')[0];
    endInput.value = endDate.toISOString().split('T')[0];
    renderReportPanel();
  }

  function isWithinRange(dateStr, startStr, endStr) {
    var date;
    var start;
    var end;
    if (!dateStr) return false;
    date = new Date(dateStr + 'T00:00:00');
    if (startStr) {
      start = new Date(startStr + 'T00:00:00');
      if (date < start) return false;
    }
    if (endStr) {
      end = new Date(endStr + 'T00:00:00');
      if (date > end) return false;
    }
    return true;
  }

  function renderReportPanel() {
    var statsGrid = document.getElementById('report-stats-grid');
    var ranking = document.getElementById('report-service-ranking');
    var income = document.getElementById('report-income-breakdown');
    var range = getDateRangeValues();
    var appointments = getAppointments().filter(function (item) { return isWithinRange(item.date, range.start, range.end); });
    var receipts = getReceipts().filter(function (item) { return isWithinRange(item.date, range.start, range.end); });
    var approvedAppointments = appointments.filter(function (item) { return item.status === 'aprobada'; });
    var revenue = receipts.reduce(function (acc, item) { return acc + Number(item.total || 0); }, 0);
    var rankingMap = {};
    var paymentMap = {};
    var topServicesSource = receipts.length ? receipts : approvedAppointments;

    topServicesSource.forEach(function (item) {
      parseServiceList(item.service).forEach(function (service) {
        rankingMap[service] = (rankingMap[service] || 0) + 1;
      });
      if (item.payment) paymentMap[item.payment] = (paymentMap[item.payment] || 0) + Number(item.total || 0);
    });

    if (statsGrid) {
      statsGrid.innerHTML = [
        { label: 'Citas en rango', value: appointments.length },
        { label: 'Aprobadas', value: approvedAppointments.length },
        { label: 'Ingresos', value: '$' + revenue.toFixed(2) },
        { label: 'Ticket promedio', value: '$' + (receipts.length ? (revenue / receipts.length).toFixed(2) : '0.00') }
      ].map(function (item) {
        return '<div class="kpi-chip"><strong>' + escapeHtml(item.value) + '</strong><span>' + escapeHtml(item.label) + '</span></div>';
      }).join('');
    }

    if (ranking) {
      ranking.innerHTML = Object.keys(rankingMap).sort(function (a, b) {
        return rankingMap[b] - rankingMap[a];
      }).slice(0, 8).map(function (service) {
        return '<div class="compact-row"><div><strong>' + escapeHtml(service) + '</strong><span>Ventas/atenciones registradas</span></div><div class="status-value">' + escapeHtml(rankingMap[service]) + '</div></div>';
      }).join('') || '<div class="empty-admin-state">No hay datos en ese rango.</div>';
    }

    if (income) {
      income.innerHTML = Object.keys(paymentMap).map(function (payment) {
        return '<div class="compact-row"><div><strong>' + escapeHtml(payment) + '</strong><span>Ingresos acumulados</span></div><div class="status-value">$' + escapeHtml(paymentMap[payment].toFixed(2)) + '</div></div>';
      }).join('') || '<div class="compact-row"><div><strong>Total</strong><span>Ingresos del rango</span></div><div class="status-value">$' + escapeHtml(revenue.toFixed(2)) + '</div></div>';
    }
  }

  function safeEnsureDemoData() {
    try {
      ensureDemoData();
      return true;
    } catch (error) {
      console.error('Admin boot data error:', error);
      return false;
    }
  }

  function applyReportRange() {
    renderReportPanel();
  }

  function renderDashboard() {
    var appointments = getAppointments();
    var testimonials = getTestimonials();
    var suggestions = getSuggestions();
    var clients = getClients();
    var receipts = getReceipts();
    var services = getServices();
    var statsGrid = document.getElementById('stats-grid');
    var recentAppointments = document.getElementById('recent-appointments');
    var recentTestimonials = document.getElementById('recent-testimonials');
    var dashboardKpis = document.getElementById('dashboard-kpis');
    var dashboardStatus = document.getElementById('dashboard-status-breakdown');
    var dashboardUpcoming = document.getElementById('dashboard-upcoming');
    var dashboardTopServices = document.getElementById('dashboard-top-services');
    var dashboardActivity = document.getElementById('dashboard-activity');
    var reportStart = document.getElementById('report-start');
    var reportEnd = document.getElementById('report-end');
    var pendingCount = appointments.filter(function (item) { return item.status === 'pendiente'; }).length;
    var inProgressCount = appointments.filter(function (item) { return item.status === 'en proceso'; }).length;
    var approvedApptCount = appointments.filter(function (item) { return item.status === 'aprobada'; }).length;
    var rejectedApptCount = appointments.filter(function (item) { return item.status === 'rechazada'; }).length;
    var approvedCount = testimonials.filter(function (item) { return item.status === 'aprobado'; }).length;
    var sugCount = suggestions.filter(function (item) { return item.status === 'nueva'; }).length;
    var activeServicesCount = services.filter(function (item) { return item.active; }).length;
    var revenue = receipts.reduce(function (acc, item) {
      return acc + Number(item.total || 0);
    }, 0);
    var avgTicket = receipts.length ? revenue / receipts.length : 0;
    var conversionRate = appointments.length ? Math.round((approvedApptCount / appointments.length) * 100) : 0;
    var uniqueServicesRequested = {};
    var serviceCounts = {};
    var today = new Date();
    var upcomingAppointments;
    var monthStart;
    var monthEnd;
    var monthAppointments;
    var monthRevenue;
    var activityFeed;

    appointments.forEach(function (item) {
      parseServiceList(item.services && item.services.length ? item.services : item.service).forEach(function (service) {
        uniqueServicesRequested[service] = true;
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      });
    });

    upcomingAppointments = appointments.filter(function (item) {
      if (!item.date) return false;
      return new Date(item.date + 'T00:00:00') >= new Date(today.getFullYear(), today.getMonth(), today.getDate()) && item.status !== 'rechazada';
    }).sort(function (a, b) {
      var aKey = String(a.date || '') + ' ' + String(a.time || '');
      var bKey = String(b.date || '') + ' ' + String(b.time || '');
      return aKey.localeCompare(bKey);
    });

    monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthAppointments = appointments.filter(function (item) {
      var dateObj;
      if (!item.date) return false;
      dateObj = new Date(item.date + 'T00:00:00');
      return dateObj >= monthStart && dateObj <= monthEnd;
    });
    monthRevenue = receipts.filter(function (item) {
      var dateObj;
      if (!item.date) return false;
      dateObj = new Date(item.date + 'T00:00:00');
      return dateObj >= monthStart && dateObj <= monthEnd;
    }).reduce(function (acc, item) {
      return acc + Number(item.total || 0);
    }, 0);

    activityFeed = []
      .concat(appointments.map(function (item) {
        return {
          type: 'cita',
          date: item.createdAt || item.date || '',
          title: item.name || 'Sin nombre',
          meta: (item.service || 'Servicio') + ' - ' + (item.status || 'pendiente')
        };
      }))
      .concat(testimonials.map(function (item) {
        return {
          type: 'testimonio',
          date: item.date || '',
          title: item.name || 'Testimonio',
          meta: (item.service || 'Servicio') + ' - ' + (item.status || 'pendiente')
        };
      }))
      .concat(suggestions.map(function (item) {
        return {
          type: 'sugerencia',
          date: item.date || '',
          title: item.name || 'Sugerencia',
          meta: (item.type || 'general') + ' - ' + (item.status || 'nueva')
        };
      }))
      .sort(function (a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      })
      .slice(0, 6);

    if (reportStart && reportEnd && !reportStart.value && !reportEnd.value) {
      reportStart.value = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      reportEnd.value = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    }

    if (document.getElementById('badge-appointments')) {
      document.getElementById('badge-appointments').textContent = pendingCount;
    }
    if (document.getElementById('badge-sug')) {
      document.getElementById('badge-sug').textContent = sugCount;
    }

    if (statsGrid) {
      // Calcular puntos de fidelidad (1 punto por dólar, puedes ajustar)
      var pointsPerDollar = 1;
      var points = Math.floor(revenue * pointsPerDollar);

      var statItems = [
        { label: 'Citas Totales', value: appointments.length, icon: 'fa-calendar-check', subtext: upcomingAppointments.length + ' proximas en agenda' },
        { label: 'Pendientes', value: pendingCount, icon: 'fa-hourglass-half', subtext: inProgressCount + ' en proceso' },
        { label: 'Clientas', value: clients.length, icon: 'fa-users', subtext: monthAppointments.length + ' citas este mes' },
        { label: 'Testimonios Aprobados', value: approvedCount, icon: 'fa-star', subtext: testimonials.length + ' recibidos' },
        { label: 'Servicios Activos', value: activeServicesCount, icon: 'fa-hand-sparkles', subtext: Object.keys(uniqueServicesRequested).length + ' solicitados' },
        { label: 'Ingresos', value: '$' + revenue.toFixed(2), icon: 'fa-sack-dollar', subtext: '$' + monthRevenue.toFixed(2) + ' este mes' },
        { label: 'Puntos', value: points, icon: 'fa-gift', subtext: 'Puntos acumulados por ventas' },
        { label: 'Tasa de Aprobacion', value: conversionRate + '%', icon: 'fa-chart-line', subtext: approvedApptCount + ' citas aprobadas' },
        { label: 'Ticket Promedio', value: '$' + avgTicket.toFixed(2), icon: 'fa-receipt', subtext: receipts.length + ' recibos emitidos' }
      ];

      var colorClasses = ['color-1','color-2','color-3','color-4','color-5','color-6','color-7','color-8','color-9'];

      statsGrid.innerHTML = statItems.map(function (item, idx) {
        var colorClass = colorClasses[idx % colorClasses.length];
        return '<div class="stat-card ' + colorClass + '"><div class="stat-card-top"><span class="stat-icon"><i class="fas ' + item.icon + '"></i></span><span class="stat-label">' + escapeHtml(item.label) + '</span></div><div class="stat-value">' + escapeHtml(item.value) + '</div><div class="stat-subtext">' + escapeHtml(item.subtext || '') + '</div></div>';
      }).join('');
    }

    if (dashboardKpis) {
      dashboardKpis.innerHTML = [
        { value: monthAppointments.length, label: 'Citas del mes' },
        { value: approvedApptCount + inProgressCount, label: 'Citas activas' },
        { value: sugCount, label: 'Sugerencias nuevas' },
        { value: rejectedApptCount, label: 'Citas rechazadas' },
        { value: services.filter(function (item) { return !item.active; }).length, label: 'Servicios ocultos' },
        { value: Object.keys(uniqueServicesRequested).length, label: 'Servicios con demanda' }
      ].map(function (item) {
        return '<div class="kpi-chip"><strong>' + escapeHtml(item.value) + '</strong><span>' + escapeHtml(item.label) + '</span></div>';
      }).join('');
    }

    if (dashboardStatus) {
      dashboardStatus.innerHTML = [
        { label: 'Pendientes', value: pendingCount, className: 'pending' },
        { label: 'En proceso', value: inProgressCount, className: 'progress' },
        { label: 'Aprobadas', value: approvedApptCount, className: 'approved' },
        { label: 'Rechazadas', value: rejectedApptCount, className: 'rejected' }
      ].map(function (item) {
        return '<div class="status-row ' + item.className + '"><div><strong>' + escapeHtml(item.label) + '</strong><span>Estado actual del flujo</span></div><div class="status-value">' + escapeHtml(item.value) + '</div></div>';
      }).join('');
    }

    if (dashboardUpcoming) {
      dashboardUpcoming.innerHTML = upcomingAppointments.slice(0, 5).map(function (item) {
        return '<div class="compact-row"><div><strong>' + escapeHtml(item.name) + '</strong><span>' + escapeHtml(item.date) + ' - ' + escapeHtml(item.time) + '</span></div><div>' + statusBadge(item.status) + '</div></div>';
      }).join('') || '<div class="empty-admin-state">No hay citas proximas.</div>';
    }

    if (dashboardTopServices) {
      dashboardTopServices.innerHTML = Object.keys(serviceCounts).sort(function (a, b) {
        return serviceCounts[b] - serviceCounts[a];
      }).slice(0, 5).map(function (service) {
        var percent = appointments.length ? Math.round((serviceCounts[service] / appointments.length) * 100) : 0;
        return '<div class="compact-row"><div><strong>' + escapeHtml(service) + '</strong><span>' + percent + '% de las citas</span></div><div class="status-value">' + escapeHtml(serviceCounts[service]) + '</div></div>';
      }).join('') || '<div class="empty-admin-state">Aun no hay servicios solicitados.</div>';
    }

    if (dashboardActivity) {
      dashboardActivity.innerHTML = activityFeed.map(function (item) {
        return '<div class="compact-row"><div><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.type + ' - ' + item.date) + '</span></div><div><span>' + escapeHtml(item.meta) + '</span></div></div>';
      }).join('') || '<div class="empty-admin-state">No hay actividad reciente.</div>';
    }

    if (recentAppointments) {
      recentAppointments.innerHTML = appointments.slice().sort(function (a, b) {
        return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
      }).slice(0, 5).map(function (item) {
        return '<div class="list-row"><div><strong>' + escapeHtml(item.name) + '</strong><p>' + escapeHtml(item.service) + '</p></div><div class="list-meta"><span>' + escapeHtml(item.date) + '</span><span>' + escapeHtml(item.time) + '</span></div></div>';
      }).join('') || '<div class="empty-admin-state">No hay citas registradas.</div>';
    }

    if (recentTestimonials) {
      recentTestimonials.innerHTML = testimonials.slice().sort(function (a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      }).slice(0, 4).map(function (item) {
        return '<div class="list-row"><div><strong>' + escapeHtml(item.name) + '</strong><p>' + escapeHtml(item.comment) + '</p></div><div class="list-meta"><span>' + escapeHtml(item.service) + '</span><span>' + escapeHtml(item.status) + '</span></div></div>';
      }).join('') || '<div class="empty-admin-state">No hay testimonios.</div>';
    }

    renderReportPanel();
    renderCharts();
  }

  function renderCharts() {
    if (typeof Chart === 'undefined') return;

    var appointments = getAppointments();
    var serviceCounts = {};
    var statusCounts = {};
    var dateCounts = {};
    var hourCounts = {};
    var dateOrder;

    appointments.forEach(function (item) {
      parseServiceList(item.services && item.services.length ? item.services : item.service).forEach(function (service) {
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      });
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
      dateCounts[item.date] = (dateCounts[item.date] || 0) + 1;
      hourCounts[item.time] = (hourCounts[item.time] || 0) + 1;
    });

    dateOrder = Object.keys(dateCounts).sort();

    createChart('chart-services', 'bar', Object.keys(serviceCounts), Object.keys(serviceCounts).map(function (key) { return serviceCounts[key]; }), ['#9f5a69']);
    createChart('chart-status', 'doughnut', Object.keys(statusCounts), Object.keys(statusCounts).map(function (key) { return statusCounts[key]; }), ['#9f5a69', '#d8b48b', '#2e8d63', '#b35b67']);
    createChart('chart-timeline', 'line', dateOrder, dateOrder.map(function (key) { return dateCounts[key]; }), ['#7f4350']);
    createChart('chart-hours', 'bar', Object.keys(hourCounts), Object.keys(hourCounts).map(function (key) { return hourCounts[key]; }), ['#c58aa0']);
  }

  function createChart(id, type, labels, data, colors) {
    var canvas = document.getElementById(id);
    if (!canvas || typeof Chart === 'undefined') return;
    if (chartInstances[id]) chartInstances[id].destroy();
    chartInstances[id] = new Chart(canvas, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          data: data,
          label: '',
          backgroundColor: type === 'doughnut' ? colors : colors[0],
          borderColor: type === 'line' ? colors[0] : 'transparent',
          fill: type === 'line',
          tension: 0.35,
          borderRadius: type === 'bar' ? 10 : 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: type === 'doughnut' },
          tooltip: { enabled: true }
        },
        scales: type === 'doughnut' ? {} : {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  function renderAppointmentsTable() {
    var container = document.getElementById('appointments-table');
    var search = (document.getElementById('appt-search') || {}).value || '';
    var filterStatus = (document.getElementById('appt-filter-status') || {}).value || '';
    var filterService = (document.getElementById('appt-filter-service') || {}).value || '';
    var appointments = getAppointments().filter(function (item) {
      var text = (item.name + ' ' + item.phone + ' ' + item.email).toLowerCase();
      var matchesSearch = text.indexOf(search.toLowerCase()) !== -1;
      var matchesStatus = !filterStatus || item.status === filterStatus;
      var matchesService = !filterService || String(item.service || '').indexOf(filterService) !== -1;
      return matchesSearch && matchesStatus && matchesService;
    });

    if (!container) return;

    container.innerHTML = '<table><thead><tr><th>Clienta</th><th>Servicio</th><th>Fecha</th><th>Contacto</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>' +
      appointments.map(function (item) {
        return '<tr>' +
          '<td><strong>' + escapeHtml(item.name) + '</strong><br><small>' + escapeHtml(item.email) + '</small></td>' +
          '<td>' + escapeHtml(item.service) + '</td>' +
          '<td>' + escapeHtml(item.date) + '<br><small>' + escapeHtml(item.time) + '</small></td>' +
          '<td>' + escapeHtml(item.phone) + '</td>' +
          '<td>' + statusBadge(item.status) + '</td>' +
          '<td class="table-actions">' +
            '<button class="btn-sm btn-primary" onclick="openApptEditModal(\'' + item.id + '\')" title="Editar"><i class="fas fa-pen"></i></button>' +
            '<button class="btn-sm btn-primary" onclick="openAppointmentInGoogleCalendar(\'' + item.id + '\')" title="Google Calendar"><i class="fas fa-calendar-plus"></i></button>' +
            '<button class="btn-sm btn-success" onclick="setAppointmentStatus(\'' + item.id + '\', \'aprobada\')" title="Aprobar"><i class="fas fa-check"></i></button>' +
            '<button class="btn-sm btn-danger" onclick="setAppointmentStatus(\'' + item.id + '\', \'rechazada\')" title="Rechazar"><i class="fas fa-xmark"></i></button>' +
            '<button class="btn-sm btn-danger" onclick="deleteAppointment(\'' + item.id + '\')" title="Eliminar"><i class="fas fa-trash"></i></button>' +
          '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table>';
  }

  function renderClientsTable() {
    var container = document.getElementById('clients-table');
    var search = (document.getElementById('client-search') || {}).value || '';
    var sortBy = (document.getElementById('client-sort') || {}).value || 'appointments';
    var clients = getClients().slice();

    clients = clients.filter(function (item) {
      var text = (item.name + ' ' + item.phone + ' ' + item.email).toLowerCase();
      return text.indexOf(search.toLowerCase()) !== -1;
    });

    clients.sort(function (a, b) {
      if (sortBy === 'name') return String(a.name).localeCompare(String(b.name));
      if (sortBy === 'recent') return String(b.lastAppt || '').localeCompare(String(a.lastAppt || ''));
      return Number(b.appointments || 0) - Number(a.appointments || 0);
    });

    if (!container) return;

    container.innerHTML = '<table><thead><tr><th>Nombre</th><th>Telefono</th><th>Email</th><th>Citas</th><th>Servicios</th><th>Ultima cita</th><th>Acciones</th></tr></thead><tbody>' +
      clients.map(function (item) {
        return '<tr>' +
          '<td><strong>' + escapeHtml(item.name) + '</strong></td>' +
          '<td>' + escapeHtml(item.phone) + '</td>' +
          '<td>' + escapeHtml(item.email) + '</td>' +
          '<td>' + escapeHtml(item.appointments) + '</td>' +
          '<td>' + escapeHtml((item.services || []).join(', ')) + '</td>' +
          '<td>' + escapeHtml(item.lastAppt) + '</td>' +
          '<td class="table-actions"><button class="btn-sm btn-primary" onclick="openClientDetail(\'' + item.id + '\')"><i class="fas fa-eye"></i> Ver</button></td>' +
        '</tr>';
      }).join('') +
      '</tbody></table>';
  }

  function openClientDetail(id) {
    var client = getClients().find(function (item) { return item.id === id; });
    var content = document.getElementById('detail-modal-content');
    var history;
    if (!client || !content) return;

    history = getAppointments().filter(function (item) {
      return getClientLookupKey(item) === getClientLookupKey(client);
    }).sort(function (a, b) {
      return (String(b.date || '') + String(b.time || '')).localeCompare(String(a.date || '') + String(a.time || ''));
    });

    content.innerHTML = '<div class="detail-layout">'
      + '<div class="admin-card"><h3>' + escapeHtml(client.name) + '</h3><p><strong>Tel:</strong> ' + escapeHtml(client.phone) + '</p><p><strong>Email:</strong> ' + escapeHtml(client.email) + '</p><p><strong>Total de citas:</strong> ' + escapeHtml(client.appointments) + '</p><p><strong>Servicios:</strong> ' + escapeHtml((client.services || []).join(', ')) + '</p><p><strong>Ultima cita:</strong> ' + escapeHtml(client.lastAppt) + '</p></div>'
      + '<div class="admin-card"><h4>Notas internas</h4><textarea id="client-notes-input" class="admin-input" rows="6">' + escapeHtml(client.notes || '') + '</textarea><div class="modal-actions"><button class="btn-primary" onclick="saveClientNotes(\'' + client.id + '\')"><i class="fas fa-save"></i> Guardar notas</button></div></div>'
      + '<div class="admin-card detail-history-card"><h4>Historial de citas</h4>' + (history.length ? history.map(function (item) {
        return '<div class="list-row"><div><strong>' + escapeHtml(item.date) + ' - ' + escapeHtml(item.time) + '</strong><p>' + escapeHtml(item.service) + '</p></div><div>' + statusBadge(item.status) + '</div></div>';
      }).join('') : '<div class="empty-admin-state">No hay historial para esta clienta.</div>') + '</div>'
    + '</div>';
    openModal('detail-modal');
  }

  function saveClientNotes(id) {
    var clients = getClients();
    var client = clients.find(function (item) { return item.id === id; });
    var notesInput = document.getElementById('client-notes-input');
    if (!client || !notesInput) return;
    client.notes = notesInput.value.trim();
    setClients(clients);
    renderClientsTable();
    showToast('Notas guardadas.', 'success');
  }

  function renderTestimonialsTable() {
    var container = document.getElementById('testimonials-table');
    var filter = (document.getElementById('test-filter') || {}).value || '';
    var items = getTestimonials().filter(function (item) {
      return !filter || item.status === filter;
    });

    if (!container) return;

    container.innerHTML = '<table><thead><tr><th>Autora</th><th>Servicio</th><th>Comentario</th><th>Rating</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>' +
      items.map(function (item) {
        return '<tr>' +
          '<td>' + escapeHtml(item.name) + '</td>' +
          '<td>' + escapeHtml(item.service) + '</td>' +
          '<td><small>' + escapeHtml(item.comment) + '</small></td>' +
          '<td>' + escapeHtml(item.rating) + '/5</td>' +
          '<td>' + statusBadge(item.status) + '</td>' +
          '<td class="table-actions">' +
            '<button class="btn-sm btn-primary" onclick="openTestimonialEditModal(\'' + item.id + '\')"><i class="fas fa-pen"></i></button>' +
            '<button class="btn-sm" onclick="setTestimonialStatus(\'' + item.id + '\', \'aprobado\')">OK</button>' +
            '<button class="btn-sm" onclick="setTestimonialStatus(\'' + item.id + '\', \'rechazado\')">No</button>' +
            '<button class="btn-sm btn-danger" onclick="deleteTestimonial(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
          '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table>';
  }

  function renderSuggestionsTable() {
    var container = document.getElementById('suggestions-table');
    var filterStatus = (document.getElementById('sug-filter-status') || {}).value || '';
    var filterType = (document.getElementById('sug-filter-type') || {}).value || '';
    var items = getSuggestions().filter(function (item) {
      var matchesStatus = !filterStatus || item.status === filterStatus;
      var matchesType = !filterType || item.type === filterType;
      return matchesStatus && matchesType;
    });

    if (!container) return;

    container.innerHTML = '<table><thead><tr><th>Nombre</th><th>Tipo</th><th>Mensaje</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>' +
      items.map(function (item) {
        return '<tr>' +
          '<td>' + escapeHtml(item.name) + '</td>' +
          '<td>' + escapeHtml(item.type) + '</td>' +
          '<td><small>' + escapeHtml(item.message) + '</small></td>' +
          '<td>' + escapeHtml(item.date) + '</td>' +
          '<td>' + statusBadge(item.status) + '</td>' +
          '<td class="table-actions">' +
            '<button class="btn-sm" onclick="setSuggestionStatus(\'' + item.id + '\', \'revisada\')">Revisar</button>' +
            '<button class="btn-sm" onclick="setSuggestionStatus(\'' + item.id + '\', \'archivada\')">Archivar</button>' +
            '<button class="btn-sm btn-danger" onclick="deleteSuggestion(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
          '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table>';
  }

  function renderServicesGrid() {
    var container = document.getElementById('services-admin-grid');
    var items = getServices();
    if (!container) return;
    container.innerHTML = items.map(function (item) {
      var priceDisplay = item.id === 's10' ? 'Full Set Nuevo' : '$' + escapeHtml(Number(item.price || 0).toFixed(2));
      return '<div class="admin-card"><h4>' + escapeHtml(item.name) + '</h4><p><strong>' + priceDisplay + '</strong></p><p>' + escapeHtml(item.description) + '</p><div class="table-actions">' +
        '<button class="btn-sm btn-primary" onclick="openServiceModal(\'' + item.id + '\')"><i class="fas fa-pen"></i></button>' +
        '<button class="btn-sm" onclick="toggleServiceActive(\'' + item.id + '\')">' + (item.active ? 'Ocultar' : 'Activar') + '</button>' +
        '<button class="btn-sm btn-danger" onclick="deleteService(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
      '</div></div>';
    }).join('');
    populateServiceSelectOptions();
  }

  function renderGalleryGrid() {
    var container = document.getElementById('gallery-admin-grid');
    var items = getGallery();
    if (!container) return;
    container.innerHTML = items.map(function (item) {
      return '<div class="admin-card"><div class="thumb-preview">' +
        (item.afterImg ? '<img src="' + escapeHtml(item.afterImg) + '" alt="' + escapeHtml(item.title) + '">' : '<div class="thumb-empty">Sin imagen</div>') +
      '</div><h4>' + escapeHtml(item.title) + '</h4><p>' + escapeHtml(item.desc) + '</p><div class="table-actions">' +
        '<button class="btn-sm btn-primary" onclick="openGalleryItemModal(\'' + item.id + '\')"><i class="fas fa-pen"></i></button>' +
        '<button class="btn-sm" onclick="toggleGalleryActive(\'' + item.id + '\')">' + (item.active ? 'Ocultar' : 'Activar') + '</button>' +
        '<button class="btn-sm btn-danger" onclick="deleteGalleryItem(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
      '</div></div>';
    }).join('');
  }

  function renderFAQList() {
    var container = document.getElementById('faq-admin-list');
    var items = getFAQs();
    if (!container) return;
    container.innerHTML = items.map(function (item) {
      return '<div class="admin-card"><h4>' + escapeHtml(item.q) + '</h4><p>' + escapeHtml(item.a) + '</p><div class="table-actions">' +
        '<button class="btn-sm btn-primary" onclick="openFAQModal(\'' + item.id + '\')"><i class="fas fa-pen"></i></button>' +
        '<button class="btn-sm" onclick="toggleFAQActive(\'' + item.id + '\')">' + (item.active ? 'Ocultar' : 'Activar') + '</button>' +
        '<button class="btn-sm btn-danger" onclick="deleteFAQ(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
      '</div></div>';
    }).join('');
  }

  function renderReceiptsTable() {
    var container = document.getElementById('receipts-table');
    var receipts = getReceipts();
    if (!container) return;
    container.innerHTML = '<table><thead><tr><th>Cliente</th><th>Servicio</th><th>Fecha</th><th>Total</th><th>Pago</th><th>Acciones</th></tr></thead><tbody>' +
      receipts.map(function (item) {
        return '<tr>' +
          '<td>' + escapeHtml(item.client) + '</td>' +
          '<td>' + escapeHtml(item.service) + '</td>' +
          '<td>' + escapeHtml(item.date) + '</td>' +
          '<td>$' + escapeHtml(Number(item.total || 0).toFixed(2)) + '</td>' +
          '<td>' + escapeHtml(item.payment) + '</td>' +
          '<td class="table-actions"><button class="btn-sm btn-primary" onclick="viewReceipt(\'' + item.id + '\')"><i class="fas fa-eye"></i></button><button class="btn-sm btn-danger" onclick="deleteReceipt(\'' + item.id + '\')"><i class="fas fa-trash"></i></button></td>' +
        '</tr>';
      }).join('') +
      '</tbody></table>';
  }

  function renderCalendarAdmin() {
    var rulesContainer = document.getElementById('cal-admin-rules-container');
    var ruleHourSelect;
    var rulesList;
    var availability = getAvailability();

    renderAdminMonthView();

    if (rulesContainer) {
      rulesContainer.innerHTML = ''
          + '<div class="admin-card admin-calendar-card">'
          + '  <h4>No disponible</h4>'
          + '  <p>Bloquea solo lo necesario: un dia completo, una fecha completa, un dia con una hora especifica o una fecha con una hora especifica.</p>'
          + '  <div class="calendar-rule-form">'
          + '    <select id="rule-weekday" class="admin-select">'
          + '      <option value="">Dia de la semana</option>'
          + '      <option value="domingo">Domingo</option>'
          + '      <option value="lunes">Lunes</option>'
          + '      <option value="martes">Martes</option>'
          + '      <option value="miercoles">Miercoles</option>'
          + '      <option value="jueves">Jueves</option>'
          + '      <option value="viernes">Viernes</option>'
          + '      <option value="sabado">Sabado</option>'
          + '    </select>'
          + '    <input type="date" id="rule-date" class="admin-input" onchange="syncRuleDate()" />'
          + '    <select id="rule-hour" class="admin-select"><option value="">Hora especifica (opcional)</option></select>'
          + '    <button class="btn-sm btn-danger" onclick="addBlockedRule()"><i class="fas fa-ban"></i> Guardar bloqueo</button>'
          + '  </div>'
          + '  <div id="blocked-rules-list" class="avail-hours-list"></div>'
          + '</div>';
    }

    ruleHourSelect = document.getElementById('rule-hour');
    rulesList = document.getElementById('blocked-rules-list');
    if (ruleHourSelect) {
      ruleHourSelect.innerHTML = '<option value="">Hora especifica (opcional)</option>' + buildHourOptions();
    }
    if (rulesList) {
      rulesList.innerHTML = (availability.blockedRules || []).slice().sort(function (a, b) {
        return String(a.date || '').localeCompare(String(b.date || '')) || String(a.day || '').localeCompare(String(b.day || '')) || String(a.time || '').localeCompare(String(b.time || ''));
      }).map(function (rule) {
        return '<div class="list-row"><div><strong>' + escapeHtml(describeBlockType(rule.type)) + '</strong><p>' + escapeHtml(describeBlockedRule(rule)) + '</p></div><button class="btn-sm btn-danger" onclick="removeBlockedRule(\'' + rule.id + '\')"><i class="fas fa-trash"></i></button></div>';
      }).join('') || '<div class="empty-admin-state">No hay bloqueos guardados.</div>';
    }
  }

  function renderAdminMonthView() {
    var grid = document.getElementById('admin-month-calendar-grid');
    var title = document.getElementById('admin-month-title');
    if (!grid || !title) return;

    var date = state.adminCalDate;
    var year = date.getFullYear();
    var month = date.getMonth();
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    title.textContent = monthNames[month] + ' ' + year;

    var appointments = getAppointments().filter(function (a) { return a.status !== 'rechazada'; });
    var apptsByDate = {};
    appointments.forEach(function (a) {
      if (!apptsByDate[a.date]) apptsByDate[a.date] = [];
      apptsByDate[a.date].push(a);
    });

    var html = '<div class="admin-cal-month-header-row">' +
      ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(function (d) { return '<div class="cal-h-cell">' + d + '</div>'; }).join('') +
      '</div><div class="admin-cal-month-body">';

    for (var i = 0; i < firstDay; i++) {
      html += '<div class="cal-d-cell empty"></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var dStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var dayAppts = apptsByDate[dStr] || [];
      dayAppts.sort(function (a, b) { return a.time.localeCompare(b.time); });

      html += '<div class="cal-d-cell" onclick="viewDateInAdmin(\'' + dStr + '\')">' +
        '<span class="cal-d-num">' + d + '</span>' +
        '<div class="cal-d-appts">' +
        dayAppts.slice(0, 4).map(function (a) {
          return '<div class="cal-d-appt" title="' + escapeHtml(a.name + ' - ' + a.service) + '"><strong>' + escapeHtml(a.time) + '</strong> ' + escapeHtml(a.name) + '</div>';
        }).join('') +
        (dayAppts.length > 4 ? '<div class="cal-d-more">+' + (dayAppts.length - 4) + ' más</div>' : '') +
        '</div>' +
        '</div>';
    }
    html += '</div>';
    grid.innerHTML = html;
  }

  function changeAdminMonth(delta) {
    state.adminCalDate.setMonth(state.adminCalDate.getMonth() + delta);
    renderAdminMonthView();
  }

  function viewDateInAdmin(dateStr) {
    var dateInput = document.getElementById('cal-view-date');
    if (dateInput) {
      dateInput.value = dateStr;
      renderCalDayView();
      var card = dateInput.closest('.admin-card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function buildHourOptions() {
    var hours = ALL_BUSINESS_HOURS.slice();
    return hours.map(function (hour) {
      return '<option value="' + escapeHtml(hour) + '">' + escapeHtml(hour) + '</option>';
    }).join('');
  }

  function describeBlockType(type) {
    var labels = {
      'day-full': 'Dia completo bloqueado',
      'day-time': 'Hora bloqueada por dia',
      'date-full': 'Fecha completa bloqueada',
      'date-time': 'Hora bloqueada por fecha'
    };
    return labels[type] || 'Bloqueo';
  }

  function describeBlockedRule(rule) {
    var parts = [];
    if (rule.day) parts.push('Dia: ' + getWeekdayLabel(getWeekdayIndexByName(rule.day)));
    if (rule.date) parts.push('Fecha: ' + rule.date);
    if (rule.time) parts.push('Hora: ' + rule.time);
    return parts.join(' | ');
  }

  function renderCalDayView() {
    var dateInput = document.getElementById('cal-view-date');
    var container = document.getElementById('cal-day-view');
    var date = dateInput ? dateInput.value : '';
    var appointments;
    var availability = getAvailability();
    var weekday;
    var title;
    var hoursMarkup;
    var bookedMap = {};
    if (!container) return;
    if (!date) {
      container.innerHTML = '<div class="empty-admin-state">Selecciona una fecha.</div>';
      return;
    }

    syncCalendarSelection(date);

    weekday = getDateWeekday(date);
    appointments = getAppointments().filter(function (item) { return item.date === date; });
    appointments.forEach(function (item) {
      bookedMap[item.time] = item;
    });

    title = '<div class="calendar-day-header"><div><strong>' + escapeHtml(getWeekdayLabel(weekday)) + '</strong><p>' + escapeHtml(date) + '</p></div><button class="btn-sm btn-primary" onclick="selectCalendarSlot(\'' + date + '\', \'\')"><i class="fas fa-arrow-up-right-from-square"></i> Usar fecha arriba</button></div>';

    hoursMarkup = (availability.weeklyHours || []).map(function (hour) {
      var appointment = bookedMap[hour];
      var fullyBlocked = isDateBlockedByRule(date, availability);
      var blocked = isTimeBlockedByRule(date, hour, availability);
      var statusClass = 'available';
      var statusText = 'Disponible';
      var detail = 'Este horario se puede reservar.';

      if (fullyBlocked || blocked) {
        statusClass = 'blocked';
        statusText = 'No disponible';
        detail = fullyBlocked ? 'La fecha completa esta bloqueada.' : 'Este horario esta bloqueado.';
      } else if (appointment && appointment.status !== 'rechazada') {
        statusClass = 'booked';
        statusText = 'Reservado';
        detail = appointment.name + ' - ' + appointment.service;
      }

      return '<button class="calendar-slot-card ' + statusClass + '" onclick="selectCalendarSlot(\'' + date + '\', \'' + escapeHtml(hour) + '\')">' +
        '<div><strong>' + escapeHtml(hour) + '</strong><p>' + escapeHtml(detail) + '</p></div>' +
        '<span>' + escapeHtml(statusText) + '</span>' +
      '</button>';
    }).join('');

    container.innerHTML = title
      + '<div class="calendar-slots-grid">' + hoursMarkup + '</div>'
      + (appointments.length ? '<div class="avail-hours-list">' + appointments.map(function (item) {
        return '<div class="list-row"><div><strong>' + escapeHtml(item.time) + '</strong><p>' + escapeHtml(item.name) + ' - ' + escapeHtml(item.service) + '</p></div><div>' + statusBadge(item.status) + '</div></div>';
      }).join('') + '</div>' : '<div class="empty-admin-state">No hay citas registradas para esta fecha.</div>');
  }

  function loadPageEditor() {
    var content = getPageContent();
    var schedule = getSchedule();
    var scheduleEditor = document.getElementById('schedule-editor');
    setInputValue('pe-heroTitle', content.heroTitle);
    setInputValue('pe-heroSubtitle', content.heroSubtitle);
    setInputValue('pe-aboutTitle', content.aboutTitle);
    setInputValue('pe-aboutText', content.aboutText);
    setInputValue('pe-footerDesc', content.footerDesc);
    if (scheduleEditor) {
      scheduleEditor.innerHTML = schedule.map(function (row, index) {
        return '<div class="schedule-edit-row"><input class="admin-input schedule-day" data-index="' + index + '" value="' + escapeHtml(row.day) + '"><input class="admin-input schedule-hours" data-index="' + index + '" value="' + escapeHtml(row.hours) + '"><button class="btn-sm btn-danger" onclick="removeScheduleRow(' + index + ')"><i class="fas fa-trash"></i></button></div>';
      }).join('');
    }
  }

  function loadConfig() {
    var config = getConfig();
    setInputValue('cfg-name', config.name);
    setInputValue('cfg-phone', config.phone);
    setInputValue('cfg-location', config.location);
    setInputValue('cfg-email', config.email);
    setInputValue('cfg-ig', config.instagram);
    setInputValue('cfg-fb', config.facebook);
    setInputValue('cfg-calendar-webhook', config.calendarWebhookUrl);
    setInputValue('cfg-calendar-secret', config.calendarSecret);
    setInputValue('cfg-calendar-id', config.calendarId);
    setInputValue('cfg-calendar-timezone', config.calendarTimezone);
    setInputValue('cfg-calendar-duration', config.calendarEventDurationMinutes);
    setInputValue('cfg-lang', config.lang);
    setInputValue('cfg-theme', config.theme);
  }

  function setInputValue(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value == null ? '' : value;
  }

  function getInputValue(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback == null ? '' : fallback;
    return el.value == null ? (fallback == null ? '' : fallback) : el.value;
  }

  function getTrimmedInputValue(id, fallback) {
    return String(getInputValue(id, fallback)).trim();
  }

  function populateServiceSelectOptions() {
    var services = getServices();
    var selects = [
      document.getElementById('appt-filter-service'),
      document.getElementById('edit-appt-service'),
      document.getElementById('rec-service')
    ];
    selects.forEach(function (select, index) {
      if (!select) return;
      if (index === 0) {
        select.innerHTML = '<option value="">Todos los servicios</option>' + services.map(function (service) {
          return '<option value="' + escapeHtml(service.name) + '">' + escapeHtml(service.name) + '</option>';
        }).join('');
      } else {
        select.innerHTML = services.map(function (service) {
          var priceLabel = service.id === 's10' ? 'Full Set Nuevo' : '$' + escapeHtml(Number(service.price || 0).toFixed(2));
          return '<option value="' + escapeHtml(service.name) + '">' + escapeHtml(service.name) + ' - ' + priceLabel + '</option>';
        }).join('');
      }
    });
    renderAppointmentServiceChoices();
  }

  function renderAppointmentServiceChoices() {
    var select = document.getElementById('edit-appt-service');
    var container = document.getElementById('edit-appt-service-options');
    if (!select || !container) return;

    container.innerHTML = Array.prototype.map.call(select.options, function (option) {
      return '<label class="service-choice-item">'
        + '<input type="checkbox" value="' + escapeHtml(option.value) + '"' + (option.selected ? ' checked' : '') + ' />'
        + '<div><strong>' + escapeHtml(option.textContent) + '</strong></div>'
      + '</label>';
    }).join('');

    Array.prototype.forEach.call(container.querySelectorAll('input[type="checkbox"]'), function (input) {
      input.addEventListener('change', function () {
        var values = Array.prototype.map.call(container.querySelectorAll('input[type="checkbox"]:checked'), function (item) { return item.value; });
        Array.prototype.forEach.call(select.options, function (option) {
          option.selected = values.indexOf(option.value) !== -1;
        });
      });
    });
  }

  function openApptEditModal(id) {
    var item = getAppointments().find(function (appt) { return appt.id === id; });
    state.editingAppointmentId = id;
    if (!item) return;
    setInputValue('edit-appt-id', id);
    setInputValue('edit-appt-name', item.name);
    setInputValue('edit-appt-phone', item.phone);
    setInputValue('edit-appt-email', item.email);
    setInputValue('edit-appt-date', item.date);
    setInputValue('edit-appt-status', item.status);
    setInputValue('edit-appt-comments', item.comments);
    populateServiceSelectOptions();
    Array.prototype.forEach.call(document.getElementById('edit-appt-service').options, function (option) {
      option.selected = ((item.services && item.services.length ? item.services : String(item.service || '').split(',').map(function (entry) { return entry.trim(); })).indexOf(option.value) !== -1);
    });
    renderAppointmentServiceChoices();
    document.getElementById('edit-appt-time').innerHTML = buildHourOptions();
    setInputValue('edit-appt-time', item.time);
    openModal('appt-edit-modal');
  }

  async function saveApptEdit() {
    var appointments = getAppointments();
    var id = document.getElementById('edit-appt-id').value;
    var item = appointments.find(function (appt) { return appt.id === id; });
    var previousItem;
    if (!item) return;
    previousItem = clone(item);
    item.name = document.getElementById('edit-appt-name').value.trim();
    item.phone = document.getElementById('edit-appt-phone').value.trim();
    item.email = document.getElementById('edit-appt-email').value.trim();
    item.services = Array.prototype.map.call(document.getElementById('edit-appt-service').selectedOptions, function (option) { return option.value; }).filter(Boolean);
    item.service = item.services.join(', ');
    item.date = document.getElementById('edit-appt-date').value;
    item.time = document.getElementById('edit-appt-time').value;
    item.status = document.getElementById('edit-appt-status').value;
    item.comments = document.getElementById('edit-appt-comments').value.trim();
    item.calendarSynced = item.calendarSynced === true;
    item.calendarEventId = item.calendarEventId || '';
    item.calendarSyncedAt = item.calendarSyncedAt || '';
    setAppointments(appointments);
    syncAppointmentBlockedSlot(item, previousItem);
    rebuildClients();
    renderAppointmentsTable();
    renderClientsTable();
    renderDashboard();
    renderCalendarAdmin();
    closeModal('appt-edit-modal');
    try {
      await handleApprovedAppointmentCalendarSync(item, previousItem);
    } catch (error) {
      console.error('Appointment save sync error:', error);
      showToast('La cita se guardo, pero Google Calendar fallo.', 'error');
    }
    setAppointments(appointments);
    showToast('Cita actualizada.', 'success');
  }

  async function setAppointmentStatus(id, status) {
    var appointments = getAppointments();
    var item = appointments.find(function (appt) { return appt.id === id; });
    var previousItem;
    if (!item) return;
    previousItem = clone(item);
    item.status = status;
    setAppointments(appointments);
    syncAppointmentBlockedSlot(item, previousItem);
    rebuildClients();
    renderAppointmentsTable();
    renderClientsTable();
    renderDashboard();
    renderCalendarAdmin();
    try {
      await handleApprovedAppointmentCalendarSync(item, previousItem);
    } catch (error) {
      console.error('Appointment status sync error:', error);
      showToast('La cita se aprobo, pero Google Calendar fallo.', 'error');
    }
    setAppointments(appointments);
    renderAppointmentsTable();
    renderClientsTable();
    renderDashboard();
    renderCalendarAdmin();
    showToast('Estado de cita actualizado.', 'success');
  }

  function deleteAppointment(id) {
    var previousItem = getAppointments().find(function (item) { return item.id === id; });
    if (!window.confirm('Eliminar esta cita?')) return;
    setAppointments(getAppointments().filter(function (item) { return item.id !== id; }));
    syncAppointmentBlockedSlot(null, previousItem);
    rebuildClients();
    renderAppointmentsTable();
    renderClientsTable();
    renderDashboard();
    renderCalendarAdmin();
    showToast('Cita eliminada.', 'success');
  }

  function openTestimonialEditModal(id) {
    var item = getTestimonials().find(function (test) { return test.id === id; });
    state.editingTestimonialId = id;
    if (!item) return;
    setInputValue('edit-test-id', id);
    setInputValue('edit-test-name', item.name);
    setInputValue('edit-test-service', item.service);
    setInputValue('edit-test-comment', item.comment);
    setInputValue('edit-test-status', item.status);
    openModal('test-edit-modal');
  }

  function saveTestEdit() {
    var items = getTestimonials();
    var id = document.getElementById('edit-test-id').value;
    var item = items.find(function (test) { return test.id === id; });
    if (!item) return;
    item.name = document.getElementById('edit-test-name').value.trim();
    item.service = document.getElementById('edit-test-service').value.trim();
    item.comment = document.getElementById('edit-test-comment').value.trim();
    item.status = document.getElementById('edit-test-status').value;
    setTestimonials(items);
    renderTestimonialsTable();
    renderDashboard();
    closeModal('test-edit-modal');
    showToast('Testimonio actualizado.', 'success');
  }

  function setTestimonialStatus(id, status) {
    var items = getTestimonials();
    var item = items.find(function (test) { return test.id === id; });
    if (!item) return;
    item.status = status;
    setTestimonials(items);
    renderTestimonialsTable();
    renderDashboard();
    showToast('Estado de testimonio actualizado.', 'success');
  }

  function deleteTestimonial(id) {
    if (!window.confirm('Eliminar este testimonio?')) return;
    setTestimonials(getTestimonials().filter(function (item) { return item.id !== id; }));
    renderTestimonialsTable();
    renderDashboard();
    showToast('Testimonio eliminado.', 'success');
  }

  function setSuggestionStatus(id, status) {
    var items = getSuggestions();
    var item = items.find(function (sug) { return sug.id === id; });
    if (!item) return;
    item.status = status;
    setSuggestions(items);
    renderSuggestionsTable();
    renderDashboard();
    showToast('Sugerencia actualizada.', 'success');
  }

  function deleteSuggestion(id) {
    if (!window.confirm('Eliminar esta sugerencia?')) return;
    setSuggestions(getSuggestions().filter(function (item) { return item.id !== id; }));
    renderSuggestionsTable();
    renderDashboard();
    showToast('Sugerencia eliminada.', 'success');
  }

  function openServiceModal(id) {
    var item = id ? getServices().find(function (service) { return service.id === id; }) : null;
    state.editingServiceId = id || '';
    document.getElementById('service-modal-title').textContent = id ? 'Editar servicio' : 'Anadir servicio';
    setInputValue('edit-svc-id', id || '');
    setInputValue('edit-svc-name', item ? item.name : '');
    setInputValue('edit-svc-nameEn', item ? item.nameEn : '');
    setInputValue('edit-svc-price', item ? item.price : '');
    setInputValue('edit-svc-icon', item ? item.icon : 'fas fa-hand-sparkles');
    setInputValue('edit-svc-desc', item ? item.description : '');
    setInputValue('edit-svc-descEn', item ? item.descriptionEn : '');
    document.getElementById('edit-svc-active').checked = item ? !!item.active : true;
    openModal('service-modal');
  }

  function saveService() {
    var items = getServices();
    var id = document.getElementById('edit-svc-id').value;
    var current = id ? items.find(function (item) { return item.id === id; }) : null;
    var payload = {
      id: id || uid('s'),
      category: current && current.category ? current.category : 'gel',
      name: document.getElementById('edit-svc-name').value.trim(),
      nameEn: document.getElementById('edit-svc-nameEn').value.trim(),
      price: Number(document.getElementById('edit-svc-price').value || 0),
      icon: document.getElementById('edit-svc-icon').value.trim() || (current && current.icon) || 'fas fa-hand-sparkles',
      description: document.getElementById('edit-svc-desc').value.trim() || (current && current.description) || '',
      descriptionEn: document.getElementById('edit-svc-descEn').value.trim() || (current && current.descriptionEn) || '',
      active: document.getElementById('edit-svc-active').checked
    };
    if (!payload.name) {
      showToast('El servicio necesita un nombre.', 'error');
      return;
    }
    if (id) {
      items = items.map(function (item) { return item.id === id ? payload : item; });
    } else {
      items.push(payload);
    }
    setServices(items);
    renderServicesGrid();
    renderDashboard();
    closeModal('service-modal');
    showToast('Servicio guardado.', 'success');
  }

  function toggleServiceActive(id) {
    var items = getServices();
    var item = items.find(function (service) { return service.id === id; });
    if (!item) return;
    item.active = !item.active;
    setServices(items);
    renderServicesGrid();
    renderDashboard();
  }

  function deleteService(id) {
    if (!window.confirm('Eliminar este servicio?')) return;
    setServices(getServices().filter(function (item) { return item.id !== id; }));
    renderServicesGrid();
    renderDashboard();
    showToast('Servicio eliminado.', 'success');
  }

  function openFAQModal(id) {
    var item = id ? getFAQs().find(function (faq) { return faq.id === id; }) : null;
    state.editingFAQId = id || '';
    document.getElementById('faq-modal-title').textContent = id ? 'Editar pregunta' : 'Anadir pregunta';
    setInputValue('edit-faq-id', id || '');
    setInputValue('edit-faq-q', item ? item.q : '');
    setInputValue('edit-faq-qEn', item ? item.qEn : '');
    setInputValue('edit-faq-a', item ? item.a : '');
    setInputValue('edit-faq-aEn', item ? item.aEn : '');
    document.getElementById('edit-faq-active').checked = item ? !!item.active : true;
    openModal('faq-modal');
  }

  function saveFAQ() {
    var items = getFAQs();
    var id = document.getElementById('edit-faq-id').value;
    var payload = {
      id: id || uid('f'),
      q: document.getElementById('edit-faq-q').value.trim(),
      qEn: document.getElementById('edit-faq-qEn').value.trim(),
      a: document.getElementById('edit-faq-a').value.trim(),
      aEn: document.getElementById('edit-faq-aEn').value.trim(),
      active: document.getElementById('edit-faq-active').checked
    };
    if (!payload.q || !payload.a) {
      showToast('La FAQ necesita pregunta y respuesta.', 'error');
      return;
    }
    if (id) {
      items = items.map(function (item) { return item.id === id ? payload : item; });
    } else {
      items.push(payload);
    }
    setFAQs(items);
    renderFAQList();
    closeModal('faq-modal');
    showToast('FAQ guardada.', 'success');
  }

  function toggleFAQActive(id) {
    var items = getFAQs();
    var item = items.find(function (faq) { return faq.id === id; });
    if (!item) return;
    item.active = !item.active;
    setFAQs(items);
    renderFAQList();
  }

  function deleteFAQ(id) {
    if (!window.confirm('Eliminar esta pregunta?')) return;
    setFAQs(getFAQs().filter(function (item) { return item.id !== id; }));
    renderFAQList();
    showToast('FAQ eliminada.', 'success');
  }

  function openGalleryItemModal(id) {
    var item = id ? getGallery().find(function (galleryItem) { return galleryItem.id === id; }) : null;
    state.editingGalleryId = id || '';
    document.getElementById('gallery-modal-title').textContent = id ? 'Editar trabajo' : 'Anadir trabajo';
    setInputValue('edit-gal-id', id || '');
    setInputValue('edit-gal-title', item ? item.title : '');
    setInputValue('edit-gal-titleEn', item ? item.titleEn : '');
    setInputValue('edit-gal-desc', item ? item.desc : '');
    setInputValue('edit-gal-descEn', item ? item.descEn : '');
    setInputValue('edit-gal-cat', item ? item.category : 'manicura');
    setInputValue('edit-gal-before', item ? item.beforeImg : '');
    setInputValue('edit-gal-after', item ? item.afterImg : '');
    document.getElementById('edit-gal-active').checked = item ? !!item.active : true;
    openModal('gallery-item-modal');
  }

  function saveGalleryItem() {
    var items = getGallery();
    var id = document.getElementById('edit-gal-id').value;
    var payload = {
      id: id || uid('g'),
      title: document.getElementById('edit-gal-title').value.trim(),
      titleEn: document.getElementById('edit-gal-titleEn').value.trim(),
      desc: document.getElementById('edit-gal-desc').value.trim(),
      descEn: document.getElementById('edit-gal-descEn').value.trim(),
      category: document.getElementById('edit-gal-cat').value,
      beforeImg: document.getElementById('edit-gal-before').value.trim(),
      afterImg: document.getElementById('edit-gal-after').value.trim(),
      active: document.getElementById('edit-gal-active').checked
    };
    if (!payload.title) {
      showToast('La pieza necesita un titulo.', 'error');
      return;
    }
    if (id) {
      items = items.map(function (item) { return item.id === id ? payload : item; });
    } else {
      items.push(payload);
    }
    setGallery(items);
    renderGalleryGrid();
    closeModal('gallery-item-modal');
    showToast('Elemento de galeria guardado.', 'success');
  }

  function toggleGalleryActive(id) {
    var items = getGallery();
    var item = items.find(function (galleryItem) { return galleryItem.id === id; });
    if (!item) return;
    item.active = !item.active;
    setGallery(items);
    renderGalleryGrid();
  }

  function deleteGalleryItem(id) {
    if (!window.confirm('Eliminar este trabajo?')) return;
    setGallery(getGallery().filter(function (item) { return item.id !== id; }));
    renderGalleryGrid();
    showToast('Elemento eliminado.', 'success');
  }

  function savePageContent() {
    var content = {
      heroTitle: getInputValue('pe-heroTitle', ''),
      heroSubtitle: getInputValue('pe-heroSubtitle', ''),
      aboutTitle: getInputValue('pe-aboutTitle', ''),
      aboutText: getInputValue('pe-aboutText', ''),
      footerDesc: getInputValue('pe-footerDesc', '')
    };
    setPageContent(content);
    saveScheduleFromEditor();
    showToast('Contenido del sitio guardado.', 'success');
  }

  function resetPageContent() {
    if (!window.confirm('Restaurar contenido y horario por defecto?')) return;
    setPageContent(clone(DEFAULT_PAGE_CONTENT));
    setSchedule(clone(DEFAULT_SCHEDULE));
    loadPageEditor();
    showToast('Contenido restaurado.', 'success');
  }

  function saveScheduleFromEditor() {
    var rows = document.querySelectorAll('#schedule-editor .schedule-edit-row');
    var schedule = [];
    Array.prototype.forEach.call(rows, function (row) {
      var day = row.querySelector('.schedule-day').value.trim();
      var hours = row.querySelector('.schedule-hours').value.trim();
      if (day || hours) {
        schedule.push({ day: day, dayEn: day, hours: hours });
      }
    });
    if (schedule.length) setSchedule(schedule);
  }

  function addScheduleRow() {
    var schedule = getSchedule();
    schedule.push({ day: '', dayEn: '', hours: '' });
    setSchedule(schedule);
    loadPageEditor();
  }

  function removeScheduleRow(index) {
    var schedule = getSchedule();
    schedule.splice(index, 1);
    setSchedule(schedule);
    loadPageEditor();
  }

  function openReceiptModal() {
    setInputValue('edit-rec-id', '');
    setInputValue('rec-client', '');
    setInputValue('rec-phone', '');
    setInputValue('rec-email', '');
    populateServiceSelectOptions();
    setInputValue('rec-date', new Date().toISOString().split('T')[0]);
    setInputValue('rec-price', '');
    setInputValue('rec-discount', '0');
    setInputValue('rec-payment', 'efectivo');
    setInputValue('rec-notes', '');
    openModal('receipt-modal');
  }

  function saveReceipt() {
    var receipts = getReceipts();
    var price = Number(document.getElementById('rec-price').value || 0);
    var discount = Number(document.getElementById('rec-discount').value || 0);
    var receipt = {
      id: uid('r'),
      client: document.getElementById('rec-client').value.trim(),
      phone: document.getElementById('rec-phone').value.trim(),
      email: document.getElementById('rec-email').value.trim(),
      service: document.getElementById('rec-service').value,
      date: document.getElementById('rec-date').value,
      price: price,
      discount: discount,
      total: Math.max(price - discount, 0),
      payment: document.getElementById('rec-payment').value,
      notes: document.getElementById('rec-notes').value.trim()
    };
    if (!receipt.client || !receipt.service || !receipt.date) {
      showToast('Completa cliente, servicio y fecha.', 'error');
      return;
    }
    receipts.push(receipt);
    setReceipts(receipts);
    renderReceiptsTable();
    renderDashboard();
    closeModal('receipt-modal');
    viewReceipt(receipt.id);
    showToast('Recibo guardado.', 'success');
  }

  function viewReceipt(id) {
    var receipt = getReceipts().find(function (item) { return item.id === id; });
    var preview = document.getElementById('receipt-preview');
    if (!receipt || !preview) return;
    preview.innerHTML = '<div class="receipt-card"><h3>Recibo</h3><p><strong>Cliente:</strong> ' + escapeHtml(receipt.client) + '</p><p><strong>Servicio:</strong> ' + escapeHtml(receipt.service) + '</p><p><strong>Fecha:</strong> ' + escapeHtml(receipt.date) + '</p><p><strong>Metodo:</strong> ' + escapeHtml(receipt.payment) + '</p><p><strong>Precio:</strong> $' + Number(receipt.price).toFixed(2) + '</p><p><strong>Descuento:</strong> $' + Number(receipt.discount).toFixed(2) + '</p><p><strong>Total:</strong> $' + Number(receipt.total).toFixed(2) + '</p><p><strong>Notas:</strong> ' + escapeHtml(receipt.notes) + '</p></div>';
    openModal('view-receipt-modal');
  }

  function deleteReceipt(id) {
    if (!window.confirm('Eliminar este recibo?')) return;
    setReceipts(getReceipts().filter(function (item) { return item.id !== id; }));
    renderReceiptsTable();
    renderDashboard();
    showToast('Recibo eliminado.', 'success');
  }

  function printReceipt() {
    window.print();
  }

  function shareReceiptWA() {
    var preview = document.getElementById('receipt-preview');
    if (!preview) return;
    showToast('Abre WhatsApp y comparte el detalle manualmente por ahora.', 'info');
  }

  function saveConfigValues() {
    var config = {
      name: getTrimmedInputValue('cfg-name', ''),
      phone: getTrimmedInputValue('cfg-phone', ''),
      location: getTrimmedInputValue('cfg-location', ''),
      email: getTrimmedInputValue('cfg-email', ''),
      instagram: getTrimmedInputValue('cfg-ig', ''),
      facebook: getTrimmedInputValue('cfg-fb', ''),
      calendarWebhookUrl: getTrimmedInputValue('cfg-calendar-webhook', ''),
      calendarSecret: getTrimmedInputValue('cfg-calendar-secret', ''),
      calendarId: getTrimmedInputValue('cfg-calendar-id', 'primary') || 'primary',
      calendarTimezone: getTrimmedInputValue('cfg-calendar-timezone', 'America/Puerto_Rico') || 'America/Puerto_Rico',
      calendarEventDurationMinutes: Number(getInputValue('cfg-calendar-duration', 60)) || 60,
      lang: getInputValue('cfg-lang', 'es'),
      theme: getInputValue('cfg-theme', 'light')
    };
    setConfig(config);
    showToast('Configuracion guardada.', 'success');
  }

  function saveConfig() {
    try {
      return saveConfigValues();
    } catch (error) {
      console.error('Config save error:', error);
      showToast('No se pudo guardar la configuración.', 'error');
      return false;
    }
  }

  function confirmClearData() {
    if (!window.confirm('Esto eliminara datos creados en el panel. Continuar?')) return;
    setAppointments(clone(DEFAULT_APPOINTMENTS));
    setTestimonials(clone(DEFAULT_TESTIMONIALS));
    setSuggestions(clone(DEFAULT_SUGGESTIONS));
    setGallery(clone(DEFAULT_GALLERY));
    setServices(clone(DEFAULT_SERVICES));
    setFAQs(clone(DEFAULT_FAQS));
    setSchedule(clone(DEFAULT_SCHEDULE));
    setAvailability(clone(DEFAULT_AVAILABILITY));
    setReceipts([]);
    setPageContent(clone(DEFAULT_PAGE_CONTENT));
    rebuildClients();
    renderAllSections();
    showToast('Datos limpiados y restaurados.', 'success');
  }

  function confirmResetDemo() {
    if (!window.confirm('Restaurar datos demo completos?')) return;
    localStorage.removeItem('pal_init');
    ensureDemoData();
    renderAllSections();
    loadPageEditor();
    loadConfig();
    showToast('Datos demo restaurados.', 'success');
  }

  function exportCSV(type) {
    var rows;
    var headers;
    var filename = type + '.csv';

    if (type === 'appointments') {
      rows = getAppointments();
      headers = ['name', 'service', 'date', 'time', 'phone', 'email', 'status'];
    } else if (type === 'clients') {
      rows = getClients();
      headers = ['name', 'phone', 'email', 'appointments', 'lastAppt'];
    } else if (type === 'testimonials') {
      rows = getTestimonials();
      headers = ['name', 'service', 'rating', 'status', 'comment'];
    } else if (type === 'suggestions') {
      rows = getSuggestions();
      headers = ['name', 'type', 'status', 'message'];
    } else if (type === 'receipts') {
      rows = getReceipts();
      headers = ['client', 'service', 'date', 'total', 'payment'];
    } else {
      showToast('Tipo de exportacion no soportado.', 'error');
      return;
    }

    downloadCSV(filename, headers, rows);
  }

  function getExportConfig(type) {
    if (type === 'appointments') {
      return {
        rows: getAppointments(),
        headers: ['name', 'service', 'date', 'time', 'phone', 'email', 'status'],
        labels: { name: 'Nombre', service: 'Servicio', date: 'Fecha', time: 'Hora', phone: 'Telefono', email: 'Email', status: 'Estado' }
      };
    }
    if (type === 'clients') {
      return {
        rows: getClients(),
        headers: ['name', 'phone', 'email', 'appointments', 'services', 'lastAppt', 'notes'],
        labels: { name: 'Nombre', phone: 'Telefono', email: 'Email', appointments: 'Citas', services: 'Servicios', lastAppt: 'Ultima cita', notes: 'Notas internas' }
      };
    }
    return null;
  }

  function exportData(type, format) {
    var config = getExportConfig(type);
    if (!config) {
      showToast('Tipo de exportacion no soportado.', 'error');
      return;
    }
    if (format === 'excel') {
      downloadExcel(type + '.xls', config.headers, config.labels, config.rows);
      return;
    }
    if (format === 'pdf') {
      downloadPrintableReport(type, config.headers, config.labels, config.rows);
      return;
    }
    showToast('Formato no soportado.', 'error');
  }

  function downloadCSV(filename, headers, rows) {
    var csv = headers.join(',') + '\n' + rows.map(function (row) {
      return headers.map(function (key) {
        var value = row[key];
        if (Array.isArray(value)) value = value.join(', ');
        return '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
      }).join(',');
    }).join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function downloadExcel(filename, headers, labels, rows) {
    var table = '<table><thead><tr>' + headers.map(function (header) {
      return '<th>' + escapeHtml(labels[header] || header) + '</th>';
    }).join('') + '</tr></thead><tbody>' + rows.map(function (row) {
      return '<tr>' + headers.map(function (key) {
        var value = row[key];
        if (Array.isArray(value)) value = value.join(', ');
        return '<td>' + escapeHtml(value == null ? '' : value) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table>';
    var blob = new Blob(['\ufeff' + table], { type: 'application/vnd.ms-excel' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function downloadPrintableReport(type, headers, labels, rows) {
    var win = window.open('', '_blank', 'width=1100,height=800');
    if (!win) {
      showToast('Tu navegador bloqueo la ventana de impresion.', 'error');
      return;
    }
    win.document.write('<html><head><title>' + escapeHtml(type) + '</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#222}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#f3e9e4}h1{margin-bottom:16px}</style></head><body>');
    win.document.write('<h1>Exportacion de ' + escapeHtml(type) + '</h1>');
    win.document.write('<table><thead><tr>' + headers.map(function (header) {
      return '<th>' + escapeHtml(labels[header] || header) + '</th>';
    }).join('') + '</tr></thead><tbody>' + rows.map(function (row) {
      return '<tr>' + headers.map(function (key) {
        var value = row[key];
        if (Array.isArray(value)) value = value.join(', ');
        return '<td>' + escapeHtml(value == null ? '' : value) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table></body></html>');
    win.document.close();
    win.focus();
    win.print();
  }

  function addAvailHour() {
    var select = document.getElementById('new-hour-input');
    var availability = getAvailability();
    var hour = select ? select.value : '';
    if (!hour) return;
    if (availability.weeklyHours.indexOf(hour) === -1) availability.weeklyHours.push(hour);
    availability.weeklyHours.sort();
    setAvailability(availability);
    renderCalendarAdmin();
    showToast('Horario agregado.', 'success');
  }

  function removeAvailHour(hour) {
    var availability = getAvailability();
    availability.weeklyHours = availability.weeklyHours.filter(function (item) { return item !== hour; });
    setAvailability(availability);
    renderCalendarAdmin();
    showToast('Horario eliminado.', 'success');
  }

  function addBlockedRule() {
    var weekdayInput = document.getElementById('rule-weekday');
    var dateInput = document.getElementById('rule-date');
    var hourInput = document.getElementById('rule-hour');
    var availability = getAvailability();
    var day = weekdayInput ? String(weekdayInput.value || '').toLowerCase() : '';
    var date = dateInput ? dateInput.value : '';
    var time = hourInput ? hourInput.value : '';
    var type = '';
    var exists;

    if (!day && !date) {
      showToast('Selecciona al menos un dia o una fecha para bloquear.', 'error');
      return;
    }

    if (date) {
      day = getWeekdayNameByIndex(getDateWeekday(date));
    }

    if (date && time) type = 'date-time';
    else if (date) type = 'date-full';
    else if (day && time) type = 'day-time';
    else if (day) type = 'day-full';

    exists = availability.blockedRules.some(function (rule) {
      return String(rule.day || '') === String(day || '') &&
        String(rule.date || '') === String(date || '') &&
        String(rule.time || '') === String(time || '') &&
        String(rule.type || '') === String(type || '');
    });

    if (exists) {
      showToast('Ese bloqueo ya existe.', 'error');
      return;
    }

    availability.blockedRules.push({
      id: uid('rule'),
      day: day,
      date: date,
      time: time,
      type: type
    });

    setAvailability(availability);

    if (weekdayInput) weekdayInput.value = '';
    if (dateInput) dateInput.value = '';
    if (hourInput) hourInput.value = '';

    renderCalendarAdmin();
    showToast('Bloqueo guardado.', 'success');
  }

  function syncCalendarSelection(date, hour) {
    var ruleDateInput = document.getElementById('rule-date');
    var ruleWeekdaySelect = document.getElementById('rule-weekday');
    var ruleHourSelect = document.getElementById('rule-hour');
    var dayName;

    if (!date) return;
    dayName = getWeekdayNameByIndex(getDateWeekday(date));

    if (ruleDateInput) ruleDateInput.value = date;
    if (ruleWeekdaySelect) ruleWeekdaySelect.value = dayName;
    if (ruleHourSelect && hour !== undefined) ruleHourSelect.value = hour || '';
  }

  function syncRuleDate() {
    var ruleDateInput = document.getElementById('rule-date');
    var date = ruleDateInput ? ruleDateInput.value : '';
    if (!date) return;
    syncCalendarSelection(date, document.getElementById('rule-hour') ? document.getElementById('rule-hour').value : '');
  }

  function selectCalendarSlot(date, hour) {
    syncCalendarSelection(date, hour || '');
    showToast(hour ? 'Fecha y hora cargadas en el formulario.' : 'Fecha cargada en el formulario.', 'success');
  }

  function removeBlockedRule(id) {
    var availability = getAvailability();
    availability.blockedRules = availability.blockedRules.filter(function (rule) { return rule.id !== id; });
    setAvailability(availability);
    renderCalendarAdmin();
    showToast('Bloqueo eliminado.', 'success');
  }

  function blockDate() {
    var input = document.getElementById('block-date-input');
    var availability = getAvailability();
    var date = input ? input.value : '';
    if (!date) return;
    if (availability.blockedDates.indexOf(date) === -1) availability.blockedDates.push(date);
    availability.blockedDates.sort();
    setAvailability(availability);
    renderCalendarAdmin();
    showToast('Fecha bloqueada.', 'success');
  }

  function unblockDate(date) {
    var availability = getAvailability();
    availability.blockedDates = availability.blockedDates.filter(function (item) { return item !== date; });
    setAvailability(availability);
    renderCalendarAdmin();
    showToast('Fecha desbloqueada.', 'success');
  }

  function toggleUnavailableWeekday(dayIndex) {
    var availability = getAvailability();
    var weekdays = Array.isArray(availability.unavailableWeekdays) ? availability.unavailableWeekdays.slice() : [];
    if (weekdays.indexOf(dayIndex) === -1) weekdays.push(dayIndex);
    else weekdays = weekdays.filter(function (item) { return item !== dayIndex; });
    weekdays.sort();
    availability.unavailableWeekdays = weekdays;
    setAvailability(availability);
    renderCalendarAdmin();
    showToast('Disponibilidad semanal actualizada.', 'success');
  }

  function renderAllSections() {
    populateServiceSelectOptions();
    renderDashboard();
    renderAppointmentsTable();
    renderClientsTable();
    renderTestimonialsTable();
    renderSuggestionsTable();
    renderServicesGrid();
    renderGalleryGrid();
    renderFAQList();
    renderReceiptsTable();
    renderCalendarAdmin();
    loadPageEditor();
    loadConfig();
  }

  function bindFilters() {
    [
      ['appt-search', renderAppointmentsTable],
      ['appt-filter-status', renderAppointmentsTable],
      ['appt-filter-service', renderAppointmentsTable],
      ['client-search', renderClientsTable],
      ['client-sort', renderClientsTable],
      ['test-filter', renderTestimonialsTable],
      ['sug-filter-status', renderSuggestionsTable],
      ['sug-filter-type', renderSuggestionsTable],
      ['report-start', renderReportPanel],
      ['report-end', renderReportPanel]
    ].forEach(function (entry) {
      var el = document.getElementById(entry[0]);
      if (!el) return;
      el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', entry[1]);
    });
  }

  function bindActionButtons() {
    [
      { id: 'save-config-btn', handler: saveConfig },
      { id: 'save-page-content-btn', handler: savePageContent },
      { id: 'save-appt-btn', handler: saveApptEdit },
      { id: 'save-test-btn', handler: saveTestEdit },
      { id: 'save-service-btn', handler: saveService },
      { id: 'save-faq-btn', handler: saveFAQ },
      { id: 'save-gallery-btn', handler: saveGalleryItem },
      { id: 'save-receipt-btn', handler: saveReceipt }
    ].forEach(function (binding) {
      var button = document.getElementById(binding.id);
      if (!button) return;
      button.addEventListener('click', function (event) {
        var result;
        event.preventDefault();
        event.stopPropagation();
        try {
          result = binding.handler();
          if (result && typeof result.then === 'function') {
            result.catch(function (error) {
              console.error('Admin button action failed:', binding.id, error);
              showToast('No se pudo completar la accion.', 'error');
            });
          }
        } catch (error) {
          console.error('Admin button action failed:', binding.id, error);
          showToast('No se pudo completar la accion.', 'error');
        }
      });
    });
  }

  function setupNavigation() {
    var menuToggle = document.getElementById('menu-toggle');
    var sidebar = document.getElementById('sidebar');
    var sidebarOverlay = document.getElementById('sidebar-overlay');
    var sidebarClose = document.getElementById('sidebar-close');
    var navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-section]');
    var sections = document.querySelectorAll('.admin-section');

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', function () {
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('visible');
      });
    }
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    navItems.forEach(function (button) {
      button.addEventListener('click', function () {
        var section = button.getAttribute('data-section');
        navItems.forEach(function (item) { item.classList.remove('active'); });
        sections.forEach(function (panel) { panel.classList.add('hidden'); });
        button.classList.add('active');
        if (document.getElementById('sec-' + section)) document.getElementById('sec-' + section).classList.remove('hidden');
        if (document.getElementById('topbar-title')) document.getElementById('topbar-title').textContent = button.textContent.trim();
        closeSidebar();

        if (section === 'dashboard') renderDashboard();
        if (section === 'appointments') renderAppointmentsTable();
        if (section === 'clients') renderClientsTable();
        if (section === 'testimonials') renderTestimonialsTable();
        if (section === 'suggestions') renderSuggestionsTable();
        if (section === 'services') renderServicesGrid();
        if (section === 'gallery') renderGalleryGrid();
        if (section === 'faq') renderFAQList();
        if (section === 'calendar') renderCalendarAdmin();
        if (section === 'page-editor') loadPageEditor();
        if (section === 'receipts') renderReceiptsTable();
        if (section === 'config') loadConfig();
      });
    });

    if (document.getElementById('logout-btn')) {
      document.getElementById('logout-btn').addEventListener('click', function () {
        try {
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
        } catch (error) {}
        try {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        } catch (error) {}
        showToast('Sesion cerrada.', 'success');
        window.location.reload();
      });
    }
  }

  function initLogin() {
    var loginForm = document.getElementById('login-form');
    var loginScreen = document.getElementById('login-screen');
    var adminPanel = document.getElementById('admin-panel');
    var loginError = document.getElementById('login-error');
    var passToggle = document.getElementById('pass-toggle');
    var loginPass = document.getElementById('login-pass');
    var loginUser = document.getElementById('login-user');

    function isLoggedIn() {
      try {
        return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
      } catch (error) {
        return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
      }
    }

    function persistLogin() {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch (error) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      }
    }

    function showAdmin() {
      if (loginScreen) loginScreen.classList.add('hidden');
      if (adminPanel) adminPanel.classList.remove('hidden');
    }

    async function runLogin(event) {
      if (event) event.preventDefault();

      var user = loginUser ? loginUser.value.trim() : '';
      var pass = loginPass ? loginPass.value.trim() : '';
      var adminRecord;

      if (!user || !pass) {
        if (loginError) loginError.textContent = 'Escribe tu usuario y contrasena.';
        return false;
      }

      if (!window.PalSupabaseSync || typeof window.PalSupabaseSync.authenticateAdmin !== 'function') {
        if (loginError) loginError.textContent = 'No se pudo conectar con el sistema de acceso.';
        return false;
      }

      try {
        adminRecord = await window.PalSupabaseSync.authenticateAdmin(user, pass);
      } catch (error) {
        console.error('Admin login RPC error:', error);
        if (loginError) loginError.textContent = 'No se pudo verificar el acceso. Intenta de nuevo.';
        return false;
      }

      if (!adminRecord) {
        if (loginError) loginError.textContent = 'Usuario o contrasena incorrectos.';
        return false;
      }

      persistLogin();
      if (loginError) loginError.textContent = '';
      showAdmin();

      try {
        safeEnsureDemoData();
        renderAllSections();
        showToast('Bienvenida al panel.', 'success');
      } catch (error) {
        console.error('Admin render error after login:', error);
        showToast('Entraste al panel, pero una seccion fallo al cargar.', 'error');
      }

      return false;
    }

    if (passToggle && loginPass) {
      passToggle.addEventListener('click', function () {
        var isPass = loginPass.type === 'password';
        loginPass.type = isPass ? 'text' : 'password';
        passToggle.innerHTML = '<i class="fas fa-' + (isPass ? 'eye-slash' : 'eye') + '"></i>';
      });
    }

    if (isLoggedIn()) {
      showAdmin();
      try {
        safeEnsureDemoData();
        renderAllSections();
      } catch (error) {
        console.error('Admin render error on persisted session:', error);
      }
    }

    if (loginForm) {
      loginForm.addEventListener('submit', runLogin);
    }
  }

  function wireGlobals() {
    window.closeModal = closeModal;
    window.closeConfirm = function () { closeModal('confirm-modal'); };
    window.exportCSV = exportCSV;
    window.exportData = exportData;
    window.addAvailHour = addAvailHour;
    window.removeAvailHour = removeAvailHour;
    window.addBlockedRule = addBlockedRule;
    window.removeBlockedRule = removeBlockedRule;
    window.syncRuleDate = syncRuleDate;
    window.selectCalendarSlot = selectCalendarSlot;
    window.blockDate = blockDate;
    window.unblockDate = unblockDate;
    window.toggleUnavailableWeekday = toggleUnavailableWeekday;
    window.renderCalDayView = renderCalDayView;
    window.openGalleryItemModal = openGalleryItemModal;
    window.openServiceModal = openServiceModal;
    window.openFAQModal = openFAQModal;
    window.addScheduleRow = addScheduleRow;
    window.removeScheduleRow = removeScheduleRow;
    window.savePageContent = savePageContent;
    window.resetPageContent = resetPageContent;
    window.openReceiptModal = openReceiptModal;
    window.saveConfig = saveConfig;
    window.saveConfigValues = saveConfigValues;
    window.confirmClearData = confirmClearData;
    window.confirmResetDemo = confirmResetDemo;
    window.openApptEditModal = openApptEditModal;
    window.openAppointmentInGoogleCalendar = openAppointmentInGoogleCalendar;
    window.saveApptEdit = saveApptEdit;
    window.setAppointmentStatus = setAppointmentStatus;
    window.deleteAppointment = deleteAppointment;
    window.openClientDetail = openClientDetail;
    window.saveClientNotes = saveClientNotes;
    window.setReportRange = setReportRange;
    window.applyReportRange = applyReportRange;
    window.openTestimonialEditModal = openTestimonialEditModal;
    window.saveTestEdit = saveTestEdit;
    window.setTestimonialStatus = setTestimonialStatus;
    window.deleteTestimonial = deleteTestimonial;
    window.setSuggestionStatus = setSuggestionStatus;
    window.deleteSuggestion = deleteSuggestion;
    window.saveService = saveService;
    window.toggleServiceActive = toggleServiceActive;
    window.deleteService = deleteService;
    window.saveFAQ = saveFAQ;
    window.toggleFAQActive = toggleFAQActive;
    window.deleteFAQ = deleteFAQ;
    window.saveGalleryItem = saveGalleryItem;
    window.toggleGalleryActive = toggleGalleryActive;
    window.deleteGalleryItem = deleteGalleryItem;
    window.saveReceipt = saveReceipt;
    window.viewReceipt = viewReceipt;
    window.deleteReceipt = deleteReceipt;
    window.printReceipt = printReceipt;
    window.shareReceiptWA = shareReceiptWA;
    window.changeAdminMonth = changeAdminMonth;
    window.viewDateInAdmin = viewDateInAdmin;
    window.testCalendarWebhook = testCalendarWebhook;
  }

  function addCalendarNavIfMissing() {
    var sidebarList = document.querySelector('.sidebar-nav ul');
    if (!sidebarList) return;
    if (document.querySelector('.nav-item[data-section="calendar"]')) return;
    var li = document.createElement('li');
    li.innerHTML = '<button class="nav-item" data-section="calendar"><i class="fas fa-calendar-alt"></i> Calendario</button>';
    var clientsItem = document.querySelector('.nav-item[data-section="clients"]');
    if (clientsItem && clientsItem.parentNode) {
      clientsItem.parentNode.parentNode.insertBefore(li, clientsItem.parentNode);
    } else {
      sidebarList.appendChild(li);
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    if (window.PalSupabaseSync) {
      await window.PalSupabaseSync.hydrateLocalCache();
    }
    var bootOk = safeEnsureDemoData();
    addCalendarNavIfMissing();
    wireGlobals();
    setupNavigation();
    bindFilters();
    bindActionButtons();
    initLogin();
    if (!bootOk) {
      showToast('Hubo un problema cargando algunos datos del panel. Intenta entrar de nuevo o reinicia los datos desde el navegador.', 'error');
    }
  });
})();
