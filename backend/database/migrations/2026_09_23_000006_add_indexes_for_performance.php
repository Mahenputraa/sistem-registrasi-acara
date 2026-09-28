<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->index('start_time', 'events_start_time_idx');
            $table->index('venue_id', 'events_venue_id_idx');
            $table->index('organizer_id', 'events_organizer_id_idx');
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->index('user_id', 'registrations_user_id_idx');
            $table->index('event_id', 'registrations_event_id_idx');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->index('registration_id', 'tickets_registration_id_idx');
            $table->index('ticket_type_id', 'tickets_ticket_type_id_idx');
            $table->index('status', 'tickets_status_idx');
            $table->index(['ticket_type_id', 'status'], 'tickets_type_status_composite_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex('tickets_registration_id_idx');
            $table->dropIndex('tickets_ticket_type_id_idx');
            $table->dropIndex('tickets_status_idx');
            $table->dropIndex('tickets_type_status_composite_idx');
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->dropIndex('registrations_user_id_idx');
            $table->dropIndex('registrations_event_id_idx');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('events_start_time_idx');
            $table->dropIndex('events_venue_id_idx');
            $table->dropIndex('events_organizer_id_idx');
        });
    }
};
