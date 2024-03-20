import useSWR from "swr";
import Error from "next/error";
import { Card, Button } from "react-bootstrap";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCard({ objectID }) {
  // fetch data
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher); // error handling
  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  // return data
  if (data) {
    return (
      <>
        <Card>
          <Card.Img variant="top" src={data?.primaryImageSmall || `https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d`} />
          <Card.Body>
            <Card.Title>{data?.title || "N/A"}</Card.Title>
            {/* Card.text => renders objectDate, classification, medium properties */}
            <Card.Text>
              <p>
                <span className="fw-bold">Date:</span> {data?.objectDate || "N/A"}
              </p>
              <p>
                <span className="fw-bold">Classification:</span> {data?.classification || "N/A"}
              </p>
              <p>
                <span className="fw-bold">Medium:</span> {data?.medium || "N/A"}
              </p>
            </Card.Text>
            {/* navigate to artwork on objectID */}
            <Link href={`/artwork/${objectID}`} passHref>
              <Button variant="primary">ID: {data?.objectID}</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    );
  }
}
