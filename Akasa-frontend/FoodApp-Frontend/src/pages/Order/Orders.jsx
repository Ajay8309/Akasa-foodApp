import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import OrderItem from "../../components/OrderItem/OrderItem";
import { useOrders } from "../../context/OrderContext";
import Layout from "../../layout/layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/order.service";
import styles from "./Orders.module.css"; 
// import Arrowleft from '../../assets/arrowLeft.jpeg';
// import Arrowright from '../../assets/arrowRight.jpeg';

const Orders = () => {
  const { orders, setOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handlePage = (num) => {
    setCurrentPage(num);
  };

  console.log("Inside Order");
  const goToDetails = (order) => {
    navigate(`/order/${order.order_id}`, { state: { order } });
  };

  useEffect(() => {
    orderService.getAll(currentPage).then((res) => setOrders(res.data));
  }, [currentPage, setOrders]);
  
  console.log(orders);

  if (orders?.length === 0) {
    return (
      <Layout loading={orders === null}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.noOrdersMsg}>You haven't placed any orders yet.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Orders" loading={orders === null}>
      <div className={styles.tableWrapper}>
        <h1 className={styles.title}>Orders</h1>
        <TableContainer>
          <Table className={styles.table}>
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>No. of Items</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
  {orders?.map((order) => (
    <TableRow
      className={`${styles.row} cursor-pointer`}
      onClick={() => goToDetails(order)}
      key={order.order_id}
    >
      <OrderItem order={order} />
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
        <TableFooter>
        <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          <button className={styles.previousPageButton}>
            {/* <img src={Arrowleft} alt="" className={styles.ArrowL} /> */}
          </button>
          <div className={styles.pageInfo}>
            <p className={styles.currentPage}>page</p>
          </div> 
          <button className={styles.nextPageButton}>
            {/* <img src={Arrowright} className={styles.ArrowR} alt="" /> */}
          </button>
        </div>
          </div>
        </TableFooter>
      </div>
    </Layout>
  );
};

export default Orders;
