import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-chart-kit";
import generateRandomColor from '../../utils/generateRandomColor';
import { Dimensions, Platform } from 'react-native';
import ProductRevenue from './ProductRevenueSales';
import { BASE_URL } from '@env'; 

const screenWidth = Dimensions.get('window').width;



const SummaryCategorySalesReport = ({ route }) => {
  const { branchId } = route.params;
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [dateData, setDateData] = useState({
    selectedYear: null,
    selectedMonth: null,
    selectedDate: null,
  });
  const [OverallRevenue, setOverallRevenue] = useState(null);

  const fetchCategorySalesData = async () => {
    setLoading(true);
    try {
      let endpoint = `${BASE_URL}/api/checkout/sales/category_revenue/${branchId}/`;
      if (selectedReportType === "monthly") {
        endpoint += `?year=${dateData.selectedYear}&month=${dateData.selectedMonth}`;
      } else if (selectedReportType === "daily") {
        endpoint += `?year=${dateData.selectedYear}&month=${dateData.selectedMonth}&day=${dateData.selectedDate}`;
      } else if (selectedReportType === "yearly") {
        endpoint += `?year=${dateData.selectedYear}`;
      }
  
      const response = await axios.get(endpoint);
      setSalesData(response.data.category_revenue || []);
      setOverallRevenue(response.data.total_revenue || null);
    } catch (error) {
      console.error("Error fetching category sales data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      selectedReportType &&
      dateData.selectedYear &&
      (selectedReportType !== "yearly" || dateData.selectedMonth) &&
      (selectedReportType !== "monthly" || dateData.selectedMonth)
    ) {
      fetchCategorySalesData();
    }
  }, [selectedReportType, dateData]);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date) => {
    const selectedDay = date.getDate();
    const selectedMonth = date.getMonth() + 1;
    const selectedYear = date.getFullYear();
    setDateData({
      selectedDay: selectedReportType === "daily" ? selectedDay : null,
      selectedMonth: ["monthly", "daily"].includes(selectedReportType) ? selectedMonth : null,
      selectedYear,
    });
    hideDatePicker();
  };

  const Colors = generateRandomColor(salesData.length);
  const pieChartData = salesData.map((item, index) => ({
    name: item.category_name,
    value: item.total_revenue,
    color: Colors[index],
    legendFontColor: Colors[index],
    legendFontSize: 14,
  }));

  return (
    <ScrollView style={styles.container}>
      {/* Report Type Picker */}
      <Picker
        selectedValue={selectedReportType}
        onValueChange={(itemValue) => setSelectedReportType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Report Type" value={null} />
        <Picker.Item label="Monthly" value="monthly" />
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Yearly" value="yearly" />
      </Picker>

      {/* Date Picker */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>
          {selectedReportType === "monthly" ? (
            `Selected Month/Year: ${dateData.selectedMonth || "N/A"}/${dateData.selectedYear || "N/A"}`
          ) : selectedReportType === "yearly" ? (
            `Selected Year: ${dateData.selectedYear || "N/A"}`
          ) : selectedReportType === "daily" ? (
            `Selected Day: ${dateData.selectedDay || "N/A"}/${dateData.selectedMonth || "N/A"}/${dateData.selectedYear || "N/A"}`
          ) : (
            "Please select a report type"
          )}
        </Text>

        <Button title="Pick Date" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
        />
      </View>

      {/* Conditional Rendering */}
      {!selectedReportType || !dateData.selectedYear || 
      (selectedReportType === "monthly" && !dateData.selectedMonth) ||
      (selectedReportType === "daily" && (!dateData.selectedDay || !dateData.selectedMonth)) ? (
        <Text style={styles.emptyText}>
          Please select a report type and date to display the graphs.
        </Text>
      ) : loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {/* Pie Chart */}
          <View>
            <Text style={[styles.totalProfitText, styles.textCenter]}>
              Total Revenue: RM {OverallRevenue || "N/A"}
            </Text>
            <PieChart
              data={pieChartData}
              width={screenWidth * 0.9}
              height={220}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute={false}
            />
          </View>

          {/* Product Revenue Graph */}
          <ProductRevenue
            reportType={selectedReportType}
            date={dateData}
            branchId={branchId}
          />
        </>
      )}
    </ScrollView>
  );
};

export default SummaryCategorySalesReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    marginVertical: 10,
    height: 50,
    color: '#333',
  },
  filterContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 16,
  },
  totalProfitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  textCenter: {
    textAlign: 'center',
  },
});
