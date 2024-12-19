<script lang="ts">
    import db from "$lib/db";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { logoutUser } from "$lib/user";
    import { fade, scale } from "svelte/transition";

    export let isAdmin = false;
    let isMenuOpen = false;

    async function handleLogout() {
        await logoutUser();
        goto("/login");
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }
</script>

<nav class="w-full border-b bg-white py-4 px-4 relative z-10">
    <div class="container mx-auto">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-8">
                <a href="/" class="text-lg font-semibold">Kontrol Paneli</a>
                <div class="hidden md:flex items-center space-x-6 text-sm">
                    {#if isAdmin}
                    <a href="/dashboard/admin" class="opacity-70 hover:opacity-100 transition-all duration-300">
                        <i class="ri-admin-line mr-1"></i> Admin Panel
                    </a>
                    {/if}
                    <a href="/" class="opacity-70 hover:opacity-100 transition-all duration-300">
                        <i class="ri-book-line mr-1"></i> Bloglar
                    </a>
                    <a href="/dashboard/profile" class="opacity-70 hover:opacity-100 transition-all duration-300">
                        <i class="ri-user-line mr-1"></i> Profil
                    </a>
                    <a href="/dashboard/settings" class="opacity-70 hover:opacity-100 transition-all duration-300">
                        <i class="ri-settings-3-line mr-1"></i> Ayarlar
                    </a>
                </div>
            </div>

            <div class="flex items-center space-x-4">
                <button on:click={handleLogout} class="hidden md:flex bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-hover transition-all duration-300">
                    Çıkış Yap
                </button>
                <button on:click={toggleMenu} class="md:hidden text-gray-600 hover:text-gray-900 transition-all duration-300">
                    <i class="ri-menu-line text-xl"></i>
                </button>
            </div>
        </div>
    </div>
</nav>

{#if isMenuOpen}
<div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/70 z-30" on:click={closeMenu}></div>
<div class="fixed inset-0 z-40 flex items-center justify-center p-4" on:click|self={closeMenu}>
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
            {#if isAdmin}
            <a href="/dashboard/admin" class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300" on:click={closeMenu}>
                <i class="ri-admin-line text-lg"></i>
                <span>Admin Panel</span>
            </a>
            {/if}
            <a href="/" class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300" on:click={closeMenu}>
                <i class="ri-book-line text-lg"></i>
                <span>Bloglar</span>
            </a>
            <a href="/dashboard/profile" class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300" on:click={closeMenu}>
                <i class="ri-user-line text-lg"></i>
                <span>Profil</span>
            </a>
            <a href="/dashboard/settings" class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300" on:click={closeMenu}>
                <i class="ri-settings-3-line text-lg"></i>
                <span>Ayarlar</span>
            </a>

            <div class="pt-4 border-t">
                <button on:click={handleLogout} class="w-full bg-primary text-white px-6 py-2 rounded-lg text-sm hover:bg-primary-hover transition-all duration-300 flex items-center justify-center space-x-2">
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </div>
    </div>
</div>
{/if}