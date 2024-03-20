import Link from "next/link";
import { Card } from "react-bootstrap";
import ListingDetails from "@/components/ListingDetails";
import PageHeader from "@/components/PageHeader";

export function getStaticProps() {
  // Call an external API endpoint to get posts
  return new Promise((resolve, reject) => {
    fetch("https://pear-wandering-harp-seal.cyclic.app/api/listings/1001265")
      .then((res) => res.json())
      .then((data) => {
        resolve({ props: { listing: data } });
      });
  });
}
export default function About({ listing }) {
  return (
    <>
      <PageHeader text="About the Developer: Yoojin" />
      <Card>
        <Card.Body>
          <p>Hello! I am Yoojin Lee, a passionate developer dedicated to creating decent airbnb application. </p>
          <br />
          <p>
            One of the places that I would like to visit is the:
            <Link href={`/listing/1001265`}>
              {" "}
              "{listing.name}" {}
            </Link>
          </p>
          <br />
          <ListingDetails listing={listing} />
        </Card.Body>
      </Card>
    </>
  );
}
