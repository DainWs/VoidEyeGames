<?php
/**
 * File: AtlasProvider.php
 * Purpose: Provides the instance of Atlas object.
 * DB Access: Yes
 * Uses files:
 *  - None
 * Used from:
 *  - src\controllers\BaseController.php
 */
namespace src\domain\providers;

use Atlas\Orm\Atlas;
use Atlas\Orm\AtlasBuilder;

/**
 * Creates and provide the Atlas instance.
 */
class AtlasProvider {

    private static ?Atlas $instance = null;

    /**
     * Creates a new instance of Atlas
     */
    public static function newInstance($container): Atlas {
        if (SELF::$instance == null) {
            $args = $container['settings']['settings']['atlas']['pdo'];
            $atlasBuilder = new AtlasBuilder(...$args);
            $atlasBuilder->setFactory(function ($class) use ($container) {
                if ($container->has($class)) {
                    return $container->get($class);
                }
            
                return new $class();
            });
            SELF::$instance = $atlasBuilder->newAtlas();
        }
        return SELF::$instance;
    }

    /**
     * Returns the Atlas instance
     */
    public static function getInstance(): Atlas {
        return SELF::$instance;
    }
}