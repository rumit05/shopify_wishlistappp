import React, { useState } from "react";
 import db from '../db.server'
 
// import db from "../db.server";

import { useLoaderData,  useNavigation,  useSubmit } from "@remix-run/react";
import {
  Card,
  Button,
  InlineStack,
  InlineError,
  Layout,
  Page,
  Text,
  Thumbnail,
  BlockStack,
  PageActions,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import {  getAllData, getCustomers } from "../models/data.server";
import { redirect } from "@remix-run/node";
import CustomerResourceList from "./CustomerResourceList";


//  Thhis function  use get all customer data get 
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  const customer = await getCustomers(admin.graphql);
  const allData = await getAllData(admin.graphql);
 

  return {
    customer,
    allData

  };
}

//this is a action function

// // This is an action function
export async function action({ request, params }) {
   await authenticate.admin(request);


  /** @type {any} */
  const data = {
    ...Object.fromEntries(await request.formData())  };

  console.log('Params ID:', params.id);
  console.log('Data:', data);
   await db.procustomers.create({ data });

  return redirect(`/app`);
}


export default function ProductPage() {
  const nav = useNavigation();
  const [formState, setFormState] = useState({
    products: [],
  // Maintain selected customers here
  });
  const isDirty = JSON.stringify(formState);
  const isSaving = nav.state === 'submitting' && nav.formData?.get('action') !== 'delete';

  const { customer,allData } = useLoaderData();

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectedItemsChange = (items) => {
    setSelectedItems(items);
  };

  const errors = {};

  const selectProduct = async () => {
    try {
      const products = await window.shopify.resourcePicker({
        type: 'product',
        action: 'select',
        multiple: true,
      });
  
      if (products) {
        const updatedProducts = products.map((product) => {
          const { images, title, id } = product; // <-- Add 'id' here
       
     
          return {
            productImage: images[0]?.originalSrc,
            productAlt: images[0]?.altText,
            productID: id,
            productTitle : title
      
            
          };
        });
    
        setFormState({ ...formState, products: updatedProducts });
      }
    } catch (error) {
      console.error('Error selecting product:', error);
    }
  };
  
  const submit = useSubmit();

 const handleSave = () => {
  const productIds = formState.products.map((product) => {
    // Extract numeric part from the product ID
    return product.productID.trim().split('/').pop();
  });
  const productCount = formState.products.length; 
  const productTitle = formState.products.map((product) => product.productTitle);
  const productImage = formState.products.map((product) => product.productImage);
  const productAlt = formState.products.map((product) => product.productAlt);
  
  if (selectedItems.length === 0) {
    alert('Please select at least one customer before saving.');
    return;
  }

  const data = {
    customerid: selectedItems[0].id,
    customename :selectedItems[0].name,
    productids: productIds,
    productname :productTitle,
    productcount: productCount, 
    productImage:productImage,
    productalt :productAlt,
  };

  submit(data, { method: 'post' });

  console.log(data, 'datatatat');
};
  return (
    <Page>
      <Layout.Section>
      <CustomerResourceList   customers={customer.customers} onSelectedItemsChange={handleSelectedItemsChange}   allData = {allData}/>
        <BlockStack gap="500">
          <Card>
            <BlockStack gap="500">
              <InlineStack align="space-between">
                <Text as={"h2"} variant="headingLg">
                  Products
                </Text>

                {formState.products.length > 0 && (
                  <Button variant="plain" onClick={selectProduct}>
                    Change products
                  </Button>
                )}
              </InlineStack>

              {formState.products.length > 0 &&
                formState.products.map((product, index) => (
                  <InlineStack key={index} blockAlign="center" gap="500">
                    <Thumbnail
                      source={product.productImage || ImageMajor}
                      alt={product.productAlt}
                    />
                    <Text
                      as="span"
                      variant="headingMd"
                      fontWeight="semibold"
                    >
                      {product.productTitle}
                     
                    </Text>
                  </InlineStack>
                ))}

              {formState.products.length === 0 && (
                <BlockStack gap="200">
                  <Button onClick={selectProduct} id="select-product">
                    Select products
                  </Button>
                  {errors.productId ? (
                    <InlineError
                      message={errors.productId}
                      fieldID="myFieldID"
                    />
                  ) : null}
                </BlockStack>

              )}
       
   <PageActions
   primaryAction={{
    content: "Save",
    loading: isSaving,
    disabled: !isDirty || isSaving,
    onAction: handleSave,
  }}
/>
            </BlockStack>
          </Card>    
        </BlockStack>
      </Layout.Section>
    </Page>
  );


}
