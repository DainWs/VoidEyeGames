<?php
session_save_path(sys_get_temp_dir());

include_once('autoload.php');

$DATA = [];

if (isset($_GET['controller']) && isset($_GET['action'])) {
    $controllerClass = 'src\\controllers\\' .str_replace("/", "\\", $_GET['controller']);
    $method = $_GET['action'];
    
    $controller = new $controllerClass();
    $controller->$method();
}
?>
