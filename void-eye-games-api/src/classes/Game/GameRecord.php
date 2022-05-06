<?php
declare(strict_types=1);

namespace classes\Game;

use Atlas\Mapper\Record;
use classes\Media\Media;

/**
 * @method GameRow getRow()
 */
class GameRecord extends Record
{
    use GameFields;

    public function addMedia(Array $media) {
        $media['src'] = null;
        $media['id'] = null;
        $media['gamesId'] = $this->id;
        $this->medias->appendNew($media);
    }

    public function addCategoriesGames(Array $categoriesGames) {
        $categoriesGames['games'] = null;
        $categoriesGames['categories'] = null;
        $categoriesGames['gamesId'] = $this->id;
        $this->categories_games->appendNew($categoriesGames);
    }

    public function addPlataformsGames(Array $gamePlataform) {
        $gamePlataform['gamesId'] = $this->id;
        $gamePlataform['games'] = null;
        $gamePlataform['plataforms'] = null;
        $this->plataforms_games->appendNew($gamePlataform);
    }

    public function updateMedias(Array $medias) {
        $this->medias->setDelete();
        foreach ($medias as $value) {
            $record = $this->medias->getOneBy(['id' => $value['id']]);
            if ($record) {
                $record->setDelete(false);
            } else {
                $value['src'] = null;
                $value['id'] = null;
                $value['gamesId'] = $this->id;
                $record = $this->atlas->newRecord(Media::class, $value);
                $this->medias->appendNew($value, $record);
            }
        }
    }

    public function updateCategoriesGames(Array $categoriesGames) {
        $this->categories_games->setDelete();
        foreach ($categoriesGames as $value) {
            $record = $this->categories_games->getOneBy(['categoriesId' => $value['categoriesId']]);
            if ($record) {
                $record->setDelete(false);
            } else {
                $record = $this->atlas->newRecord(CategoriesGame::class, $value);
                $this->categories_games->appendNew($value, $record);
            }
        }
    }

    public function updatePlataformsGames(Array $plataformGames) {
        $this->plataforms_games->setDelete();
        foreach ($plataformGames as $value) {
            $record = $this->plataforms_games->getOneBy(['plataformsId' => $value['plataformsId']]);
            if ($record) {
                $record->setDelete(false);
            } else {
                $record = $this->atlas->newRecord(PlataformsGame::class, $value);
                $this->plataforms_games->appendNew($value, $record);
            }
        }
    }

    public function disable() {
        foreach ($this->plataforms_games as $value) {
            $value->isEnabled = false;
        }
    }

    public function enable() {
        foreach ($this->plataforms_games as $value) {
            $value->isEnabled = true;
        }
    }
}
