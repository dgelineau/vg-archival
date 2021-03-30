import React from "react";
import Search from "components/TableFilters/Search";
import DateRange from "components/TableFilters/DateRange";
import moment from "moment";

export const toLowerCaseString = (str) => str.toString().toLowerCase();

export const compareAlphabetically = (a, b) => {
  return a.toString().localeCompare(b.toString());
};

export const caseInsensitiveIncludes = (a, b) => {
  return toLowerCaseString(a).includes(toLowerCaseString(b));
};

export const numericIsBetweenInclusive = (a, b) => {
  const { min, max } = b;

  return a >= min && a <= max;
};

export const dateInBetween = (a, b) => {
  const { start, end } = b;

  return moment(a).isBetween(start, end);
};

export const Filters = {
  Search: "Search",
  DateRange: "DateRange",
};

const filterComponents = {
  Search,
  DateRange,
};

export const getFilter = (
  filterType,
  property,
  filteredInfo,
  comparator,
  componentProps
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => {
    const filter = filterComponents[filterType];

    const ReactComponent =
      typeof filter !== "undefined" ? (
        React.createElement(filter, {
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          property,
          componentProps,
        })
      ) : (
        <div />
      );

    return ReactComponent;
  },
  filteredValue: filteredInfo[property] || null,
  onFilter: (value, record) => comparator(record[property], value),
});

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const genreFix = (genre) => {
  return genre.replace("_", " & ");
};
