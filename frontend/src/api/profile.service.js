import api from '../lib/api'

export const profileService = {
  /**
   * Update profile info (nama, email, dan opsional avatar file).
   * Menggunakan multipart/form-data untuk file upload.
   */
  async updateProfile(formData) {
    const res = await api.post('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  /**
   * Menghapus avatar kustom dan kembali ke inisial nama.
   */
  async removeAvatar() {
    const res = await api.delete('/profile/avatar')
    return res.data
  },

  /**
   * Memperbarui kata sandi akun pengguna.
   */
  async updatePassword({ current_password, password, password_confirmation }) {
    const res = await api.put('/profile/password', {
      current_password,
      password,
      password_confirmation,
    })
    return res.data
  },
}
