<script lang="ts">
    import { getAllBlogs, type Blog } from "$lib/blog";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let blogs: Blog[] = [];
    let loading = true;
    let error: string | null = null;
    let selectedTags: string[] = [];
    let searchQuery = "";
    let sortBy: "newest" | "popular" | "oldest" = "newest";
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
            blogs = await getAllBlogs();
            allTags = [...new Set(blogs.flatMap(blog => blog.tags || []))].sort();
        } catch (e) {
            if (e instanceof Error) {
                error = e.message;
            } else {
                error = "Blog yazıları yüklenirken bir hata oluştu";
            }
        } finally {
            loading = false;
        }
    });

    function toggleTag(tag: string) {
        selectedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
    }
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
        <div>
            <h2 class="text-3xl font-extrabold">Blog Yazıları</h2>
            <p class="mt-2 text-sm opacity-70">Tüm blog yazılarını görüntüleyin</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border space-y-6">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <div class="relative">
                        <input type="text" bind:value={searchQuery} placeholder="Blog ara..." class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary transition-all duration-300" />
                        <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 opacity-50"></i>
                    </div>
                </div>
                
                <div class="flex-shrink-0">
                    <select bind:value={sortBy} class="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary transition-all duration-300">
                        <option value="newest">En Yeni</option>
                        <option value="popular">En Çok Okunan</option>
                        <option value="oldest">En Eski</option>
                    </select>
                </div>
            </div>

            {#if allTags.length > 0}
            <div class="space-y-2">
                <h3 class="text-sm font-medium opacity-70">Etiketler</h3>
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

        {#if loading}
        <div class="flex justify-center items-center py-20">
            <i class="ri-loader-4-line animate-spin text-4xl text-primary"></i>
        </div>
        {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative" role="alert">
            <span class="block sm:inline">{error}</span>
        </div>
        {:else if filteredBlogs.length === 0}
        <div class="text-center py-12">
            <p class="text-lg opacity-70">{searchQuery || selectedTags.length > 0 ? 'Aramanızla eşleşen blog bulunamadı' : 'Henüz blog yazısı bulunmuyor'}</p>
        </div>
        {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredBlogs as blog}
            <article class="group bg-white rounded-lg border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col" on:click={() => goto(`/blog/${blog.id}`)}>
                <div class="w-full h-48 relative overflow-hidden bg-gray-100">
                    {#if blog.image}
                        <img src={blog.image} alt={blog.title} class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    {:else}
                        <div class="w-full h-full flex items-center justify-center text-gray-400">
                            <i class="ri-image-line text-4xl"></i>
                        </div>
                    {/if}
                </div>
                
                <div class="p-6 flex-1 flex flex-col">
                    <h3 class="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">{blog.title}</h3>
                    <p class="text-sm opacity-70 mb-4 line-clamp-3 flex-1">{blog.description}</p>
                    
                    <div class="flex items-center justify-between text-sm opacity-70">
                        <div class="flex items-center gap-2">
                            <i class="ri-user-line"></i>
                            <span>{blog.author}</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-1">
                                <i class="ri-eye-line"></i>
                                <span>{blog.views || 0}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <i class="ri-time-line"></i>
                                <time datetime={blog.created}>{new Date(blog.created).toLocaleDateString("tr-TR")}</time>
                            </div>
                        </div>
                    </div>

                    {#if blog.tags && blog.tags.length > 0}
                    <div class="flex flex-wrap gap-2 mt-4">
                        {#each blog.tags.slice(0, 3) as tag}
                        <span class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm hover:bg-primary/20 transition-colors" on:click|stopPropagation={() => toggleTag(tag)}>
                            {tag}
                        </span>
                        {/each}
                        {#if blog.tags.length > 3}
                        <span class="bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-500">+{blog.tags.length - 3} daha</span>
                        {/if}
                    </div>
                    {/if}
                </div>
            </article>
            {/each}
        </div>
        {/if}
    </div>
</div>