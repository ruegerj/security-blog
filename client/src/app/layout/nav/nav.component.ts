import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
	navItems: NavItem[] = [
		{
			title: 'Home',
			link: '/home',
		},
	];

	constructor() {}

	ngOnInit(): void {}
}

/**
 * Represents a single nav item (link) in the navbar
 */
interface NavItem {
	title: string;
	link: string;
}
