<?php

namespace App\Models;

class OnlineVenue extends Venue {
    private $platform;
    private $url;

    public function __construct($id, $name, $platform, $url) {
        parent::__construct($id, $name);
        $this->platform = $platform;
        $this->url = $url;
    }

    public function getDisplayDetails(): string {
        return "Via {$this->platform}: <a href='{$this->url}' target='_blank' class='text-blue-500 hover:underline'>Link Acara</a>";
    }
}