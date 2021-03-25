

export interface User {
  accessToken: string;
  profile:Profile;
}

export interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
  oldpass:string;
  newpass:string;
  confirmpass:string;
}

