import moment from 'moment';
import { Alert } from 'react-native';
import { Calendar } from 'expo';

const { AlarmMethod, CalendarType, CalendarAccessLevel } = Calendar;

class CalendarService {
  static async addEvent(event = {}) {
    try {
      const calendar = await CalendarService._findEditableCalendar();

      if (!calendar) {
        Alert.alert(
          'Event not added!',
          'No calendar to add.',
          [{ text: 'Ok' }]
        );

        return;
      }

      const similarEvent = await CalendarService._findSimilarEvent(calendar.id, event);

      if (similarEvent) {
        Alert.alert(
          'Already added',
          'Event has already added',
          [{ text: 'Ok' }]);

        return;
      }

      await CalendarService._createEvent(calendar.id, event);

      Alert.alert(
        'Event added!',
        `Event added in ${calendar.title} calendar`,
        [{ text: 'Ok' }]
      );
    } catch (err) {
      Alert.alert('Event not added!', `Error: ${err}`, [{ text: 'Ok' }]);
    }
  }

  static async _findEditableCalendar() {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const editableCalendars = calendars.filter(({ allowsModifications }) => allowsModifications);
    let ownerCalendar;

    if (!editableCalendars.length) {
      return null;
    }
    
    ownerCalendar = calendars.find(
      ({ accessLevel }) => accessLevel === CalendarAccessLevel.OWNER
    );
    

    return ownerCalendar || editableCalendars[0];
  }

  static async _findSimilarEvent(calendarId, { title, startDate, finishDate }) {
    const events = await Calendar.getEventsAsync([calendarId], startDate, finishDate);

    return events.find(event => event.title === title);
  }

  static async _createEvent(id, { title, notes, startDate, finishDate }) {
    const alarms = [
      {
        method: AlarmMethod.ALERT,
        absoluteDate: startDate,
        relativeOffset: -40,
      },
    ];

    if (startDate !== finishDate) {
      alarms.push({
        method: AlarmMethod.ALERT,
        absoluteDate: startDate,
        relativeOffset: -1440,
      });
    }

    await Calendar.createEventAsync(id, {
      title,
      notes,
      alarms,
      endDate: finishDate,
      timeZone: `${moment(startDate).utcOffset()}`,
      startDate,
    });
  }
}

export default CalendarService;