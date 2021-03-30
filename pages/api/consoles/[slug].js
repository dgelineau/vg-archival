import { GraphQLClient } from "graphql-request";
import slugify from "slugify";

const createMutationEvent = async ({
  title,
  description,
  rating,
  release,
  upc,
  developer,
  publisher,
  genre,
  consoleSlug,
}) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
    },
  });

  const slugifiedTitle = slugify(title, {
    lower: true,
    strict: true,
  });

  const { createGame } = await graphcms.request(
    `    
          mutation ($title: String!, $description: String!, $rating: EsrbRatings!, $release: Date!, $upc: String!, $developer: String!, $publisher: String!, $genre: Genre!, $consoleSlug: String!, $slug: String!) {
            createGame(
              data: {
                title: $title,
                description: $description,
                rating: $rating,
                release: $release,
                upc: $upc,
                developer: $developer,
                publisher: $publisher,
                genre: $genre,
                console: { connect: { slug: $consoleSlug } }
                slug: $slug
              }
            ) 
            {
              id
              title
              description
              rating
              release
              upc
              developer
              publisher
              genre
              slug
            }
          }
        `,
    {
      title: title,
      description: description,
      rating: rating,
      release: release,
      upc: upc,
      developer: developer,
      publisher: publisher,
      genre: genre,
      consoleSlug: consoleSlug,
      slug: `${slugifiedTitle}-${consoleSlug}`,
    }
  );

  //publish the changes to graph CMS
  await graphcms.request(
    `
      mutation ($id: ID!) {
        publishGame(where: { id: $id }, to: PUBLISHED) {
          id
        }
      }
  `,
    { id: createGame.id }
  );

  return createGame;
};

export default async function handler(req, res) {
  const {
    query: { slug },
  } = req;

  switch (req.method) {
    case "GET":
      const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
        headers: {
          authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
        },
      });

      const variables = {
        consoleSlug: slug,
      };

      const { gameConsole } = await graphcms.request(
        `
            query getGameConsole($consoleSlug: String!) {
                gameConsole(where: { slug: $consoleSlug }) {
                    id,
                    slug,
                    name,
                    games(orderBy: title_ASC) { 
                        id,
                        title,
                        description,
                        rating,
                        release,
                        upc,
                        developer,
                        publisher,
                        genre,
                        slug
                    }
            }
        }
        `,
        variables
      );

      res.status(200).json({ gameConsole });
      break;
    case "POST":
      const {
        body: { games },
      } = req;

      if (games.length > 100) {
        throw new Error("You cannot upload more than 100 games at a time.");
      }

      try {
        const createdGames = await Promise.all(
          games.map((game) =>
            createMutationEvent({ ...game, consoleSlug: slug })
          )
        );

        res.status(200).json({ games: createdGames });
      } catch ({ response: { errors } }) {
        res.status(400).json({ errors });
      }
    default:
      res.status(405).end();
      break;
  }
}
