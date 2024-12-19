<script lang="ts">
    import { onMount } from "svelte";
    import { getAllUsers, deleteUser, updateUserRole } from "$lib/admin";
    import { getAllBlogs, deleteBlog } from "$lib/blog";
    import Navbar from "../../../components/dashboard/Navbar.svelte";
    import Footer from "../../../components/dashboard/Footer.svelte";
    import { Toaster, toast } from 'svelte-sonner';
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { isUserLoggedIn } from "$lib/user";
    import db from "$lib/db";

    let users: any[] = [];
    let blogs: any[] = [];
    let loading = true;
    let error: string | null = null;
    let currentUserId: string | null = null;
    let showDeleteModal = false;
    let blogToDelete: any = null;
    let userToDelete: any = null;
    let isAuthenticated = false;

    $: totalUsers = users.length;
    $: adminCount = users.filter(user => user.admin).length;
    $: regularUserCount = totalUsers - adminCount;
    $: totalBlogs = blogs.length;

    async function checkAuth() {
        try {
            isAuthenticated = await isUserLoggedIn();
            if (!isAuthenticated) {
                goto("/login");
                return;
            }

            const isAdmin = db.authStore.model?.admin || false;
            if (!isAdmin) {
                goto("/dashboard");
                return;
            }
        } catch (e) {
            error = "Yetkilendirme hatası.";
            return;
        }
    }

    onMount(async () => {
        try {
            await checkAuth();
            
            const [usersData, blogsData] = await Promise.all([
                getAllUsers(),
                getAllBlogs()
            ]);
            users = usersData;
            blogs = blogsData;
            currentUserId = $page.data.user?.id;
        } catch (e) {
            if (e instanceof Error) {
                error = e.message;
            } else {
                error = "Veriler yüklenirken bir hata oluştu.";
            }
        } finally {
            loading = false;
        }
    });

    async function handleRoleUpdate(userId: string, isAdmin: boolean) {
        if (userId === currentUserId) {
            toast.error("Kendi rolünüzü değiştiremezsiniz!");
            return;
        }

        const adminUsers = users.filter(u => u.admin);
        if (!isAdmin && adminUsers.length <= 1 && users.find(u => u.id === userId)?.admin) {
            toast.error("Son admin kullanıcısının rolünü değiştiremezsiniz!");
            return;
        }

        try {
            await updateUserRole(userId, isAdmin);
            users = users.map(user => 
                user.id === userId 
                    ? { ...user, admin: isAdmin }
                    : user
            );
            toast.success("Kullanıcı rolü güncellendi!");
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            } else {
                toast.error("Kullanıcı rolü güncellenirken bir hata oluştu.");
            }
        }
    }

    function openDeleteModal(type: 'blog' | 'user', item: any) {
        if (type === 'blog') {
            blogToDelete = item;
        } else {
            userToDelete = item;
        }
        showDeleteModal = true;
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        blogToDelete = null;
        userToDelete = null;
    }

    async function handleDelete() {
        try {
            if (blogToDelete) {
                await deleteBlog(blogToDelete.id);
                blogs = blogs.filter(blog => blog.id !== blogToDelete.id);
                toast.success("Blog yazısı başarıyla silindi!");
            } else if (userToDelete) {
                if (userToDelete.id === currentUserId) {
                    toast.error("Kendi hesabınızı silemezsiniz!");
                    return;
                }

                const adminUsers = users.filter(u => u.admin);
                if (userToDelete.admin && adminUsers.length <= 1) {
                    toast.error("Son admin kullanıcısını silemezsiniz!");
                    return;
                }

                await deleteUser(userToDelete.id);
                users = users.filter(user => user.id !== userToDelete.id);
                toast.success("Kullanıcı başarıyla silindi!");
            }
            closeDeleteModal();
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            } else {
                toast.error("İşlem sırasında bir hata oluştu.");
            }
        }
    }
</script>

<Toaster richColors />
<Navbar />

