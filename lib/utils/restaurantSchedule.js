// lib/utils/restaurantSchedule.js
export const getCurrentApiDateTimeObj = () => {
	const now = new Date();
	const dayNo = now.getDay() === 0 ? 7 : now.getDay();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;
	const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
	return {dayNo: dayNo.toString(), time: formattedTime};
};

export const convertToMinutes = (timeStr) => {
	const [time, modifier] = timeStr.split(' ');
	let [hours, minutes] = time.split(':').map(Number);
	if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
	if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
	return hours * 60 + minutes;
};

export const getRestaurantScheduleStatus = (scheduleList, currentApiDateTimeObj) => {
	let status = 'CLOSED';
	const todaySchedule = scheduleList.find((day) => day.weekday_id === parseInt(currentApiDateTimeObj.dayNo));

	if (!todaySchedule || !todaySchedule.list?.length) return status;

	const currentMinutes = convertToMinutes(currentApiDateTimeObj.time);
	const shifts = todaySchedule.list.filter((shift) => shift.type === '3');
	if (!shifts.length) return status;

	let pastShifts = 0;
	for (let shift of shifts) {
		const openMinutes = convertToMinutes(shift.opening_time);
		const closeMinutes = convertToMinutes(shift.closing_time);
		if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
			return 'OPEN';
		} else if (currentMinutes > closeMinutes) {
			pastShifts++;
		}
	}

	return pastShifts >= shifts.length ? 'CLOSED' : 'PRE-ORDER';
};


// lib/utils/restaurantSchedule.js

export const getAvailableTimeSlots = (scheduleList, orderMode, policyTime) => {
	const {dayNo} = getCurrentApiDateTimeObj(); // use existing helper
	const todaySchedule = scheduleList.find((day) => day.weekday_id === parseInt(dayNo));

	if (!todaySchedule) return [];

	const shift = todaySchedule.list.find((s) => s.type === '3' && s[orderMode] && s[`${orderMode}_policy_id`]);

	if (!shift) return [];

	const convertToMinutes = (timeStr) => {
		const [time, modifier] = timeStr.split(' ');
		let [hours, minutes] = time.split(':').map(Number);
		if (modifier === 'PM' && hours !== 12) hours += 12;
		if (modifier === 'AM' && hours === 12) hours = 0;
		return hours * 60 + minutes;
	};

	const formatMinutesToTime = (mins) => {
		const hours24 = Math.floor(mins / 60);
		const minutes = mins % 60;
		const hours12 = hours24 % 12 || 12;
		const ampm = hours24 >= 12 ? 'PM' : 'AM';
		return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
	};

	const openingMinutes = convertToMinutes(shift.opening_time) + parseInt(policyTime);
	const closingMinutes = convertToMinutes(shift.closing_time);

	const slots = [];
	for (let mins = openingMinutes; mins <= closingMinutes; mins += 15) {
		slots.push(formatMinutesToTime(mins));
	}

	return slots;
};


