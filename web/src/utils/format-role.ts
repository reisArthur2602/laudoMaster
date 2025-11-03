export const formatRole = (role: Roles) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";

    case "MEMBER":
      return "Membro";
  }
};
