import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProductListing from '../Screens/Product_Management/Product_Listing';
// ...existing code...

const Drawer = createDrawerNavigator();

const ManagerDrawer = ({ route }) => {
  const { role, branchId } = route.params;

  return (
    <Drawer.Navigator initialRouteName="ProductListing">
      <Drawer.Screen name="ProductListing">
        {props => <ProductListing {...props} route={{ ...props.route, params: { role, branchId } }} />}
      </Drawer.Screen>
      {/* Add other screens here */}
    </Drawer.Navigator>
  );
};

export default ManagerDrawer;
