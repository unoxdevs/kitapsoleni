<script lang="ts">
    const currentYear = new Date().getFullYear();
</script>

<footer class="bg-white border-t mt-auto">
    <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-6 text-sm">
                <a href="#" class="opacity-70 hover:opacity-100 transition-all duration-300">
                    <i class="ri-question-line mr-1"></i> Yardım
                </a>
                <a href="#" class="opacity-70 hover:opacity-100 transition-all duration-300">
                    <i class="ri-customer-service-2-line mr-1"></i> Destek
                </a>
                <a href="#" class="opacity-70 hover:opacity-100 transition-all duration-300">
                    <i class="ri-file-list-3-line mr-1"></i> Dökümanlar
                </a>
            </div>

            <div class="flex items-center gap-6 text-sm">
                <p class="opacity-70">{currentYear} Kitap Şöleni</p>
                <div class="hidden md:flex items-center gap-4">
                    <a href="/privacy" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                        Gizlilik
                    </a>
                    <a href="/terms" class="opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                        Kullanım Şartları
                    </a>
                </div>
            </div>
        </div>
    </div>
</footer>