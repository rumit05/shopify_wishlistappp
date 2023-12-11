import React, { useEffect, useState } from 'react';
import { Card, ResourceList, Avatar, ResourceItem, Text } from '@shopify/polaris';
import { useLoaderData } from 'react-router';
import { getAllData, getwishlistItem } from '../models/data.server';


export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  if (params.id !== "new") {
    const wishlistItem = await getwishlistItem(Number(params.id), admin.graphql);
 
    return {
      wishlistItem,
    
    };
  }
}

function CustomerResourceList({ customers, onSelectedItemsChange , allData}) {
                                          
  const {wishlistItem} = useLoaderData();

  console.log(wishlistItem,"wishlistItem")
             
  const [selectedItems, setSelectedItems] = useState(wishlistItem
    ? [{ id: wishlistItem.customerid, name: wishlistItem.customename }]
    : []
  );

   const allcustomerId = allData.map((item) => item.customerid);

  useEffect(() => {
    console.log('Selected Items:', selectedItems);
  }, [selectedItems]);


  const getId = (product) => {
    const match = product.match(/\/(\d+)$/);
    return match ? match[1] : null;
  }
  

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const renderItem = (customer) => {
    const { id, displayName } = customer;
    const media = <Avatar customer size="md" name={displayName} />;

    return (
      <ResourceItem
        id={id}
        media={media}
        accessibilityLabel={`View details for ${displayName}`}
        selected={selectedItems.map(item => item.id).includes(id)} 
      >
        <Text variant="bodyMd" fontWeight="bold" as="h3">
          {displayName}
        </Text>
        <div>{getId(id)}</div>
      </ResourceItem>
    );
  };

  const handleSelectionChange = (selectedItems) => {
    const lastSelectedItemId = selectedItems[selectedItems.length - 1];
    const selectedCustomer = customers.find((customer) => customer.id === lastSelectedItemId);
  
    if (selectedCustomer) {
      const selectedDisplayName = selectedCustomer.displayName;
      const isDisabled = allcustomerId.includes(lastSelectedItemId);
  
      if (!isDisabled) {
        setSelectedItems([{ id: lastSelectedItemId, name: selectedDisplayName }]);
        
        if (onSelectedItemsChange) {
          onSelectedItemsChange([{ id: lastSelectedItemId, name: selectedDisplayName }]);
        }
      }
    } else {
      setSelectedItems([]);
      
      if (onSelectedItemsChange) {
        onSelectedItemsChange(null);
      }
    }
  };
  

  const cardTitle =
    selectedItems.length > 0 ? `Select Customers (${selectedItems.length} selected)` : 'Select Customers';
//  const allcustomer = allData

  return (
    <Card title={cardTitle}>
      <ResourceList
        resourceName={resourceName}
        items={customers}
        renderItem={renderItem}
        selectedItems={selectedItems.map(item => item.id)}
        onSelectionChange={handleSelectionChange}
        selectable
      />
    </Card>
  );
}

export default CustomerResourceList;
