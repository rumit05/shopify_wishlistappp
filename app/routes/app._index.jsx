import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { Card, EmptyState, IndexTable, Layout, Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { getAllData } from "../models/data.server";



export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  const allData = await getAllData(admin.graphql);
  // await  getDelete(admin.graphql);
  


  return {
    allData,
  };
}

const WishlistTable = ({allData}) => (
  <IndexTable
    resourceName={{
      singular: "Wislist",
      plural: "Wislists",
    }}
    itemCount={allData.length}
    headings={[

      { title: "Customer Name" },
      { title: "Product Count" },
      { title: "Date created" },
    ]}
    selectable={false}
  >
    {allData.map((data) => (
      <WishlistRow key={data.id} data={data} />
    ))}
  </IndexTable>
)
const getId = (product) => {
  const match = product.match(/\/(\d+)$/);
  return match ? match[1] : null;
}
 
const WishlistRow = ({data}) => (
  <IndexTable.Row id={data.id} position={data.id}>
    {console.log(data,"customeridcustomeridcustomeridcustomeridcustomerid")}

    <IndexTable.Cell><Link to={`wishlistupdate/${data.id}`}>{data.customename}</Link></IndexTable.Cell>
    <IndexTable.Cell>{data.productcount}</IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(data.createdAt).toDateString()}
    </IndexTable.Cell>
  </IndexTable.Row>
)

export default function Index() {

  const navigate = useNavigate()
  const {allData} = useLoaderData()
  

  return (
    <Page>
      <ui-title-bar title="Wishlist">
      <button variant="primary" onClick={() => navigate("/app/product")}>
          Add product
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {allData.length === 0 ? (
              <EmptyWishlist onAction={() => navigate("wishlist/new")} />
            ) : (
              <WishlistTable allData={allData} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

