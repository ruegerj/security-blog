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

	/**
	 * Template ref to element wich should be displayed if the auth condition fails
	 */
	elseTemplate?: TemplateRef<any> = undefined;

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private authQuery: AuthQuery,
	) {}

	/**
	 * Optional roles which should be checked => atleast one role must be satisfied by the current user
	 */
	@Input()
	set auth(roles: Role[] | string) {
		// No param provided => set to default
		if (typeof roles === 'string') {
			this.roles = [];
			return;
		}

		this.roles = roles;
	}

	/**
	 * Reference to a template which should be rendered, if the user is not authenticated or isnt authorized
	 */
	@Input()
	set authElse(ref: TemplateRef<any>) {
		this.elseTemplate = ref;
	}

	ngOnInit(): void {
		this.userSubscription = this.authQuery.authenticatedUser$.subscribe(
			(authenticatedUser) => {
				// If user authenticated and satifies role claims => render template
				if (authenticatedUser && this.isInRole(authenticatedUser)) {
					this.viewContainer.createEmbeddedView(this.templateRef);
					return;
				} else if (this.elseTemplate) {
					// Render "else" tempalte
					this.viewContainer.clear();
					this.viewContainer.createEmbeddedView(this.elseTemplate);
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
