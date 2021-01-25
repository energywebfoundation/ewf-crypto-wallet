import isDev from 'electron-is-dev';
import { MODULES } from '@desktop-electron/libs/constants';

const modules = async (dependencies: Dependencies) => {
    const { logger } = global;

    logger.info('modules', `Loading ${MODULES.length} modules`);

    await Promise.all(
        MODULES.flatMap(async module => {
            if (module.isDev !== undefined && module.isDev !== isDev) {
                logger.debug(
                    'modules',
                    `${module.name} was skipped because it is configured for a diferent environment`,
                );
                return [];
            }

            try {
                const m = await import(`./modules/${module.name}`);
                return [m.default(dependencies)];
            } catch (err) {
                logger.error('modules', `Couldn't load ${module.name} (${err.toString()})`);
            }
        }),
    );

    logger.info('modules', 'All modules loaded');
};

export default modules;
