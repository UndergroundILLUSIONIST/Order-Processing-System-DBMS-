-- 06_procedures.sql
-- Stored Procedures for business operations

CREATE OR REPLACE PROCEDURE prc_approve_order (
    p_order_id IN NUMBER
)
IS
    v_status VARCHAR2(20);
BEGIN
    SELECT status INTO v_status FROM orders WHERE order_id = p_order_id;
    
    IF v_status = 'PENDING' THEN
        UPDATE orders SET status = 'APPROVED' WHERE order_id = p_order_id;
        COMMIT;
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Order cannot be approved because it is not in PENDING state.');
    END IF;
END;
/

CREATE OR REPLACE PROCEDURE prc_cancel_order (
    p_order_id IN NUMBER
)
IS
    v_status VARCHAR2(20);
BEGIN
    SELECT status INTO v_status FROM orders WHERE order_id = p_order_id;
    
    IF v_status IN ('PENDING', 'APPROVED') THEN
        -- Revert stock
        FOR item IN (SELECT product_id, quantity FROM order_items WHERE order_id = p_order_id) LOOP
            UPDATE products SET stock_quantity = stock_quantity + item.quantity WHERE product_id = item.product_id;
        END LOOP;
        
        UPDATE orders SET status = 'CANCELLED' WHERE order_id = p_order_id;
        COMMIT;
    ELSE
        RAISE_APPLICATION_ERROR(-20002, 'Order cannot be cancelled in its current state.');
    END IF;
END;
/
