declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      accessToken?: string;
    };
  }

  interface User {
    accessToken?: string;
  }
}
