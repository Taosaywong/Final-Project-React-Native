import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useEffect, useState } from 'react';
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import generateRandomColor from '../../utils/generateRandomColor';
import { BASE_URL } from '@env'; 

const screenWidth = Dimensions.get('window').width;


const ProductRevenue = ({ reportType, date, branchId }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productSales, setProductSales] = useState([]);
  const [overallProductRevenue, setOverallProductRevenue] = useState(0);

  const fetchAllCategory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/categories/`);
      setCategoryData(response.data);
    } catch (error) {
      console.error(error, 'Failed to Fetch All Category from backend');
    }
  };

  const fetchProductRevenueData = async () => {
    try {
      let endpoint = `${BASE_URL}/api/checkout/sales/product_category_revenue/${branchId}/${selectedCategory}/`;
      if (reportType === "monthly") {
        endpoint += `?year=${date.selectedYear}&month=${date.selectedMonth}`;
      } else if (reportType === "daily") {
        endpoint += `?year=${date.selectedYear}&month=${date.selectedMonth}&day=${date.selectedDate}`;
      } else if (reportType === "yearly") {
        endpoint += `?year=${date.selectedYear}`;
      }

      const response = await axios.get(endpoint);
      setProductSales(response.data.product_revenue);
      setOverallProductRevenue(
        response.data.product_revenue.reduce((sum, item) => sum + item.total_revenue, 0)
      );
    } catch (error) {
      console.error(error, 'Failed to Fetch Product Revenue Data from backend');
    }
  };

  useEffect(() => {
    fetchAllCategory();

    if (date && reportType) {
      fetchProductRevenueData();
    }
  }, [branchId, date, reportType, selectedCategory]);

  // Data for Bar Chart
  const BarChartData = {
    labels: productSales.map((item) => item.product_name),
    datasets: [
      {
        data: productSales.map((item) => item.total_revenue),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Revenue</Text>

      {/* Category Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {categoryData &&
            categoryData.map((category, index) => (
              <Picker.Item label={category.name} value={category.id} key={index} />
            ))}
        </Picker>
      </View>

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <BarChart
          data={BarChartData}
          width={screenWidth * 0.9} // Reduce width slightly for better layout
          height={220}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          fromZero={true} // Start bars from zero
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  pickerContainer: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ProductRevenue;
