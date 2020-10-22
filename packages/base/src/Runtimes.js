import VersionInfo from "./generated/VersionInfo.js";
import RuntimeRegistry from "./runtime/RuntimeRegistry.js";
import { getSharedResource } from "./SharedResources.js";
import Logger from "./util/Logger.js";

let currentRuntimeIndex;
let showWarnings = true;

/**
 * Central registry where all runtimes register themselves by pushing a Runtime instance object.
 * The index in the registry servers as an ID for the runtime.
 * @type {*}
 */
const registry = getSharedResource("Runtimes", new RuntimeRegistry());

/**
 * Returns the runtime object for a given runtime (current runtime by default)
 *
 * @param runtimeIndex the index of the runtime (current runtime if undefined)
 * @returns {*}
 */
const getRuntime = runtimeIndex => {
	return registry.getRuntime(runtimeIndex || currentRuntimeIndex);
};

/**
 * Registers the current runtime in the shared runtimes resource registry
 */
const registerCurrentRuntime = () => {
	if (currentRuntimeIndex !== undefined) {
		throw new Error("Runtime already registered");
	}

	currentRuntimeIndex = registry.registerRuntime(VersionInfo);
};

/**
 * Returns the index of the current runtime's object in the shared runtimes resource registry
 * @returns {*}
 */
const getCurrentRuntimeIndex = () => {
	if (currentRuntimeIndex === undefined) {
		throw new Error("Runtime not yet registered");
	}

	return currentRuntimeIndex;
};

/**
 * Compares the current runtime's version with the version of another runtime on the same page (in the shared runtimes resource registry)
 * @param otherRuntimeIndex The index in the registry of the runtime to be compared with
 * @returns {number} Positive number if the current runtime's version is newer, 0 if equal, negative number if the current runtime's version is older
 */
const compareCurrentRuntimeWith = otherRuntimeIndex => {
	const currentRuntime = getRuntime();
	const otherRuntime = getRuntime(otherRuntimeIndex);
	return currentRuntime.compareTo(otherRuntime);
};

/**
 * Call this method to stop runtime-related console warnings such as "Tags already defined by another runtime"
 */
const disableRuntimeWarnings = () => {
	showWarnings = false;
};

/**
 * Determines whether runtime-related warnings are enabled
 * @returns {boolean}
 */
const runtimeWarningsEnabled = () => {
	return showWarnings;
};

/**
 * Receives as a parameter a util/Logger.js class instance and logs instructions how to disable runtime-related warnings
 * @param logger
 */
const logDisableRuntimeWarningsInstructions = logger => {
	if (!(logger instanceof Logger)) {
		throw new Error("logger must be a Logger class instance");
	}

	logger.para(`To suppress runtime related warnings such as this one, add the following code to your bundle:`);
	logger.line(`import { disableRuntimeWarnings } from "@ui5/webcomponents-base/dist/Runtimes.js";`);
	logger.line(`disableRuntimeWarnings();`);
};

/**
 * Returns an array with all runtimes
 * @returns {*}
 */
const getAllRuntimes = () => registry.getAllRuntimes();

/**
 * Set an alias for the the current app/library/microfrontend which will appear in debug messages and console warnings
 * @param alias
 */
const setRuntimeAlias = alias => {
	const currentRuntime = getRuntime();
	currentRuntime.customAlias = alias;
};

export {
	getRuntime,
	getCurrentRuntimeIndex,
	registerCurrentRuntime,
	compareCurrentRuntimeWith,
	disableRuntimeWarnings,
	runtimeWarningsEnabled,
	getAllRuntimes,
	logDisableRuntimeWarningsInstructions,
	setRuntimeAlias,
};
