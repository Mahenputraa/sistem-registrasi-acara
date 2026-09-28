<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_profile_endpoints(): void
    {
        $response = $this->postJson('/api/profile/update', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
        $response->assertStatus(401);

        $response = $this->deleteJson('/api/profile/avatar');
        $response->assertStatus(401);

        $response = $this->putJson('/api/profile/password', [
            'current_password' => 'secret123',
            'password' => 'newsecret123',
            'password_confirmation' => 'newsecret123',
        ]);
        $response->assertStatus(401);
    }

    public function test_user_can_update_name_and_email(): void
    {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
        ]);

        $response = $this->actingAs($user)->postJson('/api/profile/update', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'name' => 'Updated Name',
                    'email' => 'updated@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_user_cannot_take_another_users_email(): void
    {
        $otherUser = User::factory()->create([
            'email' => 'taken@example.com',
        ]);

        $user = User::factory()->create([
            'email' => 'myemail@example.com',
        ]);

        $response = $this->actingAs($user)->postJson('/api/profile/update', [
            'name' => 'My Name',
            'email' => 'taken@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_upload_and_delete_avatar(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('profile.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($user)->postJson('/api/profile/update', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
        ]);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertNotNull($user->avatar);
        $this->assertNotNull($user->avatar_url);
        Storage::disk('public')->assertExists($user->avatar);

        // Delete avatar
        $deleteResponse = $this->actingAs($user)->deleteJson('/api/profile/avatar');
        $deleteResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'avatar' => null,
                    'avatar_url' => null,
                ],
            ]);

        $user->refresh();
        $this->assertNull($user->avatar);
        Storage::disk('public')->assertMissing($user->avatar);
    }

    public function test_user_can_update_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('oldpassword123'),
        ]);

        // Wrong current password
        $failResponse = $this->actingAs($user)->putJson('/api/profile/password', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);
        $failResponse->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        // Correct update
        $successResponse = $this->actingAs($user)->putJson('/api/profile/password', [
            'current_password' => 'oldpassword123',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $successResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }
}
