<script lang="ts">
    import Navbar from "../../../components/dashboard/Navbar.svelte";
    import Footer from "../../../components/dashboard/Footer.svelte";
    import { Toaster, toast } from 'svelte-sonner'
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { editUserProfile, isUserLoggedIn, logoutUser } from "$lib/user";
    import db from "$lib/db";

    interface UserData {
        email: string;
        username: string;
        name: string;
        emailVisibility: boolean;
    }

    let user: UserData = {
        email: "",
        username: "",
        name: "",
        emailVisibility: false
    };

    let currentPassword: string = "";
    let newPassword: string = "";
    let confirmPassword: string = "";
    let loading: boolean = false;

    onMount(async () => {
        if (!(await isUserLoggedIn())) {
            goto("/login");
            return;
        }
        
        const userData = db.authStore.model;
        if (userData) {
            user = {
                email: userData.email || "",
                username: userData.username || "",
                name: userData.name || "",
                emailVisibility: userData.emailVisibility || false
            };
        }
    });

    async function handleSubmit() {
        try {
            loading = true;

            const userId = db.authStore.model?.id;
            if (!userId) {
                toast.error("Kullanıcı ID'si bulunamadı");
                loading = false;
                return;
            }

            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    toast.error("Yeni şifreler eşleşmiyor");
                    loading = false;
                    return;
                }
                if (!currentPassword) {
                    toast.error("Yeni şifre belirlemek için mevcut şifre gerekli");
                    loading = false;
                    return;
                }
            }

            await editUserProfile(
                userId,
                user.email,
                newPassword || undefined,
                user.username,
                user.emailVisibility,
                user.name,
                undefined,
                currentPassword || undefined
            );

            toast.success("Profil başarıyla güncellendi!");
            if (newPassword) {
                toast.success("Şifreniz değiştirildi. Yeniden giriş yapmanız gerekiyor.");
                await logoutUser();
                goto("/login");
                return;
            }
            if (newPassword) {
                currentPassword = "";
                newPassword = "";
                confirmPassword = "";
            }
        } catch (e) {
            toast.error("Bir şeyler yanlış gitti.");
        } finally {
            loading = false;
        }
    }
</script>

<Toaster richColors />
<Navbar />

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-8">
        <div>
            <h2 class="text-center text-3xl font-extrabold">Ayarlar</h2>
            <p class="mt-2 text-center text-sm opacity-70">Hesap tercihlerinizi yönetin</p>
        </div>

        <div class="bg-white rounded-md shadow-md backdrop-blur-sm border border-gray-100 p-8">
            {#if loading}
            <div class="flex justify-center items-center py-20">
                <i class="ri-loader-4-line animate-spin text-4xl text-primary"></i>
            </div>
            {:else}
            <form on:submit|preventDefault={handleSubmit} class="space-y-8">
                <div class="space-y-6">
                    <h3 class="text-xl font-bold">Profil Bilgileri</h3>
                    
                    <div class="space-y-5">
                        <div class="relative">
                            <input type="text" id="name" bind:value={user.name} class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                            <label for="name" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">İsim</label>
                        </div>

                        <div class="relative">
                            <input type="text" id="username" bind:value={user.username} class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                            <label for="username" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Kullanıcı Adı</label>
                        </div>

                        <div class="relative">
                            <input type="email" id="email" bind:value={user.email} class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                            <label for="email" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">E-posta</label>
                        </div>

                        <div class="flex items-center space-x-3 px-2">
                            <input type="checkbox" id="emailVisibility" bind:checked={user.emailVisibility} class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label for="emailVisibility" class="text-sm text-gray-600">E-postayı diğer kullanıcılara görünür yap</label>
                        </div>
                    </div>
                </div>

                <div class="space-y-6 pt-6 border-t">
                    <h3 class="text-xl font-bold">Şifre Değiştir</h3>
                    
                    <div class="space-y-5">
                        <div class="relative">
                            <input type="password" id="currentPassword" bind:value={currentPassword} class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                            <label for="currentPassword" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Mevcut Şifre</label>
                        </div>

                        <div class="relative">
                            <input type="password" id="newPassword" bind:value={newPassword} class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                            <label for="newPassword" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Yeni Şifre</label>
                        </div>

                        <div class="relative">
                            <input type="password" id="confirmPassword" bind:value={confirmPassword} class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                            <label for="confirmPassword" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Yeni Şifreyi Onayla</label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button type="submit" disabled={loading} class="group relative flex justify-center py-2 px-8 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md">
                        {#if loading}
                        <span class="inline-flex items-center">
                            Değişiklikler kaydediliyor...
                            <i class="ri-loader-4-line animate-spin ml-2 text-white" />
                        </span>
                        {:else}
                        Değişiklikleri Kaydet
                        {/if}
                    </button>
                </div>
            </form>
            {/if}
        </div>
    </div>
</div>

<Footer />