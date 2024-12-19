import db from './db';
import type { Record } from 'pocketbase';

export interface Blog extends Record {
    title: string;
    description: string;
    content: string;
    link?: string;
    image?: string;
    tags?: string[];
    author: string;
    authorId: string;
    published: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
}

export async function createBlog(data: Partial<Blog>) {
    try {
        const user = db.authStore.model;
        if (!user) throw new Error("Giriş yapmanız gerekiyor");

        const blogData = {
            ...data,
            author: user.name,
            authorId: user.id,
            published: true,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return await db.collection('blogs').create(blogData);
    } catch (error) {
        console.error('Error creating blog:', error);
        throw error;
    }
}

export async function updateBlog(blogId: string, data: Partial<Blog>) {
    try {
        const user = db.authStore.model;
        if (!user) throw new Error("Giriş yapmanız gerekiyor");

        const blog = await db.collection('blogs').getOne(blogId);
        if (blog.authorId !== user.id && !user.admin) {
            throw new Error("Bu blogu düzenleme yetkiniz yok");
        }

        const updateData = {
            ...data,
            updatedAt: new Date().toISOString()
        };

        return await db.collection('blogs').update(blogId, updateData);
    } catch (error) {
        console.error('Error updating blog:', error);
        throw error;
    }
}

export async function deleteBlog(blogId: string) {
    try {
        const user = db.authStore.model;
        if (!user) throw new Error("Giriş yapmanız gerekiyor");

        const blog = await db.collection('blogs').getOne(blogId);
        if (blog.authorId !== user.id && !user.admin) {
            throw new Error("Bu blogu silme yetkiniz yok");
        }

        return await db.collection('blogs').delete(blogId);
    } catch (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }
}

export async function getBlog(blogId: string) {
    try {
        return await db.collection('blogs').getOne(blogId);
    } catch (error) {
        console.error('Error fetching blog:', error);
        throw error;
    }
}

export async function getAllBlogs() {
    try {
        const records = await db.collection('blogs').getFullList({
            sort: '-created',
        });
        
        return records.map(record => ({
            ...record,
            createdAt: record.created,
            updatedAt: record.updated
        }));
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
}

export async function getUserBlogs(userId: string): Promise<Blog[]> {
    try {
        const records = await db.collection('blogs').getFullList<Blog>({
            filter: `authorId = "${userId}"`,
            sort: '-created',
        });
        return records;
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        throw error;
    }
}

export async function incrementBlogViews(blogId: string) {
    try {
        const blog = await db.collection('blogs').getOne(blogId);
        return await db.collection('blogs').update(blogId, {
            views: blog.views + 1
        });
    } catch (error) {
        console.error('Error incrementing blog views:', error);
        throw error;
    }
}

export function canIncrementViews(blogId: string): boolean {
    if (typeof window === 'undefined') return false;

    const now = new Date().getTime();
    const viewsKey = `blog_view_${blogId}`;
    const lastViewTime = localStorage.getItem(viewsKey);

    if (!lastViewTime) {
        localStorage.setItem(viewsKey, now.toString());
        return true;
    }

    const timeDiff = now - parseInt(lastViewTime);
    const hourInMs = 60 * 60 * 1000;

    if (timeDiff >= hourInMs) {
        localStorage.setItem(viewsKey, now.toString());
        return true;
    }

    return false;
}