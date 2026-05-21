'use strict';

(function () {
  var SUPABASE_REST_URL = 'https://wrtfzjojwgduidtpgjib.supabase.co/rest/v1';
  var SUPABASE_ANON_KEY = 'sb_publishable_lp8gdfAI9KjCclcmw4y6zg_4bw3VPP0';
  var APP_STATE_KEYS = [
    'pal_init',
    'pal_services',
    'pal_faqs',
    'pal_schedule',
    'pal_availability',
    'pal_gallery',
    'pal_testimonials',
    'pal_appointments',
    'pal_suggestions',
    'pal_page_content',
    'pal_config',
    'pal_clients',
    'pal_receipts'
  ];
  var DEFAULT_WEEKLY_HOURS = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  var syncTimers = {};

  function buildHeaders(extra) {
    var headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY
    };
    Object.keys(extra || {}).forEach(function (key) {
      headers[key] = extra[key];
    });
    return headers;
  }

  function request(path, options) {
    return fetch(SUPABASE_REST_URL + path, options).then(function (response) {
      if (!response.ok) {
        return response.text().then(function (text) {
          throw new Error('Supabase request failed: ' + response.status + ' ' + path + (text ? ' :: ' + text : ''));
        });
      }
      if (response.status === 204) return null;
      return response.text().then(function (text) {
        return text ? JSON.parse(text) : null;
      });
    });
  }

  function selectRows(table, select) {
    return request('/' + table + '?select=' + encodeURIComponent(select || '*'), {
      method: 'GET',
      headers: buildHeaders()
    });
  }

  function deleteAllRows(table) {
    return request('/' + table + '?id=not.is.null', {
      method: 'DELETE',
      headers: buildHeaders({
        Prefer: 'return=minimal'
      })
    }).catch(function (error) {
      if (table === 'business_hours') {
        return request('/' + table + '?weekday=gte.0', {
          method: 'DELETE',
          headers: buildHeaders({
            Prefer: 'return=minimal'
          })
        });
      }
      if (table === 'site_content') {
        return request('/' + table + '?section_key=like.*', {
          method: 'DELETE',
          headers: buildHeaders({
            Prefer: 'return=minimal'
          })
        });
      }
      if (table === 'app_settings') {
        return request('/' + table + '?setting_key=like.*', {
          method: 'DELETE',
          headers: buildHeaders({
            Prefer: 'return=minimal'
          })
        });
      }
      if (table === 'customers') {
        return request('/' + table + '?full_name=like.*', {
          method: 'DELETE',
          headers: buildHeaders({
            Prefer: 'return=minimal'
          })
        });
      }
      throw error;
    });
  }

  function insertRows(table, rows) {
    if (!rows || !rows.length) return Promise.resolve(true);
    return request('/' + table, {
      method: 'POST',
      headers: buildHeaders({
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      }),
      body: JSON.stringify(rows)
    }).then(function () { return true; });
  }

  function upsertRows(table, rows, conflictColumn) {
    if (!rows || !rows.length) return Promise.resolve(true);
    return request('/' + table + '?on_conflict=' + encodeURIComponent(conflictColumn), {
      method: 'POST',
      headers: buildHeaders({
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      }),
      body: JSON.stringify(rows)
    }).then(function () { return true; });
  }

  function authenticateAdmin(username, password) {
    return request('/rpc/authenticate_admin', {
      method: 'POST',
      headers: buildHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        input_username: username,
        input_password: password
      })
    }).then(function (rows) {
      return Array.isArray(rows) && rows.length ? rows[0] : null;
    });
  }

  function safeSetLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Local cache write failed for', key, error);
    }
  }

  function safeGetLocal(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function toDateString(value) {
    if (!value) return '';
    return String(value).split('T')[0];
  }

  function formatHour24To12(value) {
    var parts;
    var hour;
    var minute;
    var suffix;
    var normalizedHour;

    if (!value) return '';
    parts = String(value).split(':');
    hour = Number(parts[0]);
    minute = parts[1] || '00';
    suffix = hour >= 12 ? 'PM' : 'AM';
    normalizedHour = hour % 12;
    if (normalizedHour === 0) normalizedHour = 12;
    return normalizedHour + ':' + minute + ' ' + suffix;
  }

  function parseHour12To24(value) {
    var match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    var hour;
    var minute;
    var suffix;

    if (!match) return null;
    hour = Number(match[1]);
    minute = match[2];
    suffix = match[3].toUpperCase();
    if (suffix === 'PM' && hour !== 12) hour += 12;
    if (suffix === 'AM' && hour === 12) hour = 0;
    return String(hour).padStart(2, '0') + ':' + minute + ':00';
  }

  function mapServicesFromRows(rows) {
    return (rows || []).sort(function (a, b) {
      return Number(a.sort_order || 0) - Number(b.sort_order || 0);
    }).map(function (row) {
      return {
        id: row.legacy_id || row.id,
        category: row.category,
        name: row.name_es,
        nameEn: row.name_en || '',
        description: row.description_es || '',
        descriptionEn: row.description_en || '',
        icon: row.icon || 'fas fa-hand-sparkles',
        price: Number(row.price || 0),
        active: row.is_active !== false
      };
    });
  }

  function mapFaqsFromRows(rows) {
    return (rows || []).sort(function (a, b) {
      return Number(a.sort_order || 0) - Number(b.sort_order || 0);
    }).map(function (row) {
      return {
        id: row.legacy_id || row.id,
        q: row.question_es,
        qEn: row.question_en || '',
        a: row.answer_es,
        aEn: row.answer_en || '',
        active: row.is_active !== false
      };
    });
  }

  function mapGalleryFromRows(rows) {
    return (rows || []).sort(function (a, b) {
      return Number(a.sort_order || 0) - Number(b.sort_order || 0);
    }).map(function (row) {
      return {
        id: row.legacy_id || row.id,
        title: row.title_es,
        titleEn: row.title_en || '',
        desc: row.description_es || '',
        descEn: row.description_en || '',
        category: row.category,
        beforeImg: row.before_image_url || '',
        afterImg: row.after_image_url || '',
        active: row.is_active !== false
      };
    });
  }

  function mapTestimonialsFromRows(rows) {
    return (rows || []).map(function (row) {
      return {
        id: row.legacy_id || row.id,
        name: row.customer_name,
        service: row.service_name || '',
        rating: Number(row.rating || 5),
        comment: row.comment || '',
        date: row.testimonial_date || toDateString(row.created_at),
        status: row.status
      };
    });
  }

  function mapSuggestionsFromRows(rows) {
    return (rows || []).map(function (row) {
      return {
        id: row.legacy_id || row.id,
        name: row.customer_name,
        email: row.customer_email || '',
        type: row.suggestion_kind,
        message: row.message || '',
        date: toDateString(row.created_at),
        status: row.status
      };
    });
  }

  function mapAppointmentsFromRows(rows, serviceRows) {
    var servicesByAppointment = {};

    (serviceRows || []).forEach(function (row) {
      if (!servicesByAppointment[row.appointment_id]) {
        servicesByAppointment[row.appointment_id] = [];
      }
      servicesByAppointment[row.appointment_id].push(row.service_name_snapshot);
    });

    return (rows || []).map(function (row) {
      var services = servicesByAppointment[row.id] || [];
      return {
        id: row.legacy_id || row.id,
        name: row.customer_name,
        phone: row.customer_phone || '',
        email: row.customer_email || '',
        service: services.length ? services.join(', ') : '',
        services: services,
        date: row.appointment_date,
        time: row.appointment_time,
        comments: row.comments || '',
        contactPref: row.contact_preference,
        status: row.status,
        createdAt: toDateString(row.created_at),
        calendarEventId: row.calendar_event_id || '',
        calendarSynced: row.calendar_synced === true,
        calendarSyncedAt: row.calendar_synced_at || ''
      };
    });
  }

  function mapCustomersFromRows(rows, appointments) {
    return (rows || []).map(function (row) {
      var relatedAppointments = (appointments || []).filter(function (appt) {
        return (row.email && appt.email === row.email) || (row.phone && appt.phone === row.phone);
      });
      var servicesMap = {};
      relatedAppointments.forEach(function (appt) {
        (appt.services && appt.services.length ? appt.services : [appt.service]).forEach(function (service) {
          if (service) servicesMap[service] = true;
        });
      });
      return {
        id: row.id,
        name: row.full_name,
        phone: row.phone || '',
        email: row.email || '',
        appointments: relatedAppointments.length,
        services: Object.keys(servicesMap),
        lastAppt: relatedAppointments.map(function (appt) { return appt.date; }).sort().slice(-1)[0] || '',
        notes: row.notes || ''
      };
    });
  }

  function mapReceiptsFromRows(rows) {
    return (rows || []).map(function (row) {
      return {
        id: row.legacy_id || row.id,
        client: row.customer_name,
        phone: row.customer_phone || '',
        email: row.customer_email || '',
        service: row.service_name,
        date: row.receipt_date,
        price: Number(row.price || 0),
        discount: Number(row.discount || 0),
        total: Number(row.total || 0),
        payment: row.payment_method,
        notes: row.notes || ''
      };
    });
  }

  function mapScheduleFromRows(rows) {
    return (rows || []).sort(function (a, b) {
      return Number(a.weekday || 0) - Number(b.weekday || 0);
    }).map(function (row) {
      return {
        day: row.day_name_es,
        dayEn: row.day_name_en,
        hours: row.is_closed ? 'Cerrado / Closed' : formatHour24To12(row.open_time) + ' - ' + formatHour24To12(row.close_time)
      };
    });
  }

  function mapAvailabilityFromRows(hoursRows, ruleRows) {
    return {
      weeklyHours: DEFAULT_WEEKLY_HOURS.slice(),
      unavailableWeekdays: (hoursRows || []).filter(function (row) { return row.is_closed; }).map(function (row) { return Number(row.weekday); }),
      blockedDates: [],
      blockedSlots: {},
      blockedRules: (ruleRows || []).map(function (row) {
        return {
          id: row.id,
          day: row.day_name || '',
          date: row.specific_date || '',
          time: row.specific_time || '',
          type: row.rule_type
        };
      })
    };
  }

  function mapPageContentFromRows(rows) {
    var byKey = {};
    (rows || []).forEach(function (row) {
      byKey[row.section_key] = row.content || {};
    });
    return {
      heroTitle: byKey.hero && byKey.hero.title ? byKey.hero.title : '',
      heroSubtitle: byKey.hero && byKey.hero.subtitle ? byKey.hero.subtitle : '',
      aboutTitle: byKey.about && byKey.about.title ? byKey.about.title : '',
      aboutText: byKey.about && byKey.about.text ? byKey.about.text : '',
      footerDesc: byKey.footer && byKey.footer.description ? byKey.footer.description : ''
    };
  }

  function mapBusinessConfigFromRows(rows) {
    var row = (rows || []).find(function (item) { return item.setting_key === 'business'; });
    return row ? row.setting_value : null;
  }

  function replaceServices(items) {
    return deleteAllRows('services').then(function () {
      return insertRows('services', (items || []).map(function (item, index) {
        return {
          legacy_id: item.id || ('service-' + index),
          category: item.category || 'gel',
          name_es: item.name || '',
          name_en: item.nameEn || '',
          description_es: item.description || '',
          description_en: item.descriptionEn || '',
          icon: item.icon || 'fas fa-hand-sparkles',
          price: Number(item.price || 0),
          is_active: item.active !== false,
          sort_order: index
        };
      }));
    });
  }

  function replaceFaqs(items) {
    return deleteAllRows('faqs').then(function () {
      return insertRows('faqs', (items || []).map(function (item, index) {
        return {
          legacy_id: item.id || ('faq-' + index),
          question_es: item.q || '',
          question_en: item.qEn || '',
          answer_es: item.a || '',
          answer_en: item.aEn || '',
          is_active: item.active !== false,
          sort_order: index
        };
      }));
    });
  }

  function replaceGallery(items) {
    return deleteAllRows('gallery_items').then(function () {
      return insertRows('gallery_items', (items || []).map(function (item, index) {
        return {
          legacy_id: item.id || ('gallery-' + index),
          title_es: item.title || '',
          title_en: item.titleEn || '',
          description_es: item.desc || '',
          description_en: item.descEn || '',
          category: item.category || 'gel',
          before_image_url: item.beforeImg || '',
          after_image_url: item.afterImg || '',
          is_active: item.active !== false,
          sort_order: index
        };
      }));
    });
  }

  function replaceTestimonials(items) {
    return deleteAllRows('testimonials').then(function () {
      return insertRows('testimonials', (items || []).map(function (item, index) {
        return {
          legacy_id: item.id || ('testimonial-' + index),
          customer_name: item.name || '',
          service_name: item.service || '',
          rating: Number(item.rating || 5),
          comment: item.comment || '',
          testimonial_date: item.date || null,
          status: item.status || 'pendiente'
        };
      }));
    });
  }

  function replaceSuggestions(items) {
    return deleteAllRows('suggestions').then(function () {
      return insertRows('suggestions', (items || []).map(function (item, index) {
        return {
          legacy_id: item.id || ('suggestion-' + index),
          customer_name: item.name || '',
          customer_email: item.email || '',
          suggestion_kind: item.type || 'otro',
          message: item.message || '',
          status: item.status || 'nueva',
          created_at: item.date ? item.date + 'T00:00:00Z' : undefined
        };
      }));
    });
  }

  function replaceAppointments(items) {
    var appointmentIdMap = {};
    return deleteAllRows('appointment_services')
      .then(function () { return deleteAllRows('appointments'); })
      .then(function () {
        return request('/appointments?select=id,legacy_id', {
          method: 'POST',
          headers: buildHeaders({
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          }),
          body: JSON.stringify((items || []).map(function (item, index) {
            return {
              legacy_id: item.id || ('appointment-' + index),
              customer_name: item.name || '',
              customer_phone: item.phone || '',
              customer_email: item.email || '',
              appointment_date: item.date || null,
              appointment_time: item.time || '',
              comments: item.comments || '',
              contact_preference: item.contactPref || 'whatsapp',
              status: item.status || 'pendiente',
              calendar_event_id: item.calendarEventId || '',
              calendar_synced: item.calendarSynced === true,
              calendar_synced_at: item.calendarSyncedAt || null,
              created_at: item.createdAt ? item.createdAt + 'T00:00:00Z' : undefined
            };
          }))
        });
      })
      .then(function (rows) {
        (rows || []).forEach(function (row) {
          appointmentIdMap[row.legacy_id] = row.id;
        });
        return insertRows('appointment_services', (items || []).reduce(function (acc, item) {
          var services = item.services && item.services.length ? item.services : (item.service ? String(item.service).split(',').map(function (entry) { return entry.trim(); }).filter(Boolean) : []);
          services.forEach(function (serviceName) {
            acc.push({
              appointment_id: appointmentIdMap[item.id],
              service_name_snapshot: serviceName,
              price_snapshot: 0
            });
          });
          return acc;
        }, []));
      });
  }

  function replaceCustomers(items) {
    return deleteAllRows('customers').then(function () {
      return insertRows('customers', (items || []).map(function (item) {
        return {
          full_name: item.name || '',
          phone: item.phone || '',
          email: item.email || '',
          notes: item.notes || ''
        };
      }));
    });
  }

  function replaceReceipts(items) {
    return deleteAllRows('receipts').then(function () {
      return insertRows('receipts', (items || []).map(function (item, index) {
        return {
          legacy_id: item.id || ('receipt-' + index),
          customer_name: item.client || '',
          customer_phone: item.phone || '',
          customer_email: item.email || '',
          service_name: item.service || '',
          receipt_date: item.date || null,
          price: Number(item.price || 0),
          discount: Number(item.discount || 0),
          total: Number(item.total || 0),
          payment_method: item.payment || 'efectivo',
          notes: item.notes || ''
        };
      }));
    });
  }

  function replaceBusinessHours(schedule) {
    var weekdayMap = {
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
      domingo: 0
    };

    return deleteAllRows('business_hours').then(function () {
      return insertRows('business_hours', (schedule || []).map(function (row) {
        var dayName = String(row.day || '').toLowerCase();
        var weekday = weekdayMap[dayName];
        var closed = String(row.hours || '').toLowerCase().indexOf('cerrado') !== -1;
        var parts = String(row.hours || '').split(' - ');
        return {
          weekday: weekday,
          day_name_es: row.day || '',
          day_name_en: row.dayEn || '',
          open_time: closed ? null : parseHour12To24(parts[0]),
          close_time: closed ? null : parseHour12To24(parts[1]),
          is_closed: closed
        };
      }).filter(function (row) {
        return row.weekday !== undefined;
      }));
    });
  }

  function replaceAvailabilityRules(availability) {
    return deleteAllRows('availability_rules').then(function () {
      return insertRows('availability_rules', ((availability && availability.blockedRules) || []).map(function (rule) {
        var weekdayMap = {
          domingo: 0,
          lunes: 1,
          martes: 2,
          miercoles: 3,
          jueves: 4,
          viernes: 5,
          sabado: 6
        };
        return {
          rule_type: rule.type,
          weekday: rule.day ? weekdayMap[String(rule.day).toLowerCase()] : null,
          day_name: rule.day || null,
          specific_date: rule.date || null,
          specific_time: rule.time || null,
          source: 'frontend_sync'
        };
      }));
    });
  }

  function replacePageContent(content) {
    return deleteAllRows('site_content').then(function () {
      return insertRows('site_content', [
        { section_key: 'hero', content: { title: content.heroTitle || '', subtitle: content.heroSubtitle || '' } },
        { section_key: 'about', content: { title: content.aboutTitle || '', text: content.aboutText || '' } },
        { section_key: 'footer', content: { description: content.footerDesc || '' } }
      ]);
    });
  }

  function replaceBusinessConfig(config) {
    return upsertRows('app_settings', [{
      setting_key: 'business',
      setting_value: config || {}
    }], 'setting_key');
  }

  function hydrateLocalCache() {
    return Promise.allSettled([
      selectRows('services', '*'),
      selectRows('faqs', '*'),
      selectRows('gallery_items', '*'),
      selectRows('testimonials', '*'),
      selectRows('suggestions', '*'),
      selectRows('appointments', '*'),
      selectRows('appointment_services', '*'),
      selectRows('customers', '*'),
      selectRows('receipts', '*'),
      selectRows('business_hours', '*'),
      selectRows('availability_rules', '*'),
      selectRows('site_content', '*'),
      selectRows('app_settings', 'setting_key,setting_value')
    ]).then(function (results) {
      var services = results[0].status === 'fulfilled' ? results[0].value : [];
      var faqs = results[1].status === 'fulfilled' ? results[1].value : [];
      var gallery = results[2].status === 'fulfilled' ? results[2].value : [];
      var testimonials = results[3].status === 'fulfilled' ? results[3].value : [];
      var suggestions = results[4].status === 'fulfilled' ? results[4].value : [];
      var appointmentsRows = results[5].status === 'fulfilled' ? results[5].value : [];
      var appointmentServices = results[6].status === 'fulfilled' ? results[6].value : [];
      var customers = results[7].status === 'fulfilled' ? results[7].value : [];
      var receipts = results[8].status === 'fulfilled' ? results[8].value : [];
      var businessHours = results[9].status === 'fulfilled' ? results[9].value : [];
      var availabilityRules = results[10].status === 'fulfilled' ? results[10].value : [];
      var siteContent = results[11].status === 'fulfilled' ? results[11].value : [];
      var appSettings = results[12].status === 'fulfilled' ? results[12].value : [];
      var appointments = mapAppointmentsFromRows(appointmentsRows, appointmentServices);

      safeSetLocal('pal_services', mapServicesFromRows(services));
      safeSetLocal('pal_faqs', mapFaqsFromRows(faqs));
      safeSetLocal('pal_gallery', mapGalleryFromRows(gallery));
      safeSetLocal('pal_testimonials', mapTestimonialsFromRows(testimonials));
      safeSetLocal('pal_suggestions', mapSuggestionsFromRows(suggestions));
      safeSetLocal('pal_appointments', appointments);
      safeSetLocal('pal_clients', mapCustomersFromRows(customers, appointments));
      safeSetLocal('pal_receipts', mapReceiptsFromRows(receipts));
      safeSetLocal('pal_schedule', mapScheduleFromRows(businessHours));
      safeSetLocal('pal_availability', mapAvailabilityFromRows(businessHours, availabilityRules));
      safeSetLocal('pal_page_content', mapPageContentFromRows(siteContent));
      safeSetLocal('pal_config', mapBusinessConfigFromRows(appSettings));
      safeSetLocal('pal_init', true);
      return true;
    }).catch(function (error) {
      console.warn('Supabase hydration skipped:', error);
      return false;
    });
  }

  function queueSync(key, value) {
    if (APP_STATE_KEYS.indexOf(key) === -1 || key === 'pal_init') return;
    if (syncTimers[key]) clearTimeout(syncTimers[key]);
    syncTimers[key] = setTimeout(function () {
      var task = Promise.resolve(true);
      if (key === 'pal_services') task = replaceServices(value);
      else if (key === 'pal_faqs') task = replaceFaqs(value);
      else if (key === 'pal_gallery') task = replaceGallery(value);
      else if (key === 'pal_testimonials') task = replaceTestimonials(value);
      else if (key === 'pal_suggestions') task = replaceSuggestions(value);
      else if (key === 'pal_appointments') task = replaceAppointments(value);
      else if (key === 'pal_clients') task = replaceCustomers(value);
      else if (key === 'pal_receipts') task = replaceReceipts(value);
      else if (key === 'pal_schedule') task = replaceBusinessHours(value);
      else if (key === 'pal_availability') task = replaceAvailabilityRules(value);
      else if (key === 'pal_page_content') task = replacePageContent(value || {});
      else if (key === 'pal_config') task = replaceBusinessConfig(value || {});
      else task = Promise.resolve(true);

      task.catch(function (error) {
        console.warn('Supabase sync failed for', key, error);
      });
      delete syncTimers[key];
    }, 350);
  }

  function syncLocalStateKey(key) {
    return Promise.resolve(queueSync(key, safeGetLocal(key)));
  }

  window.PalSupabaseSync = {
    authenticateAdmin: authenticateAdmin,
    hydrateLocalCache: hydrateLocalCache,
    queueSync: queueSync,
    syncLocalStateKey: syncLocalStateKey,
    appStateKeys: APP_STATE_KEYS.slice()
  };
})();
