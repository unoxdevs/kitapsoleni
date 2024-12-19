<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { isUserLoggedIn } from "$lib/user";
    import { fade, scale } from "svelte/transition";
    
    let loggedIn = false;
    let isMenuOpen = false;

    onMount(async () => {
        loggedIn = await isUserLoggedIn();
    });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }
</script>

<nav class="w-full border-b bg-white py-4 relative z-50">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
            <div class="text-lg font-semibold">
                <a href="/">Kitap Şöleni</a>
            </div>

            <div class="hidden md:flex items-center space-x-8">
                <div class="flex items-center space-x-8 text-sm">
                    <a href="/" class="opacity-70 hover:opacity-100 transition-all duration-300">
                        <i class="ri-home-4-line"></i> Ana Sayfa
                    </a>
                </div>

                {#if loggedIn}
                <button on:click={() => goto("/dashboard")} class="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-hover transition-all duration-300">
                    Kontrol Paneli
                </button>
                {:else}
                <button on:click={() => goto("/register")} class="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-hover transition-all duration-300">
                    Kayıt Ol
                </button>
                {/if}
            </div>

            <button class="md:hidden text-2xl" on:click={toggleMenu}>
                <i class="ri-menu-line"></i>
            </button>
        </div>
    </div>

    {#if isMenuOpen}
    <div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/70 z-40" on:click={closeMenu}></div>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" on:click|self={closeMenu}>
        <div transition:scale={{ duration: 300, start: 0.95 }} class="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div class="p-4 border-b">
                <div class="flex justify-between items-center">
                    <p class="text-lg font-semibold">Menü</p>
                    <button class="text-2xl hover:opacity-70 transition-opacity" on:click={closeMenu}>
                        <i class="ri-close-line"></i>
                    </button>
                </div>
            </div>

            <div class="p-4 space-y-4">
                <a href="/" class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300" on:click={closeMenu}>
                    <i class="ri-home-4-line text-lg"></i>
                    <span>Ana Sayfa</span>
                </a>

                <div class="pt-4 border-t">
                    {#if loggedIn}
                    <button on:click={() => { goto("/dashboard"); closeMenu(); }} class="w-full bg-primary text-white px-6 py-2 rounded-lg text-sm hover:bg-primary-hover transition-all duration-300 flex items-center justify-center space-x-2">
                        <span>Kontrol Paneli</span>
                    </button>
                    {:else}
                    <button on:click={() => { goto("/register"); closeMenu(); }} class="w-full bg-primary text-white px-6 py-2 rounded-lg text-sm hover:bg-primary-hover transition-all duration-300 flex items-center justify-center space-x-2">
                        <span>Kayıt Ol</span>
                    </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    {/if}
</nav>
