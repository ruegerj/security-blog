import { Component, OnInit } from '@angular/core';
import { Role } from '@data/enums';

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
			authenticated: false,
		},
		{
			title: 'User Dashboard',
			link: '/user/dashboard',
			authenticated: true,
			roles: [Role.User],
		},
		{
			title: 'Admin Dashboard',
			link: '/admin/dashboard',
			authenticated: true,
			roles: [Role.Admin],
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
	authenticated: boolean;
	roles?: Role[];
}
