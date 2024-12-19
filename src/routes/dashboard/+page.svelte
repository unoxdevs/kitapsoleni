<script lang="ts">
    import { onMount } from "svelte";
    import { getAllBlogs, getUserBlogs, deleteBlog } from "$lib/blog";
    import { Toaster, toast } from 'svelte-sonner';
    import Navbar from "../../components/dashboard/Navbar.svelte";
    import Footer from "../../components/dashboard/Footer.svelte";
    import { goto } from "$app/navigation";
    import db from "$lib/db";
    import { getUserProfile } from "$lib/user";

    let blogs: any[] = [];
    let loading = true;
    let error: string | null = null;
    let showDeleteModal = false;
    let blogToDelete: any = null;
    let isAdmin = false;
    let currentUserId = null;
    let currentUser: any = null;
    let searchQuery = "";
    let selectedTags: string[] = [];
    let sortBy = "newest";
    let allTags: string[] = [];

    $: filteredBlogs = blogs
        .filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               blog.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTags = selectedTags.length === 0 || 
                              (blog.tags && blog.tags.some(tag => selectedTags.includes(tag)));
            return matchesSearch && matchesTags;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.created).getTime() - new Date(a.created).getTime();
                case "oldest":
                    return new Date(a.created).getTime() - new Date(b.created).getTime();
                case "popular":
                    return (b.views || 0) - (a.views || 0);
                default:
                    return 0;
            }
        });

    onMount(async () => {
        try {
            if (!db.authStore.model?.id) {
                goto('/login');
                return;
            }

            currentUserId = db.authStore.model.id;
            currentUser = db.authStore.model;
            
            const userData = await getUserProfile(currentUserId);
            isAdmin = userData.admin;
            
            blogs = isAdmin 
                ? await getAllBlogs()
                : await getUserBlogs(currentUserId);
            
            allTags = [...new Set(blogs.flatMap(blog => blog.tags || []))].sort();
        } catch (e) {
            error = e instanceof Error ? e.message : "Bloglar yüklenirken bir hata oluştu.";
        } finally {
            loading = false;
        }
    });

    function toggleTag(tag) {
        selectedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
    }

    function openDeleteModal(blog) {
        blogToDelete = blog;
        showDeleteModal = true;
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        blogToDelete = null;
    }

    async function handleDelete() {
        if (!blogToDelete) return;
        
        try {
            await deleteBlog(blogToDelete.id);
            blogs = blogs.filter(blog => blog.id !== blogToDelete.id);
            toast.success("Blog başarıyla silindi!");
            closeDeleteModal();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Blog silinirken bir hata oluştu.");
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
</script>

<Toaster richColors />
<Navbar {isAdmin} />

{#if showDeleteModal}
<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h3 class="text-xl font-semibold">Blog Yazısını Sil</h3>
        <p class="opacity-70">"{blogToDelete?.title}" başlıklı blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
        <div class="flex gap-4 pt-4">
            <button type="button" class="flex-1 bg-gray-100 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-all duration-300" on:click={closeDeleteModal}>
                İptal
            </button>
            <button type="button" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-all duration-300" on:click={handleDelete}>
                Sil
            </button>
        </div>
    </div>
</div>
{/if}

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
        <div class="bg-white p-8 rounded-lg shadow-sm border-b">
            <div class="md:flex md:justify-between md:items-center">
                <div>
                    <h2 class="text-3xl font-extrabold">Bloglarım</h2>
                    <p class="mt-2 text-sm opacity-70">{isAdmin ? 'Tüm blog yazılarını görüntüleyin ve yönetin' : 'Blog yazılarınızı görüntüleyin ve yönetin'}</p>
                </div>
                <button on:click={() => goto("/dashboard/blog")} class="w-full md:w-auto mt-4 md:mt-0 bg-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-all duration-300 flex items-center justify-center gap-2">
                    Yeni Blog
                </button>
            </div>

            <div class="mt-8 space-y-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <input type="text" bind:value={searchQuery} placeholder="Blog ara..." class="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300" />
                            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2"></i>
                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <select bind:value={sortBy} class="w-full md:w-48 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300">
                            <option value="newest">En Yeni</option>
                            <option value="popular">En Çok Okunan</option>
                            <option value="oldest">En Eski</option>
                        </select>
                    </div>
                </div>

                {#if allTags.length > 0}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium">Etiketler</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each allTags as tag}
                        <button class="px-3 py-1.5 rounded-lg text-sm transition-all duration-300 {selectedTags.includes(tag) ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}" on:click={() => toggleTag(tag)}>
                            {tag}
                        </button>
                        {/each}
                    </div>
                </div>
                {/if}
            </div>
        </div>

        {#if loading}
        <div class="flex justify-center items-center h-64">
            <div class="inline-flex items-center gap-2 text-primary">
                <i class="ri-loader-4-line animate-spin text-4xl"></i>
            </div>
        </div>
        {:else if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg" role="alert">
            <div class="flex items-center gap-2">
                <i class="ri-error-warning-line"></i>
                <span>{error}</span>
            </div>
        </div>
        {:else if filteredBlogs.length === 0}
        <div class="text-center py-12">
            <div class="inline-flex flex-col items-center">
                <i class="ri-article-line text-5xl mb-4"></i>
                <p class="text-lg">
                    {#if isAdmin}
                    {searchQuery || selectedTags.length > 0 ? 'Aramanızla eşleşen blog bulunamadı' : 'Henüz blog yazısı bulunmuyor'}
                    {:else}
                    {searchQuery || selectedTags.length > 0 ? 'Aramanızla eşleşen blog bulunamadı' : 'Henüz blog yazısı paylaşmadınız'}
                    {/if}
                </p>
            </div>
        </div>
        {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredBlogs as blog (blog.id)}
            <article class="group bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 flex flex-col">
                <div class="relative w-full h-48 overflow-hidden bg-gray-100 cursor-pointer" on:click={() => goto(`/blog/${blog.id}`)}>
                    {#if blog.image}
                    <img src={blog.image} alt={blog.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {:else}
                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                        <i class="ri-image-line text-4xl"></i>
                    </div>
                    {/if}
                </div>

                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex-1 cursor-pointer" on:click={() => goto(`/blog/${blog.id}`)}>
                        <h3 class="text-xl font-semibold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {blog.title}
                        </h3>
                        <p class="mt-2 text-sm opacity-70 line-clamp-3">
                            {blog.description}
                        </p>
                    </div>

                    <div class="mt-4 flex items-center justify-between text-sm opacity-70">
                        <span>{isAdmin ? blog.author : currentUser?.name}</span>
                        <span>{formatDate(blog.created)}</span>
                    </div>

                    {#if blog.tags && blog.tags.length > 0}
                    <div class="mt-4 flex flex-wrap gap-2">
                        {#each blog.tags as tag}
                        <span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                            {tag}
                        </span>
                        {/each}
                    </div>
                    {/if}

                    <div class="mt-4 pt-4 border-t flex items-center justify-between">
                        {#if blog.link}
                        <a href={blog.link} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline text-sm flex items-center gap-1" on:click|stopPropagation>
                            <i class="ri-link"></i>
                            Bağlantıya Git
                        </a>
                        {:else}
                        <div></div>
                        {/if}

                        <div class="flex items-center space-x-2">
                            <button on:click|stopPropagation={() => goto(`/dashboard/blog/${blog.id}`)} class="text-primary hover:bg-primary/10 p-2 rounded-md transition-colors" title="Düzenle">
                                <i class="ri-edit-line"></i>
                            </button>
                            <button on:click|stopPropagation={() => openDeleteModal(blog)} class="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors" title="Sil">
                                <i class="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
            {/each}
        </div>
        {/if}
    </div>
</div>

<Footer />