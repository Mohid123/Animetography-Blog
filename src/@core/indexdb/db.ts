import Dexie, { Table } from "dexie";

interface PostData {
  id?: number,
  data: any,
  totalCount: number
}

export class AppDB extends Dexie {
  blogPostsData!: Table<PostData, number>;
  // blogDraftsData!: Table<any, number>;
  // blogFavsData!: Table<any, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      blogPostsData: '++id, data, totalCount',
      // blogDraftsData: '++id',
      // blogFavsData: '++id'
    });
  }

  async fetchAllPosts() {
    try {
      return await db.blogPostsData.toArray();
    } catch (error) {
      throw error
    }
  }

  async bulkAddPosts(postData: any) {
    try {
      return await db.blogPostsData.add({
        data: postData.data,
        totalCount: postData?.totalCount,
        id: 1
      });
    } catch (error) {
      throw error
    }
  }

  async updatePosts(postData: any) {
    try {
      return await db.blogPostsData.update(1, {
        data: postData?.data,
        totalCount: postData?.totalCount
      });
    } catch (error) {
      throw error
    }
  }
}

export const db = new AppDB();
