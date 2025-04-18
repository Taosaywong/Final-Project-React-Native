import React, { useState, useEffect } from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './src/Screens/User_Management/Login';
import Register from './src/Screens/User_Management/Register';
import ForgotPassword from './src/Screens/User_Management/ForgetPassword';
import ResetPassword from './src/Screens/User_Management/ResetPassword';
import ProductListing from './src/Screens/Product_Management/Product_Listing';
import ProductDetail from './src/Screens/Product_Management/ProductDetail';
import Logout from './src/Screens/User_Management/Logout';
import UserProfile from './src/Screens/User_Management/UserProfile';
import AddProductBranch from './src/Screens/Product_Management/Add_ProductBranch';
import CreateStockNotification from './src/Screens/Product_Management/CreateStockNotification';
import TrackStockNotification from './src/Screens/Product_Management/TrackStockNotification';
import AddReviews from './src/Screens/Product_Management/AddReviews';
import ProductReviewListing from './src/Screens/Product_Management/ProductReviewListing';
import UserReview from './src/Screens/Product_Management/userReview';
import ReviewDetail from './src/Screens/Product_Management/ReviewDetail';
import RefreshAccessToken from './src/Screens/User_Management/authToken/refresh_accessToken';
import ScanProduct from './src/Screens/QR_Scanner/ScanProduct';
import CheckoutPage from './src/Screens/Checkout/Checkout';
import UserListing from './src/Screens/User_Management/User_Listing';
import Branch_Listing from './src/Screens/User_Management/Branch_Listing';
import AddUser from './src/Screens/User_Management/addUser';
import BranchDetail from './src/Screens/User_Management/BranchDetail';
import UserDetail from './src/Screens/User_Management/UserDetail';
import AddBranch from './src/Screens/User_Management/AddBranch';
import AdminProductListing from './src/Screens/Product_Management/AdminProductListing';
import AdminProductDetail from './src/Screens/Product_Management/AdminProductDetail';
import AddProduct from './src/Screens/Product_Management/AddProduct';
import CategoryList from './src/Screens/Product_Management/Category_List';
import CategoryDetail from './src/Screens/Product_Management/CategoryDetail';
import PaymentScreen from './src/Screens/Checkout/Payment';
import PaymentSuccess from './src/Screens/Checkout/PaymentSuccess';
import PaymentCancelled from './src/Screens/Checkout/PaymentCancelled';
import TransactionHistoryScreen from './src/Screens/Checkout/TransactionHistory';
import TransactionDetail from './src/Screens/Checkout/TransactionDetail';
import SummaryCategorySalesReport from './src/Screens/Statistical Analysis/SummarySalesReport';
import FloorList from './src/Screens/AR_indoor_Navigation/FloorList';
import CustomerPurchaseBehavior from './src/Screens/Statistical Analysis/CustomerPurchaseBehavior';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomerDrawer = ({ route }) => {
  const { userId, userName, role, authToken } = route.params;

  return (
    <Drawer.Navigator initialRouteName="ProductListing" screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="ProductListing">
        {props => <ProductListing {...props} route={{ ...route }} />}
      </Drawer.Screen>
      <Drawer.Screen name="AddProductReview" options={{ title: 'Add Product Reviews' }}>
      {props => <AddReviews {...props} route={{ ...route, params: { userId, authToken } }}  />}
      </Drawer.Screen>
      <Drawer.Screen name="UserProfile" options={{ title: 'User Profile' }}>
        {props => <UserProfile {...props} userId={userId} />}
      </Drawer.Screen>
      <Drawer.Screen name="UserReview" options={{ title: 'User Reviews' }}>
        {props => <UserReview {...props} route={{ ...route, params: {userName}}}  /> }
      </Drawer.Screen>
      <Drawer.Screen name="TransactionHistory">
        {props => <TransactionHistoryScreen {...props} route={{ ...route, params: { userId } }} />}
      </Drawer.Screen>

      <Drawer.Screen name="CustomerPurchaseBehavior">
        {props => <CustomerPurchaseBehavior {...props} route={{ ...route, params: { userId } }} />}
      </Drawer.Screen>

      <Drawer.Screen name='Logout' component={Logout} />
    </Drawer.Navigator>
  );
};

const AdminDrawer = ({ route }) => {
  const { userId, userName, role, authToken } = route.params;

  return (
    <Drawer.Navigator initialRouteName='UserListing' screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="UserListing" component={UserListing}  />
      <Drawer.Screen name="AddUser" component={AddUser} />
      <Drawer.Screen name="BranchListing" component={Branch_Listing} />
      <Drawer.Screen name="AddBranch" component={AddBranch} />
      <Drawer.Screen name="AdminProductListing" component={AdminProductListing} options={{title: 'Admin Product Listing'}} />
      <Drawer.Screen name="CreateProduct" component={AddProduct} options={{title: 'Create Product'}} />
      <Drawer.Screen name="CategoryList" component={CategoryList} options={{title: 'Category List' }} />
    </Drawer.Navigator>
  )

}



