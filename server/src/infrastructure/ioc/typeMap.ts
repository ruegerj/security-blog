/**
 * Global mapping of types to symbols which are used with the ioc container for resolving dependencies
 */
export const TypeMap = {
	// Config
	IConfig: Symbol.for('IConfig'),
	// Controllers
	ControllerBase: Symbol.for('ControllerBase'),
	App: Symbol.for('App'),
};

// export { TypeMap };
