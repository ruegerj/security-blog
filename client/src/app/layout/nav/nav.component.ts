import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services';
import { User } from '@data/models';
import { AuthQuery } from '@data/queries';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
	authenticatedUser$: Observable<User | null>;

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private authQuery: AuthQuery,
	) {}

	isActiveRoute(url: string): boolean {
		return this.router.url == url;
	}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authQuery.authenticatedUser$;
	}

	logout(): void {
		this.authenticationService.logout().subscribe(() => {
			this.router.navigate(['/login']);
		});
	}
}
