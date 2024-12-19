<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { createUser, isUserLoggedIn } from "$lib/user";
    import { Toaster, toast } from 'svelte-sonner'

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let loading = false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    onMount(async () => {
        if (await isUserLoggedIn()) {
            goto('/');
        }
    })

    async function handleSubmit() {
        if (loading) return;

        if (!username || !email || !password || !confirmPassword) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error('Şifre en az 8 karakter uzunluğunda olmalı, en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir');
            return;
        }

        try {
            loading = true;
            await createUser(username, email, false, password, confirmPassword, username, false);
            toast.success('Kullanıcı başarıyla oluşturuldu');
            goto("/login");
        } catch (error) {
            toast.error("Bir şeyler yanlış gitti");
        } finally {
            loading = false;
        }
    }
</script>

<Toaster richColors />

<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold">Hesap Oluştur</h2>
            <p class="mt-2 text-center text-sm opacity-70">Kitaplıkta kaybolmaya hazır mısın?</p>
        </div>
        <form class="mt-8 space-y-6 p-8 bg-white rounded-md shadow-md backdrop-blur-sm border border-gray-100" on:submit|preventDefault={handleSubmit}>
            <div class="rounded-md space-y-5">
                <div class="relative">
                    <input id="username" name="username" type="text" bind:value={username} required class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                    <label for="username" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Kullanıcı Adı</label>
                </div>
                <div class="relative">
                    <input id="email" name="email" type="email" bind:value={email} required class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                    <label for="email" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">E-posta</label>
                </div>
                <div class="relative">
                    <input id="password" name="password" type="password" bind:value={password} required class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                    <label for="password" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Şifre</label>
                </div>
                <div class="relative">
                    <input id="confirm-password" name="confirm-password" type="password" bind:value={confirmPassword} required class="peer appearance-none rounded-md block w-full px-4 py-3 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50" placeholder=" " />
                    <label for="confirm-password" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-primary bg-white px-2">Şifreyi Onayla</label>
                </div>
            </div>

            <div>
                <button type="submit" disabled={loading || !username || !email || !password || !confirmPassword} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md">
                    {#if loading}
                    <span class="inline-flex items-center">
                        Kayıt olunuyor...
                        <i class="ri-loader-4-line animate-spin ml-2 text-white" />
                    </span>
                    {:else}
                    Kayıt Ol
                    {/if}
                </button>
            </div>
        </form>
        <p class="text-center text-sm">Zaten hesabınız var mı? <a href="/login" class="text-primary hover:text-primary-hover font-medium hover:underline">Giriş Yap</a></p>
    </div>
</div>