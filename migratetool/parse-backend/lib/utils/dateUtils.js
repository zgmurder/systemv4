import moment from 'moment';
import { WeekDays } from '../Constants';

export default {
    isBadWeather: function(name) {
        return (name.indexOf('风') > -1) ||
          (name.indexOf('雪') > -1) ||
          (name.indexOf('寒') > -1) ||
          (name.indexOf('热') > -1) ||
          (name.indexOf('雨') > -1);
      },

      weekday: function(date) {
        let dayOfWeek = moment(date).day();

        return {
          name: WeekDays[dayOfWeek].name,
          date: date,
          dayOfWeek: dayOfWeek,
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6
        };
      },

      isWeekend: function(weekday) {
        if (weekday === 0 || weekday === 6 ||
          weekday === WeekDays[0].name || weekday === WeekDays[6].name) {
          return true;
        } else {
          return false;
        }
      },

      weekOfMonth: function(date) {
        let momDate = moment(date);
        if (momDate.day() === 0) {
          momDate = momDate.subtract(2, 'days');
          date = new Date(momDate.year(), momDate.month(), momDate.date());
        }

        let weekStart = moment(date).weekday(1);
        let weekEnd = moment(date).weekday(7);
        let weekMiddle = moment(date).weekday(4);


        let weekSeq = 0;
        if (weekMiddle.month() != weekStart.month()) {
          weekSeq = 1;
        } else {
          let firstWeekStart = moment(date).weekday(4).date(1).weekday(1);
          let firstWeekMiddle = moment(date).weekday(4).date(1).weekday(4);
          if (firstWeekMiddle.month() != weekMiddle.month()) {
            firstWeekMiddle = moment(date).weekday(4).date(1).weekday(11);
          }

          weekSeq = (weekMiddle.date() - firstWeekMiddle.date()) / 7 + 1;
        }

        return {
          year: weekMiddle.year(),
          month: weekMiddle.month() + 1,
          weekSeq: weekSeq,
          weekStart: new Date(weekStart.year(), weekStart.month(), weekStart.date()),
          weekMiddle: new Date(weekMiddle.year(), weekMiddle.month(), weekMiddle.date()),
          weekEnd: new Date(weekEnd.year(), weekEnd.month(), weekEnd.date(), 23, 59, 59)
        }
      },

      isSameWeek: function(date1, date2) {
        let week1 = weekOfMonth(date1);
        let week2 = weekOfMonth(date2);
        return week1.year === week2.year && week1.month === week2.month && week1.weekSeq === week2.weekSeq;
      }
}
