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

    public function update(Array $updatedMedia)
    {
        $this->updateName($updatedMedia['name'] ?? null);
        $this->updateName($updatedMedia['mediaType'] ?? null);
    }

    public function updateName(?string $name): void {
        if (!$name || empty($name)) return;
        $this->name = $name;
    }

    public function updateMediaTypes(?string $mediaType): void {
        if (!$mediaType || empty($mediaType)) return;
        $this->mediaType = $mediaType;
    }
}
