import React from "react";
import { Button, DatePicker, Row, Col } from "antd";

function Search({
  property,
  confirm,
  clearFilters,
  selectedKeys,
  setSelectedKeys,
}) {
  const closeOnConfirm = () => {
    confirm({ closeDropdown: true });
  };

  const handleChange = (dateRange) => {
    if (dateRange) {
      const [start, end] = dateRange;
      setSelectedKeys([{ start, end }]);
    } else {
      setSelectedKeys([]);
    }
  };

  return (
    <div className="p-8">
      <Row>
        <Col span={24}>
          <DatePicker.RangePicker
            value={
              selectedKeys[0]
                ? [selectedKeys[0].start, selectedKeys[0].end]
                : []
            }
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Row justify="space-between" className="pt-8">
        <Col>
          <Button
            type="link"
            size="small"
            onClick={clearFilters}
            disabled={!selectedKeys[0]}
          >
            Reset
          </Button>
        </Col>
        <Col>
          <Button type="primary" size="small" onClick={closeOnConfirm}>
            OK
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default React.memo(Search);
