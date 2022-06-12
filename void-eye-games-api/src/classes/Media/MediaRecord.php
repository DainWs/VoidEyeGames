<?php
declare(strict_types=1);

namespace classes\Media;

use Atlas\Mapper\Record;

/**
 * @method MediaRow getRow()
 * @property mixed $name
 * @property mixed $mediaType
 */
class MediaRecord extends Record
{
    use MediaFields;

    /**
     * Updates a media with other Media object as array representation.
     * @param Array $updatedMedia a list of properties from Media objects.
     */
    public function update(Array $updatedMedia)
    {
        $this->updateName($updatedMedia['name'] ?? null);
        $this->updateName($updatedMedia['mediaType'] ?? null);
    }

    /**
     * Updates a media name.
     * @param ?String $name the new media name.
     */
    public function updateName(?String $name): void {
        if (!$name || empty($name)) return;
        $this->name = $name;
    }

    /**
     * Updates a media type.
     * @param ?String $mediaType the new media type.
     */
    public function updateMediaTypes(?String $mediaType): void {
        if (!$mediaType || empty($mediaType)) return;
        $this->mediaType = $mediaType;
    }
}
