import React, { useState, useCallback, useMemo } from "react";
import { Table, Tag, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  compareAlphabetically,
  caseInsensitiveIncludes,
  dateInBetween,
  getFilter,
  Filters,
  genreFix,
} from "helpers";
import { esrbMap, genreMap } from "constants/index";
import Link from "next/link";

function GamesTable({ data }) {
  const [tableInfo, setTableInfo] = useState({
    filteredInfo: {},
    sortedInfo: {},
  });

  const { filteredInfo, sortedInfo } = tableInfo;

  const handleChange = (pagination, filters, sorter) => {
    setTableInfo({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  const buildFilters = useCallback(
    (propertyName, mappedValues) => {
      const result = [];
      const map = new Map();

      data.forEach((row) => {
        const property = row[propertyName];

        if (!map.has(property)) {
          map.set(property, true);

          if (mappedValues && mappedValues[property]) {
            result.push({
              text: mappedValues[property],
              value: property,
            });
          } else {
            result.push({ text: property, value: property });
          }
        }
      });

      return result;
    },
    [data]
  );

  const columns = useMemo(
    () => [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        filteredValue: filteredInfo.title || null,
        sorter: (a, b) => compareAlphabetically(a.title, b.title),
        sortOrder: sortedInfo.columnKey === "title" && sortedInfo.order,
        ellipsis: true,
        ...getFilter(
          Filters.Search,
          "title",
          filteredInfo,
          caseInsensitiveIncludes
        ),
      },
      {
        title: "Genre",
        dataIndex: "genre",
        key: "genre",
        ellipsis: true,
        responsive: ["md"],
        filteredValue: filteredInfo.genre || null,
        onFilter: (value, record) =>
          caseInsensitiveIncludes(record.genre, value),
        filters: buildFilters("genre", genreMap),
        sorter: (a, b) => compareAlphabetically(a.genre, b.genre),
        sortOrder: sortedInfo.columnKey === "genre" && sortedInfo.order,
        render: (text) => genreFix(text),
      },
      {
        title: "UPC",
        dataIndex: "upc",
        key: "upc",
        filteredValue: filteredInfo.upc || null,
        sorter: (a, b) => compareAlphabetically(a.upc, b.upc),
        sortOrder: sortedInfo.columnKey === "upc" && sortedInfo.order,
        ellipsis: true,
        responsive: ["md"],
        ...getFilter(
          Filters.Search,
          "upc",
          filteredInfo,
          caseInsensitiveIncludes
        ),
      },
      {
        title: "Publisher",
        dataIndex: "publisher",
        key: "publisher",
        ellipsis: true,
        filteredValue: filteredInfo.publisher || null,
        responsive: ["lg"],
        onFilter: (value, record) =>
          caseInsensitiveIncludes(record.publisher, value),
        filters: buildFilters("publisher"),
        sorter: (a, b) => compareAlphabetically(a.publisher, b.publisher),
        sortOrder: sortedInfo.columnKey === "publisher" && sortedInfo.order,
      },
      {
        title: "Developer",
        dataIndex: "developer",
        key: "developer",
        ellipsis: true,
        filteredValue: filteredInfo.developer || null,
        responsive: ["lg"],
        onFilter: (value, record) =>
          caseInsensitiveIncludes(record.developer, value),
        filters: buildFilters("developer"),
        sorter: (a, b) => compareAlphabetically(a.developer, b.developer),
        sortOrder: sortedInfo.columnKey === "developer" && sortedInfo.order,
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        filteredValue: filteredInfo.rating || null,
        responsive: ["md"],
        sorter: (a, b) => compareAlphabetically(a.rating, b.rating),
        sortOrder: sortedInfo.columnKey === "rating" && sortedInfo.order,
        onFilter: (value, record) =>
          caseInsensitiveIncludes(record.rating, value),
        filters: buildFilters("rating", esrbMap),
        render: (text) => (
          <Tag color="blue" disabled>
            {esrbMap[text]}
          </Tag>
        ),
      },
      {
        title: "Release Date",
        dataIndex: "release",
        key: "release",
        filteredValue: filteredInfo.release || null,
        responsive: ["md"],
        sorter: (a, b) => compareAlphabetically(a.release, b.release),
        sortOrder: sortedInfo.columnKey === "release" && sortedInfo.order,
        ellipsis: true,
        ...getFilter(Filters.DateRange, "release", filteredInfo, dateInBetween),
        render: (text) => moment(text).format("LL"),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, { slug }) => (
          <Link href={`/game/${slug}`} passHref>
            <Button icon={<EyeOutlined />} />
          </Link>
        ),
      },
    ],
    [data, filteredInfo, sortedInfo]
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      onChange={handleChange}
      rowKey="id"
    />
  );
}

GamesTable.propTypes = {};

export default GamesTable;
