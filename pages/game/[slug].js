import { useMemo } from "react";
import {
  PageHeader,
  Row,
  Col,
  Descriptions,
  Button,
  Result,
  Typography,
  Carousel,
  Image,
  Empty,
  Divider,
  Tag,
} from "antd";
import {
  PlusOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/client";
import Layout from "components/Layout";
import Loading from "components/Loading";
import { useRouter } from "next/router";
import { GraphQLClient } from "graphql-request";
import { genreFix } from "helpers";
import { esrbMap } from "constants/index";
import Link from "next/link";
import Head from "next/head";
import moment from "moment";

function Game({ game }) {
  const [session, loading] = useSession();
  const { isFallback, back } = useRouter();

  const carouselImages = useMemo(() => {
    if (!game || game.images?.length === 0) {
      return (
        <div>
          <div className="carousel-content-container">
            <Empty description="No images were found for this game." />
          </div>
        </div>
      );
    }

    return game.images.map(({ id, url }) => (
      <div key={id}>
        <div className="carousel-content-container">
          <Image src={url} width={250} />
        </div>
      </div>
    ));
  }, [game]);

  if (loading || isFallback) {
    return <Loading />;
  }

  if (!game) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, this game doesn't appear to exist."
        extra={
          <Link href="/" passHref>
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }

  const {
    title,
    publisher,
    description,
    rating,
    developer,
    upc,
    genre,
    release,
    console: { name },
  } = game;

  return (
    <PageHeader
      title={title}
      ghost={false}
      onBack={back}
      tags={<Tag color="blue">{name}</Tag>}
      extra={
        session && [
          <Button
            type="primary"
            htmlType="button"
            icon={<PlusOutlined />}
            key="addToCollection"
          >
            Add to Collection
          </Button>,
        ]
      }
    >
      <Head>
        <title>
          vg-archive | {title} - {name}
        </title>
      </Head>
      <Row gutter={[16, 16]}>
        <Col md={24} lg={24} xl={12}>
          <Divider>Images</Divider>
          <Carousel
            dotPosition="top"
            arrows
            nextArrow={<ArrowRightOutlined />}
            prevArrow={<ArrowLeftOutlined />}
            className="full-width"
          >
            {carouselImages}
          </Carousel>
        </Col>
        <Col md={24} lg={24} xl={12}>
          <Divider>Information</Divider>
          <Descriptions bordered size="large">
            <Descriptions.Item label="Genre">
              {genreFix(genre)}
            </Descriptions.Item>
            <Descriptions.Item label="Publisher">{publisher}</Descriptions.Item>
            <Descriptions.Item label="Developer">{developer}</Descriptions.Item>
            <Descriptions.Item label="Rating">
              {esrbMap[rating]}
            </Descriptions.Item>
            <Descriptions.Item label="UPC">{upc}</Descriptions.Item>
            <Descriptions.Item label="Release Date">
              {moment(release).format("LL")}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          <Divider>Description</Divider>
          <Typography.Paragraph>{description}</Typography.Paragraph>
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
    slug: slug,
  };

  const { game } = await graphcms.request(
    `
        query getGameBySlug($slug: String!) {
            game(where: { slug: $slug }) {
                id,
                title,
                description,
                rating,
                release,
                upc,
                developer,
                publisher,
                genre,
                slug,
                console {
                  name
                }
                images {
                  id,
                  url
                }
            }
        }
    `,
    variables
  );

  return {
    props: { game },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
    },
  });

  const { games } = await graphcms.request(
    `
        {
            games {
                slug,
            }
        }
    `
  );

  const paths = games.map(({ slug }) => ({
    params: {
      slug,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

Game.layout = Layout;

Game.propTypes = {};

export default Game;
