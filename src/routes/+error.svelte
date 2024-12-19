<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
        <div>
            <h1 class="text-5xl font-extrabold text-primary mb-4">{$page.status}</h1>
            <h2 class="text-2xl font-bold mb-2">
                {#if $page.status === 404}
                Sayfa Bulunamadı
                {:else if $page.status === 403}
                Erişim Reddedildi
                {:else}
                Bir Hata Oluştu
                {/if}
            </h2>
            <p class="opacity-70 mb-8">{$page.error?.message || 'Bir şeyler yanlış gitti.'}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button on:click={() => goto('/')} class="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover transition-all duration-300">
                Ana Sayfa
            </button>
            <button on:click={() => window.history.back()} class="inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300">
                Geri Dön
            </button>
        </div>
    </div>
</div>