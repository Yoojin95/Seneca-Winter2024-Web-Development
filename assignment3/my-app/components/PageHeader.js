import React from "react";
import { Card } from "react-bootstrap";

export default function PageHeader(props) {
  return (
    <>
      <Card className="bg-light">
        <Card.Body>
          <strong>{props.text}</strong>
        </Card.Body>
      </Card>
      <br />
    </>
  );
}
