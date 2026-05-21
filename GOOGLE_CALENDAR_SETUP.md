## Google Calendar Automatic Setup

This project can now send approved appointments from the admin panel to a Google Apps Script web app.

### 1. Create the Apps Script

1. Open `https://script.google.com/`
2. Create a new project.
3. Replace the default code with this:

```javascript
const DEFAULT_CALENDAR_ID = 'primary';
const SHARED_SECRET = 'CHANGE_THIS_SECRET';

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const rawPayload = (e.parameter && e.parameter.payload) || (e.postData && e.postData.contents) || '{}';
    const payload = JSON.parse(rawPayload);

    if (!payload.secret || payload.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const calendarId = payload.calendarId || DEFAULT_CALENDAR_ID;
    const timezone = payload.timezone || 'America/Puerto_Rico';
    const calendar = CalendarApp.getCalendarById(calendarId) || CalendarApp.getDefaultCalendar();

    const start = new Date(payload.start);
    const end = new Date(payload.end);

    const event = calendar.createEvent(payload.title, start, end, {
      description: payload.description || '',
      location: payload.location || ''
    });

    return jsonResponse({
      ok: true,
      eventId: event.getId(),
      eventUrl: event.getHtmlLink(),
      timezone: timezone
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message
    });
  }
}
```

### 2. Deploy it as a Web App

1. Click `Deploy`.
2. Click `New deployment`.
3. Choose `Web app`.
4. Set:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
5. Authorize the script.
6. Copy the `Web app URL`.

### 3. Configure the Admin Panel

Open the admin panel and go to `Ajustes > Google Calendar`.

Fill in:

- `Webhook URL de Apps Script`: the web app URL
- `Secreto compartido`: the same value you set in `SHARED_SECRET`
- `Calendar ID`: usually `primary`
- `Zona horaria`: for example `America/Puerto_Rico`
- `Duracion por cita (minutos)`: your default event length

Save the configuration.

Important:

- If you already created the Apps Script before this update, replace your existing `doPost()` code with the new version above.
- The admin panel now sends the appointment inside a form field called `payload`, so the Apps Script must read `e.parameter.payload`.

### 4. How it works

- When an appointment changes from `pendiente` or another status to `aprobada`, the panel sends it to the webhook.
- The send is done silently from the browser, so the admin is not redirected to Google Calendar.
- If the webhook is configured correctly, the event is created automatically in Google Calendar.

### Notes

- This setup creates a new event when the appointment is approved.
- Because this project is a static frontend, the browser sends the request in a silent cross-origin mode. That means the panel cannot reliably read the webhook response back from Apps Script, but it can still send the event creation request.
- If you later edit an already approved appointment, the panel does not update the existing Google Calendar event automatically yet.
- You can still use the Google Calendar button in the admin panel to open the updated event details manually.

### Official references

- Apps Script `doPost()` and Content service:
  `https://developers.google.com/apps-script/guides/content`
- Apps Script Calendar service:
  `https://developers.google.com/apps-script/reference/calendar`
- Google Calendar API event creation reference:
  `https://developers.google.com/workspace/calendar/api/v3/reference/events/insert`
