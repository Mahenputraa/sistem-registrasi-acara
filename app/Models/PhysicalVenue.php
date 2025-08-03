<?php

namespace App\Models;

class PhysicalVenue extends Venue {
    private $address;

    public function __construct($id, $name, $address) {
        parent::__construct($id, $name); // Memanggil constructor dari parent class
        $this->address = $address;
    }

    public function getDisplayDetails(): string {
        return htmlspecialchars($this->address);
    }
}