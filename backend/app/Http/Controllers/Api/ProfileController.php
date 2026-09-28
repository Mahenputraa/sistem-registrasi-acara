<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Memperbarui profil pengguna (nama, email, dan foto profil).
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->name = $request->validated('name');
        $user->email = $request->validated('email');

        if ($request->hasFile('avatar')) {
            // Hapus file avatar lama jika ada untuk mencegah file sampah
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Simpan file avatar baru ke direktori avatars pada disk public
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'avatar_url' => $user->avatar_url,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Menghapus foto profil kustom pengguna dan kembali ke avatar default.
     */
    public function removeAvatar(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = null;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Foto profil berhasil dihapus.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => null,
                'avatar_url' => null,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Memperbarui kata sandi akun pengguna.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->password = Hash::make($request->validated('password'));
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Kata sandi akun Anda berhasil diperbarui.',
        ]);
    }
}
