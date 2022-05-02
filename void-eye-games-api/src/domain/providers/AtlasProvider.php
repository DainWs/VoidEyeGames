<?php
namespace src\domain\providers;

use Atlas\Orm\Atlas;
use Atlas\Orm\AtlasBuilder;

class AtlasProvider {

    private static ?Atlas $instance = null;

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

    public static function getInstance(): Atlas {
        return SELF::$instance;
    }
}