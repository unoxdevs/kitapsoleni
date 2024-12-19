<script>
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
</script>

<Navbar />

<main class="container mx-auto px-4 py-8 md:py-12">
    <div class="max-w-3xl mx-auto space-y-8">
        <h1 class="text-3xl font-bold">Kullanım Şartları</h1>
        
        <section class="space-y-4">
            <h2 class="text-xl font-semibold">1. Genel Koşullar</h2>
            <p class="text-gray-700">
                Kitap Şöleni'ni kullanarak aşağıdaki şartları kabul etmiş olursunuz. 
                Bu şartları kabul etmiyorsanız, lütfen siteyi kullanmayınız.
            </p>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold">2. Kullanıcı Sorumlulukları</h2>
            <p class="text-gray-700">
                Kullanıcılar aşağıdaki kurallara uymakla yükümlüdür:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
                <li>Doğru ve güncel bilgiler sağlamak</li>
                <li>Uygunsuz veya zararlı içerik paylaşmamak</li>
                <li>Başkalarının telif haklarına saygı göstermek</li>
                <li>Site güvenliğini tehdit edecek eylemlerden kaçınmak</li>
            </ul>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold">3. İçerik Politikası</h2>
            <p class="text-gray-700">
                Kullanıcılar tarafından oluşturulan içerikler (yorumlar, blog yazıları vb.) 
                aşağıdaki kurallara tabidir:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
                <li>Nefret söylemi ve ayrımcılık içeren içerikler yasaktır</li>
                <li>Telif hakkı ihlali yapan içerikler kaldırılacaktır</li>
                <li>Spam ve yanıltıcı içerikler yasaktır</li>
            </ul>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold">4. Hesap Güvenliği</h2>
            <p class="text-gray-700">
                Kullanıcılar kendi hesap güvenliklerinden sorumludur. 
                Şüpheli bir durum fark edildiğinde derhal bizimle iletişime geçilmelidir.
            </p>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold">5. Değişiklikler</h2>
            <p class="text-gray-700">
                Kitap Şöleni, bu kullanım şartlarını herhangi bir zamanda değiştirme 
                hakkını saklı tutar. Değişiklikler sitede yayınlandığı anda yürürlüğe girer.
            </p>
        </section>
    </div>
</main>

<Footer />
