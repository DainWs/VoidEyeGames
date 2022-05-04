<?php
declare(strict_types=1);

namespace classes\Plataform;

use Atlas\Mapper\Record;
use classes\PlataformsGame\PlataformsGame;

/**
 * @method PlataformRow getRow()
 */
class PlataformRecord extends Record
{
    use PlataformFields;

    public function updatePlataformsGames(Array $plataformGames) {
        $this->plataforms_games->setDelete();
        foreach ($plataformGames as $value) {
            $record = $this->plataforms_games->getOneBy(['gamesId' => $value['gamesId']]);
            if ($record) {
                $record->setDelete(false);
            } else {
                $record = $this->atlas->newRecord(PlataformsGame::class, $value);
                $this->plataforms_games->appendNew($value, $record);
            }
        }
    }
}
