import { useRouter } from "next/router";
import useSWR from "swr";
import ListingDetails from "@/components/ListingDetails";
import Error from "next/error";
import PageHeader from "@/components/PageHeader";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Listing() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isValidating } = useSWR(id ? `https://pear-wandering-harp-seal.cyclic.app/api/listings/${id}` : null, fetcher);

  if (isValidating) {
    return null;
  }

  if (error || !data) {
    return <Error statusCode={404} />;
  }

  const { name } = data;

  return (
    <>
      <PageHeader text={name} />
      <ListingDetails listing={data} />
    </>
  );
}
