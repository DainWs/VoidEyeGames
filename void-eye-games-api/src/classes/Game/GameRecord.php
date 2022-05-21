<?php

declare(strict_types=1);

namespace classes\Game;

use Atlas\Mapper\Record;
use Atlas\Orm\Atlas;
use classes\CategoriesGame\CategoriesGame;
use classes\CategoriesGame\CategoriesGameRecordSet;
use classes\Media\Media;
use classes\Media\MediaRecord;
use classes\PlataformsGame\PlataformsGame;
use src\domain\AssetsManager;
use src\domain\exceptions\AppException;

/**
 * @method GameRow getRow()
 * @property mixed $id
 * @property mixed $name
 * @property mixed $descripcion
 * @property MediasRecordSet $medias
 * @property CategoriesGameRecordSet $categories_games
 * @property PlataformsGameRecordSet $plataforms_games 
 */
class GameRecord extends Record
{
    use GameFields;

    public function addMedia(array $mediaArray, Atlas $atlas)
    {
        if (!$this->medias) $this->medias = $atlas->newRecordSet(Media::class);

        $src = $mediaArray['src'];
        $mediaArray['src'] = null;
        $mediaArray['id'] = null;
        $mediaArray['gamesId'] = $this->id;

        /** @var MediaRecord $media */
        $mediaRecord = $this->medias->appendNew($mediaArray);
        $atlas->insert($mediaRecord);

        $this->uploadMedia($src, $mediaRecord, $atlas);
    }

    private function uploadMedia($base64_string, MediaRecord $media)
    {
        $data = explode(',', $base64_string);
        $filename = $this->id . '-' . $media->id;
        $extension = $this->getExtension($data[0]);
        $path = $_SERVER['APP_BASE_PATH'] . "/assets/images/games/medias/";
        $mediaFilename = "$filename.$extension";
        AssetsManager::getInstance()->writeAssets($path, $mediaFilename, base64_decode($data[1]));
    }

    private function getExtension($mediaType)
    {
        preg_match('/.*(?:image|video)\/(?<extension>[^;]+).*/', $mediaType, $matches);
        return $matches['extension'];
    }

    public function addCategoriesGames(array $categoriesGames, Atlas $atlas)
    {
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);
        $categoriesGames['gamesId'] = $this->id;
        $categoriesGames['games'] = null;
        $categoriesGames['categories'] = null;
        $this->categories_games->appendNew($categoriesGames);
    }

    public function addPlataformsGames(array $gamePlataform, Atlas $atlas)
    {
        if (!$this->plataforms_games) $this->plataforms_games = $atlas->newRecordSet(PlataformsGame::class);
        $gamePlataform['gamesId'] = $this->id;
        $gamePlataform['games'] = null;
        $gamePlataform['plataforms'] = null;
        $this->plataforms_games->appendNew($gamePlataform);
    }

    public function update(array $updatedGame, Atlas $atlas): void
    {
        $this->updateName($updatedGame['name'] ?? null, $atlas);
        $this->updateDescripcion($updatedGame['descripcion'] ?? null, $atlas);
        $this->updateMedias($updatedGame['medias'] ?? null, $atlas);
        $this->updateCategoriesGames($updatedGame['categories_games'] ?? null, $atlas);
    }

    public function updateName(?string $name, Atlas $atlas): void
    {
        if (!$name || empty($name)) return;
        $searchedGame = $atlas->select(Game::class, ['name' => $name])->where('id !=', $this->id)->fetchRecord();
        if ($searchedGame) throw new AppException('There is already a game with this name.');
        $this->name = $name;
    }

    public function updateDescripcion(?string $descripcion): void
    {
        if (!$descripcion) return;
        $this->descripcion = $descripcion;
    }

    public function updateMedias(?array $medias, Atlas $atlas)
    {
        if (!$medias) return;
        if (!$this->medias) $this->medias = $atlas->newRecordSet(Media::class);

        $this->medias->setDelete();
        foreach ($medias as $value) {
            $record = $this->medias->getOneBy(['id' => $value['id']]);
            if ($record) {
                $record->setDelete(false);
                $record->update($value);
            } else {
                $this->addMedia($value, $atlas);
            }
        }
    }

    public function updateCategoriesGames(?array $updatedCategoriesGames, Atlas $atlas)
    {
        if (!$updatedCategoriesGames) return;
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);

        $this->categories_games->setDelete();
        foreach ($updatedCategoriesGames as $value) {
            $record = $this->categories_games->getOneBy(['categoriesId' => $value['categoriesId']]);
            if ($record) $record->setDelete(false);
            else $this->addCategoriesGames($value, $atlas);
        }
    }

    public function updatePlataformsGames(array $updatedPlataformGames, Atlas $atlas)
    {
        if (!$updatedPlataformGames) return;
        if (!$this->plataforms_games) $this->plataforms_games = $atlas->newRecordSet(PlataformsGame::class);

        $this->plataforms_games->setDelete();
        foreach ($updatedPlataformGames as $plataformGame) {
            $record = $this->plataforms_games->getOneBy(['plataformsId' => $plataformGame['plataformsId']]);
            if ($record) {
                $record->setDelete(false);
                $record->update($plataformGame);
            } else {
                $this->addPlataformsGames($plataformGame, $atlas);
            }
        }
    }

    public function disable()
    {
        foreach ($this->plataforms_games as $value) {
            $value->isEnabled = false;
        }
    }

    public function enable()
    {
        foreach ($this->plataforms_games as $value) {
            $value->isEnabled = true;
        }
    }
}
