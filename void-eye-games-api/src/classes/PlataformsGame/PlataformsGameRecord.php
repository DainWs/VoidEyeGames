<?php
declare(strict_types=1);

namespace classes\PlataformsGame;

use Atlas\Mapper\Record;
use src\domain\exceptions\AppException;

/**
 * @method PlataformsGameRow getRow()
 * @property mixed $price 
 * @property mixed $priceUnit
 * @property mixed $discount 
 * @property mixed $isEnabled
 */
class PlataformsGameRecord extends Record
{
    use PlataformsGameFields;

    public function update(Array $updatedPlataformGame): void
    {
        $this->updatePrice($updatedPlataformGame['price'] ?? null);
        $this->updatePriceUnit($updatedPlataformGame['priceUnit'] ?? null);
        $this->updateDiscount($updatedPlataformGame['discount'] ?? null);
        $this->updateIsEnabled($updatedPlataformGame['isEnabled'] ?? null);
    }

    public function updatePrice($price): void
    {
        if (!$price) return;
        if (!is_numeric($price)) throw new AppException('The price has to be a number.');
        if (floatval($price) < 0) $price = 0;
        $this->price = $price;
    }
    
    public function updatePriceUnit($priceUnit): void
    {
        if (!$priceUnit || empty($priceUnit)) return;
        if (!array_search($priceUnit, ['EUR', 'USD'])) throw new AppException('The currency type is not correct.');
        $this->priceUnit = $priceUnit;
    }

    public function updateDiscount($discount): void
    {
        if (!$discount) return;
        if (!is_numeric($discount)) throw new AppException('The discount has to be a number.');
        if (floatval($discount) < 0 || floatval($discount) > 1) throw new AppException('The value of the discount must be between 0.0 and 1.0');
        $this->discount = $discount;
    }

    public function updateIsEnabled(?bool $isEnabled): void
    {
        if ($isEnabled === null) return;
        $this->isEnabled = $isEnabled;
    }
}
