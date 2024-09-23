import { Badge, TableCell } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";

const OrderItem = ({ order }) => {

    const formattedPrice = (amount) => {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);
    };

    // Function to safely format the date
    const formattedDate = (date) => {
        try {
            return date ? format(parseISO(date), "dd/MM/yy") : "N/A";
        } catch (error) {
            console.error("Invalid date:", error);
            return "Invalid Date";
        }
    };

    return (
        <>
            <TableCell>#{order.order_id}</TableCell>
            <TableCell>{order.total || "Not available"}</TableCell>
            <TableCell>
                <Badge type="success">{order.status}</Badge>
            </TableCell>
            <TableCell>{formattedPrice(order.amount)}</TableCell>
            <TableCell>{formattedDate(order.date)}</TableCell>
        </>
    );
};

export default OrderItem;
