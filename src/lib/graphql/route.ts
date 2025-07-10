import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { NextRequest } from 'next/server';

interface MyContext {
  req: NextRequest;
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, MyContext>(server, {
  context: async (req) => {
    return { req };
  },
});

export { handler as GET, handler as POST };
