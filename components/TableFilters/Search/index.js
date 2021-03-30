import React from "react";
import { Button, Input, Row, Col } from "antd";

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

  return (
    <div className="p-8">
      <Row>
        <Col span={24}>
          <Input
            placeholder={`Search ${property}`}
            value={selectedKeys[0]}
            onChange={({ target: { value } }) =>
              setSelectedKeys(value ? [value] : [])
            }
            onPressEnter={closeOnConfirm}
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
