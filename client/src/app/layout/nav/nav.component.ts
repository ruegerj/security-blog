import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services';
import { Role } from '@data/enums';
import { User } from '@data/models';
import { AuthQuery } from '@data/queries';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
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

	authenticatedUser$: Observable<User | null>;

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private authQuery: AuthQuery,
	) {}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authQuery.authenticatedUser$;
	}

	logout(): void {
		this.authenticationService.logout().subscribe(() => {
			this.router.navigate(['/login']);
		});
	}
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
