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

    /**
     * Adds a media relationship to this GameRecord.
     * @param Array $mediaArray a list of properties from Media objects.
     * @param Atlas $atlas the atlas instance.
     */
    public function addMedia(Array $mediaArray, Atlas $atlas): void
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

    /**
     * Upload a media to the assets/images folder.
     * @param mixed $base64_string the fileBytes
     * @param MediaRecord $media the media record object.
     * @uses AssetsManager
     */
    private function uploadMedia($base64_string, MediaRecord $media): void
    {
        $data = explode(',', $base64_string);
        $filename = $this->id . '-' . $media->id;
        $extension = $this->getExtension($data[0]);
        $path = $_SERVER['APP_BASE_PATH'] . "/assets/images/games/medias/";
        $mediaFilename = "$filename.$extension";
        AssetsManager::getInstance()->writeAssets($path, $mediaFilename, base64_decode($data[1]));
    }

    /**
     * Returns the mediaType file extension.
     * @param mixed $mediaType the media type, example: "images/png"
     */
    private function getExtension($mediaType)
    {
        preg_match('/.*(?:image|video)\/(?<extension>[^;]+).*/', $mediaType, $matches);
        return $matches['extension'];
    }

    /**
     * Adds a category relationship to this GameRecord.
     * @param Array $categoriesGames a list of properties from CategoriesGames objects.
     * @param Atlas $atlas the atlas instance.
     */
    public function addCategoriesGames(Array $categoriesGames, Atlas $atlas): void
    {
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);
        $categoriesGames['gamesId'] = $this->id;
        $categoriesGames['games'] = null;
        $categoriesGames['categories'] = null;
        $this->categories_games->appendNew($categoriesGames);
    }

    /**
     * Adds a plataform relationship to this GameRecord.
     * @param Array $gamePlataform a list of properties from PlataformsGames objects.
     * @param Atlas $atlas the atlas instance.
     */
    public function addPlataformsGames(Array $gamePlataform, Atlas $atlas): void
    {
        if (!$this->plataforms_games) $this->plataforms_games = $atlas->newRecordSet(PlataformsGame::class);
        $gamePlataform['gamesId'] = $this->id;
        $gamePlataform['games'] = null;
        $gamePlataform['plataforms'] = null;
        $this->plataforms_games->appendNew($gamePlataform);
    }

    /**
     * Updates a game with other Game object as array representation.
     * @param Array $updatedGame a list of properties from Game objects.
     * @param Atlas $atlas the atlas instance.
     * @throws AppException if already exists a game with that name
     */
    public function update(Array $updatedGame, Atlas $atlas): void
    {
        $this->updateName($updatedGame['name'] ?? null, $atlas);
        $this->updateDescripcion($updatedGame['descripcion'] ?? null, $atlas);
        $this->updateMedias($updatedGame['medias'] ?? null, $atlas);
        $this->updateCategoriesGames($updatedGame['categories_games'] ?? null, $atlas);
    }

    /**
     * Updates the game name.
     * @param ?String $name the new name.
     * @param Atlas $atlas the atlas instance.
     * @throws AppException if already exists a game with that name
     */
    public function updateName(?String $name, Atlas $atlas): void
    {
        if (!$name || empty($name)) return;
        $searchedGame = $atlas->select(Game::class, ['name' => $name])->where('id !=', $this->id)->fetchRecord();
        if ($searchedGame) throw new AppException('There is already a game with this name.');
        $this->name = $name;
    }

    /**
     * Updates the game description.
     * @param ?String $descripcion the new description.
     */
    public function updateDescripcion(?String $descripcion): void
    {
        if (!$descripcion) return;
        $this->descripcion = $descripcion;
    }

    /**
     * Updates the medias relationships.
     * @param ?Array $medias array of the current new medias relationships, if a relationship is not found here, it means that was deleted.
     * @param Atlas $atlas the atlas instance.
     */
    public function updateMedias(?Array $medias, Atlas $atlas): void
    {
        if ($medias == null) return;
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

    /**
     * Updates the categories relationships.
     * @param ?Array $updatedCategoriesGames array of the current new categories relationships, if a relationship is not found here, it means that was deleted.
     * @param Atlas $atlas the atlas instance.
     */
    public function updateCategoriesGames(?Array $updatedCategoriesGames, Atlas $atlas): void
    {
        if ($updatedCategoriesGames == null) return;
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);

        $this->categories_games->setDelete();
        foreach ($updatedCategoriesGames as $value) {
            $record = $this->categories_games->getOneBy(['categoriesId' => $value['categoriesId']]);
            if ($record) $record->setDelete(false);
            else $this->addCategoriesGames($value, $atlas);
        }
    }

    /**
     * Updates the plataforms relationships.
     * @param ?Array $updatedPlataformGames array of the current new plataforms relationships, if a relationship is not found here, it means that was deleted.
     * @param Atlas $atlas the atlas instance.
     */
    public function updatePlataformsGames(Array $updatedPlataformGames, Atlas $atlas): void
    {
        if ($updatedPlataformGames == null) return;
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

    /**
     * Disbled the game in all plataforms relationships, its the same as delete.
     */
    public function disable(): void
    {
        foreach ($this->plataforms_games as $value) {
            $value->isEnabled = false;
        }
    }

    /**
     * Enable the game in all plataforms relationships.
     */
    public function enable(): void
    {
        foreach ($this->plataforms_games as $value) {
            $value->isEnabled = true;
        }
    }
}
