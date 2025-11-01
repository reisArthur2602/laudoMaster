type Roles = "SUPER_ADMIN" | "MEMBER";

type Invite = {
  id: string;
  organization: {
    id: string;
    name: string;
  };
  role: Roles;
  expireAt: string;
};

type Member = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: Roles;
  createdAt: string;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  role: string;
  createdAt: string;
};
