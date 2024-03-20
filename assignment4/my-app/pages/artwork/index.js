import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import { Row, Col, Pagination, Card } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";

const PER_PAGE = 12;

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Artwork() {
  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1);

  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  // fetch request data
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher);

  // declare two functions
  function previousPage() {
    page > 1 ? setPage(page - 1) : setPage(1);
  }

  function nextPage() {
    page < artworkList.length ? setPage(page + 1) : setPage(artworkList.length);
  }

  // useEffect Hook
  useEffect(() => {
    if (data) {
      let results = [];

      for (let i = 0; i < data?.objectIDs?.length; i += PER_PAGE) {
        const chunk = data?.objectIDs.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);

      setPage(1);
    }
  }, [data]);

  // error handling
  if (error) return <Error statusCode={404} />;
  if (!artworkList) return null;

  return (
    <>
      {artworkList.length > 0 ? (
        <>
          <Row className="gy-4">
            {artworkList[page - 1].map((objectID) => (
              <Col lg={3} key={objectID}>
                {/* display ArtworkCard component */}
                <ArtworkCard objectID={objectID} />
              </Col>
            ))}
          </Row>
          <Row>
            <Col>
              <Pagination>
                <Pagination.Prev onClick={previousPage} />
                <Pagination.Item>{page}</Pagination.Item>
                <Pagination.Next onClick={nextPage} />
              </Pagination>
            </Col>
          </Row>
        </>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for something else.
          </Card.Body>
        </Card>
      )}
    </>
  );
}