const StaffDrawer = ({ route }) => {
  const { userId, role, branchId, branchName } = route.params;

  return (
    <Drawer.Navigator initialRouteName="ProductListing" screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="ProductListing">
        {props => <ProductListing {...props} route={{ ...route, params: { userId, role, branchId, branchName } }} />}
      </Drawer.Screen>
      <Drawer.Screen name="UserProfile">
        {props => <UserProfile {...props} userId={userId} />}
      </Drawer.Screen>
      <Drawer.Screen name='CreateStockNotification'>
        {props => <CreateStockNotification {...props} route={{...props.route, params: {userId, role, branchId, branchName}}} />}
      </Drawer.Screen>
      <Drawer.Screen name='TrackStockNotification'>
        {props => <TrackStockNotification {...props} route={{...props.route, params: {userId, role, branchId, branchName}}} />}
      </Drawer.Screen>
      <Drawer.Screen name='Logout' component={Logout} />
    </Drawer.Navigator>
  );
};

const ManagerDrawer = ({ route }) => {
  const { userId, role, branchId, branchName } = route.params;

  return (
    <Drawer.Navigator initialRouteName="ProductListing" screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="ProductListing">
        {props => <ProductListing {...props} route={{ ...route, params: { userId, role, branchId, branchName } }} />}
      </Drawer.Screen>
      <Drawer.Screen name="UserProfile">
        {props => <UserProfile {...props} userId={userId} role={role} />}
      </Drawer.Screen>
      <Drawer.Screen name="AddProductBranch">
        {props => <AddProductBranch {...props} route={{ ...props.route, params: { userId, role, branchId, branchName } }} options={{ title: 'Add Product Branch' }} />}
      </Drawer.Screen>
      <Drawer.Screen name="TrackStockNotification">
        {props => <TrackStockNotification {...props} route={{...props.route, params: {userId, role, branchId, branchName}}} />}
      </Drawer.Screen>

      <Drawer.Screen name="FloorList" options={{ title: 'Floor List' }}>
        {props => <FloorList {...props} route={{ ...props.route, params: { branchId, branchName}}} /> }
      </Drawer.Screen>

      <Drawer.Screen name="SummaryCategorySalesReport">
        {props => <SummaryCategorySalesReport {...props} route={{...props.route, params: {branchId, branchName}}} />}
      </Drawer.Screen>

      <Drawer.Screen name='Logout' component={Logout} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    // Load tokens from AsyncStorage
    const loadTokens = async () => {
      const storedAccessToken = await AsyncStorage.getItem('access_token');
      const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    };

    loadTokens();
  }, []);

  return (
    <SafeAreaProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          {refreshToken && <RefreshAccessToken refreshToken={refreshToken} setAccessToken={setAccessToken} />}
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
            <Stack.Screen name='CustomerDrawer' component={CustomerDrawer} />
            <Stack.Screen name='StaffDrawer' component={StaffDrawer} />
            <Stack.Screen name='ManagerDrawer' component={ManagerDrawer} />
            <Stack.Screen name='AdminDrawer' component={AdminDrawer} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Product Detail', headerShown: true }} />
            <Stack.Screen name="ProductReviews" component={ProductReviewListing} options={{ title: 'Product Reviews', headerShown: true}} />
            <Stack.Screen name='ReviewDetail' component={ReviewDetail} options={{ title: 'Review Detail',headerShown: true }} />
            <Stack.Screen name="ScanProduct" component={ScanProduct} />
            <Stack.Screen name="CheckoutPage" component={CheckoutPage} options={{  title: 'Check Out', headerShown: true }} />
            <Stack.Screen name="BranchDetail" component={BranchDetail} options={{  title: 'Branch Detail', headerShown: true }}   />
            <Stack.Screen name='UserDetail' component={UserDetail} options={{  title: 'User Detail', headerShown: true }}  />
            <Stack.Screen name="AdminProductDetail" component={AdminProductDetail} options={{title: 'Admin Product Detail', headerShown: true}} />
            <Drawer.Screen name="CategoryDetail" component={CategoryDetail} options={{title: 'Category Detail', headerShown: true }} />
            <Drawer.Screen name='PaymentScreen' component={PaymentScreen} options={{ title: 'Payment', headerShown: false }} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccess}  />
            <Stack.Screen name="PaymentCancelled" component={PaymentCancelled} />
            <Stack.Screen name="TransactionDetail" component={TransactionDetail} options={{ title: 'Transaction Detail', headerShown: true }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
};

export default App;
