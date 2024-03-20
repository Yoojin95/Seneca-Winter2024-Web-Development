import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Button, Form, Row, Col } from "react-bootstrap";

export default function AdvancedSearch() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function submitForm(data) {
    // create an empty string
    let queryString = `serachBy=true`;

    if (data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium) queryString += `&medium=${medium}`;
    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    queryString += `&q=${data.q}`;

    // redirect user
    router.push(`/artwork?${queryString}`);
  }

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Form.Group className="mb-3">
        <Form.Label>Search Query</Form.Label>
        <Form.Control type="text" placeholder="" {...register("q", { required: true })} isInvalid={!!errors.q} />
        <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Search By</Form.Label>
            <Form.Select {...register("searchBy")} className="mb-3">
              <option value="title">Title</option>
              <option value="tags">Tags</option>
              <option value="artistOrCulture">Artist or Culture</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" placeholder="" {...register("geoLocation")} />
            <Form.Text className="text-muted">
              Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple
              values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" placeholder="" {...register("medium")} />
            <Form.Text className="text-muted">
              Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.),
              with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Check type="checkbox" label="Highlighted" {...register("isHighlight")} />
          <Form.Check type="checkbox" label="Currently on View" {...register("isOnView")} />
        </Col>
      </Row>
      <br />

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
