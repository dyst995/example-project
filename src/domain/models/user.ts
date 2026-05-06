export enum CustomerType {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
}

export interface User {
  lastName: string;
  firstName: string;
  country: string;
  customerType: CustomerType;
  agreement: boolean;
  address: string;
  phone: string;
  userName: string;
  birthDate: string;
  email: string;
}
