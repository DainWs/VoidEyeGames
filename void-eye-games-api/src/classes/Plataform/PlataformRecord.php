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

    /**
     * Adds a plataform relationship to this PlataformRecord.
     * @param Array $plataformGame a list of properties from PlataformsGames objects.
     * @param Atlas $atlas the atlas instance.
     */
    public function addPlataformGame(Array $plataformGame, Atlas $atlas): void
    {
        if (!$this->plataforms_games) $this->plataforms_games = $atlas->newRecordSet(PlataformsGame::class);
        
        $plataformGame['plataformsId'] =  $this->id;
        $plataformGame['games'] = null;
        $plataformGame['plataforms'] = null;

        $founded = false;
        foreach (["EUR", "USD"] as $value) {
            if ($value == $plataformGame['priceUnit']) $founded = true;
        }
        if (!$founded) $plataformGame['priceUnit'] = 'EUR';
        
        $this->plataforms_games->appendNew($plataformGame);
    }

    /**
     * Updates a plataform with other Plataform object as array representation.
     * @param Array $updatedPlataform a list of properties from Plataform objects.
     * @param Atlas $atlas the atlas instance.
     * @throws AppException if already exists a plataform with that name
     */
    public function update(Array $updatedPlataform, Atlas $atlas): void
    {
        $this->updateName($updatedPlataform['name'] ?? null, $atlas);
        $this->updateUrl($updatedPlataform['url'] ?? null, $atlas);
        $this->updatePlataformsGames($updatedPlataform['plataforms_games'] ?? null, $atlas);
    }

    /**
     * Updates the plataform name.
     * @param ?String $name the new name.
     * @param Atlas $atlas the atlas instance.
     * @throws AppException if already exists a plataform with that name
     */
    public function updateName(?String $name, Atlas $atlas): void
    {
        if (!$name || empty($name)) return;
        $searchedPlataform = $atlas->select(Plataform::class, ['name' => $name])->where('id !=', $this->id)->fetchRecord();
        if ($searchedPlataform) throw new AppException('There is already a plataform with this name.');
        $this->name = $name;
    }
    
    /**
     * Updates the plataform url.
     * @param ?String $url the new url.
     */
    public function updateUrl(?String $url): void
    {
        if (!$url) return;
        $this->url = $url;
    }

    /**
     * Updates the plataforms relationships.
     * @param ?Array $plataformGames array of the current new plataforms relationships, if a relationship is not found here, it means that was deleted.
     * @param Atlas $atlas the atlas instance.
     */
    public function updatePlataformsGames(?Array $plataformGames, Atlas $atlas): void
    {
        if ($plataformGames == null) return;
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
