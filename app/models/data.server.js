import db from '../db.server'

export async function getAllData(graphql){
  const allData = await db.procustomers.findMany({
    orderBy: {id: "desc"}
  })
  if (allData.length === 0) return [];
  return allData;
}

export async function getwishlistItem(id, graphql){
  const wishlistItem = await db.procustomers.findFirst({ where:{ id } });
  if (!wishlistItem) {
    return null
  }
  
  return wishlistItem;
}




export async function getCustomers(graphql) {
  const response = await graphql(
    `
      query {
        customers(first:10) {
          edges {
            node {
              id
              displayName
            }
          }
        }
      }
    `
  );

  const {
    data: {customers},
  } = await response.json();

  return {
    customers: customers.edges.map(({node}) => node),
  }
}