{#if showDeleteModal}
<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h3 class="text-xl font-semibold">{blogToDelete ? 'Blog Yazısını Sil' : 'Kullanıcıyı Sil'}</h3>
        <p class="opacity-70">
            {#if blogToDelete}
            "{blogToDelete.title}" başlıklı blog yazısını silmek istediğinizden emin misiniz?
            {:else}
            "{userToDelete?.username}" kullanıcısını silmek istediğinizden emin misiniz?
            {/if}
            Bu işlem geri alınamaz.
        </p>
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

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
        <div>
            <h2 class="text-center text-3xl font-extrabold">Yönetici Paneli</h2>
            <p class="mt-2 text-center text-sm opacity-70">Kullanıcıları yönetin ve istatistikleri görüntüleyin</p>
        </div>

        {#if loading}
        <div class="flex justify-center items-center h-64">
            <div class="inline-flex items-center">
                <i class="ri-loader-4-line animate-spin text-4xl text-primary" />
            </div>
        </div>
        {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative" role="alert">
            <span class="block sm:inline">{error}</span>
        </div>
        {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm p-6 border backdrop-blur-sm">
                <div class="flex items-center space-x-4">
                    <div>
                        <h3 class="text-lg font-semibold">Toplam Kullanıcı</h3>
                        <p class="text-3xl font-bold">{totalUsers}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6 border backdrop-blur-sm">
                <div class="flex items-center space-x-4">
                    <div>
                        <h3 class="text-lg font-semibold">Admin Sayısı</h3>
                        <p class="text-3xl font-bold">{adminCount}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6 border backdrop-blur-sm">
                <div class="flex items-center space-x-4">
                    <div>
                        <h3 class="text-lg font-semibold">Normal Kullanıcı</h3>
                        <p class="text-3xl font-bold">{regularUserCount}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6 border backdrop-blur-sm">
                <div class="flex items-center space-x-4">
                    <div>
                        <h3 class="text-lg font-semibold">Toplam Blog</h3>
                        <p class="text-3xl font-bold">{totalBlogs}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white shadow-sm rounded-lg overflow-hidden border backdrop-blur-sm">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">Kullanıcı Adı</th>
                            <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">Isim</th>
                            <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">Rol</th>
                            <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y">
                        {#each users as user (user.id)}
                        <tr class="hover:bg-gray-50 transition-all duration-200">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{user.username}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{user.name}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <select class="peer appearance-none rounded-md px-4 py-2 border focus:outline-none focus:border-primary transition-all duration-200 bg-gray-50/50 text-sm" value={user.admin} on:change={(e) => handleRoleUpdate(user.id, e.target.value === 'true')}>
                                    <option value={false}>Kullanıcı</option>
                                    <option value={true}>Admin</option>
                                </select>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button on:click={() => openDeleteModal('user', user)} class="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-hover transition-all duration-300">
                                    Sil
                                </button>
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-8">
            <h3 class="text-2xl font-bold mb-4">Blog Yazıları</h3>
            <div class="bg-white shadow-sm rounded-lg overflow-hidden border backdrop-blur-sm">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">Başlık</th>
                                <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">Yazar</th>
                                <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">Tarih</th>
                                <th class="px-6 py-3 text-left text-xs font-medium opacity-70 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y">
                            {#each blogs as blog (blog.id)}
                            <tr class="hover:bg-gray-50 transition-all duration-200">
                                <td class="px-6 py-4">
                                    <div class="text-sm font-medium text-gray-900">{blog.title}</div>
                                    <div class="text-sm opacity-70 line-clamp-1">{blog.description}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{blog.author}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm opacity-70">{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center gap-2">
                                        <button on:click={() => goto(`/dashboard/blog/${blog.id}`)} class="text-primary hover:bg-primary/10 p-2 rounded-md transition-colors">
                                            <i class="ri-edit-line"></i>
                                        </button>
                                        <button on:click={() => openDeleteModal('blog', blog)} class="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors">
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {/if}
    </div>
</div>

<Footer />