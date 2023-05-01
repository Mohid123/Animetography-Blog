import { Avatar } from "src/@core/models/user.model";

export interface BlogPost {
 _id: string,
 blogTitle: string,
 blogSubtitle: string,
 blogContent: string,
 postedDate: number,
 coverImage: Avatar[],
 deletedCheck: boolean,
 author: string,
 status: string
}

export interface PostData {
  data: BlogPost[],
  totalCount: number,
  filteredCount?: number
}
