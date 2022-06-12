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

    /**
     * Updates a plataformGame with other PlataformGame object as array representation.
     * @param Array $updatedPlataformGame a list of properties from PlataformGame objects.
     * @throws AppException if price is not a number, if the currency type is not correct, or if the discount is not correct.
     */
    public function update(Array $updatedPlataformGame): void
    {
        $this->updatePrice($updatedPlataformGame['price'] ?? null);
        $this->updatePriceUnit($updatedPlataformGame['priceUnit'] ?? null);
        $this->updateDiscount($updatedPlataformGame['discount'] ?? null);
        $this->updateIsEnabled($updatedPlataformGame['isEnabled'] ?? null);
    }

    /**
     * Updates the plataformGame price.
     * @param $price the new price.
     * @throws AppException if price is not a number
     */
    public function updatePrice($price): void
    {
        if (!$price) return;
        if (!is_numeric($price)) throw new AppException('The price has to be a number.');
        if (floatval($price) < 0) $price = 0;
        $this->price = $price;
    }
    
    /**
     * Updates the plataformGame priceUnit.
     * @param $priceUnit the new priceUnit.
     * @throws AppException if the currency type is not correct
     */
    public function updatePriceUnit($priceUnit): void
    {
        if (!$priceUnit || empty($priceUnit)) return;
        $founded = false;
        foreach (["EUR", "USD"] as $value) {
            if ($value == $priceUnit) $founded = true;
        }
        if (!$founded) throw new AppException('The currency type is not correct. ' . json_encode($priceUnit));
        $this->priceUnit = $priceUnit;
    }

    /**
     * Updates the plataformGame discount.
     * @param $discount the new discount.
     * @throws AppException the discount is not correct.
     */
    public function updateDiscount($discount): void
    {
        if (!$discount) return;
        if (!is_numeric($discount)) throw new AppException('The discount has to be a number.');
        if (floatval($discount) < 0 || floatval($discount) > 1) throw new AppException('The value of the discount must be between 0.0 and 1.0');
        $this->discount = $discount;
    }

    /**
     * enables or disables the game of this plataformGame, when disabled is the same as the plataform do not sell the game anymore.
     * @param $isEnabled true to enable the game, false otherwise.
     */
    public function updateIsEnabled($isEnabled): void
    {
        if ($isEnabled === null) return;
        $this->isEnabled = ($isEnabled == 1) ? true : false;;
    }
}
