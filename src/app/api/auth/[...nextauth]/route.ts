import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import NextAuth from "next-auth/next";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider) {
        try {
          // 소셜 로그인 성공 시 백엔드에 사용자 정보 전송
          const response = await fetch(
            process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `
                mutation SocialLogin($input: SocialLoginInput!) {
                  socialLogin(input: $input) {
                    token
                    user {
                      id
                      email
                      name
                    }
                  }
                }
              `,
                variables: {
                  input: {
                    provider: account.provider,
                    socialId: account.providerAccountId,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                  },
                },
              }),
            }
          );

          const data = await response.json();

          if (data.data?.socialLogin) {
            // 백엔드에서 받은 토큰을 user 객체에 저장
            user.accessToken = data.data.socialLogin.token;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Social login error:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user }) {
      // 토큰에 백엔드에서 받은 accessToken 추가
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 accessToken 추가
      if (token?.accessToken) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
