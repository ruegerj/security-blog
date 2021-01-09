import {
	Directive,
	Input,
	OnDestroy,
	OnInit,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { Role } from '@data/enums';
import { User } from '@data/models';
import { AuthQuery } from '@data/queries';
import { Subscription } from 'rxjs';

/**
 * Directive which only displays the child content if the user is authenticated and if the role claims are fullfilled (if roles set)
 */
@Directive({
	selector: '[auth]',
})
export class AuthDirective implements OnInit, OnDestroy {
	/**
	 * Subscription for the authenticated user from the AuthStore
	 */
	private userSubscription: Subscription;

	/**
	 * Roles which should be used for authorization
	 */
	private roles: Role[] = [];

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private authQuery: AuthQuery,
	) {}

	/**
	 * Optional roles which should be checked => atleast one role must be satisfied by the current user
	 */
	@Input()
	set auth(roles: Role[]) {
		this.roles = roles;
	}

	ngOnInit(): void {
		this.userSubscription = this.authQuery.authenticatedUser$.subscribe(
			(authenticatedUser) => {
				// If user authenticated and satifies role claims => render template
				if (authenticatedUser && this.isInRole(authenticatedUser)) {
					this.viewContainer.createEmbeddedView(this.templateRef);
					return;
				}

				// Clear template e.g. remove from DOM
				this.viewContainer.clear();
			},
		);
	}

	ngOnDestroy(): void {
		// Unsubscribe in order to prevent memory leaks
		this.userSubscription?.unsubscribe();
	}

	/**
	 * Checks wether the provided user atleast has one required role assigned
	 * @param user Current user which should be checked
	 */
	isInRole(user: User): boolean {
		if (this.roles.length == 0) {
			return true;
		}

		return user.roles.some((r) => this.roles.includes(r));
	}
}
