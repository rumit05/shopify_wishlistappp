import React, { useState } from 'react';
import { BlockStack, Button, Card, InlineStack, Layout, Page, PageActions, Text, Thumbnail } from '@shopify/polaris';

import { authenticate } from '../shopify.server';
import { useLoaderData, useNavigate, useSubmit } from '@remix-run/react';

import { ImageMajor } from "@shopify/polaris-icons";
import db from "../db.server";
import { json, redirect } from '@remix-run/node';
import CustomerResourceList from './CustomerResourceList';
import {  getAllData, getCustomers, getwishlistItem} from '../models/data.server';


export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const customers = await getCustomers(admin.graphql);
  const wishlistItem = await getwishlistItem(Number(params.id), admin.graphql);
  const allData = await getAllData(admin.graphql);
  

  return {
    customers,
    wishlistItem,
    allData,

  };

}

export async function action({ request, params }) {

  const { session } = await authenticate.admin(request)
  // const {shop} = session;

  const data = {
    ...Object.fromEntries(await request.formData()),
  }

 
 

  if (data.action === "delete") {
    await db.procustomers.delete({ where: { id: Number(params.id) } });
    return redirect("/app");
  }
  const newData = await db.procustomers.update({ where: { id: Number(params.id) }, data });

  return redirect("/app")


}


export default function WishlistForm() {
  const { customers, wishlistItem,allData } = useLoaderData();
  

  const navigate = useNavigate()

  const [formState, setFormState] = useState({
    wishlistItem: {
      ...wishlistItem,
      productids: wishlistItem.productids.split(','),
      productname: wishlistItem.productname.split(','),
      productImage: wishlistItem.productImage.split(','),
      productalt: wishlistItem.productalt.split(','),
    }
  });

  const productsName = formState.wishlistItem.productname.map((title, index) => ({
    productname: title,
    productids: formState.wishlistItem.productids[index],
    productImage: formState.wishlistItem.productImage[index],
    productalt: formState.wishlistItem.productalt[index],
  }));

 

  const [newFormState, setNewFormState] = useState({
    productsName
  })
 
  
  

  const [selectedItems, setSelectedItems] = useState([{ id: wishlistItem.customerid, name: wishlistItem.customename }]);
  const handleSelectedItemsChange = (items) => {
    setSelectedItems(items);
  };

  let allproduct = productsName.map(product => product.productids);

  
async function selectProducts() {
  console.log(allproduct, "allproduct");
  
  const products = await window.shopify.resourcePicker({
    type: 'product',
    action: 'select',
    multiple: true,
    initialSelectionIds: "gid://shopify/Product/8740617781562"
,
  });

  if (products) {
    const updatedProducts = products.map((product) => {
      const { images, id, title } = product;
      return {
        productImage: images[0]?.originalSrc,
        productalt: images[0]?.altText,
        productname: title,
        productids: id,
      };
    });
    setNewFormState({ productsName: updatedProducts });
  }
}



  const submit = useSubmit();

  const handleSave = () => {
    const productId = newFormState.productsName.map((product) => product.productids)
    const productCount = newFormState.productsName.length;
    const productTitle = newFormState.productsName.map((product) => product.productname);
    const productImage = newFormState.productsName.map((product) => product.productImage);
    const productAltt = newFormState.productsName.map((product) => product.productalt);
  
    if (selectedItems.length === 0) {
      alert('Please select at least one customer before saving.');
      return;
    }
  
    const data = {
      customerid: selectedItems[0].id,
      customename: selectedItems[0].name,
      productids: productId,
      productname: productTitle,
      productcount: productCount,
      productImage: productImage,
      productalt: productAltt,
    };

    submit(data, { method: 'post' });
  };



  return (
    <Page>
      <ui-title-bar title={ "Update Wishlist"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          Wishlist
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
        <CustomerResourceList customers={customers.customers} onSelectedItemsChange={handleSelectedItemsChange} allData={allData} />

          <Card>
            <BlockStack gap="500">


              <InlineStack align="space-between">
                <Text as={'h2'} variant="headingLg">
                  Product
                </Text>
                {newFormState.productsName.length > 0 && (
                  <Button variant="plain" onClick={selectProducts}>
                    Change products
                  </Button>
                )}
              </InlineStack>
              {newFormState.productsName.length > 0 &&
                newFormState.productsName.map((product, index) => (
                  <InlineStack key={index} blockAlign="center" gap="500">
                    <Thumbnail
                      source={product.productImage || ImageMajor}
                      alt={product.productalt}
                    />
                    <Text
                      as="span"
                      variant="headingMd"
                      fontWeight="semibold"
                    >
                      {product.productname}
                    </Text>
                  </InlineStack>
                ))}

              {newFormState.productsName.length === 0 && (
                <BlockStack gap="200">
                  <Button onClick={selectProducts} id="select-product">
                    Select products
                  </Button>
                
                </BlockStack>

              )}

            </BlockStack>
          </Card>

        </Layout.Section>

        <Layout.Section>
          <PageActions
            secondaryActions={[
              {
                content: "Delete",
                // loading: isDeleting,
                // disabled: !qrCode.id || !qrCode || isSaving || isDeleting,
                destructive: true,
                outline: true,
                onAction: () =>
                  submit({ action: "delete" }, { method: "post" }),
              },
            ]}
            primaryAction={{
              content: "Save",
              // loading: isSaving,
              // disabled: !isDirty || isSaving || isDeleting,
              onAction: handleSave,
            }}
          />
        </Layout.Section>


      </Layout>
    </Page>
  );
}