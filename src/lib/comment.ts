import db from './db';
import type { Record } from 'pocketbase';

export interface Comment {
    id: string;
    content: string;
    blog: string;
    user: string;
    author: string;
    created: string;
}

export async function createComment(blogId: string, content: string): Promise<Comment> {
    const userId = db.authStore.model?.id;
    if (!userId) throw new Error('Yorum yapmak için giriş yapmalısınız');

    const record = await db.collection('comments').create({
        content,
        blog: blogId,
        user: userId,
        author: db.authStore.model?.name || 'Anonim'
    });

    return {
        id: record.id,
        content: record.content,
        blog: record.blog,
        user: record.user,
        author: record.author,
        created: record.created
    };
}

export async function getComments(blogId: string): Promise<Comment[]> {
    const records = await db.collection('comments').getList(1, 50, {
        filter: `blog = "${blogId}"`,
        sort: '-created',
        expand: 'user'
    });

    return records.items.map(record => ({
        id: record.id,
        content: record.content,
        blog: record.blog,
        user: record.user,
        author: record.author,
        created: record.created
    }));
}

export async function deleteComment(commentId: string): Promise<void> {
    const userId = db.authStore.model?.id;
    if (!userId) throw new Error('Bu işlem için giriş yapmalısınız');

    const comment = await db.collection('comments').getOne(commentId);
    const user = await db.collection('users').getOne(userId);

    if (!user.admin && comment.user !== userId) {
        throw new Error('Bu yorumu silme yetkiniz yok');
    }

    await db.collection('comments').delete(commentId);
}
