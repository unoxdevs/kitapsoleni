<script lang="ts">
    import { getBlog, incrementBlogViews, canIncrementViews, type Blog } from "$lib/blog";
    import { createComment, getComments, deleteComment, type Comment } from "$lib/comment";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Navbar from "../../../components/Navbar.svelte";
    import Footer from "../../../components/Footer.svelte";
    import { Toaster, toast } from 'svelte-sonner';
    import { isUserLoggedIn, getUserProfile } from "$lib/user";
    import db from "$lib/db";

    let blog: Blog | null = null;
    let loading = true;
    let error: string | null = null;
    let comments: Comment[] = [];
    let newComment = "";
    let isAdmin = false;
    let loggedIn = false;
    let commentLoading = false;

    function calculateReadingTime(content: string): string {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        
        if (minutes < 1) return "1 dakika";
        return `${minutes} dakika`;
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async function loadComments() {
        try {
            if (!blog) return;
            comments = await getComments(blog.id);
        } catch (e) {
            console.error('Error loading comments:', e);
            toast.error('Yorumlar yüklenirken bir hata oluştu');
        }
    }

    async function handleCommentSubmit() {
        if (!blog || !newComment.trim()) return;
        
        commentLoading = true;
        try {
            await createComment(blog.id, newComment.trim());
            newComment = "";
            await loadComments();
            toast.success('Yorumunuz eklendi!');
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            } else {
                toast.error('Yorum eklenirken bir hata oluştu');
            }
        } finally {
            commentLoading = false;
        }
    }

    async function handleCommentDelete(commentId: string) {
        try {
            await deleteComment(commentId);
            await loadComments();
            toast.success('Yorum silindi!');
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            } else {
                toast.error('Yorum silinirken bir hata oluştu');
            }
        }
    }

    onMount(async () => {
        try {
            loading = true;
            error = null;
            const blogId = $page.params.id;
            blog = await getBlog(blogId);
            
            if (!blog) {
                error = "Blog yazısı bulunamadı.";
                return;
            }

            if (canIncrementViews(blogId)) {
                try {
                    blog = await incrementBlogViews(blogId);
                } catch (e) {
                    console.error('Error incrementing views:', e);
                }
            }

            loggedIn = await isUserLoggedIn();
            if (loggedIn) {
                try {
                    const user = await getUserProfile(db.authStore.model?.id || "");
                    isAdmin = user.admin;
                } catch (e) {
                    console.error('Error fetching user profile:', e);
                    // User profile hatası blog görüntülemeyi engellemeyecek
                }
            }

            await loadComments();
        } catch (e) {
            console.error('Error loading blog:', e);
            error = "Blog yazısı yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        } finally {
            loading = false;
        }
    });
</script>

