export class User {
  _id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  username!: string;
  password!: string;
  avatar!: Avatar[];
  deletedCheck!: boolean;
  isAdmin!: boolean;
}

export interface Avatar {
  captureFileURL: string;
  blurHash: string;
}
