import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  callbacks: {
    session: async (session, user) => {
      if (user.uid) {
        session.user.id = user.uid;
      }

      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      if (account) {
        const { id } = account;
        token.uid = id;
      }

      return Promise.resolve(token);
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,
  },
  secret: process.env.JWT_SECRET,
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

export default (req, res) => NextAuth(req, res, options);
