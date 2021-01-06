/**
 * Guard which throws an exception if its detected, that the specified module already has been loaded outside the root `AppModule`
 * @param parentModule Injected parent module
 * @param moduleName Name of the module which should be guarded
 */
export function throwIfAlreadyLoaded(
	parentModule: unknown,
	moduleName: string,
): void {
	if (parentModule) {
		throw new Error(
			`${moduleName} has already been loaded. Only import ${moduleName} in the root AppModule`,
		);
	}
}
