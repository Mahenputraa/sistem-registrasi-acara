<?php

namespace App\Models;

abstract class Venue {
    protected $id;
    protected $name;

    public function __construct($id, $name) {
        $this->id = $id;
        $this->name = $name;
    }

    public function getName() {
        return $this->name;
    }

    // Abstract method ini wajib diimplementasikan oleh kelas anak.
    // Ini adalah inti dari Polymorphism, di mana setiap anak akan
    // memberikan implementasi yang berbeda untuk method yang sama.
    abstract public function getDisplayDetails(): string;
}