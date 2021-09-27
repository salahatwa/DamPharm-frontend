

export interface User {
  accessToken: string;
  email:string;
  authorities: [];

  username: string;
  bio: string;
  image: string;
  following: boolean;
  oldpass: string;
  newpass: string;
  confirmpass: string;

  companyLogo: string;
  companyName:string;
  address: string;
  postalCode: string;
  country: string;
  city: string;
  phone: string;
  productRiskCategory:number;
  qr:boolean;
}