<Toaster richColors />
<Navbar />

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-8">
        {#if loading}
            <div class="flex justify-center items-center py-20">
                <i class="ri-loader-4-line animate-spin text-4xl text-primary"></i>
            </div>
        {:else if error}
            <div class="bg-white rounded-lg shadow-sm border p-8 text-center">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">{error}</h2>
                <a href="/blog" class="text-primary hover:underline">← Blog listesine dön</a>
            </div>
        {:else if blog}
        <article class="bg-white border shadow-sm rounded-lg overflow-hidden">
            {#if blog.image}
            <div class="w-full h-64 sm:h-96 relative">
                <img src={blog.image} alt={blog.title} class="w-full h-full object-cover" />
            </div>
            {/if}
                
            <div class="p-6 sm:p-8 space-y-6">
                <header class="space-y-4 border-b pb-6">
                    <div class="flex items-center justify-between">
                        <h1 class="text-3xl sm:text-4xl font-bold">{blog.title}</h1>
                        <button class="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-all duration-300" on:click={() => { navigator.clipboard.writeText(window.location.href); toast.success('Blog linki kopyalandı!'); }}>
                            <i class="ri-share-line text-xl"></i>
                        </button>
                    </div>
                        
                    <div class="flex flex-wrap items-center gap-4 text-sm opacity-70">
                        <div class="flex items-center gap-2">
                            <i class="ri-user-line"></i>
                            <span>{blog.author}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="ri-time-line"></i>
                            <time datetime={blog.created}>{new Date(blog.created).toLocaleDateString("tr-TR")}</time>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="ri-eye-line"></i>
                            <span>{blog.views} görüntülenme</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="ri-book-read-line"></i>
                            <span>{calculateReadingTime(blog.content)} okuma</span>
                        </div>
                    </div>
                </header>

                <div class="prose prose-lg max-w-none">
                    <p class="text-lg opacity-70 mb-8">{blog.description}</p>
                    <div class="whitespace-pre-wrap">{blog.content}</div>
                </div>

                {#if blog.tags && blog.tags.length > 0}
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold mb-3">Etiketler</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each blog.tags as tag}
                        <span class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm hover:bg-primary/20 transition-colors">{tag}</span>
                        {/each}
                    </div>
                </div>
                {/if}

                {#if blog.link}
                <div class="border-t pt-6">
                    <a href={blog.link} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-primary hover:underline">
                        <i class="ri-link"></i>
                        <span>Kaynak Link</span>
                    </a>
                </div>
                {/if}
            </div>
        </article>

        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div class="p-6 space-y-8">
                <div class="flex items-center justify-between border-b pb-4">
                    <div class="flex items-center gap-2">
                        <h3 class="text-xl font-semibold text-gray-900">Yorumlar</h3>
                        <span class="px-2.5 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded-lg">{comments.length}</span>
                    </div>
                </div>

                {#if loggedIn}
                <div class="space-y-4">
                    <div class="relative">
                        <textarea bind:value={newComment} placeholder="Düşüncelerinizi paylaşın..." class="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 resize-none transition-all duration-200" rows="3"></textarea>
                        <div class="absolute bottom-3 right-3 flex items-center gap-2">
                            <button on:click={() => newComment = ''} class="opacity-70 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50" title="Temizle" disabled={!newComment.trim() || commentLoading}>
                                <i class="ri-delete-bin-line"></i>
                            </button>
                            <button on:click={handleCommentSubmit} disabled={!newComment.trim() || commentLoading} class="bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-primary-hover transition-all duration-300 disabled:opacity-50 disabled:hover:bg-primary flex items-center gap-2 disabled:cursor-not-allowed">
                                {#if commentLoading}
                                <i class="ri-loader-4-line animate-spin"></i>
                                Gönderiliyor
                                {:else}
                                <i class="ri-send-plane-fill"></i>
                                Gönder
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
                {:else}
                <div class="bg-gray-50/70 p-6 rounded-xl text-center border border-dashed">
                    <div class="space-y-2">
                        <i class="ri-user-line text-2xl"></i>
                        <p class="opacity-70">Yorum yapmak için giriş yapmanız gerekiyor</p>
                        <a href="/login" class="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-hover transition-all duration-300 inline-flex items-center gap-2">Giriş Yap</a>
                    </div>
                </div>
                {/if}

                {#if comments.length > 0}
                <div class="space-y-4">
                    {#each comments as comment (comment.id)}
                    <div class="group flex space-x-4 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span class="text-primary font-medium text-sm">
                                    {comment.author[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div class="flex-1 space-y-1.5">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">{comment.author}</span>
                                    <span class="text-sm">•</span>
                                    <time datetime={comment.created} class="text-sm">{formatDate(comment.created)}</time>
                                </div>
                                {#if isAdmin || comment.user === db.authStore.model?.id}
                                <button on:click={() => handleCommentDelete(comment.id)} class="opacity-70 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200" title="Yorumu sil">
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                                {/if}
                            </div>
                            <p class="leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                    {/each}
                </div>
                {:else}
                <div class="text-center py-8">
                    <div class="space-y-3">
                        <i class="ri-chat-3-line text-3xl"></i>
                        <p class="opacity-70">Henüz yorum yapılmamış</p>
                    </div>
                </div>
                {/if}
            </div>
        </div>
        {/if}
    </div>
</div>

<Footer />