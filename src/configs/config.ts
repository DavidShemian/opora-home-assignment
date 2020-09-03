import dotenv, { DotenvConfigOutput } from 'dotenv';
import { InitializationException, InitializationExceptionCodes } from './../exceptions/initialization-exception';

type UnverifiedConfigurations = { [key: string]: string | undefined };
type VerifiedConfigurations = { [key: string]: string };

/**
 * This function is used to warp the env configurations
 */
const loadConfig = (): VerifiedConfigurations => {
    // Load .env configurations
    const configResult: DotenvConfigOutput = dotenv.config();

    if (configResult.error) {
        throw new InitializationException(
            InitializationExceptionCodes.UNABLE_TO_LOAD_CONFIGURATIONS,
            'Unable to load configurations',
            configResult.error
        );
    }

    const unverifiedConfigurations: UnverifiedConfigurations = { ...configResult.parsed };

    return getVerifiedConfigurations(unverifiedConfigurations);
};

/**
 * Makes sure that a all required configuration where loaded
 * Throws an InitializationException if a required configuration was not loaded
 * @param unverifiedConfigurations configuration with optional undefined value
 */
const getVerifiedConfigurations = (unverifiedConfigurations: UnverifiedConfigurations): VerifiedConfigurations => {
    const REQUIRED_CONFIGURATIONS = ['TOKEN_SECRET_KEY', 'TOKEN_EXPIRES_TIME', 'SERVER_PORT', 'DB_CONNECTION_STRING', 'DB_USE_SSL'];

    REQUIRED_CONFIGURATIONS.forEach((requiredConfiguration: string) => {
        if (unverifiedConfigurations[requiredConfiguration] === undefined) {
            throw getRequiredConfigurationWasNotLoadedException(requiredConfiguration);
        }
    });

    return unverifiedConfigurations as VerifiedConfigurations;
};

const getRequiredConfigurationWasNotLoadedException = (requiredConfiguration: string): InitializationException => {
    return new InitializationException(InitializationExceptionCodes.MISSING_REQUIRED_CONFIGURATION, 'Required configuration was not found', {
        requiredConfiguration,
    });
};

export const config = loadConfig();
