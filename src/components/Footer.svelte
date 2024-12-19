<script lang="ts">
    const currentYear = new Date().getFullYear();
</script>

<footer class="bg-white border-t">
    <div class="container mx-auto px-4 py-8 md:py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Kitap Şöleni</h3>
                <p class="text-sm opacity-70 leading-relaxed">Kitaplarla dolu bir dünyaya hoş geldiniz. Okuma deneyiminizi zenginleştirmek ve bilgi paylaşımını artırmak için buradayız.</p>
            </div>

            <div class="space-y-4 md:justify-self-end">
                <h3 class="text-lg font-semibold">Hızlı Linkler</h3>
                <ul class="space-y-2 text-sm">
                    <li>
                        <a href="/" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors inline-flex items-center gap-2">
                            <i class="ri-home-4-line"></i>
                            Ana Sayfa
                        </a>
                    </li>
                    <li>
                        <a href="/dashboard" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors inline-flex items-center gap-2">
                            <i class="ri-dashboard-line"></i>
                            Kontrol Paneli
                        </a>
                    </li>
                    <li>
                        <a href="/login" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors inline-flex items-center gap-2">
                            <i class="ri-login-box-line"></i>
                            Giriş Yap
                        </a>
                    </li>
                    <li>
                        <a href="/register" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors inline-flex items-center gap-2">
                            <i class="ri-user-add-line"></i>
                            Kayıt Ol
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p class="opacity-70">{currentYear} Kitap Şöleni. Tüm hakları saklıdır.</p>
            <div class="flex items-center gap-6">
                <a href="/privacy" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                    Gizlilik Politikası
                </a>
                <a href="/terms" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                    Kullanım Şartları
                </a>
            </div>
        </div>
    </div>
</footer>
