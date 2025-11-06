export const formatRole = (role: Roles) => {
  switch (role) {
    case "ADMIN":
      return "Admin";

    case "LAUDO":
      return "Laudo";
      
    case "TECHNICAL":
      return "Técnico";
  }
};
