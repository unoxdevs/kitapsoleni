<script lang="ts">
    import { onMount } from 'svelte';
    import { loginUser, isUserLoggedIn } from '$lib/user';
    import { goto } from '$app/navigation';
    import { Toaster, toast } from 'svelte-sonner'

    let email = '';
    let password = '';
    let loading = false;

    onMount(async () => {
        if (await isUserLoggedIn()) {
            goto('/');
        }
    });

    async function handleSubmit() {
        if (!email || !password) {
            toast.error("E-posta ve şifre gereklidir.");
            return;
        }

        loading = true;

        try {
            const result = await loginUser(email, password);
            if (result) {
                goto('/dashboard');
            }
        } catch (e) {
            console.error('Login error:', e);
            if (e.response?.message) {
                toast.error(e.response.message);
            } else if (e.message) {
                toast.error(e.message);
            } else {
                toast.error("Giriş yapılamadı. Lütfen e-posta ve şifrenizi kontrol edin.");
            }
        } finally {
            loading = false;
        }
    }
</script>

<Toaster richColors />

<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold">Tekrar Hoşgeldiniz!</h2>
            <p class="mt-2 text-center text-sm opacity-70">Okuma yolculuğunuza devam etmek için giriş yapın</p>
        </div>
        <form class="mt-8 space-y-6 p-8 bg-white rounded-md shadow-md backdrop-blur-sm border border-gray-100" on:submit|preventDefault={handleSubmit}>
            <div class="rounded-md space-y-5">
                <div class="relative">
                    <input id="email" name="email" type="email" bind:value={email} required class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                    <label for="email" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">E-posta</label>
                </div>
                <div class="relative">
                    <input id="password" name="password" type="password" bind:value={password} required class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                    <label for="password" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Şifre</label>
                </div>
            </div>

            <div>
                <button type="submit" disabled={loading || !email || !password} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md">
                    {#if loading}
                    <span class="inline-flex items-center">
                        Giriş yapılıyor...
                        <i class="ri-loader-4-line animate-spin ml-2 text-white" />
                    </span>
                    {:else}
                    Giriş Yap
                    {/if}
                </button>
            </div>
        </form>
        <p class="text-center text-sm">Hesabınız yok mu? <a href="/register" class="text-primary hover:text-primary-hover font-medium hover:underline">Kayıt Ol</a></p>
    </div>
</div>