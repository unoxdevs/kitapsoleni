<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getUserProfile, isUserLoggedIn } from "$lib/user";
    import { Toaster, toast } from 'svelte-sonner'
    import Navbar from "../../../components/dashboard/Navbar.svelte";
    import Footer from "../../../components/dashboard/Footer.svelte";
    import db from "$lib/db";

    interface UserProfile {
        email: string;
        username: string;
        name: string;
        emailVisibility: boolean;
        created: string;
        updated: string;
    }

    let profile: UserProfile | null = null;
    let loading = true;

    onMount(async () => {
        if (!(await isUserLoggedIn())) {
            goto("/login");
            return;
        }
        
        try {
            const userId = db.authStore.model?.id;
            if (!userId) {
                toast.error("Kullanıcı bulunamadı");
                return;
            }

            const userData = await getUserProfile(userId);
            if (userData) {
                profile = {
                    email: userData.email || "",
                    username: userData.username || "",
                    name: userData.name || "",
                    emailVisibility: userData.emailVisibility || false,
                    created: new Date(userData.created).toLocaleDateString(),
                    updated: new Date(userData.updated).toLocaleDateString()
                };
            }
        } catch (error) {
            toast.error("Profil yüklenemedi");
        } finally {
            loading = false;
        }
    });
</script>

<Toaster richColors />
<Navbar />

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold">Profil</h2>
            <p class="mt-2 text-center text-sm opacity-70">Profil bilgilerinizi görüntüleyin</p>
        </div>

        <div class="bg-white rounded-md shadow-md backdrop-blur-sm border border-gray-100 p-8">
            {#if loading}
            <div class="flex justify-center items-center py-20">
                <i class="ri-loader-4-line animate-spin text-4xl text-primary"></i>
            </div>
            {:else if profile}
            <div class="space-y-8">
                <div class="flex items-center space-x-3">
                    <h3 class="text-xl font-bold">Kişisel Bilgiler</h3>
                 </div>
                    
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="relative">
                        <div class="peer appearance-none rounded-md block w-full px-4 py-3 border bg-gray-50/50">{profile.name}</div>
                        <label class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 bg-white px-2">İsim</label>
                    </div>

                    <div class="relative">
                        <div class="peer appearance-none rounded-md block w-full px-4 py-3 border bg-gray-50/50">{profile.username}</div>
                        <label class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 bg-white px-2">Kullanıcı Adı</label>
                    </div>

                    <div class="relative">
                        <div class="peer appearance-none rounded-md block w-full px-4 py-3 border bg-gray-50/50">{profile.email}</div>
                        <label class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 bg-white px-2">E-posta</label>
                    </div>

                    <div class="relative">
                        <div class="peer appearance-none rounded-md block w-full px-4 py-3 border bg-gray-50/50">
                            {profile.emailVisibility ? 'Herkese Açık' : 'Gizli'}
                        </div>
                        <label class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 bg-white px-2">E-posta Görünürlüğü</label>
                    </div>
                </div>

                <div class="border-t pt-8 space-y-8">
                    <div class="flex items-center space-x-3">
                        <h3 class="text-xl font-bold">Hesap Detayları</h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="relative">
                            <div class="peer appearance-none rounded-md block w-full px-4 py-3 border bg-gray-50/50">{profile.created}</div>
                            <label class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 bg-white px-2">Hesap Oluşturulma</label>
                        </div>

                        <div class="relative">
                            <div class="peer appearance-none rounded-md block w-full px-4 py-3 border bg-gray-50/50">{profile.updated}</div>
                            <label class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 bg-white px-2">Son Güncelleme</label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <a href="/dashboard/settings" class="flex items-center justify-center bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-hover transition-all duration-300">
                        <span>Profili Düzenle</span>
                    </a>
                </div>
            </div>
            {:else}
            <div class="text-center py-20">
                <p>Profil bilgileri yüklenemedi</p>
            </div>
            {/if}
        </div>
    </div>
</div>

<Footer />