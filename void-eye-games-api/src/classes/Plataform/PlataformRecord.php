<?php
declare(strict_types=1);

namespace classes\Plataform;

use Atlas\Mapper\Record;
use Atlas\Orm\Atlas;
use classes\PlataformsGame\PlataformsGame;
use classes\PlataformsGame\PlataformsGameRecord;
use src\domain\exceptions\AppException;

/**
 * @method PlataformRow getRow()
 * @property mixed $id
 * @property mixed $url
 * @property mixed $name
 * @property CategoriesGameRecordSet $categories_games
 */
class PlataformRecord extends Record
{
    use PlataformFields;

    public function addPlataformGame(Array $plataformGame, Atlas $atlas): void {
        if (!$this->plataforms_games) $this->plataforms_games = $atlas->newRecordSet(PlataformsGame::class);
        
        $plataformGame['plataformsId'] =  $this->id;
        $plataformGame['games'] = null;
        $plataformGame['plataforms'] = null;
        $this->plataforms_games->appendNew($plataformGame);
    }

    public function update(Array $updatedPlataform, Atlas $atlas): void
    {
        $this->updateName($updatedPlataform['name'] ?? null, $atlas);
        $this->updateUrl($updatedPlataform['name'] ?? null, $atlas);
    }

    public function updateName(?string $name, Atlas $atlas): void
    {
        if (!$name || empty($name)) return;
        $searchedPlataform = $atlas->select(Plataform::class, ['name' => $name])->where('id !=', $this->id)->fetchRecord();
        if ($searchedPlataform) throw new AppException('There is already a plataform with this name.');
        $this->name = $name;
    }
    
    public function updateUrl(?string $url): void
    {
        if (!$url) return;
        $this->url = $url;
    }

    public function updatePlataformsGames(?Array $plataformGames, Atlas $atlas): void {
        if (!$plataformGames) return;
        if (!$this->plataforms_games) $this->plataforms_games = $atlas->newRecordSet(PlataformsGame::class);

        $this->plataforms_games->setDelete();
        foreach ($plataformGames as $plataformGame) {
            /** @var PlataformsGameRecord $record */
            $record = $this->plataforms_games->getOneBy(['gamesId' => $plataformGame['gamesId']]);
            if ($record) {
                $record->setDelete(false);
                $record->update($plataformGame);
            } else {
                $this->addPlataformGame($plataformGame, $atlas);
            }
        }
    }
}
