import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import GoogleProvider from "next-auth/providers/google";
import VkProvider from "next-auth/providers/vk";

// Helper to decode JWTs natively
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID as string,
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID as string,
      clientSecret: process.env.VK_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error(
              "Требуется указать адрес электронной почты и пароль",
            );
          }

          const backendUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8800";

          const res = await fetch(`${backendUrl}/api/auth/partner/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data.message || "Неверный адрес электронной почты или пароль!",
            );
          }

          const { token, user } = data;

          if (!token)
            throw new Error("Ошибка сервера: токен авторизации не получен.");

          const decodedToken = decodeJwt(token);

          if (!decodedToken || decodedToken.id === undefined) {
            throw new Error("Ошибка сервера: недействительный токен.");
          }

          // 🚨 FIX: Strict mapping. If role is empty, keep it empty.
          const userRole = decodedToken.role || "";

          return {
            id: decodedToken.id,
            name: user?.name || "",
            email: user?.email || credentials.email,
            phone: user?.phone || null,
            role: userRole,
            image: user?.image || null,
            accessToken: token,
          };
        } catch (error: any) {
          console.error("🚨 Authorize Error:", error.message);
          throw new Error(error.message || "Системная ошибка сервера");
        }
      },
    }),
  ],

  callbacks: {
    async signIn() {
      return true;
    },

    // NextAuth redirect callback lacks user session context, so we let it route to
    // /dashboard, and handle the role-based redirection on the frontend.
    async redirect({ url, baseUrl }) {
      if (url.includes("/dashboard")) return url;
      return `${baseUrl}/dashboard`;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session) {
        if (session.role !== undefined) token.role = session.role;
        if (session.accessToken) token.accessToken = session.accessToken;
      }

      if (account && user) {
        const isOAuth = ["yandex", "google", "vk"].includes(
          account.provider || "",
        );

        if (isOAuth) {
          try {
            const backendUrl =
              process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8800";
            const oauthRes = await fetch(
              `${backendUrl}/api/auth/oauth/partner`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                }),
              },
            );

            const oauthData = await oauthRes.json();

            if (oauthRes.ok && oauthData.token) {
              const decodedOAuthToken = decodeJwt(oauthData.token);

              if (decodedOAuthToken) {
                token.id = decodedOAuthToken.id;
                // 🚨 FIX: Do NOT fallback to "partner". If the backend says the role is "",
                // it MUST remain "" so the frontend knows they need to finish registration.
                token.role = decodedOAuthToken.role || "";
              }

              token.accessToken = oauthData.token;
            } else {
              console.error("OAuth Backend Sync Failed:", oauthData);
            }
          } catch (err) {
            console.error("OAuth Backend Fetch Error:", err);
          }
        } else {
          // Credentials login data mapping
          token.id = user.id;
          token.role = user.role || "";
          token.accessToken = user.accessToken;
        }

        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if (user.image) token.picture = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
