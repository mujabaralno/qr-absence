export type CreateUserParams = {
    clerkId: string;
    email: string;
    photo: string;
    firstName: string;
    lastName: string;
    role: string;
    approved: boolean;
    organizationId: string
};

export type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  photo?: string;
  approved?: boolean;
  role?: string;
};

export type CreateOrganizationParams = {
  organization: {
    organizationName: string;
    description: string;
    imageUrl: string;
    responsiblePerson: string
    origin: string
  };
  path: string;
};

export type UpdateOrganizationParams = {
  organization: {
    organizationName?: string;
    description?: string;
    imageUrl?: string;
    responsiblePerson?: string
    origin?: string
  };
  path: string
};




export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}