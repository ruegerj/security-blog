import { Pipe, PipeTransform } from '@angular/core';

// Credits: https://medium.com/@thunderroid/angular-date-ago-pipe-minutes-hours-days-months-years-ago-c4b5efae5fe5

/**
 * Transform the passed date to a relative time string: ... ago
 */
@Pipe({
	name: 'dateAgo',
	pure: true,
})
export class DateAgoPipe implements PipeTransform {
	transform(value: Date, ...args: unknown[]): unknown {
		if (value) {
			const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
			if (seconds < 29) {
				// less than 30 seconds ago will show as 'Just now'
				return 'Just now';
			}

			const intervals: Record<string, number> = {
				year: 31536000,
				month: 2592000,
				week: 604800,
				day: 86400,
				hour: 3600,
				minute: 60,
				second: 1,
			};

			let counter;
			for (const i in intervals) {
				counter = Math.floor(seconds / intervals[i]);

				if (counter > 0) {
					if (counter === 1) {
						return counter + ' ' + i + ' ago'; // singular (1 day ago)
					} else {
						return counter + ' ' + i + 's ago'; // plural (2 days ago)
					}
				}
			}
		}
		return value;
	}
}
