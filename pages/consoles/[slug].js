import React, { useState } from "react";
import { PageHeader, Row, Col, Button, Upload, notification } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import GamesTable from "components/GamesTable";
import GameDrawer from "components/GameDrawer";
import Loading from "components/Loading";
import Layout from "components/Layout";
import { GraphQLClient } from "graphql-request";
import parse from "csv-parse/lib/sync";
import moment from "moment";
import {
  QueryClient,
  useQuery,
  useQueryClient,
  useMutation,
} from "react-query";
import { dehydrate } from "react-query/hydration";
import axios from "axios";

const getConsole = async (slug) => {
  const {
    data: { gameConsole },
  } = await axios.get(`/api/consoles/${slug}`);

  return gameConsole;
};

function Console({ slug }) {
  const [session, loading] = useSession();
  const { isFallback } = useRouter();
  const [csvData, setCsvData] = useState({
    games: [],
    isDrawerOpen: false,
  });

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(["gameConsole", slug], () =>
    getConsole(slug)
  );
  const mutation = useMutation(
    (games) => {
      return axios.post(`/api/consoles/${slug}`, games);
    },
    {
      onSuccess: () => {
        toggleDrawer();
        queryClient.invalidateQueries(["gameConsole", slug]);
        notification.success({
          message: "Upload Success",
          description: "You have successfully uploaded your game(s).",
        });
      },
      onError: ({
        response: {
          data: { errors },
        },
      }) => {
        notification.error({
          message: "Upload Error",
          description: errors.map(({ message, idx }) => (
            <p key={idx}>{message}</p>
          )),
        });
      },
    }
  );

  const toggleDrawer = () =>
    setCsvData((c) => ({ games: [], isDrawerOpen: !c.isDrawerOpen }));

  if (loading || isFallback || isLoading) {
    return <Loading />;
  }

  const uploadProps = {
    name: "file",
    accept: ".txt, .csv",
    showUploadList: false,
    beforeUpload: (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const records = parse(e.target.result, {
            trim: true,
            skip_empty_lines: true,
            columns: true,
          });

          if (records.length > 100) {
            throw new Error(
              "You cannot upload more than 100 records at a time."
            );
          }

          const games = records.map((game) => {
            const { release } = game;
            const momentDate = moment(release);

            return {
              ...game,
              release: momentDate.isValid() ? momentDate : null,
            };
          });

          setCsvData({ games, isDrawerOpen: true });
        } catch ({ message }) {
          notification.error({
            message: "CSV Parsing Error",
            description: message,
          });
        }
      };
      reader.readAsText(file);

      // Prevent upload
      return false;
    },
  };

  const onSuccess = ({ games }) => {
    mutation.mutate({ games });
  };

  return (
    <PageHeader
      title={data.name}
      ghost={false}
      extra={
        session && [
          <Button onClick={toggleDrawer} icon={<PlusOutlined />} key="addGames">
            Add Games
          </Button>,
          <Upload {...uploadProps} key="uploadGames">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>,
        ]
      }
    >
      <GameDrawer
        csvData={csvData}
        toggleVisibility={toggleDrawer}
        onSuccess={onSuccess}
        existingGames={data.games}
        mutationIsLoading={mutation.isLoading}
      />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <GamesTable data={data.games} />
        </Col>
      </Row>
    </PageHeader>
  );
}

export async function getStaticProps(context) {
  const {
    params: { slug },
  } = context;

  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
    },
  });

  const variables = {
    consoleSlug: slug,
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["gameConsole", slug], () =>
    graphcms.request(
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
    )
  );

  return {
    props: { slug, gameConsole: dehydrate(queryClient) },
  };
}

export async function getStaticPaths() {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
    },
  });

  const { gameConsoles } = await graphcms.request(
    `
        {
            gameConsoles {
                slug
            }
        }
    `
  );

  const paths = gameConsoles.map(({ slug }) => ({
    params: {
      slug,
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

Console.layout = Layout;

export default Console;
