export type CreateUserParams = {
  organization: {
    _id: string;
    organizationName: string
  }
  user: {
    clerkId: string;
    email: string;
    photo: string;
    firstName: string;
    lastName: string;
    approved: boolean;
  };
};

export type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  photo?: string;
};

export type CreateOrganizationParams = {
  organization: {
    organizationName: string;
    description: string;
    imageUrl: string;
  };
  path: string;
};

export type UpdateOrganizationParams = {
  organization: {
    organizationName?: string;
    description?: string;
    imageUrl?: string;
  };
  path: string
};
