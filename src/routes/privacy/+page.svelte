<script>
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
</script>

<Navbar />

<main class="container mx-auto px-4 py-8 md:py-12">
    <div class="max-w-3xl mx-auto space-y-8">
        <h1 class="text-3xl font-bold">Gizlilik Politikası</h1>
        
        <section class="space-y-4">
            <h2 class="text-xl font-semibold">1. Bilgi Toplama ve Kullanımı</h2>
            <p class="text-gray-700">
                Kitap Şöleni olarak, kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz. 
                Sitemizi kullanırken aşağıdaki bilgileri toplayabiliriz:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
                <li>Ad, e-posta adresi ve kullanıcı adı gibi hesap bilgileri</li>
                <li>Yorum ve blog yazıları gibi kullanıcı tarafından oluşturulan içerikler</li>
                <li>Site kullanım istatistikleri ve tercihler</li>
            </ul>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold">2. Bilgilerin Korunması</h2>
            <p class="text-gray-700">
                Kullanıcı verileriniz güvenli bir şekilde saklanmakta ve sadece gerekli durumlarda 
                kullanılmaktadır. Verileriniz üçüncü taraflarla paylaşılmamaktadır.
            </p>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold">3. Çerezler</h2>
            <p class="text-gray-700">
                Sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
                Bu çerezler, oturum bilgilerinizi ve site tercihlerinizi saklamak için kullanılır.
            </p>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold">4. İletişim</h2>
            <p class="text-gray-700">
                Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
            </p>
        </section>
    </div>
</main>

<Footer />
