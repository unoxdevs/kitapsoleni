<script lang="ts">
    import { onMount } from "svelte";
    import { updateBlog, getBlog, type Blog } from "$lib/blog";
    import { Toaster, toast } from 'svelte-sonner';
    import Navbar from "../../../../components/dashboard/Navbar.svelte";
    import Footer from "../../../../components/dashboard/Footer.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { isUserLoggedIn, getUserProfile } from "$lib/user";
    import db from "$lib/db";

    let loading = false;
    let blog: Blog | null = null;
    let error: string | null = null;
    let isAuthenticated = false;
    let currentUser: any = null;
    let title = "";
    let description = "";
    let content = "";
    let link = "";
    let image = "";
    let tags = "";

    onMount(async () => {
        try {
            isAuthenticated = await isUserLoggedIn();
            if (!isAuthenticated) {
                error = "Bu sayfayı görüntülemek için giriş yapmalısınız.";
                return;
            }

            currentUser = await getUserProfile(db.authStore.model?.id || "");
            const blogId = $page.params.id;
            blog = await getBlog(blogId);
            
            const isAdmin = db.authStore.model?.admin || false;
            
            if (!isAdmin && blog.userId !== currentUser.id) {
                error = "Bu blogu düzenleme yetkiniz yok.";
                return;
            }
            
            title = blog.title;
            description = blog.description;
            content = blog.content;
            link = blog.link || "";
            image = blog.image || "";
            tags = blog.tags ? blog.tags.join(", ") : "";
        } catch (e) {
            if (e instanceof Error) {
                error = e.message;
            } else {
                error = "Blog yüklenirken bir hata oluştu.";
            }
        }
    });

    async function handleSubmit() {
        if (!blog) return;
        
        loading = true;
        try {
            const blogData: Partial<Blog> = {
                title,
                description,
                content,
                link: link || undefined,
                image: image || undefined,
                tags: tags ? tags.split(",").map(tag => tag.trim()) : undefined
            };

            await updateBlog(blog.id, blogData);
            toast.success("Blog başarıyla güncellendi!");
            goto("/dashboard");
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            } else {
                toast.error("Blog güncellenirken bir hata oluştu.");
            }
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
            <h2 class="text-3xl font-extrabold">Blog Düzenle</h2>
            <p class="mt-2 text-sm opacity-70">Blog yazınızı düzenleyin</p>
        </div>

        {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative" role="alert">
            <span class="block sm:inline">{error}</span>
            {#if !isAuthenticated}
            <div class="mt-4">
                <button on:click={() => goto('/login')} class="bg-red-700 text-white px-4 py-2 rounded-md text-sm hover:bg-red-800 transition-all duration-300">
                    Giriş Yap
                </button>
            </div>
            {/if}
        </div>
        {:else if !blog}
        <div class="flex justify-center items-center h-64">
            <div class="inline-flex items-center">
                <i class="ri-loader-4-line animate-spin text-4xl text-primary" />
            </div>
        </div>
        {:else}
        <form on:submit|preventDefault={handleSubmit} class="bg-white shadow-sm rounded-lg p-6 space-y-6">
            <div>
                <label for="title" class="block text-sm font-medium opacity-70">Başlık</label>
                <input bind:value={title} type="text"id="title" class="mt-1 block w-full rounded-md border focus:border-primary focus:outline-none p-2 text-sm" placeholder="Blog başlığı" required />
            </div>

            <div>
                <label for="description" class="block text-sm font-medium opacity-70">Açıklama</label>
                <textarea bind:value={description} id="description" rows="3" class="mt-1 block w-full rounded-md border focus:border-primary focus:outline-none p-2 text-sm" placeholder="Blog açıklaması" required></textarea>
            </div>

            <div>
                <label for="content" class="block text-sm font-medium opacity-70">İçerik</label>
                <textarea bind:value={content} id="content" rows="10" class="mt-1 block w-full rounded-md border focus:border-primary focus:outline-none p-2 text-sm" placeholder="Blog içeriği" required></textarea>
            </div>

            <div>
                <label for="link" class="block text-sm font-medium opacity-70">Link (Opsiyonel)</label>
                <input bind:value={link} type="url" id="link" class="mt-1 block w-full rounded-md border focus:border-primary focus:outline-none p-2 text-sm" placeholder="https://example.com" />
            </div>

            <div>
                <label for="image" class="block text-sm font-medium opacity-70">Resim URL (Opsiyonel)</label>
                <input bind:value={image} type="url" id="image" class="mt-1 block w-full rounded-md border focus:border-primary focus:outline-none p-2 text-sm" placeholder="https://example.com/image.jpg" />
            </div>

            <div>
                <label for="tags" class="block text-sm font-medium opacity-70">Etiketler (Opsiyonel)</label>
                <input bind:value={tags} type="text" id="tags" class="mt-1 block w-full rounded-md border focus:border-primary focus:outline-none p-2 text-sm" placeholder="teknoloji, yazılım, web (virgülle ayırın)" />
            </div>

            <div class="flex gap-4">
                <button type="button" on:click={() => goto("/dashboard")} class="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-200 transition-all duration-300">
                    İptal
                </button>
                <button type="submit" class="flex-1 bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-hover transition-all duration-300 disabled:opacity-50" disabled={loading}>
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
            </div>
        </form>
        {/if}
    </div>
</div>

<Footer />