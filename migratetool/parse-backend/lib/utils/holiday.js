import { calendar } from './calendar';

export const holiday = {
	holidayInfo: [{
		name: '元旦',
		solarDate: '1-1'
	}, {
		name: '情人节',
		solarDate: '2-14'
	}, {
		name: '植树节',
		solarDate: '3-12'
	}, {
		name: '愚人节',
		solarDate: '4-1'
	}, {
		name: '清明节',
		solarDate: '4-5'
	}, {
		name: '劳动节',
		solarDate: '5-1'
	}, {
		name: '青年节',
		solarDate: '5-4'
	}, {
		name: '儿童节',
		solarDate: '6-1'
	}, {
		name: '建党节',
		solarDate: '7-1'
	}, {
		name: '建军节',
		solarDate: '8-1'
	}, {
		name: '教师节',
		solarDate: '9-10'
	}, {
		name: '国庆节',
		solarDate: '10-1'
	}, {
		name: '圣诞节',
		solarDate: '12-25'
	}, {
		name: '腊八节',
		lunarDate: '12-8'
	}, {
		name: '小年',
		lunarDate: '12-23'
	}, {
		name: '春节',
		lunarDate: '1-1'
	}, {
		name: '端午节',
		lunarDate: '5-5'
	}, {
		name: '七夕',
		lunarDate: '7-7'
	}, {
		name: '中秋节',
		lunarDate: '8-15'
	}],
	offHolidayInfo: [{
		name: '元旦',
		month: 1,
		day: 1,
		isSolar: true,
		daysOff: 1
	}, {
		name: '春节',
		month: 1,
		day: 1,
		isSolar: false,
		daysOff: 3
	}, {
		name: '清明节',
		month: 4,
		day: 5,
		isSolar: true,
		daysOff: 1
	}, {
		name: '劳动节',
		month: 5,
		day: 1,
		isSolar: true,
		daysOff: 1
	}, {
		name: '端午节',
		month: 5,
		day: 5,
		isSolar: false,
		daysOff: 1
	}, {
		name: '国庆节',
		month: 10,
		day: 1,
		isSolar: true,
		daysOff: 3
	}, {
		name: '中秋节',
		month: 8,
		day: 15,
		isSolar: false,
		daysOff: 1
	}],

	is: (date) => {
		let calendarInfo = calendar.solar2lunar(date.getFullYear(), date.getMonth()+1, date.getDate());
		let solarDate = `${calendarInfo.cMonth}-${calendarInfo.cDay}`;
		let lunarDate = `${calendarInfo.lMonth}-${calendarInfo.lDay}`;
		let result = holiday.holidayInfo.find(item => {
			if (item.solarDate) return item.solarDate === solarDate;
			if (item.lunarDate) return item.lunarDate === lunarDate;

			return false;
		});

		if (!!result)	return result.name;
		if (!!calendarInfo.Term)	return calendarInfo.Term;

		return undefined;
	},

	isSetable: (date) => {
		let calendarInfo = calendar.solar2lunar(date.getFullYear(), date.getMonth()+1, date.getDate());
		let solarDate = `${calendarInfo.cMonth}-${calendarInfo.cDay}`;
		let lunarDate = `${calendarInfo.lMonth}-${calendarInfo.lDay}`;
		let result = holiday.holidayInfo.find(item => {
			if (item.solarDate) return item.solarDate === solarDate;
			if (item.lunarDate) return item.lunarDate === lunarDate;

			return false;
		});

		if (!!result)	return result.name;

		return undefined;
	}
}
